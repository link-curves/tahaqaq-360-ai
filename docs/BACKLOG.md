# Tahaqaq 360 — Technical & Product Backlog

**Last updated:** 2026-08-02
**Status:** Nothing here has been approved or started. This is a findings register, not a plan.

Estimates are in **developer-days** for one developer (Ali) and are rough — ±50%. They exist so
items can be priced and sequenced against a client budget, not to be committed to.

Each item is marked:

- **In scope** — arguably part of what was already agreed
- **Change request** — new work the client should be asked to fund
- **Internal** — Ali's own quality/velocity investment, invisible to the client

---

## P0 — Do now

### 1. Rotate the leaked credentials · 0.5d · In scope

A live Google OAuth client secret, Supabase anon key, and Supabase Postgres password were committed
and are present in the GitHub remote's history. Repo files and local history are clean; **rotation
has not happened.** Full procedure in [`SECURITY-REMEDIATION.md`](./SECURITY-REMEDIATION.md).

**Blocking.** Everything else on this list is less urgent than this.

Includes verifying Supabase **RLS is enabled** — if it is not, the leaked anon key was equivalent to
open database access and the severity is critical rather than moderate.

### 2. Force-push the purged history · 0.1d · In scope

Do after rotation. `ALLOW_FORCE_PUSH=1 git push --force-with-lease origin develop`. Then either ask
GitHub Support to GC the repo or delete/recreate it, since old objects survive on the remote.

### 2b. Triage 101 Dependabot vulnerabilities · 1–3d · In scope

Reported by GitHub on push (2026-08-02): **101 vulnerabilities on `develop` — 2 critical, 54 high,
42 moderate, 3 low.** Unreviewed.

https://github.com/link-curves/tahaqaq-360-ai/security/dependabot

Do not mass-upgrade. Triage in this order:

1. The **2 critical** — assess exploitability in this codebase specifically, not in the abstract.
2. High-severity advisories in **runtime** dependencies of `apps/api` (the internet-facing surface).
3. Everything reachable only from devDependencies or the build toolchain — usually far less urgent.

Many will be transitive and dev-only. A raw count of 101 says little; the 2 critical ones say a lot.
Worth a `security-auditor` pass, and worth knowing the real number before the client ever asks.

---

### 2c. Mass assignment on the public contact endpoint · 0.5d · In scope · **SECURITY**

**Verified exploitable by running it.** `ContactController.submitContactUSMessage` is `@Public()`
and types its body as `Prisma.ContactMessageCreateInput` — a raw Prisma type, not a class-validator
DTO. `ValidationPipe`'s `whitelist` / `forbidNonWhitelisted` have no class metadata to work from, so
**every column on `ContactMessage` is settable by an anonymous request.**

Confirmed with an unauthenticated POST that persisted:

```json
{
  "status": "RESOLVED",
  "response": "FORGED staff reply",
  "respondedBy": "admin-impersonated"
}
```

Impact:

- Submit a message pre-marked `RESOLVED` → it never surfaces in the admin queue → **support
  messages silently disappear**. A denial-of-support channel.
- Forge a staff `response` / `respondedBy` on a record the admin UI renders as genuine.
- Set `userId` to attach an arbitrary message to a real user's account.

Fix: a proper `CreateContactMessageDto` exposing only `name`, `email`, `phone`, `subject`,
`message`. **Audit every other controller for raw `Prisma.*Input` body types** — grep
`@Body() .*Prisma\.` across `apps/api/src`; this is unlikely to be the only one.

---

## P1 — High value, low risk

### 3a. Six controllers expose zero routes · unknown, needs triage · **Scope risk**

Verified at runtime — Nest logs these controllers with no mapped routes, and each source file is a
7-line empty stub:

| Controller               | Feature it is supposed to provide            |
| ------------------------ | -------------------------------------------- |
| `CertificatesController` | PDF certificates with QR verification        |
| `SearchController`       | site-wide search (`/search` returns **404**) |
| `GamificationController` | points, levels, achievements                 |
| `ModerationController`   | the moderation queue                         |
| `SessionsController`     | recorded sessions                            |
| `MediaController`        | media/file handling                          |

The Prisma models, services, and modules exist and are registered; only the HTTP surface is missing.
**Four of these are headline features** in how the platform is described.

This needs triage before anything else is estimated: for each, is the service layer complete (so it
is a few hours of wiring) or hollow (so it is a real build)? Until that is known, **any completion
estimate for this project is unreliable** — and if the client believes these ship, that is a
conversation to have now rather than at handover.

### 3. Get a real local development database · 1d · Internal

**The single highest-leverage fix on this list.**

Today `docker-compose.dev.yml` has its postgres service commented out and "development" points at the
hosted Supabase instance holding the client's real data. Consequences:

- Every destructive command is one keystroke from client data loss (currently mitigated only by a hook)
- No safe place to test migrations before they hit real data
- Integration tests are impossible (see item 6)
- Any developer mistake is a client incident

Uncomment the postgres service, bind it to **5433** (5432 is taken by an unrelated `workgrid-postgres`
container), run `db:deploy` + `db:seed`. Unblocks items 6 and 8.

### 4. Add `admin` to the CI build matrix · 0.2d · In scope

`.github/workflows/docker-build.yml` builds `api` and `web` only. The admin image is never built by
CI, so admin deploys are entirely unverified by the pipeline. Also reconcile the Dockerfile naming
inconsistency — `render.yaml` points admin at `Dockerfile.prod` and web at `Dockerfile`.

### 5. Add `test` and `typecheck` tasks to `turbo.json` · 0.3d · Internal

Neither task exists, so neither can be run across the monorepo or gated in CI. `typecheck`
(`tsc --noEmit` per app) is the cheapest possible defence against the DTO/client drift problem and
should land regardless of what happens with testing.

### 6. Bootstrap test coverage on authorization · 3–5d · Internal

Coverage is effectively zero: two default Nest scaffold files, nothing else, no frontend tests.

Test in value order, not coverage order:

1. Role/permission enforcement per endpoint (highest consequence, most likely to break silently)
2. The paginated response contract (`data`/`total`/`page`/`limit` — drop one and `meta` vanishes)
3. Content lifecycle transitions (publishing an unverified submission is the worst possible bug)
4. Quiz scoring, course completion, certificate eligibility

Depends on item 3 for anything beyond mocked unit tests.

### 7. Delete dead code · 0.3d · Internal

- `apps/docs` — vanilla Vite starter leftover, unused
- `packages/ui` — `counter.ts`/`header.ts` stub, imported by nothing
- `packages/eslint-config`, `packages/typescript-config` — consumed only by the two dead packages
- `apps/admin/src/components/admin/DashboardOverview.tsx` — verified unreferenced; the live one is
  `DashboardOverviewNew.tsx`
- `apps/api/src/modules/fact-checks/fact-checks.client.ts` — empty file
- `lovable-tagger` devDependency in `apps/web`, if the Lovable workflow is no longer used

Low risk, removes a whole category of "which file is real?" confusion. Do it in one commit so it is
easy to revert.

---

## P2 — Significant, needs a decision first

### 8. Editorial content model (supersedes "true bilingual support") · 33–46d · **Change request**

**Superseded and expanded — 2026-08-05.** This item originally covered bilingual support alone. The
editorial requirements settled since then (claim provenance, structured evidence, byline + editor,
revision history and corrections, controlled taxonomy) turned out to be one coherent change to the
same model, so they are planned together.

Both original blocking questions are now answered: **English is a full editorial artifact**, not a
translation, and there is **no production data** to migrate.

- Decisions: [ADR-0002](./adr/0002-bilingual-content-model.md) ·
  [ADR-0005](./adr/0005-evidence-model.md) · [ADR-0006](./adr/0006-revisions-and-corrections.md) ·
  [ADR-0007](./adr/0007-topic-and-region-taxonomy.md)
- Sequenced work: [`docs/plans/content-model-implementation.md`](./plans/content-model-implementation.md)

Two things to carry into the client conversation:

1. **33–46 developer-days, of which nearly half is interface work** — an evidence editor and a
   correction flow are substantial UI, not forms. The schema is the visible part and the smaller part.
2. **Doing this before publication costs a fraction of doing it after.** The Supabase project is
   gone, so revision history — the piece that is genuinely miserable to retrofit — currently costs
   nothing to add. That window closes the day real fact-checks are published.

### 9. Generate the API client from OpenAPI · 4–6d · Internal

`apps/web/src/lib/api.ts` (1001 lines) and `apps/admin/src/lib/adminApi.ts` (844 lines) are
hand-written duplications of backend types. They drift silently and produce two failure modes: a 400
from `forbidNonWhitelisted`, or a field that is silently `undefined`.

`@nestjs/swagger` already emits an OpenAPI document. Generating a typed client would delete ~1,850
lines and make drift a compile error. See [ADR-0003](./adr/0003-api-contract-generation.md).

Not client-visible, so sequence it where it does not compete with a deliverable — but it pays back
on every subsequent feature.

### 10. Extract a real shared UI package · 3–5d · Internal

50 shadcn components duplicated verbatim between web and admin. Every fix must currently be applied
twice, and in practice will not be. See [ADR-0004](./adr/0004-shared-ui-package.md).

Note the complication: the two apps are on different ESLint major versions (web/admin flat config v9,
api v8, root v8), which needs sorting out as part of this.

### 11. AI-assisted verification pipeline · 20–40d · **Change request**

The repo is named `tahaqaq-360-ai` and contains no AI code. Direction agreed: Claude-first behind a
provider abstraction, human-in-the-loop throughout.
See [`architecture/ai-verification-pipeline.md`](./architecture/ai-verification-pipeline.md).

**Entirely unbudgeted.** Do not start without client sign-off, including on who pays for inference.
If a subset must be chosen, **claim deduplication** (stage 2) is the highest ROI: it directly reduces
analyst turnaround time and cannot publish anything.

---

## P3 — Worth doing eventually

- **Migrations run on every container start** (`db:generate && db:deploy && pnpm dev`). This is a race
  on multi-instance deploys and a crash-loop on migration failure. Fine at one instance; fix before
  scaling. · 1d · Internal
- **CORS origins hardcoded in `main.ts`** while `CORS_ORIGIN` is set in env and read by nothing. Every
  new domain requires a code change and redeploy. Misleading, and a trap for whoever inherits it. · 0.5d
- **Root README is still the Turborepo starter template.** It describes `docs`, `web`, and `@repo/ui`
  — none of which reflect this project. Anyone onboarding reads a lie. · 0.5d · Internal
- **ESLint version split** — root and api on 8, web and admin on 9 flat config. Consolidate. · 1d
- **Add a `pre-commit` git hook for secret scanning.** The Claude hooks only cover Claude's edits, not
  hand-made commits. · 0.3d
- **`SettingsView.tsx` is unreachable** — its case is commented out in `AdminDashboard.tsx`. Either
  wire it up or delete it. · 0.2d

---

## Product opportunities

Raised by the `product-owner` agent. Ideas, not commitments — each needs a client conversation.
Grounded in what this codebase already has.

### Claim deduplication (subset of item 11) · 5–8d

Before an analyst opens a submission, show "3 similar claims already fact-checked." Directly attacks
the desk's core operational metric — turnaround time — and it cannot publish anything, so the risk
profile is entirely different from the rest of the AI work. **The highest-value AI increment by a
wide margin, and worth proposing on its own.**

### Public transparency page · 2–3d

Fact-checking organizations are judged on transparency. The data to publish already exists in
`SystemMetric`, `ActivityLog`, `FactCheck`, and `Submission`: claims received, claims published,
median turnaround, verdict distribution, correction count. This is a credibility asset for the client
and a strong demo artifact. Cheap because the data is already collected.

### Corrections and versioning on published fact-checks · 4–6d

There is currently no correction history model. Issuing a visible, dated correction is standard
practice for credible fact-checking desks (and a requirement of most fact-checking codes of
principles). Its absence is a credibility gap, not just a missing feature — worth raising with the
client explicitly since they may assume it exists.

### Social share cards / OpenGraph metadata · 2–3d

Fact-checks spread through sharing. Without per-fact-check OG tags and preview images, every share
looks identical and performs poorly. Reach is usually worth more than another admin screen. Verify
what exists today before pricing.

### Embeddable fact-check widget · 3–5d

Lets partner newsrooms embed a verdict card. Distribution without additional editorial cost, and a
natural partnership/monetization surface for the client's sustainability story.

### Arabic search normalization · 2–3d

Without normalizing hamza forms (أإآ→ا), taa marbuta (ة→ه), and diacritics, the `search` module fails
to find content that exists. Users experience this as "the site is broken," not "search is imperfect."
Small, self-contained, and high perceived quality. Verify current behaviour before pricing.

---

## How to use this file

- The `product-owner` agent maintains "Product opportunities".
- The `solution-architect` agent adds items that need an ADR.
- Nothing here starts without Ali's decision. Items marked **Change request** need the _client's_
  decision, and should be raised with cost attached rather than absorbed silently.

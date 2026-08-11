# Implementation plan — editorial content model

- **Created:** 2026-08-05
- **Owner:** Ali Traboulsi (solo)
- **Decisions:** [ADR-0002](../adr/0002-bilingual-content-model.md) ·
  [ADR-0005](../adr/0005-evidence-model.md) · [ADR-0006](../adr/0006-revisions-and-corrections.md) ·
  [ADR-0007](../adr/0007-topic-and-region-taxonomy.md)
- **Status:** ✅ Phases 0–2 complete (2026-08-11) · Phase 3 next

## What this is

Replacing the `FactCheck`-as-blog-post model with an auditable editorial record:
claim provenance, structured evidence, byline + editor, revision history and corrections,
Arabic/English as linked sibling documents, and controlled topic/region classification.

## Why now is the cheapest it will ever be

**There is no production data.** The hosted Supabase project no longer exists. Every "retrofitting
this later is miserable" cost in these ADRs — especially revision history — is currently zero. That
window closes permanently the day real fact-checks are published.

## Total estimate

| Phase | Scope                                    | Est.       |
| ----- | ---------------------------------------- | ---------- |
| 0     | Safety net                               | 3–4d       |
| 1     | Schema foundation                        | 4–6d       |
| 2     | API — public reads                       | 4–5d       |
| 3     | API — authoring, lifecycle, revisions    | 6–8d       |
| 4     | Admin UI                                 | 8–12d      |
| 5     | Public site                              | 5–7d       |
| 6     | Rating definitions + ClaimReview interop | 3–4d       |
|       | **Total**                                | **33–46d** |

Phases 0–3 and 6 are the "model and API" figure quoted earlier (~20–27d). **Phases 4 and 5 are the
UI, and they are 13–19d on their own** — that is the part most likely to be underestimated when
this is discussed, because the schema work is visible and the interface work is not.

Estimates are ±50% and exclude client review cycles.

---

## Phase 0 — Safety net · 3–4d · ✅ DONE 2026-08-11

> **Delivered.** `pnpm typecheck` / `pnpm test` / `pnpm build` all green from the root.
> 40 tests, mutation-checked. The contact vulnerability is closed and verified against a running
> API. Two extra defects were found and fixed along the way: admin's `tsc -b` build was broken
> (unused `refetch` in `BlogManagement.tsx`, undetected because admin is absent from CI), and the
> seed scripts never loaded `.env`.

**Refactoring the most-referenced model in the system, with no reviewer and no tests, is the single
biggest risk in this plan.** This phase exists to make the rest survivable.

Do **not** write tests for the fact-check logic being replaced — that is wasted effort. Test what
survives the refactor.

1. Add `test` and `typecheck` tasks to `turbo.json`; add `typecheck` (`tsc --noEmit`) to each app.
2. **Fix the `contact` mass-assignment vulnerability** — a real `CreateContactMessageDto` replacing
   `Prisma.ContactMessageCreateInput`. It is a live vuln, it is 30 minutes, and it establishes the
   DTO pattern every new endpoint in this plan will follow.
3. Tests for the primitives that outlive the refactor:
   - `JwtAuthGuard` deny-by-default; `@Public()` opt-out
   - `RolesGuard` enforcement, including the `@Roles()`-without-guard trap
   - `TransformInterceptor`: the paginated branch requires all four of
     `data`/`total`/`page`/`limit`, and silently degrades without them
   - `ValidationPipe` rejects undeclared fields (the `forbidNonWhitelisted` contract)
4. Fix the seed dotenv bug (`db:seed` / `db:seed:ar` don't load `.env`) — the seeds get rewritten in
   Phase 1 anyway, but the runner bug is independent of their content.

**Done when:** `pnpm typecheck` and `pnpm test` run from the root and pass; the four guard/envelope
behaviours have failing-if-broken coverage.

---

## Phase 1 — Schema foundation · 4–6d

1. **Squash the six migrations into a fresh `init`.** Zero rows makes them archaeology.
2. Land the full schema from ADR-0002/0005/0006/0007 in that one migration:
   - `Claim`, `ClaimAppearance`
   - `FactCheck` (verdict, `countryCodes`, relations)
   - `FactCheckArticle` (locale, prose, byline, editor, status)
   - `Evidence` + `EvidenceType`
   - `ArticleRevision` + `RevisionTier`, `VerdictChange`
   - `Topic`, `FactCheckTopic`, `Country`
   - `VerdictDefinition`
   - `Locale` enum; `RETRACTED` added to `ContentStatus`
3. Decide and apply: keep or drop `Comment` (ADR-0002 open question 2). Dropping is free today.
4. `pnpm db:generate`; confirm the client compiles.
5. **Rewrite both seed scripts** against the new model. Seed must include, deliberately:
   - a fact-check with **both** AR and EN articles published
   - one with AR published, EN still draft
   - one with a `CORRECTION` revision, and one with a `VERDICT_CHANGE`
   - one `RETRACTED`
   - evidence including a dead URL with an `archiveUrl`
   - MENA countries with **verified** Arabic names — not machine-translated
6. Draft the starting topic vocabulary from existing seed content, for client review.

**Done when:** migration applies to a clean local DB on 5434, seeds run, and every state above
exists in the database.

**Verify:** `docker rm -f tahaqaq-db-dev` then recreate from scratch → migrate → seed, clean.

---

## Phase 2 — API, public reads · 4–5d · ✅ DONE 2026-08-11

> **Delivered**, plus an unplanned Prisma 5→7 upgrade and the enum→lookup-table
> migration that came with it. Reads are locale-aware over
> Claim/FactCheck/FactCheckArticle; internal fields are unreachable by
> construction and asserted by test; both frontend clients now derive their
> fact-check types from the OpenAPI document rather than hand-maintained
> interfaces (ADR-0003 option B, pulled forward as predicted).
>
> Authoring returns 501 by design — see Phase 3.

1. Rework `modules/fact-checks` for the new shape. Read endpoints first — they are what the public
   site needs and they carry no write-invariant risk.
2. Routes gain a locale dimension: list and detail resolve `(locale, slug)`.
3. Preserve the response envelope contract exactly — services return bare data, and paginated
   services return all four of `data`/`total`/`page`/`limit` or `meta` silently vanishes.
4. Shape `include`s deliberately. A list page must not load every evidence row for every result;
   expect to need a separate list projection from the detail projection.
5. Public payloads must **never** include `Evidence.note` or `ArticleRevision.reason`. Test it.
6. Update both hand-written API clients by hand — `sources: any[]` becomes a real `Evidence` type.

**Done when:** the public endpoints return the new shape with correct pagination, and a test asserts
internal fields are absent from public responses.

> This is where [ADR-0003](../adr/0003-api-contract-generation.md) (generate the client from
> OpenAPI) stops being optional. Two hand-written clients tracking a six-entity model by hand is a
> standing bug generator. Consider pulling ADR-0003 forward into this phase.

---

## Phase 3 — API, authoring and lifecycle · 6–8d

The highest-risk phase. Every invariant in ADR-0006 lives here.

1. **One write path.** All publish/edit operations go through a single service method that writes
   revisions. Scattered `prisma.factCheckArticle.update()` calls make the history unreliable the
   moment a second one exists.
2. Article lifecycle: `DRAFT → UNDER_REVIEW → PUBLISHED → RETRACTED | ARCHIVED`, per article,
   per locale. Reject illegal transitions.
3. Editorial gate: `editorId` set and (recommended) `!= authorId` before `PUBLISHED`.
4. Revision writing with tier selection; `noticeText` required for non-`SILENT`.
5. Verdict change: writes `VerdictChange` with a distinct approver, **and propagates a
   `CORRECTION`-or-higher revision to every published article in both locales.**
6. Evidence CRUD with `position` normalized on write, and
   `@ValidateNested({ each: true }) + @Type()` on nested DTOs — without both, `class-validator`
   silently skips array items and reopens the `any[]` hole.
7. Tests for ADR-0006 invariants **1, 5, 6, 7** specifically. Invariant 6 (cross-locale propagation)
   is the one a plausible implementation quietly gets wrong.

**Done when:** invariants are enforced and tested; no code path mutates a published article without
writing a revision.

---

## Phase 4 — Admin UI · 8–12d

The largest phase, and the one most often underestimated. New tabs go in the `switch` in
`AdminDashboard.tsx` — see the `admin-screen` skill; there is no admin router.

1. Fact-check editor restructured: claim + appearances / review (verdict, topics, countries) /
   article tabs per locale.
2. **Evidence subform** — repeatable, reorderable, ~10 fields per row. This alone is a large slice
   of the phase.
3. **Correction flow** — tier selection, notice authoring, preview against the previous revision.
4. Editorial review UI — assign editor, approve, publish, per locale and per article.
5. Verdict change flow with its mandatory second approver.
6. Topic management screen.
7. Per-locale publish state made obvious at a glance — "AR published, EN draft" must be visible
   without clicking in.

**Done when:** a full fact-check can be authored, reviewed, published, corrected, and retracted
entirely through the admin UI.

---

## Phase 5 — Public site · 5–7d

1. Locale routing and the `hreflang` pair between AR and EN versions.
2. Fact-check detail: claim, verdict with its published definition, evidence list with archive
   fallbacks, byline + editor, corrections block.
3. Retraction rendering — notice replaces the analysis, URL preserved.
4. Index and filtering by topic and country.
5. Language switcher that resolves to the sibling article, degrading sensibly when it does not exist
   or is unpublished.
6. RTL correctness — this is the phase where the **248 physical spacing utilities and 0 logical
   ones** across the two apps become a real cost. Budget for it or accept visible breakage.

**Done when:** a published fact-check renders correctly in both locales with corrections visible,
verified in a browser — not by type-check.

---

## Phase 6 — Rating definitions and interop · 3–4d

1. Seed `VerdictDefinition` for all 8 `VeracityRating` values with bilingual labels and definitions.
   **The client writes the definition text** — it is a public editorial commitment, not a
   developer's paraphrase.
2. Public ratings page rendering the scale. IFCN expects the scale to be published.
3. `ClaimReview` JSON-LD on fact-check pages. **Verify the current schema.org spec field-by-field
   before building the serializer** — do not implement it from memory.
4. Submit to Google Fact Check Tools once live.

**Done when:** the ratings page is live and `ClaimReview` markup validates against Google's testing
tool.

---

## Decisions still open

None block Phase 0 or Phase 1. Resolve before the phase noted.

| #   | Question                                       | Blocks       | Recommendation                                                                                 |
| --- | ---------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| 1   | Keep or drop `Comment`?                        | Phase 1      | Drop unless public comments are a client commitment — it is an unbudgeted moderation liability |
| 2   | Must editor differ from author?                | Phase 3      | Yes; but a one-person desk cannot comply — client/staffing call                                |
| 3   | Minimum 1 evidence row to publish?             | Phase 3      | Yes; trivial to enforce, hard to argue against                                                 |
| 4   | Is `Evidence.excerpt` public?                  | Phase 5      | Public; confirm copyright comfort at length                                                    |
| 5   | URL structure — `/ar/fact-checks/<slug>`?      | Phase 5      | Locale-prefixed; cleanest for SEO and `hreflang`                                               |
| 6   | Starting topic vocabulary                      | Phase 1 seed | Ali drafts, **client confirms before it hardens**                                              |
| 7   | Who owns the topic vocabulary long-term?       | Phase 4      | Needs a named client-side owner                                                                |
| 8   | Corrections policy page — who writes the text? | Phase 6      | Client; it is their editorial voice                                                            |

## For the client conversation

Three things here are theirs to decide, not Ali's:

- **The verdict definitions** (Phase 6) — a published editorial commitment.
- **The topic vocabulary** (Phase 1/4) — it encodes their editorial priorities, and it needs an
  owner or it rots.
- **The corrections policy** (Phase 6) — required for IFCN, written in their voice.

And one thing they should hear early: this is **33–46 developer-days**, of which nearly half is
interface work. It is also the work that makes the platform defensible as a fact-checking
organization rather than a website with verdicts on it — and doing it before publication costs a
fraction of doing it after.

# ADR-0004: Extract a shared UI package

- **Status:** Proposed
- **Date:** 2026-08-02
- **Deciders:** Ali Traboulsi

## Context

`apps/web/src/components/ui/` and `apps/admin/src/components/ui/` each contain **50 shadcn/ui
components, duplicated verbatim**. A fix applied to one is not applied to the other, and in practice
will not be — nothing signals that a twin exists.

Meanwhile `packages/ui` — the workspace package that exists precisely for this — contains
`counter.ts` and `header.ts`: **starter stubs from `create-turbo -e with-vite`, imported by nothing.**
The same is true of `packages/eslint-config` and `packages/typescript-config`, which are consumed
only by the equally dead `apps/docs`.

So the monorepo has the *shape* of code sharing with none of the substance.

Three complications make this less trivial than "move the folder":

1. **Tailwind v4.** Both apps use `@tailwindcss/vite` (v4), not the v3 PostCSS pipeline. v4's
   CSS-first configuration changes how a shared component package exposes its styles — v3 answers
   found online do not apply.
2. **ESLint version split.** web and admin are on ESLint 9 flat config; `apps/api` and the repo root
   are on ESLint 8 with `.eslintrc.js`. A shared package has to pick one, or sit outside both.
3. **The apps are not actually identical consumers.** The public site and the admin panel have
   different design needs. Some divergence between the two copies may be **intentional** — nobody has
   checked. Deduplicating a deliberate difference is a regression.

## Options

**A. Do nothing.** 0d.
Keep two copies. Cost is a slow drift and double maintenance on every `ui/` fix, plus the ongoing
confusion of a dead `packages/ui` sitting next to the real thing.

**B. Delete the dead packages only, keep the duplication.** 0.3d.
Removes `apps/docs`, `packages/ui`, `packages/eslint-config`, `packages/typescript-config`. Does not
fix duplication, but removes the misleading signal that sharing already exists.
*Forecloses:* nothing. *Reversal:* trivial (git).

**C. Extract a real `packages/ui` with the shared components.** 3–5d.
Replace the stub with the actual shadcn components, consumed by both apps. Requires resolving the
Tailwind v4 and ESLint issues, and auditing all 50 pairs for intentional divergence.
*Forecloses:* per-app component divergence — which is the point, and also the risk.
*Reversal:* moderate; inlining components back is mechanical but touches many imports.

**D. Keep duplication, add a sync check.** 1d.
A CI/script check that diffs the two `ui/` directories and reports divergence. Cheap, keeps full
per-app freedom, but never actually removes the double maintenance.

## Decision

**Recommended: B now, C later — and only after the audit in step 1 justifies it.**

Reasoning:

- **B is unambiguous and nearly free.** Dead code that *looks* like infrastructure is worse than no
  infrastructure: it invites someone (or some agent) to "just add it to `packages/ui`" and produce a
  third thing nobody imports. Do this regardless.
- **C is genuinely worth it only if the 50 pairs are actually identical.** That is an assumption, not
  a fact — verify it before committing 3–5 days. If a meaningful number diverge intentionally, C's
  value drops sharply and D becomes the better trade.
- Sequencing matters: C is not urgent. It competes with client-visible work and saves time only
  proportionally to how often `ui/` components are edited — which, for stock shadcn components, may
  be rarely. Measure before investing.

**Do not attempt C until ADR-0002 (bilingual) is decided.** Both touch every component; doing them
in sequence rather than simultaneously avoids a merge nightmare in a repo with no tests to catch
breakage.

## Consequences

**B:** ~4 directories removed, clearer repo, no functional change. Small risk that something
undiscovered imports them — check before deleting (the earlier grep found nothing).

**C, if pursued:** single source of truth for UI, at the cost of a build step for the package and
less freedom to diverge per app. If the two apps legitimately need different styling, forcing them
together creates prop-drilling and variant sprawl that is worse than the duplication it replaced.

**Note:** `apps/web` also carries `lovable-tagger` as a devDependency from its Lovable origins. If
that workflow is no longer used, it belongs in the same cleanup commit as B.

## Migration path

**Now (B, 0.3d)**
1. Confirm nothing imports `packages/ui`, `packages/eslint-config`, `packages/typescript-config`, or
   `apps/docs`.
2. Delete them in a single commit, so reverting is one operation.
3. Remove `apps/docs` from any CI/deploy config that references it.

**Before C — the deciding measurement (0.5d)**
4. Diff all 50 component pairs:
   `for f in apps/web/src/components/ui/*; do diff -q "$f" "apps/admin/src/components/ui/$(basename $f)"; done`
5. **If nearly all are identical → C is worth it.** If many diverge, understand why first; the answer
   may be that D is the right call instead.

**C, if justified (3–5d)**
6. Resolve Tailwind v4 style sharing for a workspace package (do this first — it is the part most
   likely to be unpleasant, and it invalidates the plan if it does not work cleanly).
7. Settle the ESLint version split.
8. Move identical components; leave genuinely divergent ones in the apps rather than forcing them.
9. Migrate one app fully before starting the other.

## Open questions for the client

None — internal structure, not client-visible. Sequence accordingly.

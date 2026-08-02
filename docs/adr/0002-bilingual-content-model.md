# ADR-0002: Bilingual content model

- **Status:** Proposed — **blocked on client input**
- **Date:** 2026-08-02
- **Deciders:** Ali Traboulsi (with client decision required)

## Context

The client requires **true Arabic/English bilingual support**. The codebase does not have it, and the
gap is larger than it looks from the outside.

Verified state:

- **The Prisma schema has zero translation fields.** All 36 models store content in exactly one
  language per row. There is no `titleAr`/`titleEn`, no locale column, no translation table.
- **UI strings are hardcoded Arabic literals in TSX**, across 27 pages in `apps/web` plus the admin
  components. No i18n library appears in any `package.json`.
- **Seeds are split into two parallel datasets** — `seed.ts` (English) and `arabic.seed.ts` (Arabic).
  This is the same gap showing up in the data layer: two monolingual worlds, not one bilingual one.
- **RTL is handled ad-hoc**, with directional CSS rather than logical properties.
- Commit `ac65b96` deliberately forced **English locale** for number and date formatting.

Roughly **15 of the 36 models carry user-facing content** that would need translating: `FactCheck`,
`Blog`, `Research`, `Course`, `Lesson`, `Quiz`, `Event`, `FAQ`, `Achievement`, `Certificate`,
`PrivacyPolicy`, `TermsOfService`, `AccessibilityStatement`, plus notification and moderation text.

This is not a configuration change. It touches the schema, every query that reads content, every
admin editing screen, the search module, and every string in two frontends.

## The decision that actually matters is not technical

Two client answers determine the cost, and they change it by roughly **2×**:

1. **Is English at full parity with Arabic, or a lighter secondary surface?**
   Parity means every content type, every admin screen doubles its editing UI, and the editorial team
   must produce two versions of everything — an ongoing operational cost the client will carry
   forever, not a one-off build cost.
2. **What does the public site show for content that exists in only one language?**
   Hide it? Show Arabic with a notice? Machine-translate with a disclaimer? This determines whether
   publish status is **per-locale** (significantly more schema and workflow) or global.

Question 2 is an **editorial policy decision**, and it drives the schema more than any technical
consideration does. It must be answered before the schema is designed, not after.

## Options

### A. Sibling columns — `title` + `titleEn` on each model
**Cost: 10–15d.** Simplest migration, no joins, minimal query changes.
**Forecloses:** a third language (each addition re-migrates every content model); makes "which
languages exist for this row" awkward to express; leaves null-heavy tables.
**Reversal:** moderate — data is easy to move out, but every query referencing the columns changes.

### B. Translation tables — `FactCheckTranslation(locale, ...)` per content model
**Cost: 20–25d.** Normalized, scales to N languages, the conventional answer. Per-locale publish
status falls out naturally.
**Forecloses:** little. Costs a join on every content read and rewrites essentially every query in
the API, plus the admin editing UX becomes locale-aware throughout.
**Reversal:** hard once queries are rewritten.

### C. JSON columns — `title Json` holding `{ ar, en }`
**Cost: 8–12d.** One migration per model, very flexible.
**Forecloses:** type safety at the database boundary, straightforward indexing, and — critically —
**full-text search**. This project has a `search` module; Postgres full-text over JSON content is
materially worse than over columns.
**Reversal:** moderate, but by then search will have been built around it.

### D. Do nothing for now — Arabic-only, prepare the ground
**Cost: 1–2d.** Convert directional CSS to logical properties, group strings for later extraction,
stop adding to the problem.
**Forecloses:** nothing. Makes every later option slightly cheaper.
**Reversal:** trivially — it *is* the reversal.

## Decision

**Recommended: D now, then B — conditional on the client's answers.**

Reasoning:

- **D is unambiguously worth doing immediately.** It is cheap, it forecloses nothing, and every day
  the codebase grows without it, options A–C get more expensive. Do it regardless of what the client
  decides.
- **If English is at parity → B (translation tables).** The per-locale publish status that question 2
  will almost certainly require is native to B and painful to bolt onto A or C.
- **If English is a lighter secondary surface → A (sibling columns).** At two languages with one
  clearly primary, B's normalization is overhead that buys little.
- **C is not recommended** for this product specifically. Losing good full-text search on a platform
  whose value is people *finding* whether a claim was checked is a bad trade for 4 saved days.

**This ADR cannot be accepted until the client answers the two questions above.**

## Consequences

**If B:** highest build cost and near-total query rewrite, but the model stops being a constraint —
a third language becomes configuration.

**If A:** ships sooner; expect to revisit if a third language is ever requested.

**Either way:** translated content is an **ongoing editorial cost** for the client's team, not a
one-time engineering cost. Worth stating plainly to them — a bilingual platform that nobody staffs to
translate is worse than a good monolingual one, because half of it silently rots.

**Machine translation of published fact-check content is out of scope** without an explicit, visible
disclaimer and client approval. A mistranslated verdict is a credibility incident, and credibility is
the entire product.

## Migration path

**Phase 0 — now, no decision needed (1–2d)**
1. Convert directional CSS to logical properties (`ms-*`/`me-*`, `start`/`end`) across both apps.
2. Group user-facing strings so extraction is mechanical later.
3. **Stop adding ad-hoc `*Ar`/`*En` columns.** Any such column added now is debt this ADR must undo.

**Phase 1 — after the client decides (2–3d)**
4. Choose the i18n library and land it as one coordinated change for UI strings only.
5. Extract existing strings. Mechanical, and the largest single chunk of tedium.

**Phase 2 — content model (8–20d depending on A vs B)**
6. Migrate the schema for one model first — `Blog` is the right pilot: real content, low blast radius,
   not on the critical fact-checking path.
7. Validate the full loop end to end (admin editing → API → public rendering → search) before touching
   the remaining models.
8. Roll out across the remaining ~14 content models.
9. Merge `seed.ts` and `arabic.seed.ts` into one bilingual dataset.

**Phase 3 — search (2–3d)**
10. Arabic normalization: hamza forms (أإآ→ا), taa marbuta (ة→ه), diacritic stripping. Without this,
    search fails to find content that exists — users read that as a broken site.

## Open questions for the client

1. **Is English at full parity with Arabic, or a secondary surface?** (Determines A vs B; ~2× cost.)
2. **What does the public site show for content translated in only one language** — hide, show with a
   notice, or machine-translate with a disclaimer? (Determines whether publish status is per-locale.)
3. **Who produces the English content?** If there is no budgeted translator, the honest recommendation
   may be to stay Arabic-only and do it excellently.
4. **Is a third language plausible within 2 years?** If yes, B regardless of the answer to Q1.

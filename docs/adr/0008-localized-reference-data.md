# ADR-0008: Localized reference data

- **Status:** Proposed
- **Date:** 2026-08-11
- **Deciders:** Ali Traboulsi
- **Related:** [ADR-0002](./0002-bilingual-content-model.md), [ADR-0007](./0007-topic-and-region-taxonomy.md)

## Context

Two things are now true that were not when ADR-0002 and ADR-0007 were written.

**First, the lookup tables exist.** All twelve former enums are rows, keyed by a
semantic `code`, so values can be added without a schema change. Every one of them
carries a user-facing label — a verdict shown on a public fact-check, a status shown
in the admin queue, an event type shown on the events page.

**Second, the language requirement grew.** The brief is no longer "Arabic and
English". It is Arabic and English _now_, with French and others plausible later,
and the platform should be shaped so adding one is not a migration.

The current reference tables hardcode two languages:

| Model                | Today                                                  |
| -------------------- | ------------------------------------------------------ |
| `VeracityRating`     | `labelAr`, `labelEn`, `definitionAr`, `definitionEn`   |
| `Topic`              | `labelAr`, `labelEn`, `descriptionAr`, `descriptionEn` |
| `Country`            | `nameAr`, `nameEn`                                     |
| The other 11 lookups | a single `name`                                        |

Adding French to that means a migration touching every reference table, and a
third column on each — which is precisely the shape ADR-0002 rejected for content.

Note what is **already** N-language ready and stays that way: `FactCheckArticle`
is one row per locale keyed by `localeCode`, and `Locale` is itself a lookup
table. Adding French there is inserting rows. The gap is only in reference data.

## Options

**A. Keep adding `*Ar`/`*En` columns.** 0d now, a migration per language forever,
across ~15 tables. Rejected: it is the debt this project already decided not to take.

**B. A polymorphic `Translation` table** — `(namespace, key, localeCode, label)`.
Normalized, queryable, one table for everything. But a polymorphic key cannot carry
a real foreign key, so nothing stops an orphaned or misspelled `namespace`, and —
the practical killer — Prisma cannot express it as a nested relation, so every
`select` that currently reaches `verdict.label` in one query becomes a second
lookup and a manual join in application code.

**C. Per-entity translation tables** — `VeracityRatingTranslation`, `TopicTranslation`
and thirteen more. Proper foreign keys, clean nested selects. Costs ~15 extra tables
and a join on every reference read, to translate what are four-to-eight-row tables.

**D. A JSON map per localized field** — `labels Json` holding `{ "ar": "…", "en": "…" }`.
Adding a language is writing a key. No joins, no new tables, nested selects keep
working unchanged.

## Decision

**Option D**, for reference data only.

The obvious objection is that ADR-0002 explicitly rejected JSON columns for
bilingual content. That rejection was correct and it does not apply here, for a
specific reason worth stating plainly:

> ADR-0002 rejected JSON because the platform has a search module, and Postgres
> full-text search over JSON content is materially worse than over columns.
> **Reference labels are never searched, never filtered on, and never sorted by.**
> You look them up by `code` and render the label. The property that disqualified
> JSON for articles is irrelevant for a table of eight verdicts.

So the two decisions are consistent: normalized rows where the data is queried,
JSON where it is only ever read by key.

### Shape

Every reference model converges on the same form:

```prisma
model VeracityRating {
  code         String  @id
  /// LocalizedText — { "ar": "صحيح", "en": "True" }. Adding French is a key.
  labels       Json
  descriptions Json?
  position     Int     @default(0)
  isActive     Boolean @default(true)
  …relations
}
```

`Topic`, `Country` and all fifteen lookups follow it. `VeracityRating`'s former
`definitionAr`/`definitionEn` become `descriptions`.

### Resolution

Labels resolve server-side, so the API returns one language rather than a blob:

```jsonc
"verdict": { "code": "FALSE", "label": "خاطئ", "definition": "…" }
```

Resolution falls back **requested locale → default locale (AR) → any present key →
the code itself**. A missing French label degrades to Arabic rather than to a blank
chip in the UI, and never to a crash.

Returning the resolved string rather than the map also keeps the frontends simple
and means adding a language does not change the API contract.

## Consequences

**Positive**

- Adding French is: insert a `Locale` row, add a key to each `labels` map. No
  migration, no schema change, no API change.
- No extra tables and no joins on reference reads.
- Existing nested `select`s keep working; the fact-checks service changes only in
  which fields it names.
- The same shape applies uniformly to all fifteen lookups, `Topic` and `Country`.

**Negative**

- **No database-level integrity on the language keys.** Nothing stops `{"ar": …}`
  with no `en`, or a typo'd key like `"eng"`. This is the real cost. Mitigated by
  extending `LookupIntegrityService`, which already runs at boot: it now also
  asserts every reference row has a label for every **active** locale, and refuses
  to start otherwise. That moves the failure to boot time instead of a blank label
  in production.
- `Json` is untyped in the Prisma client. Mitigated with a `LocalizedText` TS type
  and a single resolver — application code never touches the raw map.
- Editing translations in the admin becomes a form over a map rather than rows.
  For four-to-eight-row tables this is a non-issue; if a translation-management UI
  is ever wanted across hundreds of strings, revisit.

**Reversibility.** Good. Unpacking `labels` into a translation table later is a
mechanical migration — read the map, write rows — and nothing about this decision
forecloses option C.

## Migration path

No production data, so this lands in the `init` migration.

1. Replace `name`/`label*`/`definition*`/`name*` on all reference models with
   `labels Json` + `descriptions Json?`, plus `position` and `isActive`.
2. Add `LocalizedText` and `resolveLocalized()` to the shared constants, and seed
   from the same source so rows and constants cannot disagree.
3. Extend `LookupIntegrityService` to assert label coverage per active locale.
4. Resolve labels in the API rather than returning the map.

## Open questions

1. **Should `Locale` carry an `isActive` flag?** Recommended yes — it lets French
   exist as data (translated gradually) before it is exposed publicly, which is
   exactly how a third language should roll out. Included in this ADR.
2. **What is the fallback for a missing translation — silent, or visible?** This
   ADR falls back silently to Arabic. An editorial argument exists for showing an
   explicit "not available in this language" notice instead; that is a client call
   and it is a UI change, not a schema one.

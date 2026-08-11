# ADR-0005: Evidence as a first-class entity

- **Status:** Proposed
- **Date:** 2026-08-05
- **Deciders:** Ali Traboulsi
- **Depends on:** [ADR-0002](./0002-bilingual-content-model.md)

## Context

Sources are currently `sources Json[]` on `FactCheck`. The looseness runs the full depth of the
stack — verified, not assumed:

| Layer        | Declaration                                 |
| ------------ | ------------------------------------------- |
| Schema       | `sources Json[] // Array of source objects` |
| DTO          | `@IsArray() sources?: any[]`                |
| Web client   | `sources: any[]`                            |
| Admin client | same                                        |

So there is **no schema, no per-item validation, and no type** anywhere. Every row can hold a
differently-shaped object, and nothing will complain.

For a fact-checking platform this is the wrong field to be loose about. Evidence _is_ the product —
the verdict is an opinion, the sources are what make it defensible. Concretely, the current shape
cannot support:

- **Ordering.** Analysts present evidence in a deliberate sequence; a JSON array's order is
  incidental and silently lost by any client that maps over it.
- **"When did you check this?"** No accessed-date. A source that said X in January and Y in March
  makes the fact-check unfalsifiable without one.
- **Archived copies.** Sources go dead or get edited. Without a snapshot the citation eventually
  points at nothing, or worse, at something that now contradicts the analysis.
- **Any query at all.** "Which fact-checks cite this publisher?", "how many cite primary sources?",
  "which citations are dead?" are all impossible against `Json[]`.
- **Reuse.** The same official statistic cited by twelve fact-checks is twelve unrelated blobs.

The last two matter beyond engineering: publisher-level querying is what funder and transparency
reporting is built from.

## Options

**A. Keep `Json[]`, add a documented convention.** 0d. Free, changes nothing. Conventions without
enforcement drift immediately, and none of the queries become possible.

**B. Keep `Json[]`, validate with a Zod/class-validator schema on write.** ~1d. Fixes shape drift
at the boundary. Still unqueryable, still unorderable in any enforced way, still unjoinable. Buys
the cheapest 20% and forecloses nothing.

**C. `Evidence` table as a child of `FactCheck`.** ~3–4d including admin editor. Ordered, typed,
queryable, joinable. Straightforward Prisma relation.

**D. `Source` entity + `Citation` join** — deduplicate sources globally, so one publisher/URL is one
row cited by many fact-checks. ~6–8d. Enables "everything citing this source" and dead-link sweeps
across the corpus. Costs a normalization step at authoring time: analysts must find-or-create rather
than paste.

## Decision

**Option C**, structured so that D remains reachable.

Reasoning:

- C captures essentially all the near-term value — order, accessed-date, archive, publisher
  queries — for roughly half of D's cost.
- D's real payoff is corpus-scale analysis, which needs a corpus. With zero published fact-checks
  today, buying it now is speculative.
- The upgrade path from C to D is mechanical and non-destructive: extract distinct `(url, publisher)`
  pairs into `Source`, add `sourceId` to `Evidence`, keep the per-citation fields where they are.
  Nothing about C blocks it.

Keep `accessedAt` and `archiveUrl` on the **citation**, not on any future shared `Source` — two
analysts consulting the same URL months apart genuinely accessed different content.

```prisma
enum EvidenceType {
  PRIMARY_SOURCE      // the document/recording/data itself
  OFFICIAL_RECORD     // government, court, regulator
  EXPERT_STATEMENT    // named expert, on record
  MEDIA_REPORT        // journalism
  DATASET             // statistics
  ARCHIVE             // snapshot standing in for a dead original
  OTHER
}

model Evidence {
  id          String       @id @default(cuid())
  factCheckId String
  factCheck   FactCheck    @relation(fields: [factCheckId], references: [id], onDelete: Cascade)

  position    Int                        // explicit presentation order
  type        EvidenceType @default(OTHER)

  url         String
  title       String?
  publisher   String?
  publishedAt DateTime?                  // the source's own date
  accessedAt  DateTime                   // when the analyst consulted it — REQUIRED
  archiveUrl  String?                    // snapshot
  archivedAt  DateTime?

  excerpt     String?      @db.Text      // the specific passage relied on
  note        String?      @db.Text      // internal analyst note, not published

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([factCheckId, position])
  @@index([publisher])
  @@map("evidence")
}
```

Notes on the shape:

- **Evidence hangs off `FactCheck`, not `FactCheckArticle`.** A URL is language-neutral; both the
  Arabic and English versions cite the same sources. Only `excerpt` is arguably language-bound —
  accepted as a deliberate simplification, revisit if it bites.
- **`position` is indexed, not `@@unique`.** A unique constraint makes reordering require temporary
  values or a deferred constraint; not worth the pain. Normalize positions in the service on write.
- **`accessedAt` is required.** This is the field most likely to be skipped and most needed later.
- **`note` is internal and must never be serialized to public responses.** Worth an explicit test.

## Consequences

**Positive** — evidence becomes queryable and reportable; dead-link sweeps become a scheduled job
(`@nestjs/schedule` is already a dependency); the public fact-check page can render a real citation
list with archive fallbacks; `publisher` aggregation feeds transparency reporting.

**Negative** — the admin authoring UI gets significantly heavier: a repeatable, reorderable subform
with ~10 fields per row. This is the bulk of the 3–4 days, not the schema. Analysts will feel the
friction of `accessedAt` on every citation; that friction is the point, but it is real.

**Deliberately not included** — automatic archiving (calling an archive service on save). Genuinely
valuable and clearly right eventually, but it introduces an outbound network dependency in the write
path, with its own failure and retry semantics. Manual `archiveUrl` first; automate once the field
is proven to be used.

## Migration path

No data to migrate (see ADR-0002). Land alongside the ADR-0002 schema in the same `init` migration.

1. Add `EvidenceType` and `Evidence` to the schema; drop `sources Json[]`.
2. `CreateEvidenceDto` / `UpdateEvidenceDto` with `@IsUrl()`, `@IsDateString()`, `@IsEnum()`.
   **Nested evidence on the fact-check DTO needs `@ValidateNested({ each: true })` + `@Type()`** —
   without both, `class-validator` silently skips validating array items, which would reproduce the
   exact `any[]` hole this ADR exists to close.
3. Service normalizes `position` to a contiguous 0..n-1 sequence on every write.
4. Replace `sources: any[]` in both hand-written clients with a real `Evidence` interface.
5. Seed realistic evidence — including at least one dead URL with an `archiveUrl`, so the fallback
   rendering path is exercised from day one.

## Open questions

1. **Is `excerpt` published or internal?** Recommended published — quoting the passage relied on is
   good practice and cheap. But it has copyright implications at length; confirm with the client.
2. **Minimum evidence to publish?** A hard "≥1 evidence row before `PUBLISHED`" rule is trivial to
   enforce and hard to argue against for a fact-checking desk. Recommended, but it is an editorial
   policy call.

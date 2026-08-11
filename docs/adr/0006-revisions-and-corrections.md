# ADR-0006: Revisions, corrections, and retraction

- **Status:** Proposed
- **Date:** 2026-08-05
- **Deciders:** Ali Traboulsi
- **Depends on:** [ADR-0002](./0002-bilingual-content-model.md)

## Context

Today a `FactCheck` has exactly one temporal field that reflects change: `updatedAt`. Every edit
overwrites the previous state. There is no history, no correction concept, and no way to answer
"what did this page say last month" — which is precisely the question asked when a fact-check is
challenged.

This is the requirement Ali singled out as "genuinely miserable to retrofit," and that is correct:
history you did not record cannot be reconstructed. It is also the requirement whose cost is
lowest **right now**, because there is no published corpus to backfill.

Two settled inputs shape the design:

- **Verdicts can change after publication.** Refusing to change a verdict is the less credible
  option — it means knowingly leaving a wrong rating up forever. IFCN's Code of Principles requires
  a published, honest corrections policy, and the entire purpose of one is to cover being wrong.
- **The verdict is shared across language versions** (ADR-0002), while prose, byline, and publish
  state are per-article. So a verdict change is a _review-level_ event with _article-level_
  consequences in both languages.

## Decision

### 1. Tiered revisions

Not every edit deserves a public notice, and treating them alike produces either noise or
dishonesty. Four tiers:

| Tier             | Trigger                                          | Public notice                            | Requirements                                                 |
| ---------------- | ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ |
| `SILENT`         | Typo, formatting, dead-link swap                 | None                                     | Snapshot retained internally                                 |
| `UPDATE`         | New information; verdict unaffected              | "Updated on X"                           | Snapshot + notice text                                       |
| `CORRECTION`     | Something published was **wrong**; verdict holds | "Corrected on X" + what was wrong        | Snapshot + notice + internal reason                          |
| `VERDICT_CHANGE` | The rating itself changes                        | "Verdict changed from Y to Z on X" + why | All of the above **+ prior verdict shown + editor sign-off** |

The tier is chosen by the editor, not inferred. Inferring it from a diff is tempting and wrong —
a one-word change can be either a typo or a reversal of meaning, and only a human knows which.

### 2. Full snapshots, not diffs

Each revision stores the complete article content as it stood. Storage is irrelevant at this scale;
rendering and reasoning about diffs is not. The public record requirement is "serve the version as
it was on date X", which a snapshot answers directly and a diff chain answers only by replay.

### 3. Published fact-checks are never hard-deleted

`ContentStatus` gains `RETRACTED`. A retracted fact-check keeps its URL and renders a retraction
notice in place of the analysis. Deleting a published verdict is indistinguishable from hiding a
mistake, which is the specific failure mode this whole ADR exists to prevent.

**If only one rule survives this document, make it this one.**

### Schema

```prisma
enum RevisionTier {
  SILENT
  UPDATE
  CORRECTION
  VERDICT_CHANGE
}

model ArticleRevision {
  id             String           @id @default(cuid())
  articleId      String
  article        FactCheckArticle @relation(fields: [articleId], references: [id], onDelete: Cascade)
  revisionNumber Int                            // 1-based, per article
  tier           RevisionTier

  // Full snapshot of the article as it stood at this revision
  title          String
  summary        String           @db.Text
  body           String           @db.Text
  methodology    String?          @db.Text
  verdictAtTime  VeracityRating                 // denormalised: what the rating was then

  noticeText     String?          @db.Text      // PUBLIC. null only for SILENT
  reason         String?          @db.Text      // INTERNAL. never serialized publicly

  editedById     String
  editedBy       User             @relation("RevisionEditor", fields: [editedById], references: [id])
  createdAt      DateTime         @default(now())

  @@unique([articleId, revisionNumber])
  @@index([articleId, createdAt])
  @@map("article_revisions")
}

model VerdictChange {
  id           String         @id @default(cuid())
  factCheckId  String
  factCheck    FactCheck      @relation(fields: [factCheckId], references: [id], onDelete: Cascade)

  fromVerdict  VeracityRating
  toVerdict    VeracityRating
  reason       String         @db.Text          // public
  changedById  String
  changedBy    User           @relation("VerdictChangedBy", fields: [changedById], references: [id])
  approvedById String                           // editor sign-off — REQUIRED
  approvedBy   User           @relation("VerdictApprovedBy", fields: [approvedById], references: [id])

  createdAt DateTime @default(now())
  @@index([factCheckId])
  @@map("verdict_changes")
}
```

`verdictAtTime` is deliberately denormalised onto the revision. Reconstructing "what was the rating
when this text was live" by replaying `VerdictChange` records against timestamps is exactly the kind
of derivation that is right in principle and wrong at 2am.

### Invariants (enforce in the service layer, and test them)

1. Revisions are **append-only**. No update or delete path exists for `ArticleRevision`, including
   for admins.
2. Publishing an article writes revision 1.
3. Every post-publication edit writes a revision. An edit that writes no revision is a bug.
4. `tier != SILENT` ⟹ `noticeText` is required and non-empty.
5. `VERDICT_CHANGE` ⟹ a `VerdictChange` row exists, `approvedById` is set and **differs from
   `changedById`**.
6. A verdict change writes a `CORRECTION`-or-higher revision to **every published article** of that
   fact-check, in both locales. A verdict corrected in Arabic but silently left in English is the
   worst outcome this model can produce.
7. `reason` and evidence `note` are never present in any public response payload.

Invariants 5, 6 and 7 are the ones worth a test each — they are where a plausible implementation
quietly does the wrong thing.

## Consequences

**Positive** — the desk can answer "what did you say, when, and what changed" without archaeology;
corrections become a credibility asset rather than an admission; retraction stops being deletion;
`VerdictChange` gives funder/transparency reporting a real substrate.

**Negative** — every write path through published content gets heavier, and the admin UI grows a
correction flow: tier selection, notice authoring, and a diff/preview against the last revision.
That flow is meaningful interface work and is the larger half of this ADR's cost.

**Risk** — invariant 6 (cross-locale propagation) is the one most likely to be implemented as "edit
this article" and quietly skip the sibling. Test it explicitly.

**Deliberately excluded** — editing a _published_ article without any notice, for any role. If a
genuine emergency requires it, it should be a database operation performed knowingly, not a button
that exists in the product.

## Migration path

No data to migrate. Lands with the ADR-0002 `init` migration.

1. Schema: `RevisionTier`, `ArticleRevision`, `VerdictChange`; add `RETRACTED` to `ContentStatus`.
2. Route all publish/edit operations through a single service method that writes revisions —
   **not** through scattered `prisma.factCheckArticle.update()` calls. If a second write path
   exists, the history is already unreliable.
3. Public API: `GET /fact-checks/:locale/:slug/revisions` returning non-`SILENT` revisions only.
4. Public rendering: a corrections block on the article, and a retraction notice replacing the
   analysis when `status = RETRACTED`.
5. Admin: correction flow with tier selection and required notice.
6. Tests for invariants 1, 5, 6, 7 **before** the admin UI is built on top.

## Open questions

1. **Retention of `SILENT` revisions** — keeping every typo snapshot forever is defensible
   (append-only is simpler to reason about) but grows without bound. Recommended: keep them; revisit
   only if volume proves it a problem.
2. **Is the corrections policy page itself a product deliverable?** IFCN expects a published
   corrections policy. Cheap to serve from the DB alongside the legal pages that already work this
   way — but someone has to write the policy text, and that is the client's editorial voice, not
   Ali's.
3. **Can a reader reach an old version's full text**, or only the notice describing what changed?
   Recommended: notice only at first. Serving prior full versions is a stronger transparency
   position but doubles the public surface and invites the "which one is current" confusion.

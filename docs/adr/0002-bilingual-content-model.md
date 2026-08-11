# ADR-0002: Content model — claim, review, and per-language articles

- **Status:** Proposed
- **Date:** 2026-08-05
- **Deciders:** Ali Traboulsi
- **Supersedes:** the 2026-08-02 draft of this ADR, which proposed sibling columns or translation
  tables. That draft was never accepted and is now rejected — see "Why the earlier draft was wrong".

> The filename still says `bilingual-content-model` for numbering stability. The scope is broader:
> this ADR decides the shape of the whole editorial record.

## Context

The current `FactCheck` model is a blog post with a verdict field: `title`, `slug`, `claim`,
`claimant`, `verdict`, `summary`, `fullAnalysis`, `methodology`, `sources Json[]`, `tags String[]`,
`views`, `shares`, SEO fields, one `authorId`. It has no notion of where a claim appeared, who
reviewed the article, what changed after publication, or what language anything is in.

The editorial requirements are now settled:

- **Claim** — text as circulated, where it appeared, when, who spread it, original media + archive link
- **Verdict** — the existing 8-value enum, tied to published definitions
- **Evidence** — ordered sources with URL, publisher, date accessed, archived copy
- **Article body** — the reasoning
- **Byline + editor** — who wrote, who reviewed (IFCN cares about this)
- **Revision history + corrections** — append-only, public "corrected on X"
- **Language pair** — Arabic-first with a linked English version, _not_ a translation string blob
- **Topic + region tags**

Two facts changed the calculus since the earlier draft:

1. **There is no production data.** The hosted Supabase project no longer exists
   (`mkowxfbbazrjkhihmpea` does not resolve). Nothing needs backfilling.
2. **English is a full editorial artifact**, not a rendering of the Arabic — confirmed by Ali.
   It gets its own byline, publish date, and corrections.

## Why the earlier draft was wrong

The 2026-08-02 draft offered sibling columns (`title`/`titleEn`), translation tables
(`FactCheckTranslation` keyed by locale), or JSON columns, and recommended translation tables.

All three model translation as _an attribute of one document_. That cannot express the thing this
desk actually needs: **the English version being corrected while the Arabic is not.** A translation
row has no byline, no publish date, no revision history, and no independent status — because in
those models it isn't a document, it's a field value.

Once English is a full artifact, the question stops being "how do we store two strings" and becomes
"what is the document, and what is shared between documents." That is a different decision.

## Decision

Decompose `FactCheck` into three entities.

```
Claim ──< ClaimAppearance          "what was claimed, and where it showed up"
  │
  └──< FactCheck                   the review: verdict, evidence, topics, regions
         ├──< Evidence             (ADR-0005)
         ├──< VerdictChange        (ADR-0006)
         └──< FactCheckArticle     one per locale: prose, byline, editor, publish state
                └──< ArticleRevision  (ADR-0006)
```

### 1. `Claim` — what was asserted, independent of who checked it

Holds the claim as circulated, the claimant, when it was made, and the language it circulated in.
Separating it means a claim can be re-reviewed later, and the same claim can be recognised across
submissions — which is also the hook the deduplication work in the AI pipeline needs.

`ClaimAppearance` is a child table because a claim appears in **many** places (a tweet, a WhatsApp
forward, a TV segment). Each appearance carries its own URL, platform, date, and — critically —
**archive URL and archive timestamp**. Claims get deleted; the archive link is the only thing that
survives, and it is the difference between a defensible fact-check and an unfalsifiable one.

### 2. `FactCheck` — the review, language-neutral

Holds the **verdict**, evidence, topics, and region codes. Keeps the existing name and the
`/fact-checks` route family to limit churn.

**The verdict lives here, shared across both language versions.** This is the load-bearing decision:
if the verdict lived on each article, nothing would stop the Arabic reading `MOSTLY_TRUE` while the
English reads `HALF_TRUE`. Publishing two different ratings for one claim under one masthead is not
a defect you can ship. Evidence is likewise shared — a URL is a URL, regardless of the language of
the prose citing it.

### 3. `FactCheckArticle` — the per-locale editorial artifact

One row per locale, carrying everything that is genuinely per-language: `title`, `slug`, `summary`,
`body`, `methodology`, SEO fields, **`authorId` (byline)**, **`editorId` (reviewer)**, `reviewedAt`,
`status`, and `publishedAt`.

Consequences that fall out of this and are all desirable:

- English can be published while Arabic is still in review, or vice versa.
- Each version has its own revision history and corrections.
- Editorial review is per-article, because review is of _the prose_, not of the rating.
- Slugs are unique **per locale**, not globally.

### Schema sketch

```prisma
enum Locale { AR EN }

model Claim {
  id           String    @id @default(cuid())
  text         String    @db.Text          // as circulated, original language
  language     Locale?
  claimantName String?
  claimedAt    DateTime?                    // when the claim was made
  firstSeenAt  DateTime?                    // when the desk first saw it circulating

  appearances  ClaimAppearance[]
  reviews      FactCheck[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([claimedAt])
  @@map("claims")
}

model ClaimAppearance {
  id         String    @id @default(cuid())
  claimId    String
  claim      Claim     @relation(fields: [claimId], references: [id], onDelete: Cascade)
  url        String
  platform   String?                        // twitter | facebook | whatsapp | tv | news | other
  publisher  String?
  appearedAt DateTime?
  archiveUrl String?                        // snapshot — survives deletion of the original
  archivedAt DateTime?
  mediaUrls  String[]

  createdAt DateTime @default(now())
  @@index([claimId])
  @@map("claim_appearances")
}

model FactCheck {
  id           String         @id @default(cuid())
  claimId      String
  claim        Claim          @relation(fields: [claimId], references: [id])
  verdict      VeracityRating                 // SHARED across locales — see above
  countryCodes String[]                       // ISO 3166-1 alpha-2 (ADR-0007)

  submissionId String?        @unique
  submission   Submission?    @relation(fields: [submissionId], references: [id])

  articles       FactCheckArticle[]
  evidence       Evidence[]                   // ADR-0005
  topics         FactCheckTopic[]             // ADR-0007
  verdictChanges VerdictChange[]              // ADR-0006

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([verdict])
  @@index([claimId])
  @@map("fact_checks")
}

model FactCheckArticle {
  id          String        @id @default(cuid())
  factCheckId String
  factCheck   FactCheck     @relation(fields: [factCheckId], references: [id], onDelete: Cascade)
  locale      Locale

  slug        String
  title       String
  summary     String        @db.Text
  body        String        @db.Text
  methodology String?       @db.Text

  status      ContentStatus @default(DRAFT)   // + RETRACTED, see ADR-0006
  publishedAt DateTime?

  authorId    String                          // byline
  author      User          @relation("ArticleAuthor", fields: [authorId], references: [id])
  editorId    String?                         // reviewer — distinct step, see below
  editor      User?         @relation("ArticleEditor", fields: [editorId], references: [id])
  reviewedAt  DateTime?

  metaTitle       String?
  metaDescription String?
  featuredImage   String?

  revisions   ArticleRevision[]               // ADR-0006

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([factCheckId, locale])             // one article per locale per review
  @@unique([locale, slug])                    // slugs unique within a locale
  @@index([status])
  @@index([publishedAt])
  @@map("fact_check_articles")
}
```

### Editorial review is a distinct step

Confirmed with Ali: the **editor is a separate gate from the submission moderator**. Moderation
triages an incoming `Submission`; editorial review approves a written `FactCheckArticle`. Different
question, different moment, recorded in a different place.

Recommended control: **`editorId` must be set and must differ from `authorId` before an article can
reach `PUBLISHED`.** Self-review defeats the purpose of recording a reviewer, and IFCN-style
transparency is only meaningful if the byline and the sign-off are different people. Enforce it in
the service layer, not only in the UI.

This is a policy choice with a staffing implication — a one-person desk cannot satisfy it. Flagged
as an open question below.

## Consequences

**Positive**

- The published record can answer "who claimed it, where, on what evidence, reviewed by whom" —
  which is the entire point of the exercise.
- Maps closely onto schema.org `ClaimReview`, which is what Google's Fact Check Tools consume.
  That turns this from an invisible refactor into a distribution and credibility argument. _(Verify
  the current ClaimReview spec field-by-field before building the serializer — do not assume the
  mapping from memory.)_
- Claim/appearance separation is the hook the AI deduplication stage needs later.
- Adding a third language becomes adding rows, not a migration.

**Negative**

- **Reads get more expensive.** Rendering one public fact-check now touches `Claim`,
  `ClaimAppearance`, `FactCheck`, `FactCheckArticle`, `Evidence`, `Topic`. Expect to need
  deliberate `include` shaping and probably a denormalised list projection for index pages.
- **The admin UI gets materially harder.** Editing a fact-check becomes editing a claim, a review,
  N evidence rows, and two articles. This is the largest hidden cost in the whole plan and it is
  interface work, not schema work.
- Every public route gains a locale dimension. Slug uniqueness moves from global to per-locale.
- Both hand-written API clients (1001 + 844 lines) must be rewritten by hand — no generated types
  (ADR-0003). This is the moment ADR-0003 stops being optional.

**Risk**

Refactoring the most-referenced model in the system against near-zero test coverage with no
reviewer. Mitigation is non-negotiable and is Phase 0 of the implementation plan: lifecycle and
authorization tests land _before_ the model changes, not after.

## Migration path

There is **no data to migrate**. That is the single most valuable fact in this document, and it
should be spent deliberately rather than saved:

1. **Squash the six existing migrations into one fresh `init`.** With zero rows they are
   archaeology, and a clean baseline beats six historical steps plus a monstrous seventh.
2. Land the full schema in one migration rather than a careful reversible sequence.
3. Rewrite both seed scripts — they cannot survive this change, so their cost is already sunk.
   Fix the missing-dotenv bug while rewriting them.
4. Keep `Comment` and `SavedContent` pointed at `FactCheck` (the review), not at an article —
   saving or discussing a fact-check is language-independent.

## Open questions

1. **Must the editor differ from the author?** Recommended yes. A one-person desk cannot satisfy it,
   so this is a client/staffing question, not a technical one. It is a two-line service-layer change
   either way — but decide it before the admin UI is built around one assumption.
2. **Is `Comment` staying at all?** It exists on `FactCheck` today but has no visible surface. If
   public comments on fact-checks are not a product commitment, dropping the model now is free and
   removes a moderation liability nobody has budgeted for.
3. **URL structure** — `/ar/fact-checks/<slug>` vs `<slug>` with content negotiation. Affects SEO
   and the `hreflang` pairing. Small, but decide before public routes are built.

# ADR-0007: Topic and region taxonomy

- **Status:** Proposed
- **Date:** 2026-08-05
- **Deciders:** Ali Traboulsi
- **Depends on:** [ADR-0002](./0002-bilingual-content-model.md)

## Context

Classification today is a single `tags String[]` on `FactCheck` — free text, uncontrolled, with no
distinction between what a fact-check is _about_ and where it _applies_.

Free-text tags drift in any single language. In a bilingual corpus they shatter: `Lebanon`,
`لبنان`, `LB`, `lebanon`, and `Liban` are five tags for one country, and every filter built on them
silently under-reports. Nothing in the current model prevents this, and the drift is invisible until
someone tries to produce a report.

That last part is what raises this above tidiness. For a fact-checking desk, classification feeds
**funder and transparency reporting** — "we published N checks on health misinformation in Lebanon
this quarter." A count derived from drifting free text is not a number you want to put in front of a
donor.

Region matters especially here: this is a regional Arabic-language desk, so "which country does this
claim concern" is a primary filter, not a nice-to-have.

## Options

**A. Keep free-text tags.** 0d. Drift is guaranteed; reporting stays unreliable.

**B. Controlled `Topic` entity + free-text region.** ~1.5d. Fixes the topic axis, leaves the harder
axis broken.

**C. Controlled `Topic` entity + ISO 3166 country codes.** ~2–3d. Both axes controlled. Region gets
a standard rather than an invented list.

**D. Full hierarchical taxonomy** (nested topics, subdivisions, synonym rings, tag moderation
workflow). ~6–8d. Correct at scale; wildly premature at zero published fact-checks.

## Decision

**Option C.** Two distinct axes, one curated and one standard.

### Region — use ISO 3166, do not invent a list

Countries as **ISO 3166-1 alpha-2** codes (`LB`, `SY`, `EG`). Subdivisions via ISO 3166-2 later if
ever needed — not now.

Inventing a region vocabulary is pure downside. The standard gives, for free: unambiguous identity,
established bilingual names, interoperability with every mapping and reporting tool, and no debate
about whether it is "UAE" or "United Arab Emirates".

Stored as `countryCodes String[]` on `FactCheck` — the review, not the article. Which country a
claim concerns is a property of the claim, not of the language it is written up in.

A seeded `Country` reference table carries the bilingual display names, so filter UIs and reports
can join rather than hardcoding a name map in two frontends.

```prisma
model Country {
  code   String @id                  // ISO 3166-1 alpha-2
  nameAr String
  nameEn String
  @@map("countries")
}
```

`countryCodes` stays a `String[]` on `FactCheck` rather than a join table: the cardinality is tiny
(usually one), the values come from a fixed standard, and Postgres array containment queries are
adequate for the filtering this needs. Referential integrity against `Country` is enforced in the
service layer — an accepted, deliberate trade for a much simpler write path.

### Topic — a small curated list, editor-owned

A `Topic` entity with bilingual labels, seeded with a starting vocabulary and maintained by editors
through the admin panel.

**Keep it small — 10 to 25 top-level topics, flat, no hierarchy.** A taxonomy that outgrows a single
screen stops being used consistently, which defeats its purpose. Flat now; ADR a hierarchy later if
volume genuinely demands one.

```prisma
model Topic {
  id            String  @id @default(cuid())
  slug          String  @unique          // stable machine key, e.g. "health-misinformation"
  labelAr       String
  labelEn       String
  descriptionAr String?
  descriptionEn String?
  position      Int     @default(0)      // editorial display order
  isActive      Boolean @default(true)   // retire without deleting

  factChecks FactCheckTopic[]
  @@map("topics")
}

model FactCheckTopic {
  factCheckId String
  topicId     String
  factCheck   FactCheck @relation(fields: [factCheckId], references: [id], onDelete: Cascade)
  topic       Topic     @relation(fields: [topicId], references: [id])

  @@id([factCheckId, topicId])
  @@index([topicId])
  @@map("fact_check_topics")
}
```

`isActive` rather than deletion: retiring a topic must not orphan the fact-checks already
classified under it.

### Free-text tags are demoted, not removed

Keep `tags String[]` on `FactCheck` for SEO and discovery, but it is **never** the basis for
filtering, navigation, or reporting. Those read `Topic` and `countryCodes` exclusively.

This is a deliberate compromise: analysts get somewhere to put the specific, one-off descriptor
without polluting the controlled vocabulary, and the controlled vocabulary stays clean enough to
count. The risk is that tags quietly become the real taxonomy because they are easier to type —
worth checking after a few months of real use.

## Consequences

**Positive** — filters and counts become trustworthy; funder reporting has a real substrate;
bilingual labels are defined once instead of per-component; ISO codes make future map views and
data exchange trivial.

**Negative** — someone must own the topic vocabulary. An unmaintained controlled list is worse than
free text, because it looks authoritative while quietly failing to describe new content. This is an
editorial responsibility, not an engineering one, and it needs a named owner on the client side.

**Also** — analysts lose the ability to invent a topic mid-write. That friction is intentional, and
it will generate complaints in the first month.

## Migration path

No data to migrate. Lands with the ADR-0002 `init` migration.

1. Schema: `Topic`, `FactCheckTopic`, `Country`; `countryCodes String[]` on `FactCheck`; keep
   `tags String[]` demoted.
2. Seed `Country` from the ISO 3166-1 list — **MENA countries first with verified Arabic names**;
   the rest can be filled in over time. Do not machine-translate country names; getting a country's
   name wrong in Arabic is exactly the kind of small error that costs credibility with the audience.
3. Seed an initial topic vocabulary and **have the client review it before it hardens.** Once
   fact-checks are classified, changing topics is an editorial re-classification exercise, not a
   config change.
4. Service validates `countryCodes` against `Country` on write.
5. Admin: topic management screen (a new tab in `AdminDashboard.tsx` — see the `admin-screen` skill)
   and a topic/country picker on the fact-check editor.
6. Public: filter by topic and country on the fact-check index.

## Open questions

1. **Who owns the topic vocabulary on the client side?** Needs a named person. Without one it will
   rot, and a rotting controlled vocabulary is worse than none.
2. **What is the starting topic list?** Ali should not invent it — it encodes the desk's editorial
   priorities. Propose a draft from the existing seed content, then have the client confirm.
3. **Do claims ever legitimately have no country?** Regional or global claims exist. Recommended:
   allow an empty `countryCodes` rather than inventing a `GLOBAL` pseudo-code that pollutes the ISO
   namespace.

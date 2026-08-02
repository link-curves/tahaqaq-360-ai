# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-08-02
- **Deciders:** Ali Traboulsi

## Context

Tahaqaq 360 is a client project maintained by one developer, with AI agents doing a meaningful share
of the implementation. Three specific problems follow from that:

1. **No shared memory.** There is no colleague who remembers why the Prisma schema lives at the
   non-standard `src/prisma/schema.prisma`, why CORS origins are hardcoded in `main.ts` instead of
   read from `CORS_ORIGIN`, or why the admin panel has no router. Today these read as mistakes; some
   of them may have been deliberate.
2. **Agents make plausible choices silently.** An AI agent asked to "add bilingual support to the
   blog" will pick a schema shape and implement it. That choice then constrains 35 other models.
   Without a written decision, the first agent to touch a problem sets the architecture by accident.
3. **Client questions need answers with receipts.** "Why will bilingual support take three weeks?"
   is much easier to answer from a document written before the question than from memory afterwards.

The codebase already contains evidence of decisions made and forgotten: two parallel seed scripts
(`seed.ts`, `arabic.seed.ts`) instead of one bilingual dataset; `DashboardOverview.tsx` left dead
beside `DashboardOverviewNew.tsx`; a commit forcing English number/date locale with no recorded
rationale.

## Options

**A. Nothing — rely on commit messages and memory.** 0d.
Free, and what happens by default. Fails exactly when it matters: commit messages describe *what*
changed, almost never the alternatives rejected. Reversible at any time by starting to write ADRs.

**B. Lightweight ADRs in `docs/adr/`.** ~0.25d setup, ~0.5–1h per decision.
Plain markdown, numbered, in the repo next to the code. Costs a little discipline. Forecloses
nothing. Reversed by simply stopping.

**C. A full RFC process with templates and review stages.** 1d+ setup, hours per decision.
Appropriate for a team; pure overhead for one person with no reviewers.

## Decision

**Option B.** ADRs in `docs/adr/`, numbered sequentially, plain markdown, deliberately short.

Write one when a decision **constrains future work**: data model shape, a new dependency or service,
an API contract change, a build/deploy change, or anything where two defensible options exist and the
choice is expensive to reverse.

Do **not** write one for ordinary implementation choices. An ADR for every decision is an ADR
directory nobody reads.

Agents may draft ADRs; **only Ali moves one to Accepted.** This is the important part — it keeps
architectural authority with the human while still letting agents do the analysis.

## Consequences

**Positive:** decisions survive the six-month gap; agents have a written constraint to respect rather
than a guess to make; client conversations about cost have supporting material.

**Negative:** it is friction on every significant change, and friction gets skipped under deadline
pressure. Expect some decisions to go unrecorded — an ADR directory that captures the five biggest
decisions is still far better than none.

**Risk:** ADRs going stale and describing an architecture that no longer exists. Mitigation: mark
them **Superseded** rather than editing them, so the trail stays honest.

## Migration path

Already done: this directory, the index and format in `README.md`, the `/adr` command, and the
`solution-architect` agent that drafts them. Three decisions already identified and drafted as
ADR-0002, 0003, and 0004.

## Open questions for the client

None — this is an internal working practice.

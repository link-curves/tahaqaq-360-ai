# AI-Assisted Verification Pipeline — Design

- **Status:** Design only. **Nothing built. Unbudgeted. Requires client sign-off.**
- **Date:** 2026-08-02
- **Direction agreed with Ali:** Claude-first, behind a provider abstraction
- **Related:** agent `ai-verification-architect`, BACKLOG item 11

---

## 0. Starting position

Despite the repository name `tahaqaq-360-ai`, **there is no AI or LLM dependency anywhere in this
codebase.** No `openai`, `anthropic`, `langchain`, or embedding library in any `package.json`.
Everything here is greenfield.

State that plainly whenever the "AI" in the name comes up — the name currently describes an
intention, not a capability.

---

## 1. The governing constraint

**AI must never publish a verdict.**

A fact-checking organization's entire asset is credibility. One wrongly published verdict costs more
than a hundred correct ones earn, and the loss is not recoverable by being right afterwards. The
asymmetry is the whole design constraint.

Therefore, in every version of this system:

1. AI is **assistive input to a human analyst**, never a decision-maker.
2. A **hard human approval gate** sits before any transition to `PUBLISHED`. Non-bypassable, not
   configurable, no "auto-publish above confidence X".
3. AI-derived content is **visibly distinguishable** from analyst-authored content in the admin UI,
   and that provenance is **persisted in the data model** — not merely a UI convention.
4. **Evidence and reasoning are stored, not just conclusions.** A fact-checking desk must be able to
   defend how it reached a verdict. An unexplainable score is unusable here regardless of accuracy.

Any request that puts AI on the publish path should be refused in that shape, with the
human-in-the-loop alternative offered instead.

---

## 2. Pipeline stages

Six stages, deliberately separable. They have very different value/risk profiles and **should be
costed and shipped independently** — this is not an all-or-nothing programme.

| # | Stage | Value | Risk | Est. |
|---|---|---|---|---|
| 1 | Claim extraction | Medium | Low | 3–5d |
| 2 | **Deduplication / prior-art matching** | **High** | **Low** | **5–8d** |
| 3 | Evidence retrieval (RAG) | High | Medium | 8–12d |
| 4 | Source credibility scoring | Medium | **High — political** | 5–8d |
| 5 | Draft analysis generation | Medium | Medium | 5–8d |
| 6 | Human review gate | Essential | — | 3–5d |

### Stage 1 — Claim extraction
Turn a raw `Submission` (free text, URL, image or video reference) into a normalized, checkable claim
statement: who said what, when, where. Output is a structured claim attached to the submission.
Low risk — it reorganizes user input rather than asserting anything.

### Stage 2 — Deduplication / prior-art matching ⭐
"Has this claim already been fact-checked?" Embedding similarity over existing `FactCheck.claim`
values, surfaced in the moderation queue as *"3 similar claims already checked"*.

**This is the highest-ROI stage by a wide margin and should be built first, possibly alone:**

- It attacks the desk's core operational metric — claim turnaround time — directly.
- It **cannot publish anything**, so the governing constraint above is satisfied trivially.
- It degrades gracefully: a missed match costs nothing beyond the status quo.
- It is demonstrable to the client in a single screen.

If the client will only fund one increment, propose this one.

### Stage 3 — Evidence retrieval (RAG)
Gather candidate sources for a claim. **The hardest stage for Arabic**, and the one most likely to
underperform expectations: Arabic-language source coverage, indexing, and retrieval quality are all
materially worse than English. Do not carry over English-language expectations.

### Stage 4 — Source credibility scoring ⚠️
Rank retrieved sources by reliability.

**Politically sensitive.** Any scoring rubric encodes an editorial stance about which outlets are
credible. In a contested Arabic-language media environment this is not a technical judgment, and it
must not be an implicit model judgment either.

Requirement: the rubric is **the client's, explicit, documented, and auditable** — a model may apply
it, but must not invent it. Route this through the `product-owner` agent and the client before any
design work.

### Stage 5 — Draft analysis generation
Produce an Arabic draft analysis for the analyst to edit. **Never auto-fill the `verdict` field** —
the verdict is the analyst's judgment, and pre-filling it creates anchoring bias even when the
analyst is free to change it.

### Stage 6 — Human review gate
The analyst accepts, edits, or rejects each AI contribution. Mandatory. This stage is what makes the
other five safe, and it should be built alongside the first stage that produces analyst-facing
output — not deferred.

---

## 3. Arabic-specific realities

Do not hand-wave these; they are where this project's AI work will actually succeed or fail.

- **Dialectal variation.** MSA vs Levantine, Gulf, Egyptian. Claims circulate in dialect; reference
  material is in MSA. Naive matching across that gap performs poorly.
- **Orthographic variation.** Hamza forms (أ إ آ ا), taa marbuta (ة/ه), and optional diacritics mean
  the same word appears in several written forms. Normalization is mandatory for both search and
  embedding quality — this also affects the existing `search` module today, independent of any AI work.
- **Rich morphology.** Arabic's root-and-pattern system means token-level heuristics tuned for
  English transfer badly.
- **Benchmarks do not transfer.** A model's English leaderboard position says little about its Arabic
  performance. **Any quality claim must be validated against real Arabic claims from this platform's
  own `Submission` table** — that dataset is the only benchmark that matters here.
- **RTL handling** affects chunking, storage, and display. Verify round-trips explicitly.

**Recommendation:** before building anything in stage 2 or 3, run a small offline evaluation over
~100 real submissions. If retrieval and matching quality are poor on real Arabic data, that finding
is worth far more than a working pipeline built on an untested assumption — and it costs 1–2 days
rather than several weeks.

---

## 4. Integration with this codebase

**Module.** A new `apps/api/src/modules/ai/` following existing conventions: `PrismaService`
injected, registered in `app.module.ts`, DTOs with `class-validator`, endpoints behind
`@UseGuards(RolesGuard)` + `@Roles(Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN)`. **No `@Public()`
endpoint should ever reach an inference call** — that is a direct path to someone else's bill.

**Async execution.** Inference cannot happen in a request cycle. There is no queue today;
`@nestjs/schedule` exists, and `redis` + `cache-manager-redis-store` are already dependencies, so
BullMQ + Redis is the natural candidate. **Adding a queue is a real architectural decision** — it
needs its own ADR via `solution-architect` before implementation.

**Vector storage.** The database is Supabase Postgres, so `pgvector` is the obvious choice and avoids
introducing a separate service — which matters a great deal for a solo-maintained system.
**Verify pgvector is available and enabled on the client's Supabase instance before designing around
it.** If it is not, that changes the plan.

**Provider abstraction.** All model calls behind an interface (e.g. `LlmProvider`,
`EmbeddingProvider`) so the vendor is swappable without touching business logic. Claude is the
default: strong Arabic, good at weighing evidence and citing sources. The abstraction exists because
the client may have procurement constraints, not because a switch is expected.

**Operational requirements — non-negotiable:**
- Timeout and retry with backoff on every provider call
- **Per-request and cumulative cost accounting**, persisted
- A **kill switch** — an env flag that disables all inference immediately
- Rate limiting independent of the global `ThrottlerGuard`

A runaway loop against a client's API key is a real financial incident, not a hypothetical.

**Data model additions** (sketch — needs ADR-level design):
- Provenance on generated content: which stage, which model, which version, when, what it cost
- Evidence records linked to a claim, with retrieval metadata and source URLs
- Review decisions: what the analyst accepted, edited, or rejected — **this is also the training and
  evaluation signal**, and is worth capturing from day one even if unused at first

---

## 5. Cost and commercial questions

Every proposal must state a **per-claim cost estimate** and a projected monthly cost at realistic
volume. Ask Ali for expected submission volume; do not guess it.

**Unresolved and must be settled before any implementation:**

1. **Who pays for inference — the client's account or Ali's?** This is commercial, not technical, and
   it must be answered first. An ongoing per-claim cost inside a fixed-scope project is a margin
   problem that compounds silently.
2. **Is there a budget ceiling**, and what happens when it is hit — degrade to manual, or stop?
3. **Does the client accept sending submission content to a third-party model provider?** Submissions
   may contain identifying information about the submitter. Any decision to send PII externally needs
   an explicit ADR, and possibly the client's legal review.
4. **Who is accountable for an AI-assisted fact-check that turns out wrong?** Even with a human gate,
   this should be answered explicitly rather than assumed.

---

## 6. Recommended sequencing

1. **Arabic feasibility spike (1–2d).** Evaluate embedding/matching quality on ~100 real submissions.
   Cheap, and it either validates or kills the expensive stages before they are funded.
2. **Stage 2 — deduplication (5–8d).** Highest value, lowest risk, cannot publish anything, demos in
   one screen. Propose this as the standalone first increment.
3. **Stage 6 — the review gate (3–5d).** Build it before anything that generates analyst-facing text.
4. **Stages 1, 3, 5.** In that order, each gated on the previous proving useful in real editorial use.
5. **Stage 4 — credibility scoring.** Last, and only with the client's own documented rubric.

**Do not build stages 3–5 before stage 2 has been in real use for a while.** If deduplication does
not measurably shorten turnaround, the assumptions behind the rest of the pipeline are wrong, and
that is much cheaper to learn at week 2 than at week 20.

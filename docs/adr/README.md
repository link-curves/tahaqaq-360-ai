# Architecture Decision Records

Short documents capturing significant technical decisions: what was decided, why, and what it costs.

## Why bother on a solo project

Precisely _because_ it is solo. There is no colleague who remembers why a choice was made, and no
review conversation to look back on. Six months from now the reasoning exists only here.

For a **client project** there is a second reason: when the client asks "why does this work this
way" or "why will that change cost three weeks", an ADR is the answer, written before the question.

## Index

| #                                               | Title                                                | Status       |
| ----------------------------------------------- | ---------------------------------------------------- | ------------ |
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions                        | Accepted     |
| [0002](./0002-bilingual-content-model.md)       | Content model — claim, review, per-language articles | **Proposed** |
| [0003](./0003-api-contract-generation.md)       | Generate the API client from OpenAPI                 | **Proposed** |
| [0004](./0004-shared-ui-package.md)             | Extract a shared UI package                          | **Proposed** |
| [0005](./0005-evidence-model.md)                | Evidence as a first-class entity                     | **Proposed** |
| [0006](./0006-revisions-and-corrections.md)     | Revisions, corrections, and retraction               | **Proposed** |
| [0007](./0007-topic-and-region-taxonomy.md)     | Topic and region taxonomy                            | **Proposed** |

ADRs 0002 and 0005–0007 form one coherent decision about the editorial content model. The sequenced
work is in [`docs/plans/content-model-implementation.md`](../plans/content-model-implementation.md).

> **Note on 0002.** Its filename says `bilingual-content-model` for numbering stability, but its
> scope is now the whole content model. Its 2026-08-02 draft (sibling columns / translation tables)
> was never accepted and is explicitly rejected inside the document — the reasoning is preserved
> there rather than deleted.

## Statuses

- **Proposed** — drafted, not agreed. Claude may draft; only Ali moves an ADR out of Proposed.
- **Accepted** — decided; implement accordingly.
- **Superseded by ADR-NNNN** — replaced. Keep the file; do not delete history.
- **Rejected** — considered and declined. Keep it: knowing what was rejected, and why, prevents
  re-litigating it.

## Format

Copy this shape. Keep it short — an ADR nobody reads is worthless.

```markdown
# ADR-NNNN: Title

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Deciders:** Ali Traboulsi

## Context

The forces at play, grounded in this codebase. Cite real files and real numbers.

## Options

For each: cost in developer-days, what it forecloses, how it is reversed.
Always include the minimal / do-nothing option.

## Decision

One recommendation, with the reason.

## Consequences

Including the negative ones. An ADR listing only benefits is not honest.

## Migration path

Concrete steps from today's code. A target with no path is a wish, not a decision.

## Open questions for the client

Anything that depends on someone other than Ali.
```

## Writing one

Use `/adr <the decision>`, which runs the `solution-architect` agent. Number sequentially; never
reuse a number.

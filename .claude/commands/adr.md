---
description: Draft an Architecture Decision Record for a significant technical choice
argument-hint: <the decision to be made>
allowed-tools: Read, Grep, Glob, Bash, Write, WebSearch, WebFetch, Task
---

Draft an ADR for: **$ARGUMENTS**

Use the `solution-architect` agent. Follow the format and numbering in `docs/adr/README.md`.

Existing ADRs: !`ls docs/adr/ 2>/dev/null`

Requirements for the draft:

1. **Context** — the actual forces at play, grounded in this codebase. Cite real files, real
   constraints, real counts. No generic architecture prose.
2. **Options** — at most three, each with cost in developer-days, what it forecloses, and how it is
   reversed. Always include the minimal / do-nothing option.
3. **Decision** — one clear recommendation with the reason. Status stays `Proposed`; only Ali moves
   it to `Accepted`.
4. **Consequences** — including the negative ones. An ADR that lists only benefits is not honest.
5. **Migration path** — concrete steps from today's code to the target. A target with no path is not
   a decision.
6. **Open questions for the client**, if the decision depends on something only they can answer.
   This is a client project — flag those explicitly rather than assuming an answer.

Write the file to `docs/adr/NNNN-kebab-title.md` and add it to the index in `docs/adr/README.md`.

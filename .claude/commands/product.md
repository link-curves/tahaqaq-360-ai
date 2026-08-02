---
description: Get a product/business recommendation — scope, cost, client impact, what to build next
argument-hint: <the question, feature request, or "what should we build next">
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write, Task
---

Product question: **$ARGUMENTS**

Use the `product-owner` agent.

Context it must hold: Tahaqaq 360 is a **client project** built solo by Ali. Unrequested work is
unpaid. Invisible work is unpaid and invisible. The client judges progress by what they can see.

Answer with:

1. **The real decision** — requests arrive phrased as solutions; identify the underlying need.
2. **In scope or change request** — say plainly which. If it is a change request, estimate it so Ali
   can price it before agreeing.
3. **Recommendation with a rough cost** in developer-days. A range is fine; silence is not.
4. **The cheaper alternative** that captures most of the value, if one exists. This is usually the
   most useful part of the answer.
5. **Risk to the client relationship**, if any.
6. **Questions the client must answer**, framed so Ali can ask them in one message — with the cost
   and consequence of each possible answer.

If the question is "what should we build next", ground the answer in what already exists in this
codebase — the models, flows, and data being collected — and in what a fact-checking desk actually
needs: credibility, transparency, and claim turnaround time. Check `docs/BACKLOG.md` first and
update it with anything new.

Never assume what the client wants. Never recommend anything that could publish an unverified claim
as verified.

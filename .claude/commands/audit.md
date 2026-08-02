---
description: Run a security audit — auth surface, data exposure, secrets, dependencies
argument-hint: [optional: module or area to focus on]
allowed-tools: Read, Grep, Glob, Bash, Task
---

Run a security audit of Tahaqaq 360. Focus: $ARGUMENTS (if empty, audit the whole API surface).

Use the `security-auditor` agent.

Baseline facts to gather first:

- Public endpoints: !`grep -rn "@Public()" apps/api/src --include=*.controller.ts | wc -l` total
- `@Roles(` usages: !`grep -rn "@Roles(" apps/api/src --include=*.controller.ts | wc -l`
- `RolesGuard` usages: !`grep -rn "RolesGuard" apps/api/src --include=*.controller.ts | wc -l`
- Tracked secrets: !`git ls-files | xargs grep -lE "GOCSPX-[A-Za-z0-9_-]{20,}|eyJhbGciOiJ[A-Za-z0-9._-]{60,}" 2>/dev/null | head`

If the `@Roles(` and `RolesGuard` counts differ materially, investigate — `@Roles()` without
`@UseGuards(RolesGuard)` is inert and leaves the route open to any authenticated user.

Priorities, in order:

1. **Every `@Public()` endpoint** — does it expose PII, user-owned data, or accept a write?
2. **IDOR** — routes taking a client-supplied id that return user-owned data without an ownership filter.
3. **Privilege escalation** — can a `USER` modify their own `role`, `reputation`, or `totalPoints`?
4. **Submitter identity exposure** — people submit claims on contested topics; leaking who they are
   can put real people at risk.
5. **Secrets** — nothing credential-shaped in tracked files. Confirm the 2026-08-02 rotation is done
   (see `docs/SECURITY-REMEDIATION.md`).
6. **XSS** — `apps/web` renders markdown with `rehype-raw`; verify `rehype-sanitize` runs after it.
7. **Rate limits** on login, register, public submission, and contact specifically.

Report severity-ordered with concrete exploit paths. Distinguish verified findings from suspected
ones. Defensive analysis only — do not write exploit code or touch the live Supabase instance.

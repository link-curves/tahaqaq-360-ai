---
description: Pre-commit readiness check — build, lint, contract drift, secrets
allowed-tools: Read, Grep, Glob, Bash, Task
---

Run the pre-commit readiness check for Tahaqaq 360. There is no CI gate on correctness and no
reviewer — this is the last check before code lands on `develop`.

Work through these in order and report each result honestly. **Do not stop at the first failure** —
run everything, then summarize.

## 1. What changed

!`git status --short`

## 2. Build

```
pnpm build
```

Report which app failed, if any.

## 3. Lint

```
pnpm lint
```

## 4. Secret scan

```
git diff HEAD | grep -nE 'GOCSPX-|eyJhbGciOiJ|postgres(ql)?://[^:]+:[^@]{8,}@|sk-ant-|AKIA[0-9A-Z]{16}|-----BEGIN'
```

Any hit is a **blocker**. This repo leaked live credentials once already.

## 5. Contract drift

If any `apps/api/src/modules/*/dto/*.dto.ts` changed, verify the matching updates landed in
`apps/web/src/lib/api.ts` and `apps/admin/src/lib/adminApi.ts`. The clients are hand-written; the
backend rejects undeclared fields with a 400.

## 6. Migration check

If `apps/api/src/prisma/schema.prisma` changed, confirm a matching migration exists in
`apps/api/src/prisma/migrations/`. A schema change without a migration reaches no database.

## 7. Review

Run the `code-reviewer` agent on the diff.

## Verdict

Finish with a clear **READY** or **NOT READY**, and if not ready, the specific blocking items.

Be accurate about what you actually ran versus skipped. Note explicitly that test coverage is
near-zero, so a green build does not mean the change works.

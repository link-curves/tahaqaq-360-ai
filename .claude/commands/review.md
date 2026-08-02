---
description: Review uncommitted or unpushed changes for correctness and security
argument-hint: [optional: file, module, or "staged"]
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git status:*), Bash(git log:*), Task
---

Review the current changes using the **code-reviewer** agent.

Scope: $ARGUMENTS (if empty, review all uncommitted changes; if "staged", review only staged changes)

Current state:

- Status: !`git status --short`
- Diff stat: !`git diff HEAD --stat`

Run the `code-reviewer` agent against this scope. It knows this repo's specific failure modes —
missing `@Public()`, `@Roles()` without `RolesGuard`, DTO/client drift, broken response-envelope
pagination, IDOR on user-owned resources, and duplicated shadcn components.

If the diff touches `schema.prisma`, also run `prisma-schema-guardian`.
If it touches auth, roles, uploads, or adds a `@Public()` endpoint, also run `security-auditor`.

Report findings most-severe-first, then a one-line verdict on whether it is safe to commit.
Do not fix anything — report only.

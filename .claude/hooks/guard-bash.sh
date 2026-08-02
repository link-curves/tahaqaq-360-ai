#!/usr/bin/env bash
# PreToolUse: Bash
#
# Blocks commands that are destructive against THIS project specifically.
#
# The critical fact: there is no local database. docker-compose.dev.yml has its
# postgres service commented out, so DATABASE_URL points at a hosted Supabase
# instance that very likely holds the client's real data. Commands that are
# routine on a disposable dev database are data loss here.
#
# Exit 2 = block, stderr shown to Claude.

set -uo pipefail

INPUT=$(cat)
command -v jq >/dev/null 2>&1 || exit 0   # fail open

CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')
[ -n "$CMD" ] || exit 0

deny() {
  printf 'BLOCKED: %s\n\n%s\n' "$1" "$2" >&2
  exit 2
}

# ---------------------------------------------------------------------------
# 1. Destructive database commands
# ---------------------------------------------------------------------------
if printf '%s' "$CMD" | grep -qE '(prisma[[:space:]]+migrate[[:space:]]+reset|prisma[[:space:]]+db[[:space:]]+push|db:reset|db:fresh|db:push|db:reset-seed)'; then
  deny "destructive database command against a live client database." \
"Command: $CMD

There is NO local database on this project. DATABASE_URL points at the hosted
Supabase instance holding the client's real data. This command would drop or
overwrite it, and there is no backup you control.

  migrate reset / db:reset / db:fresh  -> drops the entire schema and reseeds
  db push                              -> silently drops columns, leaves no migration

For a schema change, use a migration instead:
  cd apps/api && pnpm db:migrate --name <describes_the_change>
(requires DATABASE_DIRECT_URL on port 5432 — Prisma Migrate cannot use the
 pgbouncer pooler on 6543)

Have prisma-schema-guardian review it first.

If you genuinely need this against a DISPOSABLE database, set the connection
explicitly for that one command and confirm with Ali first."
fi

# ---------------------------------------------------------------------------
# 2. Force-push — rewrites remote history, cannot be undone by others
# ---------------------------------------------------------------------------
if printf '%s' "$CMD" | grep -qE 'git[[:space:]]+push[^|;&]*([[:space:]]--force([[:space:]]|$|=)|[[:space:]]-f([[:space:]]|$))'; then
  if [ "${ALLOW_FORCE_PUSH:-0}" != "1" ]; then
    deny "force-push requires explicit opt-in." \
"Command: $CMD

Force-pushing rewrites history on the remote. It is occasionally correct on this
project (e.g. the credential-purge rewrite), but it is never routine.

If Ali has approved this specific force-push, re-run it with the opt-in:
  ALLOW_FORCE_PUSH=1 git push --force-with-lease origin <branch>

Prefer --force-with-lease over --force: it refuses to overwrite commits you have
not seen, which protects against clobbering work pushed from elsewhere."
  fi
fi

# ---------------------------------------------------------------------------
# 3. Re-adding an ignored env file to git
# ---------------------------------------------------------------------------
if printf '%s' "$CMD" | grep -qE 'git[[:space:]]+add[^|;&]*-f' && printf '%s' "$CMD" | grep -qE '\.env'; then
  deny "force-adding an env file to git." \
"Command: $CMD

.env files are ignored deliberately — this repo already leaked live credentials
once. Only *.example templates belong in version control.

See docs/SECURITY-REMEDIATION.md."
fi

# ---------------------------------------------------------------------------
# 4. Recursive delete of tracked project directories
# ---------------------------------------------------------------------------
if printf '%s' "$CMD" | grep -qE 'rm[[:space:]]+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)[[:space:]]+' \
   && printf '%s' "$CMD" | grep -qE '(apps/|packages/|src/|\.git([[:space:]/]|$)|/home/alit/tahaqaq-360-ai[[:space:]/]*$|[[:space:]]/([[:space:]]|$))'; then
  deny "recursive delete targeting project source or the git directory." \
"Command: $CMD

If files genuinely need removing, use 'git rm' so the change is reviewable and
recoverable, or delete a specific path rather than a recursive wildcard."
fi

# ---------------------------------------------------------------------------
# 5. Advisory (non-blocking): pnpm version drift
# ---------------------------------------------------------------------------
if printf '%s' "$CMD" | grep -qE '\bnpm[[:space:]]+(install|i|ci)\b|\byarn[[:space:]]+(add|install)\b'; then
  printf 'NOTE: this repo pins pnpm@8.15.6 via packageManager and uses pnpm-lock.yaml. Using npm/yarn will create a conflicting lockfile. Use pnpm.\n' >&2
  exit 2
fi

exit 0

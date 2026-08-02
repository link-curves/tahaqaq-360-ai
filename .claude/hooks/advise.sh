#!/usr/bin/env bash
# PostToolUse: Write | Edit
#
# Non-blocking advisor. Surfaces the four ways this codebase breaks silently —
# the failure modes where nothing errors, nothing fails to compile, and the bug
# only appears in production:
#
#   1. schema.prisma edited with no migration  -> change reaches no database
#   2. a DTO changed without its frontend client -> 400s or silently missing fields
#   3. a shadcn ui/ component fixed in only one app -> web and admin diverge
#   4. @Public() added -> deny-by-default auth is being opted out of
#
# Emits additionalContext so Claude sees the note. Never blocks.

set -uo pipefail

INPUT=$(cat)
command -v jq >/dev/null 2>&1 || exit 0

FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -n "$FILE" ] || exit 0

NEW=$(printf '%s' "$INPUT" | jq -r '
  (.tool_input.content // empty),
  (.tool_input.new_string // empty),
  ((.tool_input.edits // []) | map(.new_string // empty) | join("\n"))
' 2>/dev/null)

REPO_ROOT="/home/alit/tahaqaq-360-ai"
NOTES=""
add() { NOTES+="$1"$'\n'; }

# --- 1. Prisma schema -------------------------------------------------------
case "$FILE" in
  */prisma/schema.prisma)
    LATEST=$(ls -1 "$REPO_ROOT/apps/api/src/prisma/migrations" 2>/dev/null | grep -E '^[0-9]{14}_' | tail -1)
    add "schema.prisma changed. A schema edit with no migration reaches NO database — it is the most common silent failure in this repo.
  - Latest existing migration: ${LATEST:-none found}
  - Create one:  cd apps/api && pnpm db:migrate --name <describes_the_change>
  - Requires DATABASE_DIRECT_URL (port 5432). Prisma Migrate cannot run through the pgbouncer pooler on 6543.
  - DATABASE_URL points at the hosted Supabase instance with likely-real client data. Have prisma-schema-guardian classify this change as safe or destructive BEFORE running the migration.
  - Then run: pnpm db:generate  (so the Prisma client types match)"
    ;;
esac

# --- 2. DTO changes and the hand-written frontend clients -------------------
case "$FILE" in
  */apps/api/src/modules/*/dto/*.dto.ts)
    FEATURE=$(printf '%s' "$FILE" | sed -E 's|.*/modules/([^/]+)/dto/.*|\1|')
    add "DTO changed for the '$FEATURE' module. The frontend API clients are HAND-WRITTEN and will not tell you they are stale:
  - apps/web/src/lib/api.ts        (1001 lines)
  - apps/admin/src/lib/adminApi.ts (844 lines)
  The backend runs forbidNonWhitelisted:true — a field the DTO does not declare causes a 400, and a renamed field silently stops arriving.
  Check both clients:  grep -n '$FEATURE' apps/web/src/lib/api.ts apps/admin/src/lib/adminApi.ts"
    ;;
esac

# --- 3. Duplicated shadcn components ----------------------------------------
case "$FILE" in
  */apps/web/src/components/ui/*)
    TWIN="apps/admin/src/components/ui/$(basename "$FILE")"
    [ -f "$REPO_ROOT/$TWIN" ] && add "This shadcn component is duplicated verbatim in admin. The same fix probably belongs in: $TWIN"
    ;;
  */apps/admin/src/components/ui/*)
    TWIN="apps/web/src/components/ui/$(basename "$FILE")"
    [ -f "$REPO_ROOT/$TWIN" ] && add "This shadcn component is duplicated verbatim in web. The same fix probably belongs in: $TWIN"
    ;;
esac

# --- 4. Opting out of deny-by-default auth ----------------------------------
if printf '%s' "$NEW" | grep -q '@Public()'; then
  add "@Public() was added. JwtAuthGuard is global (deny-by-default), so this endpoint now requires NO authentication.
  Confirm it returns no PII, no user-owned data, and accepts no state change. Careless @Public() is the highest-severity defect class in this repo — consider a security-auditor pass."
fi

# --- 5. CORS is hardcoded, not env-driven -----------------------------------
case "$FILE" in
  */apps/api/src/main.ts)
    printf '%s' "$NEW" | grep -q 'whitelist' && add "main.ts CORS whitelist touched. Origins are HARDCODED here — the CORS_ORIGIN env var is not read anywhere. Any new deploy domain must be added to this array and redeployed, or the browser blocks it."
    ;;
esac

[ -n "${NOTES//[[:space:]]/}" ] || exit 0

jq -nc --arg ctx "$NOTES" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
exit 0

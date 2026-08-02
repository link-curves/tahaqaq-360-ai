#!/usr/bin/env bash
# PreToolUse: Write | Edit
#
# Blocks writing credential-shaped values into files that git would track.
#
# This repo previously leaked a live Google OAuth client secret, a Supabase anon
# key, and the Supabase Postgres password. This hook exists so it cannot happen
# twice. Exit 2 = block, stderr is shown to Claude.
#
# Deliberately permissive in three cases, to stay useful rather than annoying:
#   1. *.example files       — templates are supposed to show the shape
#   2. git-ignored files     — a real .env is where secrets belong
#   3. placeholder values    — USER:PASSWORD@HOST, your_key_here, ***, etc.

set -uo pipefail

INPUT=$(cat)
command -v jq >/dev/null 2>&1 || exit 0   # fail open if jq is unavailable

FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -n "$FILE" ] || exit 0

# Content differs by tool: Write uses .content, Edit uses .new_string
CONTENT=$(printf '%s' "$INPUT" | jq -r '
  (.tool_input.content // empty),
  (.tool_input.new_string // empty),
  ((.tool_input.edits // []) | map(.new_string // empty) | join("\n"))
' 2>/dev/null)
[ -n "${CONTENT//[[:space:]]/}" ] || exit 0

BASE=$(basename "$FILE")

# --- 1. Templates are allowed to show credential shapes -----------------------
case "$BASE" in
  *.example|*.sample|*.template) exit 0 ;;
esac

# --- 2. Files git already ignores are a legitimate home for secrets -----------
if git -C "$(dirname "$FILE")" check-ignore -q "$FILE" 2>/dev/null; then
  exit 0
fi

# --- 3. Scan for high-confidence credential shapes ---------------------------
# Length thresholds are set so that documentation *describing* these patterns
# (e.g. a grep example containing the bare prefix) does not trip the hook.
PATTERNS=(
  'GOCSPX-[A-Za-z0-9_-]{20,}'                          # Google OAuth client secret
  'eyJhbGciOiJ[A-Za-z0-9._-]{60,}'                     # JWT (Supabase anon/service key)
  'postgres(ql)?://[^:/[:space:]]+:[^@[:space:]]{8,}@' # Postgres URL with password
  'sk-ant-[A-Za-z0-9_-]{20,}'                          # Anthropic API key
  'sk-[A-Za-z0-9]{32,}'                                # OpenAI-style key
  'AKIA[0-9A-Z]{16}'                                   # AWS access key id
  'ghp_[A-Za-z0-9]{30,}'                               # GitHub PAT
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'                 # private key block
)

HITS=""
for p in "${PATTERNS[@]}"; do
  m=$(printf '%s' "$CONTENT" | grep -oE "$p" 2>/dev/null || true)
  [ -n "$m" ] && HITS+="$m"$'\n'
done

[ -n "${HITS//[[:space:]]/}" ] || exit 0

# --- 4. Drop placeholder-looking matches -------------------------------------
REAL=$(printf '%s' "$HITS" | grep -vEi \
  'USER|PASSWORD|HOST|YOUR[_-]|CHANGE[_-]THIS|EXAMPLE|PLACEHOLDER|REDACTED|REMOVED|XXXX|<[^>]+>|\*\*\*|GENERATE' \
  || true)

[ -n "${REAL//[[:space:]]/}" ] || exit 0

# --- 5. Block ----------------------------------------------------------------
MASKED=$(printf '%s' "$REAL" | sed -E 's/^(.{8}).*/\1…<redacted>/' | sort -u | head -5)

cat >&2 <<EOF
BLOCKED: refusing to write a credential into a git-tracked file.

  File:  $FILE
  Found: $(printf '%s' "$MASKED" | tr '\n' ' ')

This repository already leaked live credentials once (purged 2026-08-02).
Put the real value in a git-ignored .env file and reference it by variable:

  docker-compose:  DATABASE_URL: \${DATABASE_URL:?required}
  code:            configService.get('DATABASE_URL')
  template:        add the placeholder form to the matching *.example file

If this is genuinely a placeholder, make it obviously so (USER:PASSWORD@HOST,
your_key_here) and it will pass. See docs/SECURITY-REMEDIATION.md.
EOF
exit 2

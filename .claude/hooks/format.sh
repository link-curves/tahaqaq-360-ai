#!/usr/bin/env bash
# PostToolUse: Write | Edit
#
# Formats the edited file with the repo's Prettier. Never blocks, never fails the
# tool call — formatting is a convenience, not a gate.
#
# Rationale: with Prettier running automatically, the code-reviewer agent is told
# to ignore style entirely and spend its attention on correctness and security.

set -uo pipefail

INPUT=$(cat)
command -v jq >/dev/null 2>&1 || exit 0

FILE=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -n "$FILE" ] && [ -f "$FILE" ] || exit 0

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.md|*.css|*.scss|*.yml|*.yaml|*.html) ;;
  *) exit 0 ;;
esac

# Never reformat generated or vendored output
case "$FILE" in
  */node_modules/*|*/dist/*|*/.turbo/*|*pnpm-lock.yaml|*/migrations/*) exit 0 ;;
esac

REPO_ROOT="/home/alit/tahaqaq-360-ai"
cd "$REPO_ROOT" 2>/dev/null || exit 0

# Use the workspace Prettier; do not fetch anything from the network.
if [ -x "$REPO_ROOT/node_modules/.bin/prettier" ]; then
  "$REPO_ROOT/node_modules/.bin/prettier" --write --log-level warn "$FILE" >/dev/null 2>&1 || true
fi

exit 0

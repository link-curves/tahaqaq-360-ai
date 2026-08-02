# Security Remediation — Credential Leak

**Date discovered:** 2026-08-02
**Severity:** High — live credentials were committed to a GitHub repository
**Repo history status:** ✅ Purged locally · ⏳ Remote pending force-push
**Credential rotation status:** ❌ **NOT DONE — action required**

---

## 1. What leaked

Four tracked files contained credential-shaped values. Two contained **real, live** credentials:

| File | Contents | Real? |
|---|---|---|
| `.env.prod` | `GOOGLE_CLIENT_SECRET` (35 chars, `GOCSPX-` format) | ✅ **Real** |
| `.env.prod` | `SUPABASE_ANON_KEY` (208-char JWT) | ✅ **Real** |
| `.env.prod` | `JWT_ACCESS_SECRET`, `SMTP_PASSWORD` | Placeholders |
| `docker-compose.dev.yml` | Supabase Postgres password, in plaintext, in two connection URLs | ✅ **Real** |
| `docker-compose.prod.yml` | `${VAR}` references only | No — false positive |
| `.env.prod.example` | Placeholder template | No |

Introduced in commit `beda754` ("Add comprehensive deployment documentation and scripts"), and
present in every commit since. The repository is `github.com/link-curves/tahaqaq-360-ai`.

**Exposure window:** from `beda754` until rotation completes. Anyone with read access to the repo —
including anyone who cloned or forked it, and any tooling with repo access — could read the client's
production database password.

---

## 2. What has been done

✅ **Repo files cleaned** (commit `security: remove hardcoded credentials from tracked files`)

- `.env.prod` untracked (kept on disk, now git-ignored)
- `docker-compose.dev.yml` parameterized via `env_file` + required `${VAR}` references
- `.env.dev.example` template added
- `.gitignore` tightened to `.env*` with only `!.env*.example` negated

✅ **Local git history purged** with `git-filter-repo`

- `.env.prod` removed from all history via `--invert-paths`
- The three real secret strings replaced with `***REMOVED-ROTATE-ME***` via `--replace-text`
- **Verified:** 0 occurrences of any of the three secrets across all 26 commits

✅ **Backup taken before rewriting:** `/home/alit/tahaqaq-360-ai-BACKUP-20260802-084452.bundle`
Restore with `git clone <bundle> restored-repo` if anything went wrong.

⏳ **Remote not yet updated** — `origin/develop` still contains the secrets in its history.

❌ **Credentials not yet rotated.**

---

## 3. What you must do

### Step 1 — Rotate the credentials (do this first)

**History purging does not undo exposure.** Assume all three are compromised. Rotate them *before*
force-pushing, so a leaked-but-live credential is never the thing you are racing to hide.

**A. Supabase database password**
Supabase Dashboard → Project Settings → Database → Reset database password.
Then update, in every place the old one appears:
- your local `.env.dev` / `.env.prod` (on disk, git-ignored)
- Render environment variables (`DATABASE_URL`, `DATABASE_DIRECT_URL`)
- any other deploy target

Remember the two forms: pooled on **6543** (`?pgbouncer=true`) for runtime, direct on **5432**
(`?sslmode=require`) for Prisma Migrate.

**B. Google OAuth client secret**
Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client → Reset secret.
Update `GOOGLE_CLIENT_SECRET` everywhere. Existing user sessions are unaffected; the OAuth *login
flow* breaks until the new secret is deployed, so do this at a low-traffic time.

**C. Supabase anon key**
The anon key is designed to be public (it ships in browser bundles) and is only as safe as your
Row Level Security policies. It is lower urgency than A and B — but since it leaked alongside the
database password, **verify RLS is actually enabled** on any table the anon key can reach. If RLS is
off, the anon key is equivalent to open database access, and this is then a **critical** finding,
not a low one.
Rotating it: Supabase Dashboard → Project Settings → API → roll the key. Note this invalidates the
key in any deployed frontend bundle until redeployed.

**D. Audit for misuse**
- Supabase → Logs: look for connections from unfamiliar IPs since `beda754`.
- Google Cloud → Credentials: check for unexpected OAuth activity.
- Confirm no unexpected admin users exist: check the `users` table for unexpected
  `role IN ('ADMIN','SUPER_ADMIN')` rows.

### Step 2 — Push the cleaned history

Once rotation is done:

```bash
cd /home/alit/tahaqaq-360-ai
ALLOW_FORCE_PUSH=1 git push --force-with-lease origin develop
```

The `ALLOW_FORCE_PUSH=1` prefix is required — `.claude/hooks/guard-bash.sh` blocks force-pushes
without it, deliberately.

**After pushing, the old objects still exist on GitHub** in the reflog and in any fork, cached view,
or open PR. To fully remove them:

1. Ask GitHub Support to run a garbage collection on the repository, **or**
2. Delete and recreate the repository (simplest, given 26 commits and a solo developer).

Because the repo may have been cloned or forked, **rotation in Step 1 is the control that actually
matters.** Treat the history purge as cleanup, not as remediation.

### Step 3 — Set up the read-only database role for MCP

The Postgres MCP server is configured to connect via `DATABASE_READONLY_URL`. **It will not work
until you create this role** — this is expected, not a bug.

Run in the Supabase SQL editor:

```sql
-- Create a login role with no write capability
CREATE ROLE mcp_readonly WITH LOGIN PASSWORD 'GENERATE_A_STRONG_PASSWORD';

GRANT CONNECT ON DATABASE postgres TO mcp_readonly;
GRANT USAGE  ON SCHEMA public       TO mcp_readonly;
GRANT SELECT ON ALL TABLES    IN SCHEMA public TO mcp_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO mcp_readonly;

-- Ensure future tables are readable too (new Prisma migrations create tables)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES    TO mcp_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO mcp_readonly;

-- Explicitly deny schema modification
REVOKE CREATE ON SCHEMA public FROM mcp_readonly;
```

Then add to `.env.dev`:

```
DATABASE_READONLY_URL=postgresql://mcp_readonly:THAT_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Two independent layers protect you here**, and you should keep both:
1. The `mcp_readonly` role has no write grants.
2. `@modelcontextprotocol/server-postgres` wraps every query in `BEGIN TRANSACTION READ ONLY`.

Do **not** point `DATABASE_READONLY_URL` at the owner/superuser account "just to get it working" —
that discards layer 1 and leaves only the client library's good behaviour between an agent and the
client's production data.

---

## 4. Preventing recurrence

Already in place:

- `.gitignore` ignores all `.env*` except `*.example`
- `.claude/hooks/guard-secrets.sh` blocks writing credential-shaped values into git-tracked files
  (allows `*.example` templates, git-ignored files, and obvious placeholders)
- `.claude/hooks/guard-bash.sh` blocks `git add -f` on env files and blocks unprompted force-pushes

Recommended additions (tracked in `docs/BACKLOG.md`):

- A `pre-commit` git hook running the same secret scan — the Claude hooks only cover Claude's edits,
  not commits made by hand or by another tool.
- GitHub secret scanning + push protection (free on public repos; verify it is enabled).

## 5. Verifying the purge yourself

```bash
cd /home/alit/tahaqaq-360-ai
for pat in 'GOCSPX-' 'eyJhbGciOiJ' '<the old db password>'; do
  echo "$pat -> $(git grep -I -c "$pat" $(git rev-list --all) 2>/dev/null | wc -l) blobs"
done
```

All three must report `0`.

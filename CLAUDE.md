# Tahaqaq 360 — Project Memory

> تحقق ("verify") — an Arabic-first fact-checking and media literacy platform.
> **Client project.** Built and maintained by Ali Traboulsi (solo) for an external
> organization. Delivery, scope control, and demoability matter as much as code quality.

---

## 1. What this product actually does

Tahaqaq 360 is not a CMS. It runs four interlocking systems:

| System                 | Flow                                                                                                                 | Key models                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Claim verification** | Public submits a claim → moderation queue → analyst writes fact-check with verdict, methodology, sources → published | `Submission`, `FactCheck`, `ModerationLog`                                                   |
| **Media literacy LMS** | Course → lessons → quizzes → progress tracking → PDF certificate with QR verification                                | `Course`, `Lesson`, `Quiz`, `QuizAttempt`, `CourseProgress`, `LessonProgress`, `Certificate` |
| **Community & events** | Workshops/events with registration, host requests, training requests                                                 | `Event`, `EventRegistration`, `HostRequest`, `TrainingRequest`, `Session`                    |
| **Engagement**         | Points, levels, reputation, achievements, saved content, notifications                                               | `Achievement`, `UserAchievement`, `Notification`, `SavedContent`, `ActivityLog`              |

Plus editorial surfaces: `Blog`, `Research`, `FAQ`, `ContactMessage`, and legal pages
(`PrivacyPolicy`, `TermsOfService`, `AccessibilityStatement`) served from the DB, not hardcoded.

**The verdict taxonomy is the product's core IP.** `VeracityRating` has 8 values —
`TRUE, MOSTLY_TRUE, HALF_TRUE, MOSTLY_FALSE, FALSE, UNVERIFIABLE, SATIRE, MISLEADING`.
Never collapse, reorder, or "simplify" these without an explicit product decision; fact-checking
organizations are held to their published rating scale, and it appears in public-facing content.

**Roles:** `USER < MODERATOR < ADMIN < SUPER_ADMIN`.
**Content lifecycle:** `DRAFT → UNDER_REVIEW → PUBLISHED → ARCHIVED`.
**Submission lifecycle:** `PENDING → IN_REVIEW → VERIFIED | REJECTED → PUBLISHED`.

---

## 2. Repository layout

Turborepo + pnpm workspaces. `packageManager` is pinned to `pnpm@8.15.6` — respect it.

```
apps/
  api/     NestJS 10 + Prisma 5 + PostgreSQL   ← the real system (237 TS files, 24 modules)
  web/     React 18 + Vite 5 + shadcn/ui       ← public site (27 pages)
  admin/   React 18 + Vite 5 + shadcn/ui       ← admin panel (2 pages, 19 tab components)
  docs/    DEAD — vanilla Vite starter leftover from `create-turbo -e with-vite`
packages/
  ui/                DEAD stub (counter.ts/header.ts) — neither app imports it
  eslint-config/     consumed only by the two dead packages
  typescript-config/ consumed only by the two dead packages
```

⚠️ **`apps/docs` and `packages/ui` are dead code.** Do not add to them, do not "fix" them,
do not import from them. Removal is tracked in `docs/BACKLOG.md`. If you need shared UI, read
ADR-0004 first — the intended target is a real shared package, not the current stub.

---

## 3. Commands

Run from the repo root unless noted.

```bash
pnpm install           # respects the pinned pnpm 8.15.6
pnpm dev               # turbo run dev — all apps
pnpm build             # turbo run build
pnpm lint              # turbo run lint
pnpm format            # prettier across ts/tsx/md
```

API-specific (run inside `apps/api`):

```bash
pnpm dev               # nest start --watch
pnpm db:generate       # prisma generate  — schema is at src/prisma/schema.prisma (NON-STANDARD PATH)
pnpm db:migrate        # prisma migrate dev   ← creates a migration; use for schema changes
pnpm db:deploy         # prisma migrate deploy ← applies migrations; use in CI/containers
pnpm db:studio         # prisma studio
pnpm db:seed           # seeds English data
pnpm db:seed:ar        # seeds Arabic data
pnpm test              # jest — currently near-zero coverage, see §7
```

**Every Prisma command needs `--schema=src/prisma/schema.prisma`.** The package scripts already
include it; if you invoke `prisma` directly, you must pass it or it will fail or, worse, act on
a stale default path.

### Ports

| Service | Port                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| api     | 5000 (`/api/v1`, Swagger at `/api/docs` in dev only)                              |
| web     | **3000** — set explicitly in `apps/web/vite.config.ts`, not the Vite default 5173 |
| admin   | 3001 — set in `apps/admin/vite.config.ts`                                         |

Host ports **5432 and 5433 are both occupied** by unrelated containers (`workgrid-postgres`,
`shop-db`). A local Postgres must bind **5434**.

### Running it locally (verified 2026-08-02)

```bash
docker run -d --name tahaqaq-db-dev \
  -e POSTGRES_USER=tahaqaq -e POSTGRES_PASSWORD=tahaqaq_dev -e POSTGRES_DB=tahaqaq_dev \
  -p 5434:5432 postgres:16-alpine

# apps/api/.env  (git-ignored) — see .env.dev.example
cd apps/api
npx prisma migrate deploy --schema=src/prisma/schema.prisma
set -a; . ./.env; set +a && npx ts-node src/prisma/seed/arabic.seed.ts   # see caveat below
pnpm dev
```

Three things that will bite you, all verified by running it:

1. **The seed scripts do not load `.env`.** `pnpm db:seed` / `db:seed:ar` invoke bare `ts-node`,
   which — unlike the Prisma CLI — does not auto-load `.env`. They fail with
   `Environment variable not found: DATABASE_URL` unless you export the env yourself.
2. **A missing `GOOGLE_CLIENT_ID` prevents the entire API from booting.** `GoogleStrategy` is
   registered unconditionally, so passport throws during DI and every module goes down with it —
   not just Google login. Placeholder values are enough to boot.
3. **The hosted Supabase project no longer exists** (`mkowxfbbazrjkhihmpea` does not resolve).
   The old `DATABASE_URL` is dead; a local database is now the only way to run this.

---

## 4. Backend conventions (`apps/api`)

### Module shape — follow this exactly

```
src/modules/<feature>/
  <feature>.module.ts       Module definition
  <feature>.controller.ts   REST endpoints, @ApiTags decorated
  <feature>.service.ts      Business logic, injects PrismaService
  dto/*.dto.ts              class-validator DTOs
  entities/*.entity.ts      Swagger response shapes
```

New modules must be registered in `src/app.module.ts` under the correct comment banner
(CORE FEATURE / SUPPORTING / ADMIN).

### Auth is deny-by-default

`JwtAuthGuard` is bound globally via `APP_GUARD`. **Every endpoint requires a JWT unless it opts
out with `@Public()`.** This is the single most important thing to get right:

- Forgetting `@Public()` on a public endpoint → silently breaks the public site.
- Adding `@Public()` carelessly → exposes data. Never put `@Public()` on anything that reads
  user-owned data, accepts writes, or returns PII.

```ts
@Public()                                              // no JWT
@Get(':slug')
findOne(@Param('slug') slug: string) {}

@UseGuards(RolesGuard)                                 // RolesGuard must be explicit
@Roles(Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth('JWT-auth')
@Post()
create(@CurrentUser('id') userId: string, @Body() dto: CreateDto) {}
```

`@Roles()` does nothing without `@UseGuards(RolesGuard)`. Always pair them.

### The response envelope

`TransformInterceptor` wraps **every** response globally:

```jsonc
// single resource
{ "success": true, "data": {...}, "message": "...", "meta": {...} }

// paginated — detected when the service returns { data[], total, page, limit }
{ "success": true, "data": [...],
  "meta": { "total", "page", "limit", "totalPages", "hasNextPage", "hasPreviousPage" } }
```

Services return **bare data**, never the envelope. Frontends must unwrap `.data`. If a paginated
service stops returning all four of `data`/`total`/`page`/`limit`, the interceptor silently falls
through to the single-resource branch and `meta` disappears — a common source of broken pagination.

### Global pipeline (set in `main.ts`)

- `ValidationPipe` with `whitelist: true`, **`forbidNonWhitelisted: true`**, `transform: true`,
  `enableImplicitConversion: true`. Any body field absent from the DTO causes a **400**, not a
  silent drop. Adding a frontend field without the DTO field is an instant break.
- URI versioning, default `v1`, global prefix `api` → routes are `/api/v1/...`.
- Filters: `HttpExceptionFilter`, `PrismaExceptionFilter`. Interceptors: `LoggingInterceptor`, `TransformInterceptor`.
- Security: helmet, compression, cookie-parser. CORS uses a **hardcoded origin whitelist in
  `main.ts`** — not the `CORS_ORIGIN` env var. A new deploy domain must be added there or it is blocked.
- Swagger only mounts when `NODE_ENV === 'development'`.

### Data access

Always inject `PrismaService` from `database/prisma.module`. Never instantiate `PrismaClient`.

---

## 5. Frontend conventions (`apps/web`, `apps/admin`)

Both apps: React 18, Vite 5, Tailwind **v4** (via `@tailwindcss/vite`, not the v3 PostCSS setup),
shadcn/ui, TanStack Query v5, React Router 6, React Hook Form + Zod.

- `apps/web/src/lib/api.ts` (1001 lines) and `apps/admin/src/lib/adminApi.ts` (844 lines) are
  **hand-written** API clients duplicating backend types. They drift silently. When you change a
  DTO, you must update the corresponding client by hand — grep both files. Fixing this properly is
  ADR-0003.
- The 50 shadcn components under `src/components/ui/` are **duplicated verbatim** between web and
  admin. A fix applied to one must be applied to the other until the shared package exists.
- `apps/web` was originally generated by Lovable; `lovable-tagger` is still a devDependency.
- Admin is a single `Admin.tsx` shell rendering tab components from `src/components/admin/`.
  There is no admin routing beyond login — new admin screens are new tab components.

### Arabic / RTL

UI strings are **hardcoded Arabic literals in TSX**. There is no i18n library and the database has
**zero** bilingual columns. The client requires true bilingual support — this is a real, costed gap
tracked as ADR-0002 and the top backlog item. Until that lands:

- Do not add an i18n library ad-hoc, and do not invent `*Ar`/`*En` columns on one model. Both
  create migration debt that ADR-0002 has to undo.
- Do keep new strings in one place per component so extraction is mechanical later.
- Note: commit `ac65b96` deliberately forced **English locale** for number/date formatting.
  That was a conscious choice — do not "fix" it back to Arabic numerals without asking.

---

## 6. Environment, secrets, and the database

**Never commit a credential.** This repo leaked a live Google OAuth client secret, a Supabase anon
key, and the Supabase Postgres password. History was purged on 2026-08-02; the credentials still
require rotation. See `docs/SECURITY-REMEDIATION.md`.

- All `.env*` files are git-ignored except `*.example`. A hook blocks writing secret-shaped values
  into tracked files.
- `.env.dev.example` → copy to `.env.dev` for `docker-compose.dev.yml`.
- `.env.prod` exists on disk, is git-ignored, and must never be re-added.

⚠️ **There is no local database.** The `postgres` service in `docker-compose.dev.yml` is commented
out — "development" points at the **hosted Supabase instance**, which is very likely the client's
real data. Consequences you must respect:

- **Never** run `db:reset`, `db:reset-seed`, `db:fresh`, `prisma migrate reset`, or `db:push`
  against the current `DATABASE_URL`. These are destructive against live client data. A hook blocks
  them; do not work around it.
- Migrations need `DATABASE_DIRECT_URL` (port 5432), not the pooled URL (6543) — Prisma Migrate
  cannot run through a transaction pooler.
- The Postgres MCP server is wired to `DATABASE_READONLY_URL` and executes inside a read-only
  transaction. Use it to inspect data. It cannot and must not write.

---

## 7. Testing reality

Coverage is effectively **zero**: only Nest's default `app.controller.spec.ts` and default
`app.e2e-spec.ts` exist. `turbo.json` defines no `test` or `typecheck` task.

Do not claim a change is "tested" because it compiles. When you change backend logic, either write
a spec or state plainly that it is untested. Building out coverage is tracked in `docs/BACKLOG.md`.

---

## 8. Deployment

- **Docker**: `docker-compose.dev.yml` / `docker-compose.prod.yml`; per-app Dockerfiles.
- **Render**: `render.yaml` blueprint (frankfurt, free tier), health check `/api/v1/health`.
- **Netlify**: `tahaqaq-360-web.netlify.app`, `tahaqaq-360-admin.netlify.app` (per the CORS whitelist).
- **CI**: `.github/workflows/docker-build.yml` builds images for `api` and `web` only —
  **`admin` is missing from the matrix** and is never built in CI.

---

## 9. Working agreement

1. **No assumptions.** If a decision has product, cost, or client-facing consequences, ask.
   This is a standing instruction from the repo owner, not a nicety.
2. **This is a client project.** Scope creep costs Ali money. Flag when a request implies work
   beyond what was asked, and let him decide.
3. Solo developer, commits go **directly to `develop`**. There is no reviewer to catch mistakes —
   the hooks and the `code-reviewer` agent are the only safety net.
4. Prefer proposing an ADR over silently making an architectural choice. ADRs live in `docs/adr/`.
5. Report honestly. If something is untested, unverified, or partially done, say so.

## 10. Where to look

| Need                            | Path                                            |
| ------------------------------- | ----------------------------------------------- |
| Prioritized work + costs        | `docs/BACKLOG.md`                               |
| Architecture decisions          | `docs/adr/`                                     |
| Credential rotation steps       | `docs/SECURITY-REMEDIATION.md`                  |
| AI verification pipeline design | `docs/architecture/ai-verification-pipeline.md` |
| Specialized agents              | `.claude/agents/`                               |
| Repeatable procedures           | `.claude/skills/`                               |

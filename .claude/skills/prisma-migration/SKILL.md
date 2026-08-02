---
name: prisma-migration
description: Safely change the database schema. Use for ANY edit to apps/api/src/prisma/schema.prisma or when creating/applying a migration. Critical because dev points at a hosted Supabase instance holding likely-real client data — there is no local database.
---

# Changing the Tahaqaq 360 database schema

## Read this first

**There is no local database.** The `postgres` service in `docker-compose.dev.yml` is commented out.
`DATABASE_URL` points at a **hosted Supabase instance that very likely holds the client's real data**.

A migration here is a production change. Treat it as one.

Schema lives at `apps/api/src/prisma/schema.prisma` — a **non-standard path**. Every Prisma command
needs `--schema=src/prisma/schema.prisma`; the package scripts already include it.

## Never run these

```
prisma migrate reset    db:reset    db:fresh    db:reset-seed
prisma db push          db:push     db:fresh:ar db:reset-seed:ar
```

`db:push` is on this list deliberately: it silently drops columns to make the database match the
schema, produces no migration file, and leaves no record. A hook blocks all of these — do not
work around it.

## Procedure

### 1. Classify the change before editing

| Change | Risk | Requires |
|---|---|---|
| Add optional field (`String?`) | Safe | — |
| Add required field **with** `@default` | Safe | — |
| Add required field **without** default | **Destructive** — fails on a non-empty table | Backfill plan |
| Drop a column | **Destructive** — irreversible loss | Ali's explicit approval |
| Rename a field | **Destructive** — Prisma emits drop+add | `@map`, or a hand-written migration |
| Narrow a type / add `@unique` | **Destructive** — fails or truncates | Audit existing data first |
| Change an enum value | **Destructive** — orphans rows | Data migration |
| Add a relation | Usually safe | Check indexes |

Anything marked destructive: measure the affected rows first (the read-only Postgres MCP is good for
this) and get Ali's explicit go-ahead. Route the change through the `prisma-schema-guardian` agent.

### 2. Edit the schema

Conventions this schema follows everywhere — match them:

```prisma
model Example {
  id        String   @id @default(cuid())
  slug      String   @unique
  body      String   @db.Text
  status    ContentStatus @default(DRAFT)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([slug])
  @@index([authorId])
  @@index([status])
  @@map("examples")          // every model maps to a snake_case table
}
```

Index every foreign key and every field used in a `where` or `orderBy`.

**Do not add ad-hoc `*Ar`/`*En` translation columns.** The bilingual content model is an open
schema-wide decision (ADR-0002); a one-off here creates debt that has to be undone across ~15 models.

### 3. Create the migration

```bash
cd apps/api
pnpm db:migrate --name describes_the_change
```

This needs **`DATABASE_DIRECT_URL`** (port 5432). Prisma Migrate **cannot** run through the pgbouncer
pooler on 6543 — it will hang or fail with a confusing error.

### 4. Review the generated SQL before it lands

Read `src/prisma/migrations/<timestamp>_<name>/migration.sql`. Look for `DROP COLUMN`, `DROP TABLE`,
`ALTER COLUMN ... SET NOT NULL`, and type narrowing. If you see one and did not intend it, stop.

### 5. Regenerate the client

```bash
pnpm db:generate
```

Skipping this leaves the Prisma client types out of sync with the schema, and TypeScript will
confidently accept code that fails at runtime.

### 6. Propagate the change

- Update DTOs in `apps/api/src/modules/<feature>/dto/`
- Update `apps/web/src/lib/api.ts` and `apps/admin/src/lib/adminApi.ts` by hand
- Check the seed scripts (`src/prisma/seed/seed.ts`, `arabic.seed.ts`) still satisfy new required fields
- `cd apps/api && pnpm build`

## Applying in deployment

Containers run `pnpm db:deploy` (i.e. `prisma migrate deploy`) on start — it applies pending
migrations and never resets. Note this means **every container start applies migrations**, which is a
race on multi-instance deploys. Relevant if scaling beyond one instance.

## Rollback

Prisma has no `migrate down`. Rollback means writing a **new forward migration** that reverses the
change — and if a column was dropped, the data is gone regardless. This is why destructive changes
need approval before, not regret after.

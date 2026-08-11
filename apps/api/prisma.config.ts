import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 configuration.
 *
 * In Prisma 7 the datasource URL moved out of schema.prisma. `validate` and
 * `generate` tolerate its absence, but `migrate` requires it here.
 *
 * Note the non-standard schema location: this project keeps Prisma under
 * `src/prisma/` rather than the default `prisma/`.
 *
 * Migrations use DATABASE_DIRECT_URL when it is set. Prisma Migrate cannot run
 * through a transaction pooler (pgbouncer on 6543) — it needs the direct
 * connection on 5432. Falls back to DATABASE_URL for a plain local database
 * where the two are the same.
 */
export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_DIRECT_URL'] || process.env['DATABASE_URL'],
  },
});

import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma 7 no longer connects from a URL in the schema — `new PrismaClient()`
 * throws unless a driver adapter is supplied. This builds that adapter from the
 * environment so the API and the seed scripts construct their clients the same
 * way, rather than each inventing their own.
 */
export const createPrismaAdapter = (connectionString?: string) => {
  const url =
    connectionString ??
    process.env.DATABASE_URL ??
    process.env.DATABASE_DIRECT_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.dev.example to apps/api/.env and fill it in.\n' +
        'Note: bare `ts-node` does not load .env — the package scripts use ' +
        '`node --env-file-if-exists=.env` for exactly this reason.',
    );
  }

  return new PrismaPg({ connectionString: url });
};

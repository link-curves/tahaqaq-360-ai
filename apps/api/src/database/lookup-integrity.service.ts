import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LOOKUP_REGISTRY } from '../common/constants/lookups';
import { PrismaService } from './prisma.service';

/**
 * Guards the one weakness of moving enums into lookup tables: the TypeScript
 * constants in `common/constants/lookups.ts` and the database rows are two
 * sources of truth, and nothing stops them drifting.
 *
 * At boot, every code the application refers to is checked against the rows that
 * actually exist. A missing row is a hard failure — it would otherwise surface
 * as a foreign-key violation on some write path in production, long after the
 * cause.
 *
 * The check is deliberately one-directional: EXTRA rows in the database are
 * fine and expected. Being able to add values without a deploy is the entire
 * point of this design.
 */
@Injectable()
export class LookupIntegrityService implements OnModuleInit {
  private readonly logger = new Logger(LookupIntegrityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Skip during tests, which use mocked Prisma and no real tables.
    if (process.env.NODE_ENV === 'test') return;

    const problems: string[] = [];
    let checked = 0;

    for (const entry of LOOKUP_REGISTRY) {
      const delegate = (this.prisma as any)[entry.model];

      if (!delegate?.findMany) {
        problems.push(
          `${entry.label}: no Prisma delegate "${entry.model}" — LOOKUP_REGISTRY is out of step with the schema.`,
        );
        continue;
      }

      let rows: Array<{ code: string }>;
      try {
        rows = await delegate.findMany({ select: { code: true } });
      } catch (error) {
        problems.push(
          `${entry.label}: could not read the table — ${(error as Error).message}`,
        );
        continue;
      }

      const present = new Set(rows.map((r) => r.code));
      const missing = entry.codes.filter((c) => !present.has(c));

      if (missing.length > 0) {
        problems.push(
          `${entry.label}: missing row(s) for ${missing.join(', ')} — ` +
            `code refers to ${missing.length === 1 ? 'a value' : 'values'} the database does not have.`,
        );
      }

      checked += entry.codes.length;
    }

    if (problems.length > 0) {
      const message = [
        'Lookup table integrity check FAILED.',
        '',
        ...problems.map((p) => `  • ${p}`),
        '',
        'The lookup tables are probably unseeded. Run:',
        '  cd apps/api && pnpm db:seed:ar     (or pnpm db:seed)',
        '',
        'Refusing to start: continuing would turn this into foreign-key',
        'violations on write paths instead of one clear error here.',
      ].join('\n');

      this.logger.error(message);
      throw new Error(
        'Lookup table integrity check failed — see the log above.',
      );
    }

    this.logger.log(
      `✅ Lookup integrity verified: ${checked} codes across ${LOOKUP_REGISTRY.length} tables`,
    );
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  DEFAULT_LOCALE,
  LOOKUP_REGISTRY,
  LocalizedText,
} from '../common/constants/lookups';
import { PrismaService } from './prisma.service';

/**
 * Guards the two weaknesses of the reference-data design.
 *
 * 1. CODE DRIFT — the TypeScript constants and the database rows are two
 *    sources of truth. A code the application references but the database lacks
 *    would surface as a foreign-key violation on some write path in production,
 *    long after the cause.
 *
 * 2. MISSING TRANSLATIONS — labels are a JSON map with no database-level
 *    integrity, so nothing stops `{ ar: … }` with no `en`, or a typo'd key
 *    (ADR-0008). That renders as a blank chip in the UI.
 *
 * Both are checked at boot. Code drift is FATAL. Missing translations are
 * reported loudly but non-fatal, because `resolveLocalized` falls back to
 * Arabic and a half-translated language is a normal intermediate state while a
 * new locale is rolled out — which is what `Locale.isActive` exists for.
 *
 * The code check is deliberately one-directional: EXTRA rows in the database
 * are fine and expected. Adding values without a deploy is the point.
 */
@Injectable()
export class LookupIntegrityService implements OnModuleInit {
  private readonly logger = new Logger(LookupIntegrityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Tests use a mocked Prisma and no real tables.
    if (process.env.NODE_ENV === 'test') return;

    const activeLocales = await this.activeLocaleKeys();
    const missingCodes: string[] = [];
    const missingLabels: string[] = [];
    let codesChecked = 0;

    for (const entry of LOOKUP_REGISTRY) {
      const delegate = (this.prisma as any)[entry.model];

      if (!delegate?.findMany) {
        missingCodes.push(
          `${entry.label}: no Prisma delegate "${entry.model}" — LOOKUP_REGISTRY is out of step with the schema.`,
        );
        continue;
      }

      let rows: Array<{ code: string; labels: unknown }>;
      try {
        rows = await delegate.findMany({
          select: { code: true, labels: true },
        });
      } catch (error) {
        missingCodes.push(
          `${entry.label}: could not read the table — ${(error as Error).message}`,
        );
        continue;
      }

      const byCode = new Map(rows.map((r) => [r.code, r.labels]));

      const absent = entry.rows
        .map((r) => r.code)
        .filter((c) => !byCode.has(c));
      if (absent.length > 0) {
        missingCodes.push(
          `${entry.label}: missing row(s) for ${absent.join(', ')} — ` +
            `code refers to ${absent.length === 1 ? 'a value' : 'values'} the database does not have.`,
        );
      }
      codesChecked += entry.rows.length;

      // Label coverage across every active locale.
      for (const [code, labels] of byCode) {
        const map = (labels ?? {}) as LocalizedText;
        const gaps = activeLocales.filter(
          (loc) => typeof map[loc] !== 'string' || !map[loc],
        );
        if (gaps.length > 0) {
          missingLabels.push(`${entry.label}.${code} -> ${gaps.join(', ')}`);
        }
      }
    }

    if (missingCodes.length > 0) {
      const message = [
        'Lookup table integrity check FAILED.',
        '',
        ...missingCodes.map((p) => `  • ${p}`),
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

    if (missingLabels.length > 0) {
      this.logger.warn(
        [
          `Missing reference-data translations for ${missingLabels.length} row(s).`,
          `These fall back to ${DEFAULT_LOCALE} at render time, so nothing breaks —`,
          'but the UI shows the wrong language until they are filled in:',
          ...missingLabels.slice(0, 20).map((m) => `  • ${m}`),
          ...(missingLabels.length > 20
            ? [`  … and ${missingLabels.length - 20} more`]
            : []),
        ].join('\n'),
      );
    }

    this.logger.log(
      `✅ Lookup integrity verified: ${codesChecked} codes across ` +
        `${LOOKUP_REGISTRY.length} tables, locales [${activeLocales.join(', ')}]` +
        (missingLabels.length === 0 ? ', all labels present' : ''),
    );
  }

  /** Lowercase keys, matching the shape of the `labels` maps. */
  private async activeLocaleKeys(): Promise<string[]> {
    try {
      const locales = await this.prisma.locale.findMany({
        where: { isActive: true },
        select: { code: true },
      });
      return locales.map((l) => l.code.toLowerCase());
    } catch {
      return [DEFAULT_LOCALE.toLowerCase()];
    }
  }
}

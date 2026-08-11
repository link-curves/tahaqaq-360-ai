import { LOCALE, REVISION_TIER } from '../../common/constants/lookups';
import { PrismaService } from '../../database/prisma.service';
import { FactChecksService } from './fact-checks.service';

/**
 * These tests exist for one reason: `Evidence.note` and `ArticleRevision.reason`
 * are INTERNAL analyst fields, and nothing at the type level stops someone
 * swapping an explicit `select` for a convenient `include`. That single change
 * would publish internal editorial notes on every fact-check page, silently.
 *
 * ADR-0005 / ADR-0006 invariant 7. They assert on the query Prisma is asked to
 * run, so they fail on the *cause* rather than waiting for a leak to be noticed
 * in a response body.
 */
describe('FactChecksService — public payload safety', () => {
  let service: FactChecksService;
  let prisma: {
    factCheckArticle: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
    factCheck: { groupBy: jest.Mock };
  };

  /** Recursively collect every key referenced anywhere in a Prisma select tree. */
  const keysIn = (node: unknown, acc: string[] = []): string[] => {
    if (!node || typeof node !== 'object') return acc;
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      acc.push(k);
      keysIn(v, acc);
    }
    return acc;
  };

  const article = {
    id: 'a1',
    localeCode: LOCALE.AR,
    slug: 's',
    statusCode: 'PUBLISHED',
    factCheck: { topics: [], articles: [], evidence: [] },
    revisions: [],
  };

  beforeEach(() => {
    prisma = {
      factCheckArticle: {
        findUnique: jest.fn().mockResolvedValue(article),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn().mockResolvedValue(article),
      },
      factCheck: { groupBy: jest.fn().mockResolvedValue([]) },
    };
    service = new FactChecksService(prisma as unknown as PrismaService);
  });

  describe('findOne', () => {
    it('never requests Evidence.note', async () => {
      await service.findOne(LOCALE.AR, 's', false);

      const query = prisma.factCheckArticle.findUnique.mock.calls[0][0];
      const evidenceSelect = query.select.factCheck.select.evidence.select;

      expect(Object.keys(evidenceSelect)).not.toContain('note');
      expect(query.select.factCheck.select.evidence.include).toBeUndefined();
    });

    it('never requests ArticleRevision.reason', async () => {
      await service.findOne(LOCALE.AR, 's', false);

      const query = prisma.factCheckArticle.findUnique.mock.calls[0][0];
      const revisionSelect = query.select.revisions.select;

      expect(Object.keys(revisionSelect)).not.toContain('reason');
      expect(query.select.revisions.include).toBeUndefined();
    });

    it('mentions neither internal field anywhere in the query tree', async () => {
      // Catches a leak introduced at any nesting depth, not just the two
      // places checked above.
      await service.findOne(LOCALE.AR, 's', false);

      const keys = keysIn(prisma.factCheckArticle.findUnique.mock.calls[0][0]);

      expect(keys).not.toContain('note');
      expect(keys).not.toContain('reason');
    });

    it('publishes only disclosed revisions — SILENT edits stay internal', async () => {
      await service.findOne(LOCALE.AR, 's', false);

      const query = prisma.factCheckArticle.findUnique.mock.calls[0][0];

      expect(query.select.revisions.where).toEqual({
        tierCode: { not: REVISION_TIER.SILENT },
      });
    });

    it('does not increment views when asked not to', async () => {
      await service.findOne(LOCALE.AR, 's', false);

      expect(prisma.factCheckArticle.update).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('defaults to published-only, so drafts never reach the public list', async () => {
      await service.findAll({} as never);

      const { where } = prisma.factCheckArticle.findMany.mock.calls[0][0];

      expect(where.statusCode).toBe('PUBLISHED');
    });

    it('scopes to a locale, defaulting to Arabic', async () => {
      await service.findAll({} as never);

      const { where } = prisma.factCheckArticle.findMany.mock.calls[0][0];

      expect(where.localeCode).toBe(LOCALE.AR);
    });

    it('mentions neither internal field anywhere in the list query', async () => {
      await service.findAll({} as never);

      const keys = keysIn(prisma.factCheckArticle.findMany.mock.calls[0][0]);

      expect(keys).not.toContain('note');
      expect(keys).not.toContain('reason');
    });

    it('returns the flat shape TransformInterceptor detects as paginated', async () => {
      // Drop any of these four and `meta` silently vanishes from the response.
      const result = await service.findAll({} as never);

      expect(result).toEqual(
        expect.objectContaining({
          data: expect.any(Array),
          total: expect.any(Number),
          page: expect.any(Number),
          limit: expect.any(Number),
        }),
      );
    });
  });

});

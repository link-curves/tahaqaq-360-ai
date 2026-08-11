import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  CONTENT_STATUS,
  LOCALE,
  REVISION_TIER,
  VERDICT,
} from '../../common/constants/lookups';
import { PrismaService } from '../../database/prisma.service';
import { FactChecksAuthoringService } from './fact-checks-authoring.service';

/**
 * ADR-0006 invariants.
 *
 * These are not coverage for its own sake. Each one guards a way the editorial
 * record can be silently corrupted — and a corrupted record is not recoverable
 * after the fact, because the information needed to repair it was never written
 * down. Invariant 6 in particular (cross-locale propagation) is the one a
 * plausible implementation gets wrong: "edit this article" quietly skips the
 * sibling, and the Arabic says one thing while the English says another.
 */
describe('FactChecksAuthoringService — ADR-0006 invariants', () => {
  let service: FactChecksAuthoringService;
  let prisma: any;
  let tx: any;

  const ARTICLE = {
    id: 'art-ar',
    statusCode: CONTENT_STATUS.PUBLISHED,
    authorId: 'author-1',
    editorId: 'editor-1',
    title: 'T',
    summary: 'S',
    body: 'B',
    methodology: null,
    metaTitle: null,
    metaDescription: null,
    featuredImage: null,
    isFeatured: false,
    publishedAt: new Date('2026-01-01'),
    factCheck: { id: 'fc-1', verdictCode: VERDICT.HALF_TRUE },
  };

  const makeTx = () => ({
    claim: { create: jest.fn().mockResolvedValue({ id: 'claim-1' }) },
    factCheck: {
      create: jest.fn().mockResolvedValue({ id: 'fc-1' }),
      update: jest.fn().mockResolvedValue({}),
    },
    factCheckArticle: {
      create: jest.fn().mockResolvedValue({ id: 'art-new' }),
      update: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    articleRevision: {
      create: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue({ revisionNumber: 1 }),
    },
    verdictChange: { create: jest.fn().mockResolvedValue({}) },
  });

  beforeEach(() => {
    tx = makeTx();
    prisma = {
      $transaction: jest.fn((arg: any) =>
        typeof arg === 'function' ? arg(tx) : Promise.all(arg),
      ),
      factCheckArticle: { findUnique: jest.fn().mockResolvedValue(ARTICLE) },
      factCheck: { findUnique: jest.fn() },
      user: { findUnique: jest.fn().mockResolvedValue({ id: 'analyst-1' }) },
      veracityRating: {
        findUnique: jest.fn().mockResolvedValue({ code: VERDICT.TRUE }),
      },
      evidence: { count: jest.fn(), findMany: jest.fn(), create: jest.fn() },
      country: { findMany: jest.fn().mockResolvedValue([]) },
      topic: { findMany: jest.fn().mockResolvedValue([]) },
    };
    service = new FactChecksAuthoringService(
      prisma as unknown as PrismaService,
    );
  });

  // ---------------------------------------------------------------------
  // The editorial gate (ADR-0002)
  // ---------------------------------------------------------------------
  describe('publishing', () => {
    it('refuses to let an author publish their own article', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.UNDER_REVIEW,
      });

      await expect(
        service.publish(LOCALE.AR, 'slug', 'author-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows a different editor to publish', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.UNDER_REVIEW,
      });

      await service.publish(LOCALE.AR, 'slug', 'editor-2');

      expect(tx.factCheckArticle.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            statusCode: CONTENT_STATUS.PUBLISHED,
            editorId: 'editor-2',
          }),
        }),
      );
    });

    it('writes a revision when publishing (invariant 2)', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.UNDER_REVIEW,
      });
      tx.articleRevision.findFirst.mockResolvedValue(null);

      await service.publish(LOCALE.AR, 'slug', 'editor-2');

      expect(tx.articleRevision.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ revisionNumber: 1 }),
        }),
      );
    });

    it('cannot publish straight from DRAFT — review is a distinct step', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.DRAFT,
      });

      await expect(
        service.publish(LOCALE.AR, 'slug', 'editor-2'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------------------------------------------------------------------
  // Invariant 3 + 4 — post-publication edits are on the record
  // ---------------------------------------------------------------------
  describe('editing a published article', () => {
    it('rejects an edit that declares no revision (invariant 3)', async () => {
      await expect(
        service.updateArticle(LOCALE.AR, 'slug', 'editor-1', { title: 'New' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('requires a public notice for anything above SILENT (invariant 4)', async () => {
      await expect(
        service.updateArticle(LOCALE.AR, 'slug', 'editor-1', {
          title: 'New',
          revision: { tierCode: REVISION_TIER.CORRECTION },
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('allows a SILENT revision with no notice', async () => {
      await service.updateArticle(LOCALE.AR, 'slug', 'editor-1', {
        title: 'Typo fixed',
        revision: { tierCode: REVISION_TIER.SILENT },
      });

      expect(tx.articleRevision.create).toHaveBeenCalledTimes(1);
    });

    it('writes a revision numbered after the previous one', async () => {
      tx.articleRevision.findFirst.mockResolvedValue({ revisionNumber: 4 });

      await service.updateArticle(LOCALE.AR, 'slug', 'editor-1', {
        body: 'Updated',
        revision: {
          tierCode: REVISION_TIER.CORRECTION,
          noticeText: 'We corrected a figure.',
        },
      });

      expect(tx.articleRevision.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ revisionNumber: 5 }),
        }),
      );
    });

    it('does not demand a revision while the article is a draft', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.DRAFT,
      });

      await service.updateArticle(LOCALE.AR, 'slug', 'author-1', {
        title: 'Still drafting',
      });

      expect(tx.articleRevision.create).not.toHaveBeenCalled();
    });

    it('refuses to edit a retracted article', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.RETRACTED,
      });

      await expect(
        service.updateArticle(LOCALE.AR, 'slug', 'editor-1', {
          title: 'x',
          revision: { tierCode: REVISION_TIER.SILENT },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------------------------------------------------------------------
  // Invariants 5 and 6 — verdict changes
  // ---------------------------------------------------------------------
  describe('changing a verdict', () => {
    const withArticles = (articles: any[]) =>
      prisma.factCheck.findUnique.mockResolvedValue({
        id: 'fc-1',
        verdictCode: VERDICT.HALF_TRUE,
        articles,
      });

    const AR_PUB = {
      id: 'art-ar',
      statusCode: CONTENT_STATUS.PUBLISHED,
      localeCode: LOCALE.AR,
      title: 'ar',
      summary: 's',
      body: 'b',
      methodology: null,
    };
    const EN_PUB = { ...AR_PUB, id: 'art-en', localeCode: LOCALE.EN };
    const EN_DRAFT = { ...EN_PUB, statusCode: CONTENT_STATUS.DRAFT };

    const dto = {
      toVerdictCode: VERDICT.TRUE,
      reason: 'New official documents confirm the claim in full.',
      changedById: 'analyst-1',
    };

    it('refuses to let one person approve their own change (invariant 5)', async () => {
      await expect(
        service.changeVerdict('fc-1', 'analyst-1', dto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('propagates a revision to EVERY published locale (invariant 6)', async () => {
      withArticles([AR_PUB, EN_PUB]);

      const result = await service.changeVerdict('fc-1', 'editor-1', dto);

      expect(tx.articleRevision.create).toHaveBeenCalledTimes(2);
      expect(result.localesNotified).toEqual([LOCALE.AR, LOCALE.EN]);
    });

    it('marks those revisions VERDICT_CHANGE with a public notice', async () => {
      withArticles([AR_PUB, EN_PUB]);

      await service.changeVerdict('fc-1', 'editor-1', dto);

      for (const call of tx.articleRevision.create.mock.calls) {
        expect(call[0].data.tierCode).toBe(REVISION_TIER.VERDICT_CHANGE);
        expect(call[0].data.noticeText).toContain(VERDICT.TRUE);
      }
    });

    it('does not notify locales that are not published', async () => {
      withArticles([AR_PUB, EN_DRAFT]);

      const result = await service.changeVerdict('fc-1', 'editor-1', dto);

      expect(tx.articleRevision.create).toHaveBeenCalledTimes(1);
      expect(result.localesNotified).toEqual([LOCALE.AR]);
    });

    it('records both people on the VerdictChange row', async () => {
      withArticles([AR_PUB]);

      await service.changeVerdict('fc-1', 'editor-1', dto);

      expect(tx.verdictChange.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            changedById: 'analyst-1',
            approvedById: 'editor-1',
            fromVerdictCode: VERDICT.HALF_TRUE,
            toVerdictCode: VERDICT.TRUE,
          }),
        }),
      );
    });

    it('rejects a change to the verdict it already has', async () => {
      withArticles([AR_PUB]);

      await expect(
        service.changeVerdict('fc-1', 'editor-1', {
          ...dto,
          toVerdictCode: VERDICT.HALF_TRUE,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects an unknown analyst rather than recording a dangling id', async () => {
      withArticles([AR_PUB]);
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changeVerdict('fc-1', 'editor-1', dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------
  describe('lifecycle', () => {
    it('retracts rather than deletes, and records the notice', async () => {
      await service.retract(LOCALE.AR, 'slug', 'admin-1', {
        noticeText: 'Withdrawn: the sourcing was insufficient.',
      });

      expect(tx.factCheckArticle.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { statusCode: CONTENT_STATUS.RETRACTED },
        }),
      );
      expect(tx.articleRevision.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tierCode: REVISION_TIER.CORRECTION,
            noticeText: 'Withdrawn: the sourcing was insufficient.',
          }),
        }),
      );
    });

    it('treats retraction as terminal — a retraction is a public statement', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.RETRACTED,
      });

      await expect(service.archive(LOCALE.AR, 'slug')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('only lets the author submit their own draft for review', async () => {
      prisma.factCheckArticle.findUnique.mockResolvedValue({
        ...ARTICLE,
        statusCode: CONTENT_STATUS.DRAFT,
      });

      await expect(
        service.submitForReview(LOCALE.AR, 'slug', 'someone-else'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ---------------------------------------------------------------------
  // Invariant 1 — append-only
  // ---------------------------------------------------------------------
  describe('invariant 1: revisions are append-only', () => {
    it('exposes no way to update or delete a revision, for anyone', () => {
      const surface = [
        ...Object.getOwnPropertyNames(FactChecksAuthoringService.prototype),
        ...Object.keys(service),
      ];

      const mutators = surface.filter(
        (m) => /revision/i.test(m) && /(update|delete|remove|edit)/i.test(m),
      );

      expect(mutators).toEqual([]);
    });
  });
});

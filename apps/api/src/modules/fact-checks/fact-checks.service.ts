import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CONTENT_STATUS,
  LOCALE,
  LocaleCode,
  REVISION_TIER,
  resolveLocalized,
  RoleCode,
} from '../../common/constants/lookups';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateFactCheckDto,
  FactCheckFilterDto,
  UpdateFactCheckDto,
} from './dto/create-fact-check.dto';

/**
 * Reads over the editorial record: Claim -> FactCheck -> FactCheckArticle.
 *
 * The article is the entity the public reads: it carries the prose, the byline,
 * the slug and the publish state, and there is one per locale. The verdict and
 * the evidence hang off the review, shared by both locales (ADR-0002).
 *
 * PUBLIC PAYLOAD SAFETY
 * Every select here is explicit, so `Evidence.note` and `ArticleRevision.reason`
 * are never fetched — they are internal analyst notes. Using `include` instead
 * would pull them in and leak them (ADR-0005/0006 invariant 7). There is a test
 * asserting this; do not relax the selects.
 */
@Injectable()
export class FactChecksService {
  constructor(private prisma: PrismaService) {}

  /** Shared by both locales, so it lives on the review. */
  private readonly reviewListSelect = {
    id: true,
    verdictCode: true,
    countryCodes: true,
    verdict: { select: { code: true, labels: true } },
    claim: { select: { text: true, claimantName: true, claimedAt: true } },
    topics: {
      select: {
        topic: { select: { slug: true, labels: true } },
      },
    },
    _count: { select: { evidence: true, comments: true } },
  } satisfies Prisma.FactCheckSelect;

  private readonly bylineSelect = {
    id: true,
    firstName: true,
    lastName: true,
    avatar: true,
  } satisfies Prisma.UserSelect;

  // ---------------------------------------------------------------------
  // READS
  // ---------------------------------------------------------------------

  /**
   * Paginated list of articles in one locale.
   *
   * Deliberately a lighter projection than `findOne`: no body, no evidence
   * rows, no appearances. An index page that loads every citation for every
   * result is the obvious way to make this endpoint slow.
   */
  async findAll(filterDto: FactCheckFilterDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      locale = LOCALE.AR,
      status,
      verdict,
      topic,
      country,
      search,
      tags,
      authorId,
      isFeatured,
      startDate,
      endDate,
    } = filterDto;

    const where: Prisma.FactCheckArticleWhereInput = {
      localeCode: locale,
      // Public callers see published work only. An explicit status filter is
      // for admin surfaces, which are role-guarded at the controller.
      statusCode: status ?? CONTENT_STATUS.PUBLISHED,
    };

    if (authorId) where.authorId = authorId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) where.publishedAt.gte = new Date(startDate);
      if (endDate) where.publishedAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        {
          factCheck: {
            claim: { text: { contains: search, mode: 'insensitive' } },
          },
        },
      ];
    }

    // Verdict, topic, country and tags are properties of the review.
    const review: Prisma.FactCheckWhereInput = {};
    if (verdict) review.verdictCode = verdict;
    if (topic) review.topics = { some: { topic: { slug: topic } } };
    if (country) review.countryCodes = { has: country };
    if (tags?.length) review.tags = { hasSome: tags };
    if (Object.keys(review).length > 0) where.factCheck = review;

    const [articles, total] = await Promise.all([
      this.prisma.factCheckArticle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          localeCode: true,
          slug: true,
          title: true,
          summary: true,
          featuredImage: true,
          isFeatured: true,
          statusCode: true,
          publishedAt: true,
          views: true,
          shares: true,
          author: { select: this.bylineSelect },
          factCheck: { select: this.reviewListSelect },
        },
      }),
      this.prisma.factCheckArticle.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // The flat shape TransformInterceptor detects as paginated. All four of
    // data/total/page/limit must be present or `meta` silently disappears.
    return {
      data: articles.map((a) => this.shapeListItem(a, locale)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  /**
   * One article in full: the claim and where it appeared, the ordered
   * evidence, the byline and editor, and any public corrections.
   */
  async findOne(locale: LocaleCode, slug: string, incrementView = true) {
    const article = await this.prisma.factCheckArticle.findUnique({
      where: { localeCode_slug: { localeCode: locale, slug } },
      select: {
        id: true,
        localeCode: true,
        slug: true,
        title: true,
        summary: true,
        body: true,
        methodology: true,
        statusCode: true,
        publishedAt: true,
        reviewedAt: true,
        metaTitle: true,
        metaDescription: true,
        featuredImage: true,
        views: true,
        shares: true,
        author: { select: this.bylineSelect },
        editor: { select: this.bylineSelect },
        factCheck: {
          select: {
            id: true,
            verdictCode: true,
            countryCodes: true,
            tags: true,
            verdict: {
              select: {
                code: true,
                labels: true,
                descriptions: true,
              },
            },
            claim: {
              select: {
                text: true,
                languageCode: true,
                claimantName: true,
                claimedAt: true,
                firstSeenAt: true,
                appearances: {
                  orderBy: { appearedAt: 'asc' },
                  select: {
                    url: true,
                    platform: true,
                    publisher: true,
                    appearedAt: true,
                    archiveUrl: true,
                    archivedAt: true,
                    mediaUrls: true,
                  },
                },
              },
            },
            evidence: {
              orderBy: { position: 'asc' },
              // NOTE: `note` is deliberately absent — internal analyst note.
              select: {
                position: true,
                typeCode: true,
                url: true,
                title: true,
                publisher: true,
                publishedAt: true,
                accessedAt: true,
                archiveUrl: true,
                archivedAt: true,
                excerpt: true,
              },
            },
            topics: {
              select: {
                topic: { select: { slug: true, labels: true } },
              },
            },
            // Powers the language switcher.
            articles: {
              select: { localeCode: true, slug: true, statusCode: true },
            },
            _count: { select: { comments: true } },
          },
        },
        revisions: {
          // Only disclosed revisions are public; SILENT ones are internal.
          where: { tierCode: { not: REVISION_TIER.SILENT } },
          orderBy: { revisionNumber: 'desc' },
          // NOTE: `reason` is deliberately absent — internal.
          select: {
            revisionNumber: true,
            tierCode: true,
            noticeText: true,
            verdictAtTimeCode: true,
            createdAt: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Fact check not found');
    }

    if (incrementView) {
      await this.prisma.factCheckArticle.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
      });
    }

    const { factCheck, revisions, ...rest } = article;
    const { topics, articles, verdict, ...review } = factCheck;

    return {
      ...rest,
      isRetracted: article.statusCode === CONTENT_STATUS.RETRACTED,
      factCheck: {
        ...review,
        verdict: this.localize(verdict, locale),
        topics: topics.map((t) => this.localize(t.topic, locale)),
      },
      // Sibling locales that are actually published — a draft translation
      // must not appear in the language switcher.
      availableLocales: articles
        .filter(
          (a) =>
            a.localeCode !== article.localeCode &&
            a.statusCode === CONTENT_STATUS.PUBLISHED,
        )
        .map((a) => ({ locale: a.localeCode, slug: a.slug })),
      corrections: revisions,
    };
  }

  /** Same locale, published, sharing a topic or the verdict. */
  async getRelated(locale: LocaleCode, slug: string, limit?: number) {
    // `enableImplicitConversion` turns a missing numeric query param into NaN,
    // which slips past a parameter default and reaches Prisma as `take: NaN`.
    const take = Number.isFinite(Number(limit)) ? Number(limit) : 5;
    const article = await this.prisma.factCheckArticle.findUnique({
      where: { localeCode_slug: { localeCode: locale, slug } },
      select: {
        factCheck: {
          select: {
            verdictCode: true,
            tags: true,
            topics: { select: { topicId: true } },
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Fact check not found');
    }

    const topicIds = article.factCheck.topics.map((t) => t.topicId);

    const related = await this.prisma.factCheckArticle.findMany({
      where: {
        localeCode: locale,
        statusCode: CONTENT_STATUS.PUBLISHED,
        slug: { not: slug },
        factCheck: {
          OR: [
            ...(topicIds.length
              ? [{ topics: { some: { topicId: { in: topicIds } } } }]
              : []),
            { verdictCode: article.factCheck.verdictCode },
            ...(article.factCheck.tags.length
              ? [{ tags: { hasSome: article.factCheck.tags } }]
              : []),
          ],
        },
      },
      take,
      orderBy: { views: 'desc' },
      select: {
        localeCode: true,
        slug: true,
        title: true,
        summary: true,
        featuredImage: true,
        publishedAt: true,
        factCheck: {
          select: {
            verdictCode: true,
            verdict: { select: { code: true, labels: true } },
          },
        },
      },
    });

    return related.map((r) => ({
      ...r,
      factCheck: {
        ...r.factCheck,
        verdict: this.localize(r.factCheck.verdict, locale),
      },
    }));
  }

  async getStats(locale: LocaleCode = LOCALE.AR) {
    const publishedInLocale: Prisma.FactCheckWhereInput = {
      articles: {
        some: { localeCode: locale, statusCode: CONTENT_STATUS.PUBLISHED },
      },
    };

    const [total, byVerdict, recentCount] = await Promise.all([
      this.prisma.factCheckArticle.count({
        where: { localeCode: locale, statusCode: CONTENT_STATUS.PUBLISHED },
      }),
      this.prisma.factCheck.groupBy({
        by: ['verdictCode'],
        where: publishedInLocale,
        _count: { _all: true },
      }),
      this.prisma.factCheckArticle.count({
        where: {
          localeCode: locale,
          statusCode: CONTENT_STATUS.PUBLISHED,
          publishedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      total,
      recentCount,
      byVerdict: byVerdict.reduce((acc: Record<string, number>, item) => {
        acc[item.verdictCode] = item._count._all;
        return acc;
      }, {}),
    };
  }

  /** Saving is language-independent, so it is recorded against the review. */
  async toggleSave(locale: LocaleCode, slug: string, userId: string) {
    const article = await this.prisma.factCheckArticle.findUnique({
      where: { localeCode_slug: { localeCode: locale, slug } },
      select: { factCheckId: true },
    });

    if (!article) {
      throw new NotFoundException('Fact check not found');
    }

    const existing = await this.prisma.savedContent.findUnique({
      where: {
        userId_factCheckId: { userId, factCheckId: article.factCheckId },
      },
    });

    if (existing) {
      await this.prisma.savedContent.delete({ where: { id: existing.id } });
      return { saved: false, message: 'Fact check removed from saved items' };
    }

    await this.prisma.savedContent.create({
      data: { userId, factCheckId: article.factCheckId },
    });
    return { saved: true, message: 'Fact check saved successfully' };
  }

  // ---------------------------------------------------------------------
  // WRITES — Phase 3
  //
  // Deliberately not implemented rather than half-implemented. Authoring now
  // spans Claim, FactCheck, per-locale articles, ordered evidence and the
  // append-only revision log, and ADR-0006 puts hard invariants on it:
  // publishing writes revision 1, every later edit writes a revision, an
  // editor distinct from the author must sign off, and a verdict change
  // propagates a correction to every published locale.
  //
  // A write path that silently skipped those would corrupt the editorial
  // record in ways that are not recoverable after the fact — which is the one
  // failure this whole model exists to prevent.
  // ---------------------------------------------------------------------

  private notYet(): never {
    throw new NotImplementedException(
      'Authoring moved to the Claim/FactCheck/Article model and is implemented ' +
        'in Phase 3, together with the ADR-0006 revision invariants. ' +
        'See docs/plans/content-model-implementation.md.',
    );
  }

  async create(_userId: string, _createDto: CreateFactCheckDto) {
    this.notYet();
  }

  async update(
    _locale: LocaleCode,
    _slug: string,
    _userId: string,
    _userRole: RoleCode,
    _updateDto: UpdateFactCheckDto,
  ) {
    this.notYet();
  }

  async remove(
    _locale: LocaleCode,
    _slug: string,
    _userId: string,
    _userRole: RoleCode,
  ) {
    // Note: even in Phase 3 this must not hard-delete a published article.
    // Retraction is a status change (ADR-0006).
    this.notYet();
  }

  // ---------------------------------------------------------------------

  /**
   * Collapse a `labels`/`descriptions` map to the requested language.
   *
   * Falls back to Arabic and then to the row's own code, so a partially
   * translated locale degrades rather than rendering blank (ADR-0008). Adding a
   * language changes no code here and no API field.
   */
  private localize(row: any, locale: string) {
    if (!row) return row;
    const { labels, descriptions, ...rest } = row;
    const out: Record<string, unknown> = {
      ...rest,
      label: resolveLocalized(labels, locale, rest.code ?? rest.slug ?? ''),
    };
    if (descriptions !== undefined) {
      out.definition = resolveLocalized(descriptions, locale);
    }
    return out;
  }

  private shapeListItem(article: any, locale: string) {
    const { factCheck, ...rest } = article;
    const { topics, verdict, ...review } = factCheck;
    return {
      ...rest,
      factCheck: {
        ...review,
        verdict: this.localize(verdict, locale),
        topics: topics.map((t: any) => this.localize(t.topic, locale)),
      },
    };
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CONTENT_STATUS,
  ContentStatusCode,
  EVIDENCE_TYPE,
  REVISION_TIER,
  RevisionTierCode,
} from '../../common/constants/lookups';
import { createSlug } from '../../common/utils/slug.util';
import { PrismaService } from '../../database/prisma.service';
import {
  ChangeVerdictDto,
  CreateArticleDto,
  CreateEvidenceDto,
  CreateFactCheckDto,
  ReorderEvidenceDto,
  RetractArticleDto,
  UpdateArticleDto,
  UpdateEvidenceDto,
} from './dto/authoring.dto';

/**
 * THE SINGLE WRITE PATH for the editorial record.
 *
 * Everything that mutates a fact-check goes through here, and every mutation of
 * a PUBLISHED article goes through `writeRevision`. That is not tidiness: the
 * moment a second place can update `factCheckArticle`, the revision history
 * stops being trustworthy, and an untrustworthy history is worse than none —
 * it looks authoritative while being wrong.
 *
 * ADR-0006 invariants enforced here:
 *   1. Revisions are append-only. There is no update or delete path, for anyone.
 *   2. Publishing writes revision 1.
 *   3. Every post-publication edit writes a revision.
 *   4. tier != SILENT  =>  noticeText is required.
 *   5. A verdict change needs a second person: approver != the analyst.
 *   6. A verdict change propagates a revision to EVERY published locale.
 *
 * Plus the ADR-0002 editorial gate: an article cannot be published without an
 * editor, and the editor cannot be its author.
 */
@Injectable()
export class FactChecksAuthoringService {
  constructor(private prisma: PrismaService) {}

  /**
   * Legal article lifecycle. Publishing deliberately requires passing through
   * UNDER_REVIEW — editorial review is a distinct step, not a flag flipped on
   * the way out (ADR-0002).
   */
  private static readonly TRANSITIONS: Record<string, string[]> = {
    [CONTENT_STATUS.DRAFT]: [CONTENT_STATUS.UNDER_REVIEW],
    [CONTENT_STATUS.UNDER_REVIEW]: [
      CONTENT_STATUS.PUBLISHED,
      CONTENT_STATUS.DRAFT, // sent back for more work
    ],
    [CONTENT_STATUS.PUBLISHED]: [
      CONTENT_STATUS.RETRACTED,
      CONTENT_STATUS.ARCHIVED,
    ],
    [CONTENT_STATUS.ARCHIVED]: [CONTENT_STATUS.PUBLISHED],
    // RETRACTED is terminal. A retraction is a public statement; quietly
    // un-retracting would defeat the point.
    [CONTENT_STATUS.RETRACTED]: [],
  };

  private assertTransition(from: string, to: string) {
    const allowed = FactChecksAuthoringService.TRANSITIONS[from] ?? [];
    if (!allowed.includes(to)) {
      throw new BadRequestException(
        `Illegal transition ${from} -> ${to}. ` +
          (allowed.length
            ? `From ${from} you may go to: ${allowed.join(', ')}.`
            : `${from} is terminal.`),
      );
    }
  }

  // =====================================================================
  // Revisions — the ONLY place ArticleRevision rows are created
  // =====================================================================

  private async writeRevision(
    tx: Prisma.TransactionClient,
    args: {
      articleId: string;
      tierCode: RevisionTierCode;
      editedById: string;
      verdictAtTimeCode: string;
      content: {
        title: string;
        summary: string;
        body: string;
        methodology?: string | null;
      };
      noticeText?: string | null;
      reason?: string | null;
    },
  ) {
    // Invariant 4: anything the public is told about needs the public notice.
    if (args.tierCode !== REVISION_TIER.SILENT && !args.noticeText?.trim()) {
      throw new BadRequestException(
        `A ${args.tierCode} revision requires noticeText — it is what readers ` +
          `are shown. Only SILENT revisions may omit it.`,
      );
    }

    const last = await tx.articleRevision.findFirst({
      where: { articleId: args.articleId },
      orderBy: { revisionNumber: 'desc' },
      select: { revisionNumber: true },
    });

    return tx.articleRevision.create({
      data: {
        articleId: args.articleId,
        revisionNumber: (last?.revisionNumber ?? 0) + 1,
        tierCode: args.tierCode,
        title: args.content.title,
        summary: args.content.summary,
        body: args.content.body,
        methodology: args.content.methodology ?? null,
        verdictAtTimeCode: args.verdictAtTimeCode,
        noticeText: args.noticeText ?? null,
        reason: args.reason ?? null,
        editedById: args.editedById,
      },
    });
  }

  // =====================================================================
  // Creation
  // =====================================================================

  async createFactCheck(userId: string, dto: CreateFactCheckDto) {
    await this.assertVerdictExists(dto.verdictCode);
    const topicIds = await this.resolveTopicIds(dto.topicSlugs);
    await this.assertCountriesExist(dto.countryCodes);

    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.claim.create({
        data: {
          text: dto.claim.text,
          languageCode: dto.claim.languageCode ?? null,
          claimantName: dto.claim.claimantName ?? null,
          claimedAt: dto.claim.claimedAt ? new Date(dto.claim.claimedAt) : null,
          firstSeenAt: dto.claim.firstSeenAt
            ? new Date(dto.claim.firstSeenAt)
            : null,
          appearances: dto.claim.appearances?.length
            ? {
                create: dto.claim.appearances.map((a) => ({
                  url: a.url,
                  platform: a.platform ?? null,
                  publisher: a.publisher ?? null,
                  appearedAt: a.appearedAt ? new Date(a.appearedAt) : null,
                  archiveUrl: a.archiveUrl ?? null,
                  archivedAt: a.archivedAt ? new Date(a.archivedAt) : null,
                  mediaUrls: a.mediaUrls ?? [],
                })),
              }
            : undefined,
        },
      });

      const factCheck = await tx.factCheck.create({
        data: {
          claimId: claim.id,
          verdictCode: dto.verdictCode,
          countryCodes: dto.countryCodes ?? [],
          tags: dto.tags ?? [],
          submissionId: dto.submissionId ?? null,
          topics: topicIds.length
            ? { create: topicIds.map((topicId) => ({ topicId })) }
            : undefined,
        },
      });

      const article = await this.insertArticle(
        tx,
        factCheck.id,
        userId,
        dto.article,
      );

      return { factCheckId: factCheck.id, article };
    });
  }

  /** Adds a sibling article in another locale. Starts as a DRAFT of its own. */
  async addTranslation(
    factCheckId: string,
    userId: string,
    dto: CreateArticleDto,
  ) {
    const factCheck = await this.prisma.factCheck.findUnique({
      where: { id: factCheckId },
      select: { id: true, articles: { select: { localeCode: true } } },
    });
    if (!factCheck) throw new NotFoundException('Fact check not found');

    if (factCheck.articles.some((a) => a.localeCode === dto.localeCode)) {
      throw new BadRequestException(
        `This fact-check already has a ${dto.localeCode} article. ` +
          `Edit it rather than adding a second one.`,
      );
    }

    return this.prisma.$transaction((tx) =>
      this.insertArticle(tx, factCheckId, userId, dto),
    );
  }

  private async insertArticle(
    tx: Prisma.TransactionClient,
    factCheckId: string,
    authorId: string,
    dto: CreateArticleDto,
  ) {
    const slug = await this.uniqueSlug(tx, dto.localeCode, dto.slug, dto.title);

    // New articles always start as drafts. Publishing is a separate, gated act.
    return tx.factCheckArticle.create({
      data: {
        factCheckId,
        localeCode: dto.localeCode,
        slug,
        title: dto.title,
        summary: dto.summary,
        body: dto.body,
        methodology: dto.methodology ?? null,
        metaTitle: dto.metaTitle ?? null,
        metaDescription: dto.metaDescription ?? null,
        featuredImage: dto.featuredImage ?? null,
        isFeatured: dto.isFeatured ?? false,
        statusCode: CONTENT_STATUS.DRAFT,
        authorId,
      },
    });
  }

  // =====================================================================
  // Editing
  // =====================================================================

  async updateArticle(
    localeCode: string,
    slug: string,
    userId: string,
    dto: UpdateArticleDto,
  ) {
    const article = await this.loadArticle(localeCode, slug);
    const isPublished = article.statusCode === CONTENT_STATUS.PUBLISHED;

    // Invariant 3: once it is public, every edit is on the record.
    if (isPublished && !dto.revision) {
      throw new BadRequestException(
        'This article is published, so an edit must declare a revision ' +
          '{ tierCode, noticeText? }. Use SILENT for a typo or formatting; ' +
          'anything a reader would care about needs a public notice.',
      );
    }
    if (article.statusCode === CONTENT_STATUS.RETRACTED) {
      throw new BadRequestException(
        'A retracted fact-check cannot be edited. Its content is the public ' +
          'record of what was withdrawn.',
      );
    }

    const content = {
      title: dto.title ?? article.title,
      summary: dto.summary ?? article.summary,
      body: dto.body ?? article.body,
      methodology: dto.methodology ?? article.methodology,
    };

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.factCheckArticle.update({
        where: { id: article.id },
        data: {
          ...content,
          metaTitle: dto.metaTitle ?? article.metaTitle,
          metaDescription: dto.metaDescription ?? article.metaDescription,
          featuredImage: dto.featuredImage ?? article.featuredImage,
          isFeatured: dto.isFeatured ?? article.isFeatured,
        },
      });

      if (isPublished && dto.revision) {
        await this.writeRevision(tx, {
          articleId: article.id,
          tierCode: dto.revision.tierCode as RevisionTierCode,
          editedById: userId,
          verdictAtTimeCode: article.factCheck.verdictCode,
          content,
          noticeText: dto.revision.noticeText,
          reason: dto.revision.reason,
        });
      }

      return updated;
    });
  }

  // =====================================================================
  // Lifecycle
  // =====================================================================

  async submitForReview(localeCode: string, slug: string, userId: string) {
    const article = await this.loadArticle(localeCode, slug);
    this.assertTransition(article.statusCode, CONTENT_STATUS.UNDER_REVIEW);

    if (article.authorId !== userId) {
      throw new ForbiddenException(
        'Only the author can submit their own article for review.',
      );
    }

    return this.prisma.factCheckArticle.update({
      where: { id: article.id },
      data: { statusCode: CONTENT_STATUS.UNDER_REVIEW },
    });
  }

  async sendBackToDraft(localeCode: string, slug: string, editorId: string) {
    const article = await this.loadArticle(localeCode, slug);
    this.assertTransition(article.statusCode, CONTENT_STATUS.DRAFT);

    return this.prisma.factCheckArticle.update({
      where: { id: article.id },
      data: { statusCode: CONTENT_STATUS.DRAFT, editorId },
    });
  }

  /**
   * Publish. The editorial gate lives here.
   *
   * The editor must exist and must NOT be the author: a byline and a sign-off
   * by the same person records nothing, and the transparency the model promises
   * would be decorative (ADR-0002).
   */
  async publish(localeCode: string, slug: string, editorId: string) {
    const article = await this.loadArticle(localeCode, slug);
    this.assertTransition(article.statusCode, CONTENT_STATUS.PUBLISHED);

    if (article.authorId === editorId) {
      throw new ForbiddenException(
        'An article cannot be published by its own author. Editorial review is ' +
          'a distinct step, and recording the same person as byline and ' +
          'sign-off records nothing. Another editor must publish this.',
      );
    }

    const publishedAt = new Date();

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.factCheckArticle.update({
        where: { id: article.id },
        data: {
          statusCode: CONTENT_STATUS.PUBLISHED,
          editorId,
          reviewedAt: publishedAt,
          publishedAt: article.publishedAt ?? publishedAt,
        },
      });

      // Invariant 2: publication is revision 1. SILENT because first
      // publication is not a disclosure event — there is nothing to correct yet.
      await this.writeRevision(tx, {
        articleId: article.id,
        tierCode: REVISION_TIER.SILENT,
        editedById: editorId,
        verdictAtTimeCode: article.factCheck.verdictCode,
        content: {
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
        },
      });

      return updated;
    });
  }

  /** Withdraw a published fact-check. Never a delete — the URL is preserved. */
  async retract(
    localeCode: string,
    slug: string,
    userId: string,
    dto: RetractArticleDto,
  ) {
    const article = await this.loadArticle(localeCode, slug);
    this.assertTransition(article.statusCode, CONTENT_STATUS.RETRACTED);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.factCheckArticle.update({
        where: { id: article.id },
        data: { statusCode: CONTENT_STATUS.RETRACTED },
      });

      await this.writeRevision(tx, {
        articleId: article.id,
        tierCode: REVISION_TIER.CORRECTION,
        editedById: userId,
        verdictAtTimeCode: article.factCheck.verdictCode,
        content: {
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
        },
        noticeText: dto.noticeText,
        reason: dto.reason,
      });

      return updated;
    });
  }

  async archive(localeCode: string, slug: string) {
    const article = await this.loadArticle(localeCode, slug);
    this.assertTransition(article.statusCode, CONTENT_STATUS.ARCHIVED);

    return this.prisma.factCheckArticle.update({
      where: { id: article.id },
      data: { statusCode: CONTENT_STATUS.ARCHIVED },
    });
  }

  // =====================================================================
  // Verdict change — needs two people, and touches every locale
  // =====================================================================

  async changeVerdict(
    factCheckId: string,
    approverId: string,
    dto: ChangeVerdictDto,
  ) {
    // Invariant 5: the person who determined the change cannot also approve it.
    if (dto.changedById === approverId) {
      throw new ForbiddenException(
        'A verdict change needs two people: the analyst who determined it and ' +
          'an editor who approves it. You cannot approve your own change.',
      );
    }

    const [factCheck, changedBy] = await Promise.all([
      this.prisma.factCheck.findUnique({
        where: { id: factCheckId },
        select: {
          id: true,
          verdictCode: true,
          articles: {
            select: {
              id: true,
              statusCode: true,
              title: true,
              summary: true,
              body: true,
              methodology: true,
              localeCode: true,
            },
          },
        },
      }),
      this.prisma.user.findUnique({
        where: { id: dto.changedById },
        select: { id: true },
      }),
    ]);

    if (!factCheck) throw new NotFoundException('Fact check not found');
    if (!changedBy) {
      throw new BadRequestException(
        `changedById "${dto.changedById}" is not a known user.`,
      );
    }
    await this.assertVerdictExists(dto.toVerdictCode);

    if (factCheck.verdictCode === dto.toVerdictCode) {
      throw new BadRequestException(
        `The verdict is already ${dto.toVerdictCode}.`,
      );
    }

    const fromVerdictCode = factCheck.verdictCode;
    const published = factCheck.articles.filter(
      (a) => a.statusCode === CONTENT_STATUS.PUBLISHED,
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.verdictChange.create({
        data: {
          factCheckId: factCheck.id,
          fromVerdictCode,
          toVerdictCode: dto.toVerdictCode,
          reason: dto.reason,
          changedById: dto.changedById,
          approvedById: approverId,
        },
      });

      await tx.factCheck.update({
        where: { id: factCheck.id },
        data: { verdictCode: dto.toVerdictCode },
      });

      // Invariant 6: EVERY published locale gets the notice. A verdict
      // corrected in Arabic but silently left in English is the worst outcome
      // this model can produce.
      for (const article of published) {
        await this.writeRevision(tx, {
          articleId: article.id,
          tierCode: REVISION_TIER.VERDICT_CHANGE,
          editedById: approverId,
          verdictAtTimeCode: dto.toVerdictCode,
          content: {
            title: article.title,
            summary: article.summary,
            body: article.body,
            methodology: article.methodology,
          },
          noticeText: `Verdict changed from ${fromVerdictCode} to ${dto.toVerdictCode}. ${dto.reason}`,
          reason: dto.reason,
        });
      }

      return {
        factCheckId: factCheck.id,
        fromVerdictCode,
        toVerdictCode: dto.toVerdictCode,
        localesNotified: published.map((a) => a.localeCode),
      };
    });
  }

  // =====================================================================
  // Evidence
  // =====================================================================

  async addEvidence(factCheckId: string, dto: CreateEvidenceDto) {
    await this.assertFactCheckExists(factCheckId);

    const count = await this.prisma.evidence.count({ where: { factCheckId } });

    await this.prisma.evidence.create({
      data: {
        factCheckId,
        position: dto.position ?? count,
        typeCode: dto.typeCode ?? EVIDENCE_TYPE.OTHER,
        url: dto.url,
        title: dto.title ?? null,
        publisher: dto.publisher ?? null,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        accessedAt: new Date(dto.accessedAt),
        archiveUrl: dto.archiveUrl ?? null,
        archivedAt: dto.archivedAt ? new Date(dto.archivedAt) : null,
        excerpt: dto.excerpt ?? null,
        note: dto.note ?? null,
      },
    });

    return this.normalizePositions(factCheckId);
  }

  async updateEvidence(id: string, dto: UpdateEvidenceDto) {
    const existing = await this.prisma.evidence.findUnique({
      where: { id },
      select: { id: true, factCheckId: true },
    });
    if (!existing) throw new NotFoundException('Evidence not found');

    await this.prisma.evidence.update({
      where: { id },
      data: {
        ...(dto.url !== undefined ? { url: dto.url } : {}),
        ...(dto.typeCode !== undefined ? { typeCode: dto.typeCode } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.publisher !== undefined ? { publisher: dto.publisher } : {}),
        ...(dto.publishedAt !== undefined
          ? { publishedAt: new Date(dto.publishedAt) }
          : {}),
        ...(dto.accessedAt !== undefined
          ? { accessedAt: new Date(dto.accessedAt) }
          : {}),
        ...(dto.archiveUrl !== undefined ? { archiveUrl: dto.archiveUrl } : {}),
        ...(dto.archivedAt !== undefined
          ? { archivedAt: new Date(dto.archivedAt) }
          : {}),
        ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
      },
    });

    return this.normalizePositions(existing.factCheckId);
  }

  async removeEvidence(id: string) {
    const existing = await this.prisma.evidence.findUnique({
      where: { id },
      select: { factCheckId: true },
    });
    if (!existing) throw new NotFoundException('Evidence not found');

    await this.prisma.evidence.delete({ where: { id } });
    return this.normalizePositions(existing.factCheckId);
  }

  async reorderEvidence(factCheckId: string, dto: ReorderEvidenceDto) {
    const rows = await this.prisma.evidence.findMany({
      where: { factCheckId },
      select: { id: true },
    });
    const known = new Set(rows.map((r) => r.id));

    const unknown = dto.orderedIds.filter((id) => !known.has(id));
    if (unknown.length) {
      throw new BadRequestException(
        `These evidence ids do not belong to this fact-check: ${unknown.join(', ')}`,
      );
    }
    if (dto.orderedIds.length !== rows.length) {
      throw new BadRequestException(
        `Reordering must list every evidence row: got ${dto.orderedIds.length}, expected ${rows.length}.`,
      );
    }

    await this.prisma.$transaction(
      dto.orderedIds.map((id, position) =>
        this.prisma.evidence.update({ where: { id }, data: { position } }),
      ),
    );

    return this.listEvidence(factCheckId);
  }

  /** Keeps positions contiguous from 0, as ADR-0005 requires. */
  private async normalizePositions(factCheckId: string) {
    const rows = await this.prisma.evidence.findMany({
      where: { factCheckId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, position: true },
    });

    const moved = rows
      .map((r, i) => ({ id: r.id, position: i, changed: r.position !== i }))
      .filter((r) => r.changed);

    if (moved.length) {
      await this.prisma.$transaction(
        moved.map((r) =>
          this.prisma.evidence.update({
            where: { id: r.id },
            data: { position: r.position },
          }),
        ),
      );
    }

    return this.listEvidence(factCheckId);
  }

  private listEvidence(factCheckId: string) {
    return this.prisma.evidence.findMany({
      where: { factCheckId },
      orderBy: { position: 'asc' },
    });
  }

  // =====================================================================
  // Helpers
  // =====================================================================

  private async loadArticle(localeCode: string, slug: string) {
    const article = await this.prisma.factCheckArticle.findUnique({
      where: { localeCode_slug: { localeCode, slug } },
      select: {
        id: true,
        statusCode: true,
        authorId: true,
        editorId: true,
        title: true,
        summary: true,
        body: true,
        methodology: true,
        metaTitle: true,
        metaDescription: true,
        featuredImage: true,
        isFeatured: true,
        publishedAt: true,
        factCheck: { select: { id: true, verdictCode: true } },
      },
    });
    if (!article) throw new NotFoundException('Fact check not found');
    return article as typeof article & { statusCode: ContentStatusCode };
  }

  private async uniqueSlug(
    tx: Prisma.TransactionClient,
    localeCode: string,
    provided: string | undefined,
    title: string,
  ) {
    const base = provided?.trim()
      ? createSlug(provided, false)
      : createSlug(title, false);

    // Slugs are unique WITHIN a locale, so only that locale is checked.
    const clash = await tx.factCheckArticle.findUnique({
      where: { localeCode_slug: { localeCode, slug: base } },
      select: { id: true },
    });
    return clash ? createSlug(base) : base;
  }

  private async assertVerdictExists(code: string) {
    const found = await this.prisma.veracityRating.findUnique({
      where: { code },
      select: { code: true },
    });
    if (!found) {
      throw new BadRequestException(`Unknown verdict "${code}".`);
    }
  }

  private async assertFactCheckExists(id: string) {
    const found = await this.prisma.factCheck.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!found) throw new NotFoundException('Fact check not found');
  }

  /** Validates country codes against the ISO reference table (ADR-0007). */
  private async assertCountriesExist(codes?: string[]) {
    if (!codes?.length) return;
    const found = await this.prisma.country.findMany({
      where: { code: { in: codes } },
      select: { code: true },
    });
    const known = new Set(found.map((c) => c.code));
    const unknown = codes.filter((c) => !known.has(c));
    if (unknown.length) {
      throw new BadRequestException(
        `Unknown country code(s): ${unknown.join(', ')}. Expected ISO 3166-1 alpha-2.`,
      );
    }
  }

  private async resolveTopicIds(slugs?: string[]) {
    if (!slugs?.length) return [];
    const topics = await this.prisma.topic.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true, isActive: true },
    });
    const bySlug = new Map(topics.map((t) => [t.slug, t]));

    const unknown = slugs.filter((s) => !bySlug.has(s));
    if (unknown.length) {
      throw new BadRequestException(
        `Unknown topic slug(s): ${unknown.join(', ')}.`,
      );
    }
    const retired = slugs.filter((s) => bySlug.get(s)?.isActive === false);
    if (retired.length) {
      throw new BadRequestException(
        `These topics are retired and cannot be applied to new content: ${retired.join(', ')}.`,
      );
    }
    return topics.map((t) => t.id);
  }
}

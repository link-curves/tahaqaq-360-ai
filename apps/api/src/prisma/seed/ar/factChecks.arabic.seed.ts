import {
  ContentStatus,
  EvidenceType,
  FactCheck,
  Locale,
  PrismaClient,
  RevisionTier,
  Role,
  Topic,
  User,
  VeracityRating,
} from '@prisma/client';
import {
  randomDate,
  randomElement,
  randomInt,
  shuffle,
} from '../helpers/seed.helper';
import {
  arabicClaimTexts,
  arabicFactCheckTitles,
  arabicFirstNames,
  arabicLastNames,
  arabicTags,
} from './data/arabic.data';

/**
 * Seeds the editorial record: Claim -> FactCheck -> FactCheckArticle, with
 * evidence, topics, revisions and corrections. See ADR-0002/0005/0006/0007.
 *
 * Beyond bulk data, this deliberately produces the specific states that the
 * API, admin and public phases need to be developed and tested against —
 * see SPECIAL CASES at the end. Without them those paths get built blind.
 */

/** `status` now lives on the article, so callers that need "is this publicly
 *  visible" get an explicit flag rather than reaching into a field that no
 *  longer exists on FactCheck. */
export type SeededFactCheck = FactCheck & { hasPublishedArticle: boolean };

const VERDICT_AR: Record<VeracityRating, string> = {
  [VeracityRating.TRUE]: 'صحيح',
  [VeracityRating.MOSTLY_TRUE]: 'صحيح في معظمه',
  [VeracityRating.HALF_TRUE]: 'صحيح جزئياً',
  [VeracityRating.MOSTLY_FALSE]: 'خاطئ في معظمه',
  [VeracityRating.FALSE]: 'خاطئ',
  [VeracityRating.UNVERIFIABLE]: 'غير قابل للتحقق',
  [VeracityRating.SATIRE]: 'سخرية',
  [VeracityRating.MISLEADING]: 'مضلل',
};

const PLATFORMS = ['twitter', 'facebook', 'whatsapp', 'tv', 'news', 'other'];
const COUNTRY_POOL = [
  'LB',
  'SY',
  'JO',
  'PS',
  'IQ',
  'EG',
  'SA',
  'AE',
  'YE',
  'MA',
];

const arabicBody = (verdict: VeracityRating) => `# تحليل مفصل

يفحص هذا التحقق الشامل من الحقائق الادعاء من خلال مصادر متعددة وآراء الخبراء.

## مراجعة الأدلة

لقد استشرنا ${randomInt(3, 10)} من الخبراء المتخصصين وراجعنا ${randomInt(10, 50)} مصدراً.

## المنهجية

اتبع تحقيقنا بروتوكولات التحقق القياسية من الحقائق:

1. التحقق من المصادر
2. استشارة الخبراء
3. تحليل البيانات
4. المرجعية المتقاطعة

## الخلاصة

بناءً على الأدلة المتاحة، نصنف هذا الادعاء على أنه ${VERDICT_AR[verdict]}.`;

const englishBody = (verdict: VeracityRating) => `# Detailed analysis

This fact-check examines the claim against multiple sources and expert opinion.

## Evidence review

We consulted ${randomInt(3, 10)} subject-matter experts and reviewed ${randomInt(10, 50)} sources.

## Methodology

Our investigation followed standard fact-checking protocols:

1. Source verification
2. Expert consultation
3. Data analysis
4. Cross-referencing

## Conclusion

Based on the available evidence, we rate this claim **${verdict.replace(/_/g, ' ').toLowerCase()}**.`;

export const seedArabicFactChecks = async (
  prisma: PrismaClient,
  users: Array<User>,
  topics: Topic[],
): Promise<SeededFactCheck[]> => {
  console.log('🌱 البدء في إضافة فحوصات الحقائق بالعربية...');

  const staffRoles: Role[] = [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN];
  const staff = users.filter((u) => staffRoles.includes(u.role));
  // Fall back to any user if the seeded population has no staff, so the seed
  // cannot fail on an empty pick.
  const authorPool = staff.length > 0 ? staff : users;

  /** Editors must differ from authors — the service layer will enforce this
   *  before an article may be published (ADR-0002). */
  const pickEditor = (authorId: string) => {
    const candidates = authorPool.filter((u) => u.id !== authorId);
    return candidates.length > 0 ? randomElement(candidates) : null;
  };

  const results: SeededFactCheck[] = [];
  const TOTAL = 200;

  for (let i = 1; i <= TOTAL; i++) {
    const author = randomElement(authorPool);
    const editor = pickEditor(author.id);
    const verdict = randomElement(Object.values(VeracityRating));

    // ~90% published, remainder still moving through the desk.
    const arStatus =
      i <= 180
        ? ContentStatus.PUBLISHED
        : randomElement([ContentStatus.DRAFT, ContentStatus.UNDER_REVIEW]);
    const publishedAt =
      arStatus === ContentStatus.PUBLISHED
        ? randomDate(new Date(2023, 0, 1), new Date())
        : null;

    // --- the claim, and where it circulated -----------------------------
    const claim = await prisma.claim.create({
      data: {
        text: randomElement(arabicClaimTexts),
        language: Locale.AR,
        claimantName:
          Math.random() > 0.5
            ? `${randomElement(arabicFirstNames)} ${randomElement(arabicLastNames)}`
            : 'مجهول',
        claimedAt: randomDate(new Date(2020, 0, 1), new Date()),
        firstSeenAt: randomDate(new Date(2023, 0, 1), new Date()),
        appearances: {
          create: Array.from({ length: randomInt(1, 3) }, (_, a) => ({
            url: `https://example.com/claim-${i}-appearance-${a + 1}`,
            platform: randomElement(PLATFORMS),
            publisher: Math.random() > 0.5 ? 'مصدر إعلامي' : null,
            appearedAt: randomDate(new Date(2023, 0, 1), new Date()),
            // Most appearances are archived — that snapshot is what survives
            // the original being deleted.
            archiveUrl:
              Math.random() > 0.25
                ? `https://web.archive.org/web/2024/https://example.com/claim-${i}-appearance-${a + 1}`
                : null,
            archivedAt: Math.random() > 0.25 ? new Date() : null,
            mediaUrls:
              Math.random() > 0.7
                ? [`https://example.com/image-ar-${i}.jpg`]
                : [],
          })),
        },
      },
    });

    // --- the review (verdict, region, topics) ---------------------------
    const chosenTopics = shuffle([...topics]).slice(0, randomInt(1, 3));
    const factCheck = await prisma.factCheck.create({
      data: {
        claimId: claim.id,
        verdict,
        countryCodes: shuffle([...COUNTRY_POOL]).slice(0, randomInt(1, 2)),
        tags: shuffle([...arabicTags]).slice(0, randomInt(3, 6)),
        topics: {
          create: chosenTopics.map((t) => ({ topicId: t.id })),
        },
      },
    });

    // --- evidence -------------------------------------------------------
    const evidenceCount = randomInt(2, 5);
    await prisma.evidence.createMany({
      data: Array.from({ length: evidenceCount }, (_, e) => {
        // Every 7th fact-check gets a dead source that survives only as an
        // archive copy, so the public fallback rendering path is exercised
        // from day one rather than discovered in production.
        const isDead = i % 7 === 0 && e === 0;
        return {
          factCheckId: factCheck.id,
          position: e,
          type: randomElement(Object.values(EvidenceType)),
          url: isDead
            ? `https://dead-source.example.com/removed-${i}`
            : `https://example.com/source-${i}-${e + 1}`,
          title: isDead ? 'تقرير مُزال من المصدر الأصلي' : 'مصدر مرجعي',
          publisher: randomElement([
            'وكالة الأنباء',
            'مجلة علمية',
            'تقرير رسمي',
            'منظمة دولية',
          ]),
          publishedAt: randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
          accessedAt: randomDate(new Date(2024, 0, 1), new Date()),
          archiveUrl: isDead
            ? `https://web.archive.org/web/2023/https://dead-source.example.com/removed-${i}`
            : null,
          archivedAt: isDead ? new Date(2023, 5, 1) : null,
          excerpt: 'المقطع الذي استندنا إليه في التحليل.',
          note: isDead
            ? 'المصدر الأصلي حُذف — نعتمد على النسخة المؤرشفة.'
            : null,
        };
      }),
    });

    // --- the Arabic article --------------------------------------------
    const arArticle = await prisma.factCheckArticle.create({
      data: {
        factCheckId: factCheck.id,
        locale: Locale.AR,
        slug: `fact-check-ar-${i}`,
        title: `${randomElement(arabicFactCheckTitles)} - ادعاء رقم ${i}`,
        summary: `بعد التحقيق الدقيق، تم تصنيف هذا الادعاء على أنه ${VERDICT_AR[verdict]}.`,
        body: arabicBody(verdict),
        methodology: 'منهجية التحقق القياسية من الحقائق وفقاً للمعايير الدولية',
        status: arStatus,
        publishedAt,
        authorId: author.id,
        editorId: arStatus === ContentStatus.PUBLISHED ? editor?.id : null,
        reviewedAt: arStatus === ContentStatus.PUBLISHED ? publishedAt : null,
        metaTitle: `تحقق من الحقائق: ادعاء رقم ${i}`,
        metaDescription: `تحقق شامل من الادعاء رقم ${i}`,
        featuredImage: `https://picsum.photos/seed/ar${i}/800/400`,
        isFeatured: i <= 6,
        views: randomInt(100, 10000),
        shares: randomInt(10, 1000),
      },
    });

    // Publishing writes revision 1 (ADR-0006 invariant 2).
    if (arStatus === ContentStatus.PUBLISHED && publishedAt) {
      await prisma.articleRevision.create({
        data: {
          articleId: arArticle.id,
          revisionNumber: 1,
          tier: RevisionTier.SILENT,
          title: arArticle.title,
          summary: arArticle.summary,
          body: arArticle.body,
          methodology: arArticle.methodology,
          verdictAtTime: verdict,
          editedById: author.id,
          createdAt: publishedAt,
        },
      });
    }

    // --- an English sibling for roughly a third ------------------------
    // Independently authored and published: AR and EN are sibling artifacts,
    // not translation rows.
    const wantsEnglish = i % 3 === 0;
    if (wantsEnglish) {
      const enAuthor = randomElement(authorPool);
      const enEditor = pickEditor(enAuthor.id);
      // Every 4th English sibling stays in draft while Arabic is live — the
      // "published in one locale only" case the public site must handle.
      const enStatus =
        i % 12 === 0 ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;
      const enPublishedAt =
        enStatus === ContentStatus.PUBLISHED
          ? randomDate(publishedAt ?? new Date(2023, 0, 1), new Date())
          : null;

      const enArticle = await prisma.factCheckArticle.create({
        data: {
          factCheckId: factCheck.id,
          locale: Locale.EN,
          slug: `fact-check-en-${i}`,
          title: `Fact-check: claim no. ${i}`,
          summary: `After investigation, this claim is rated ${verdict.replace(/_/g, ' ').toLowerCase()}.`,
          body: englishBody(verdict),
          methodology:
            'Standard fact-checking methodology per international norms',
          status: enStatus,
          publishedAt: enPublishedAt,
          authorId: enAuthor.id,
          editorId: enStatus === ContentStatus.PUBLISHED ? enEditor?.id : null,
          reviewedAt: enPublishedAt,
          metaTitle: `Fact-check: claim no. ${i}`,
          metaDescription: `A full review of claim no. ${i}`,
          featuredImage: `https://picsum.photos/seed/en${i}/800/400`,
          views: randomInt(50, 4000),
          shares: randomInt(5, 400),
        },
      });

      if (enStatus === ContentStatus.PUBLISHED && enPublishedAt) {
        await prisma.articleRevision.create({
          data: {
            articleId: enArticle.id,
            revisionNumber: 1,
            tier: RevisionTier.SILENT,
            title: enArticle.title,
            summary: enArticle.summary,
            body: enArticle.body,
            methodology: enArticle.methodology,
            verdictAtTime: verdict,
            editedById: enAuthor.id,
            createdAt: enPublishedAt,
          },
        });
      }
    }

    results.push({
      ...factCheck,
      hasPublishedArticle: arStatus === ContentStatus.PUBLISHED,
    });
  }

  await seedSpecialCases(prisma, authorPool, pickEditor);

  console.log(`✅ تم إنشاء ${results.length} فحص للحقائق (مع مقالات وأدلة)\n`);
  return results;
};

/**
 * SPECIAL CASES — the states every later phase needs to build against.
 *
 * Random bulk data will not reliably produce a correction, a verdict change or
 * a retraction, and those are exactly the flows the admin and public surfaces
 * have to get right. They are created explicitly so they always exist.
 */
const seedSpecialCases = async (
  prisma: PrismaClient,
  authorPool: User[],
  pickEditor: (authorId: string) => User | null,
) => {
  console.log('🌱 إضافة الحالات الخاصة (تصحيح، تغيير تصنيف، سحب)...');

  const author = randomElement(authorPool);
  const editor = pickEditor(author.id);
  const editorId = editor?.id ?? author.id;

  // --- 1. A CORRECTION on a published article -------------------------
  {
    const claim = await prisma.claim.create({
      data: {
        text: 'ادعاء يتطلب تصحيحاً بعد النشر',
        language: Locale.AR,
        claimantName: 'مصدر إعلامي',
        claimedAt: new Date(2024, 2, 1),
      },
    });
    const fc = await prisma.factCheck.create({
      data: {
        claimId: claim.id,
        verdict: VeracityRating.MOSTLY_FALSE,
        countryCodes: ['LB'],
        tags: ['تحقق_من_الحقائق'],
      },
    });
    const publishedAt = new Date(2024, 3, 1);
    const article = await prisma.factCheckArticle.create({
      data: {
        factCheckId: fc.id,
        locale: Locale.AR,
        slug: 'fact-check-ar-with-correction',
        title: 'تحقق يتضمن تصحيحاً منشوراً',
        summary: 'هذا التحقق صدر بشأنه تصحيح بعد النشر.',
        body: '# التحليل\n\nنص التحليل بعد التصحيح.',
        methodology: 'منهجية قياسية',
        status: ContentStatus.PUBLISHED,
        publishedAt,
        authorId: author.id,
        editorId,
        reviewedAt: publishedAt,
      },
    });
    await prisma.articleRevision.createMany({
      data: [
        {
          articleId: article.id,
          revisionNumber: 1,
          tier: RevisionTier.SILENT,
          title: article.title,
          summary: article.summary,
          body: '# التحليل\n\nنص التحليل الأصلي قبل التصحيح.',
          methodology: article.methodology,
          verdictAtTime: VeracityRating.MOSTLY_FALSE,
          editedById: author.id,
          createdAt: publishedAt,
        },
        {
          articleId: article.id,
          revisionNumber: 2,
          tier: RevisionTier.CORRECTION,
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
          verdictAtTime: VeracityRating.MOSTLY_FALSE,
          noticeText:
            'تصحيح: تضمّنت النسخة الأولى رقماً غير دقيق بشأن عدد المصادر، وقد صُحّح.',
          reason: 'خطأ في النسخ من المصدر الأصلي.',
          editedById: editorId,
          createdAt: new Date(2024, 3, 15),
        },
      ],
    });
  }

  // --- 2. A VERDICT CHANGE, propagated to both locales ----------------
  {
    const claim = await prisma.claim.create({
      data: {
        text: 'ادعاء تغيّر تصنيفه بعد ظهور أدلة جديدة',
        language: Locale.AR,
        claimantName: 'حساب على وسائل التواصل',
        claimedAt: new Date(2024, 0, 10),
      },
    });
    const fc = await prisma.factCheck.create({
      data: {
        claimId: claim.id,
        verdict: VeracityRating.TRUE, // the CURRENT verdict, post-change
        countryCodes: ['JO', 'PS'],
        tags: ['تحقق_من_الحقائق'],
      },
    });
    const publishedAt = new Date(2024, 1, 1);
    const changedAt = new Date(2024, 4, 20);

    await prisma.verdictChange.create({
      data: {
        factCheckId: fc.id,
        fromVerdict: VeracityRating.HALF_TRUE,
        toVerdict: VeracityRating.TRUE,
        reason:
          'ظهرت وثائق رسمية جديدة تؤكد الادعاء بالكامل، فتم رفع التصنيف من "صحيح جزئياً" إلى "صحيح".',
        changedById: author.id,
        approvedById: editorId, // must differ from changedById (ADR-0006)
        createdAt: changedAt,
      },
    });

    // Invariant 6: a verdict change writes a CORRECTION-or-higher revision to
    // EVERY published article, in both locales.
    for (const [locale, slug, title] of [
      [Locale.AR, 'fact-check-ar-verdict-changed', 'تحقق تغيّر تصنيفه'],
      [
        Locale.EN,
        'fact-check-en-verdict-changed',
        'Fact-check with a changed verdict',
      ],
    ] as const) {
      const article = await prisma.factCheckArticle.create({
        data: {
          factCheckId: fc.id,
          locale,
          slug,
          title,
          summary:
            locale === Locale.AR
              ? 'تم تعديل تصنيف هذا التحقق بعد النشر.'
              : 'The rating on this fact-check was changed after publication.',
          body:
            locale === Locale.AR
              ? '# التحليل\n\nالتحليل بعد تحديث التصنيف.'
              : '# Analysis\n\nThe analysis following the rating update.',
          methodology:
            locale === Locale.AR ? 'منهجية قياسية' : 'Standard methodology',
          status: ContentStatus.PUBLISHED,
          publishedAt,
          authorId: author.id,
          editorId,
          reviewedAt: publishedAt,
        },
      });
      await prisma.articleRevision.createMany({
        data: [
          {
            articleId: article.id,
            revisionNumber: 1,
            tier: RevisionTier.SILENT,
            title: article.title,
            summary: article.summary,
            body: article.body,
            methodology: article.methodology,
            verdictAtTime: VeracityRating.HALF_TRUE, // the rating at the time
            editedById: author.id,
            createdAt: publishedAt,
          },
          {
            articleId: article.id,
            revisionNumber: 2,
            tier: RevisionTier.VERDICT_CHANGE,
            title: article.title,
            summary: article.summary,
            body: article.body,
            methodology: article.methodology,
            verdictAtTime: VeracityRating.TRUE,
            noticeText:
              locale === Locale.AR
                ? 'تغيير التصنيف: من "صحيح جزئياً" إلى "صحيح" بعد ظهور وثائق رسمية جديدة.'
                : 'Verdict changed from "Half True" to "True" after new official documents emerged.',
            reason: 'أدلة جديدة.',
            editedById: editorId,
            createdAt: changedAt,
          },
        ],
      });
    }
  }

  // --- 3. A RETRACTED fact-check --------------------------------------
  // Keeps its URL and renders a retraction notice. Never deleted (ADR-0006).
  {
    const claim = await prisma.claim.create({
      data: {
        text: 'ادعاء سُحب التحقق الخاص به',
        language: Locale.AR,
        claimantName: 'مجهول',
        claimedAt: new Date(2024, 1, 5),
      },
    });
    const fc = await prisma.factCheck.create({
      data: {
        claimId: claim.id,
        verdict: VeracityRating.UNVERIFIABLE,
        countryCodes: ['SY'],
        tags: ['تحقق_من_الحقائق'],
      },
    });
    const publishedAt = new Date(2024, 2, 10);
    const article = await prisma.factCheckArticle.create({
      data: {
        factCheckId: fc.id,
        locale: Locale.AR,
        slug: 'fact-check-ar-retracted',
        title: 'تحقق مسحوب',
        summary: 'سُحب هذا التحقق.',
        body: '# التحليل\n\nنص التحليل الأصلي.',
        methodology: 'منهجية قياسية',
        status: ContentStatus.RETRACTED,
        publishedAt,
        authorId: author.id,
        editorId,
        reviewedAt: publishedAt,
      },
    });
    await prisma.articleRevision.createMany({
      data: [
        {
          articleId: article.id,
          revisionNumber: 1,
          tier: RevisionTier.SILENT,
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
          verdictAtTime: VeracityRating.UNVERIFIABLE,
          editedById: author.id,
          createdAt: publishedAt,
        },
        {
          articleId: article.id,
          revisionNumber: 2,
          tier: RevisionTier.CORRECTION,
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
          verdictAtTime: VeracityRating.UNVERIFIABLE,
          noticeText:
            'سُحب هذا التحقق لعدم كفاية الأدلة التي استند إليها. نعتذر عن النشر الأولي.',
          reason: 'مراجعة داخلية خلصت إلى أن الأدلة غير كافية.',
          editedById: editorId,
          createdAt: new Date(2024, 3, 2),
        },
      ],
    });
  }

  console.log(
    '✅ الحالات الخاصة جاهزة: تصحيح، تغيير تصنيف (بلغتين)، تحقق مسحوب\n',
  );
};

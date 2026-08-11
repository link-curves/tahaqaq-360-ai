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
  claimTexts,
  factCheckTitles,
  firstNames,
  lastNames,
  tags,
} from '../en/data/english.data';
import {
  randomDate,
  randomElement,
  randomInt,
  shuffle,
} from '../helpers/seed.helper';

/**
 * English-dataset equivalent of the Arabic fact-check seeder.
 *
 * The two seed entry points are independent datasets, not two languages of one
 * dataset — that predates this refactor. The richer edge cases (correction,
 * verdict change, retraction) live in the Arabic seeder, which is the primary
 * dataset for an Arabic-first desk.
 */

/** `status` and `publishedAt` moved to FactCheckArticle, so callers get them
 *  explicitly rather than off a FactCheck field that no longer exists. */
export type SeededFactCheckEn = FactCheck & {
  hasPublishedArticle: boolean;
  publishedAt: Date | null;
};

const PLATFORMS = ['twitter', 'facebook', 'whatsapp', 'tv', 'news', 'other'];
const COUNTRY_POOL = ['US', 'GB', 'FR', 'DE', 'IN', 'EG', 'LB'];

export const seedFactChecks = async (
  prisma: PrismaClient,
  users: Array<User>,
  topics: Topic[],
): Promise<SeededFactCheckEn[]> => {
  console.log('🌱 Starting fact-check seeding...');

  const staffRoles: Role[] = [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN];
  const staff = users.filter((u) => staffRoles.includes(u.role));
  const authorPool = staff.length > 0 ? staff : users;

  const pickEditor = (authorId: string) => {
    const candidates = authorPool.filter((u) => u.id !== authorId);
    return candidates.length > 0 ? randomElement(candidates) : null;
  };

  const results: SeededFactCheckEn[] = [];

  for (let i = 1; i <= 200; i++) {
    const author = randomElement(authorPool);
    const editor = pickEditor(author.id);
    const verdict = randomElement(Object.values(VeracityRating));

    const status =
      i <= 180
        ? ContentStatus.PUBLISHED
        : randomElement([ContentStatus.DRAFT, ContentStatus.UNDER_REVIEW]);
    const publishedAt =
      status === ContentStatus.PUBLISHED
        ? randomDate(new Date(2023, 0, 1), new Date())
        : null;

    const claim = await prisma.claim.create({
      data: {
        text: randomElement(claimTexts),
        language: Locale.EN,
        claimantName:
          Math.random() > 0.5
            ? `${randomElement(firstNames)} ${randomElement(lastNames)}`
            : 'Anonymous',
        claimedAt: randomDate(new Date(2020, 0, 1), new Date()),
        firstSeenAt: randomDate(new Date(2023, 0, 1), new Date()),
        appearances: {
          create: Array.from({ length: randomInt(1, 3) }, (_, a) => ({
            url: `https://example.com/claim-en-${i}-appearance-${a + 1}`,
            platform: randomElement(PLATFORMS),
            appearedAt: randomDate(new Date(2023, 0, 1), new Date()),
            archiveUrl:
              Math.random() > 0.25
                ? `https://web.archive.org/web/2024/https://example.com/claim-en-${i}-appearance-${a + 1}`
                : null,
            archivedAt: Math.random() > 0.25 ? new Date() : null,
            mediaUrls: [],
          })),
        },
      },
    });

    const chosenTopics = shuffle([...topics]).slice(0, randomInt(1, 3));
    const factCheck = await prisma.factCheck.create({
      data: {
        claimId: claim.id,
        verdict,
        countryCodes: shuffle([...COUNTRY_POOL]).slice(0, randomInt(1, 2)),
        tags: shuffle([...tags]).slice(0, randomInt(3, 6)),
        topics: { create: chosenTopics.map((t) => ({ topicId: t.id })) },
      },
    });

    await prisma.evidence.createMany({
      data: Array.from({ length: randomInt(2, 5) }, (_, e) => {
        const isDead = i % 7 === 0 && e === 0;
        return {
          factCheckId: factCheck.id,
          position: e,
          type: randomElement(Object.values(EvidenceType)),
          url: isDead
            ? `https://dead-source.example.com/removed-en-${i}`
            : `https://example.com/source-en-${i}-${e + 1}`,
          title: isDead
            ? 'Report removed from the original source'
            : 'Reference source',
          publisher: randomElement([
            'News Agency',
            'Scientific Journal',
            'Official Report',
            'International Organisation',
          ]),
          publishedAt: randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
          accessedAt: randomDate(new Date(2024, 0, 1), new Date()),
          archiveUrl: isDead
            ? `https://web.archive.org/web/2023/https://dead-source.example.com/removed-en-${i}`
            : null,
          archivedAt: isDead ? new Date(2023, 5, 1) : null,
          excerpt: 'The passage relied on in the analysis.',
          note: isDead
            ? 'Original removed — relying on the archived copy.'
            : null,
        };
      }),
    });

    const article = await prisma.factCheckArticle.create({
      data: {
        factCheckId: factCheck.id,
        locale: Locale.EN,
        slug: `fact-check-${i}`,
        title: `${randomElement(factCheckTitles)} - Claim #${i}`,
        summary: `After thorough investigation, this claim is rated ${verdict.replace(/_/g, ' ').toLowerCase()}.`,
        body: `# Detailed Analysis

This comprehensive fact-check examines the claim through multiple sources and expert opinions.

## Evidence Review

We consulted ${randomInt(3, 10)} subject matter experts and reviewed ${randomInt(10, 50)} sources.

## Conclusion

Based on available evidence, we rate this claim **${verdict.replace(/_/g, ' ').toLowerCase()}**.`,
        methodology:
          'Standard fact-checking methodology following international guidelines',
        status,
        publishedAt,
        authorId: author.id,
        editorId: status === ContentStatus.PUBLISHED ? editor?.id : null,
        reviewedAt: publishedAt,
        metaTitle: `Fact-check: claim #${i}`,
        metaDescription: `A full review of claim #${i}`,
        featuredImage: `https://picsum.photos/seed/en${i}/800/400`,
        isFeatured: i <= 6,
        views: randomInt(100, 10000),
        shares: randomInt(10, 1000),
      },
    });

    if (status === ContentStatus.PUBLISHED && publishedAt) {
      await prisma.articleRevision.create({
        data: {
          articleId: article.id,
          revisionNumber: 1,
          tier: RevisionTier.SILENT,
          title: article.title,
          summary: article.summary,
          body: article.body,
          methodology: article.methodology,
          verdictAtTime: verdict,
          editedById: author.id,
          createdAt: publishedAt,
        },
      });
    }

    results.push({
      ...factCheck,
      hasPublishedArticle: status === ContentStatus.PUBLISHED,
      publishedAt,
    });
  }

  console.log(
    `✅ Created ${results.length} fact-checks (with articles and evidence)\n`,
  );
  return results;
};

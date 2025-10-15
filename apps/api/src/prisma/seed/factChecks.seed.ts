import {
  ContentStatus,
  FactCheck,
  PrismaClient,
  Role,
  User,
  VeracityRating,
} from '@prisma/client';
import {
  categories,
  claimTexts,
  factCheckTitles,
  firstNames,
  lastNames,
  tags,
} from './data/primary.data';
import {
  randomDate,
  randomElement,
  randomInt,
  shuffle,
} from './helpers/seed.helper';

export const seedFactChecks = async (
  prisma: PrismaClient,
  users: Array<User>,
): Promise<FactCheck[]> => {
  console.log('🌱 Starting fact-check seeding...');
  const factChecks = [];
  const moderators = users.filter((u) =>
    [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.USER].includes(u.role),
  );

  for (let i = 1; i <= 200; i++) {
    const author = randomElement(moderators);
    const verdict = randomElement(Object.values(VeracityRating));
    const status =
      i <= 180
        ? ContentStatus.PUBLISHED
        : randomElement([ContentStatus.DRAFT, ContentStatus.UNDER_REVIEW]);

    const factCheck = await prisma.factCheck.create({
      data: {
        title: `${randomElement(factCheckTitles)} - Claim #${i}`,
        slug: `fact-check-${i}-${Date.now()}-${randomInt(1000, 9999)}`,
        claim: randomElement(claimTexts),
        claimant:
          Math.random() > 0.5
            ? `${randomElement(firstNames)} ${randomElement(lastNames)}`
            : 'Anonymous',
        claimDate: randomDate(new Date(2020, 0, 1), new Date()),
        verdict,
        summary: `After thorough investigation, this claim has been rated as ${verdict}. Our analysis shows that the evidence ${verdict === VeracityRating.TRUE ? 'fully supports' : verdict === VeracityRating.FALSE ? 'contradicts' : 'partially supports'} the claim.`,
        fullAnalysis: `# Detailed Analysis\n\nThis comprehensive fact-check examines the claim through multiple sources and expert opinions.\n\n## Evidence Review\n\nWe consulted with ${randomInt(3, 10)} subject matter experts and reviewed ${randomInt(10, 50)} sources.\n\n## Methodology\n\nOur investigation followed standard fact-checking protocols:\n1. Source verification\n2. Expert consultation\n3. Data analysis\n4. Cross-referencing\n\n## Conclusion\n\nBased on available evidence, we rate this claim as ${verdict}.`,
        methodology:
          'Standard fact-checking methodology following international guidelines',
        sources: [
          {
            title: 'Scientific Journal Article',
            url: 'https://example.com/source1',
            type: 'academic',
          },
          {
            title: 'Expert Interview',
            url: 'https://example.com/source2',
            type: 'interview',
          },
          {
            title: 'Official Report',
            url: 'https://example.com/source3',
            type: 'official',
          },
        ],
        mediaUrls:
          Math.random() > 0.7 ? [`https://example.com/image${i}.jpg`] : [],
        tags: shuffle(tags).slice(0, randomInt(3, 6)),
        views: randomInt(100, 10000),
        shares: randomInt(10, 1000),
        status,
        featuredImage: `https://picsum.photos/seed/${i}/800/400`,
        metaTitle: `Fact Check: ${randomElement(factCheckTitles)}`,
        metaDescription: `Comprehensive fact-check of claims regarding ${randomElement(categories).toLowerCase()}`,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? randomDate(new Date(2023, 0, 1), new Date())
            : null,
        authorId: author.id,
      },
    });
    factChecks.push(factCheck);
  }

  console.log(`✅ Created ${factChecks.length} fact checks\n`);

  return factChecks;
};

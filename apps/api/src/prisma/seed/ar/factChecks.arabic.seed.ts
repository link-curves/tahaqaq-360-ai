import {
  ContentStatus,
  FactCheck,
  PrismaClient,
  Role,
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
  arabicCategories,
  arabicClaimTexts,
  arabicFactCheckTitles,
  arabicFirstNames,
  arabicLastNames,
  arabicTags,
} from './data/arabic.data';

export const seedArabicFactChecks = async (
  prisma: PrismaClient,
  users: Array<User>,
): Promise<FactCheck[]> => {
  console.log('🌱 البدء في إضافة فحوصات الحقائق بالعربية...');
  const factChecks = [];
  const moderators = users.filter((u) =>
    [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.USER].includes(u.role),
  );

  const verdictArabic = {
    [VeracityRating.TRUE]: 'صحيح',
    [VeracityRating.MOSTLY_TRUE]: 'صحيح في معظمه',
    [VeracityRating.HALF_TRUE]: 'صحيح جزئياً',
    [VeracityRating.MOSTLY_FALSE]: 'خاطئ في معظمه',
    [VeracityRating.FALSE]: 'خاطئ',
    [VeracityRating.UNVERIFIABLE]: 'غير قابل للتحقق',
    [VeracityRating.SATIRE]: 'سخرية',
    [VeracityRating.MISLEADING]: 'مضلل',
  };

  for (let i = 1; i <= 200; i++) {
    const author = randomElement(moderators);
    const verdict = randomElement(Object.values(VeracityRating));
    const status =
      i <= 180
        ? ContentStatus.PUBLISHED
        : randomElement([ContentStatus.DRAFT, ContentStatus.UNDER_REVIEW]);

    const factCheck = await prisma.factCheck.create({
      data: {
        title: `${randomElement(arabicFactCheckTitles)} - ادعاء رقم ${i}`,
        slug: `fact-check-ar-${i}-${Date.now()}-${randomInt(1000, 9999)}`,
        claim: randomElement(arabicClaimTexts),
        claimant:
          Math.random() > 0.5
            ? `${randomElement(arabicFirstNames)} ${randomElement(arabicLastNames)}`
            : 'مجهول',
        claimDate: randomDate(new Date(2020, 0, 1), new Date()),
        verdict,
        summary: `بعد التحقيق الدقيق، تم تصنيف هذا الادعاء على أنه ${verdictArabic[verdict]}. يظهر تحليلنا أن الأدلة ${verdict === VeracityRating.TRUE ? 'تدعم بالكامل' : verdict === VeracityRating.FALSE ? 'تناقض' : 'تدعم جزئياً'} الادعاء.`,
        fullAnalysis: `# تحليل مفصل

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

بناءً على الأدلة المتاحة، نصنف هذا الادعاء على أنه ${verdictArabic[verdict]}.`,
        methodology: 'منهجية التحقق القياسية من الحقائق وفقاً للمعايير الدولية',
        sources: [
          {
            title: 'مقال في مجلة علمية',
            url: 'https://example.com/source1',
            type: 'academic',
          },
          {
            title: 'مقابلة مع خبير',
            url: 'https://example.com/source2',
            type: 'interview',
          },
          {
            title: 'تقرير رسمي',
            url: 'https://example.com/source3',
            type: 'official',
          },
        ],
        mediaUrls:
          Math.random() > 0.7 ? [`https://example.com/image-ar-${i}.jpg`] : [],
        tags: shuffle(arabicTags).slice(0, randomInt(3, 6)),
        views: randomInt(100, 10000),
        shares: randomInt(10, 1000),
        status,
        featuredImage: `https://picsum.photos/seed/ar${i}/800/400`,
        metaTitle: `تحقق من الحقائق: ${randomElement(arabicFactCheckTitles)}`,
        metaDescription: `تحقق شامل من الادعاءات المتعلقة بـ${randomElement(arabicCategories)}`,
        publishedAt:
          status === ContentStatus.PUBLISHED
            ? randomDate(new Date(2023, 0, 1), new Date())
            : null,
        authorId: author.id,
      },
    });
    factChecks.push(factCheck);
  }

  console.log(`✅ تم إنشاء ${factChecks.length} فحص للحقائق\n`);

  return factChecks;
};

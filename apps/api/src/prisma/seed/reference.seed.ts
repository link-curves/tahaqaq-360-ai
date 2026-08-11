import { PrismaClient } from '@prisma/client';
import { LOOKUP_REGISTRY, LocalizedText } from '../../common/constants/lookups';

/**
 * Reference data: lookup tables, topics and countries.
 *
 * Language-independent, so it is shared by both seed entry points rather than
 * duplicated per language. Labels are `LocalizedText` maps — adding French is
 * adding a key, not a migration (ADR-0008).
 *
 * MUST run before anything else: every other model has a foreign key into the
 * lookup tables, so seeding users before roles fails with a foreign-key
 * violation.
 */

// ---------------------------------------------------------------------------
// TOPICS
//
// Derived from `arabicCategories` in ./ar/data/arabic.data.ts — the vocabulary
// the project already used — rather than invented from scratch.
//
// ⚠️ NEEDS CLIENT SIGN-OFF before fact-checks are classified against it.
// Re-classifying later is an editorial exercise, not a config change.
// The last three are PROPOSED ADDITIONS, not part of the original list.
// ---------------------------------------------------------------------------
export const TOPIC_SEED: Array<{ slug: string; labels: LocalizedText }> = [
  // --- the 15 categories already in use ---
  { slug: 'politics', labels: { ar: 'السياسة', en: 'Politics' } },
  { slug: 'health', labels: { ar: 'الصحة', en: 'Health' } },
  { slug: 'science', labels: { ar: 'العلوم', en: 'Science' } },
  { slug: 'technology', labels: { ar: 'التكنولوجيا', en: 'Technology' } },
  { slug: 'economy', labels: { ar: 'الاقتصاد', en: 'Economy' } },
  { slug: 'environment', labels: { ar: 'البيئة', en: 'Environment' } },
  { slug: 'education', labels: { ar: 'التعليم', en: 'Education' } },
  { slug: 'sports', labels: { ar: 'الرياضة', en: 'Sports' } },
  { slug: 'culture', labels: { ar: 'الثقافة', en: 'Culture' } },
  { slug: 'society', labels: { ar: 'المجتمع', en: 'Society' } },
  {
    slug: 'cybersecurity',
    labels: { ar: 'الأمن السيبراني', en: 'Cybersecurity' },
  },
  {
    slug: 'social-media',
    labels: { ar: 'وسائل التواصل الاجتماعي', en: 'Social Media' },
  },
  { slug: 'media', labels: { ar: 'الإعلام', en: 'Media' } },
  { slug: 'human-rights', labels: { ar: 'حقوق الإنسان', en: 'Human Rights' } },
  {
    slug: 'international-relations',
    labels: { ar: 'العلاقات الدولية', en: 'International Relations' },
  },

  // --- PROPOSED ADDITIONS — client decides ---
  // Heavily-targeted misinformation categories for a MENA desk that the
  // original list does not cover. `religion` already appears in the project's
  // free-text tag list, so it is not a new subject for the platform — but it
  // is editorially sensitive and is explicitly the client's call.
  {
    slug: 'conflict-and-war',
    labels: { ar: 'النزاعات والحروب', en: 'Conflict & War' },
  },
  {
    slug: 'migration-and-refugees',
    labels: { ar: 'الهجرة واللاجئون', en: 'Migration & Refugees' },
  },
  { slug: 'religion', labels: { ar: 'الدين', en: 'Religion' } },
];

// ---------------------------------------------------------------------------
// COUNTRIES — ISO 3166-1 alpha-2
//
// MENA first, then the non-regional countries most likely to appear in
// international claims. Standard reference data, not an editorial list.
// ---------------------------------------------------------------------------
export const COUNTRY_SEED: Array<{ code: string; labels: LocalizedText }> = [
  { code: 'LB', labels: { ar: 'لبنان', en: 'Lebanon' } },
  { code: 'SY', labels: { ar: 'سوريا', en: 'Syria' } },
  { code: 'JO', labels: { ar: 'الأردن', en: 'Jordan' } },
  { code: 'PS', labels: { ar: 'فلسطين', en: 'Palestine' } },
  { code: 'IQ', labels: { ar: 'العراق', en: 'Iraq' } },
  { code: 'EG', labels: { ar: 'مصر', en: 'Egypt' } },
  { code: 'SA', labels: { ar: 'السعودية', en: 'Saudi Arabia' } },
  {
    code: 'AE',
    labels: { ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates' },
  },
  { code: 'QA', labels: { ar: 'قطر', en: 'Qatar' } },
  { code: 'KW', labels: { ar: 'الكويت', en: 'Kuwait' } },
  { code: 'BH', labels: { ar: 'البحرين', en: 'Bahrain' } },
  { code: 'OM', labels: { ar: 'عُمان', en: 'Oman' } },
  { code: 'YE', labels: { ar: 'اليمن', en: 'Yemen' } },
  { code: 'LY', labels: { ar: 'ليبيا', en: 'Libya' } },
  { code: 'TN', labels: { ar: 'تونس', en: 'Tunisia' } },
  { code: 'DZ', labels: { ar: 'الجزائر', en: 'Algeria' } },
  { code: 'MA', labels: { ar: 'المغرب', en: 'Morocco' } },
  { code: 'SD', labels: { ar: 'السودان', en: 'Sudan' } },
  { code: 'MR', labels: { ar: 'موريتانيا', en: 'Mauritania' } },
  { code: 'SO', labels: { ar: 'الصومال', en: 'Somalia' } },
  { code: 'DJ', labels: { ar: 'جيبوتي', en: 'Djibouti' } },
  { code: 'KM', labels: { ar: 'جزر القمر', en: 'Comoros' } },
  { code: 'TR', labels: { ar: 'تركيا', en: 'Türkiye' } },
  { code: 'IR', labels: { ar: 'إيران', en: 'Iran' } },
  { code: 'IL', labels: { ar: 'إسرائيل', en: 'Israel' } },
  { code: 'US', labels: { ar: 'الولايات المتحدة', en: 'United States' } },
  { code: 'GB', labels: { ar: 'المملكة المتحدة', en: 'United Kingdom' } },
  { code: 'FR', labels: { ar: 'فرنسا', en: 'France' } },
  { code: 'DE', labels: { ar: 'ألمانيا', en: 'Germany' } },
  { code: 'RU', labels: { ar: 'روسيا', en: 'Russia' } },
  { code: 'CN', labels: { ar: 'الصين', en: 'China' } },
  { code: 'IN', labels: { ar: 'الهند', en: 'India' } },
];

/**
 * Seeds all lookup tables from LOOKUP_REGISTRY — the same source the
 * application imports, so codes and labels cannot disagree with what the code
 * refers to.
 */
export const seedLookupTables = async (prisma: PrismaClient) => {
  let count = 0;

  for (const entry of LOOKUP_REGISTRY) {
    const delegate = (prisma as any)[entry.model];
    for (const [i, row] of entry.rows.entries()) {
      const data = {
        labels: row.labels,
        descriptions: row.descriptions ?? undefined,
        position: i,
      };
      await delegate.upsert({
        where: { code: row.code },
        update: data,
        create: { code: row.code, ...data },
      });
      count++;
    }
  }

  console.log(
    `✅ جداول القيم المرجعية: ${count} صف عبر ${LOOKUP_REGISTRY.length} جدولاً`,
  );
  return count;
};

export const seedReferenceData = async (prisma: PrismaClient) => {
  console.log('🌱 البدء في إضافة البيانات المرجعية...');

  await seedLookupTables(prisma);

  for (const [i, t] of TOPIC_SEED.entries()) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { labels: t.labels, position: i },
      create: { slug: t.slug, labels: t.labels, position: i },
    });
  }

  for (const c of COUNTRY_SEED) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: { labels: c.labels },
      create: { code: c.code, labels: c.labels },
    });
  }

  const topics = await prisma.topic.findMany({ orderBy: { position: 'asc' } });
  console.log(
    `✅ المواضيع: ${topics.length} | الدول: ${COUNTRY_SEED.length}\n`,
  );

  return topics;
};

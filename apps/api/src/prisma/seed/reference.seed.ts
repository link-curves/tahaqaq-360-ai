import { PrismaClient } from '@prisma/client';
import {
  CONTENT_STATUS_SEED,
  EVENT_STATUS_SEED,
  EVENT_TYPE_SEED,
  EVIDENCE_TYPE_SEED,
  LOCALE_SEED,
  MODERATION_ACTION_SEED,
  NOTIFICATION_TYPE_SEED,
  REVISION_TIER_SEED,
  ROLE_SEED,
  SUBMISSION_STATUS_SEED,
  SUBMISSION_TYPE_SEED,
  VERDICT_SEED,
} from '../../common/constants/lookups';

/**
 * Reference data: topics, countries, and the published rating scale.
 *
 * This is bilingual and language-independent, so it is shared by both the
 * Arabic and English seed entry points rather than duplicated per language.
 *
 * See ADR-0007 (taxonomy) and ADR-0002 (rating definitions).
 */

// ---------------------------------------------------------------------------
// TOPICS
//
// Derived from `arabicCategories` in ./ar/data/arabic.data.ts — i.e. the
// vocabulary the project already used — rather than invented from scratch.
//
// ⚠️ NEEDS CLIENT SIGN-OFF before fact-checks are classified against it.
// Re-classifying later is an editorial exercise, not a config change.
// The last three are PROPOSED ADDITIONS, not part of the original list.
// ---------------------------------------------------------------------------
export const TOPIC_SEED = [
  // --- the 15 categories already in use ---
  { slug: 'politics', labelAr: 'السياسة', labelEn: 'Politics' },
  { slug: 'health', labelAr: 'الصحة', labelEn: 'Health' },
  { slug: 'science', labelAr: 'العلوم', labelEn: 'Science' },
  { slug: 'technology', labelAr: 'التكنولوجيا', labelEn: 'Technology' },
  { slug: 'economy', labelAr: 'الاقتصاد', labelEn: 'Economy' },
  { slug: 'environment', labelAr: 'البيئة', labelEn: 'Environment' },
  { slug: 'education', labelAr: 'التعليم', labelEn: 'Education' },
  { slug: 'sports', labelAr: 'الرياضة', labelEn: 'Sports' },
  { slug: 'culture', labelAr: 'الثقافة', labelEn: 'Culture' },
  { slug: 'society', labelAr: 'المجتمع', labelEn: 'Society' },
  {
    slug: 'cybersecurity',
    labelAr: 'الأمن السيبراني',
    labelEn: 'Cybersecurity',
  },
  {
    slug: 'social-media',
    labelAr: 'وسائل التواصل الاجتماعي',
    labelEn: 'Social Media',
  },
  { slug: 'media', labelAr: 'الإعلام', labelEn: 'Media' },
  { slug: 'human-rights', labelAr: 'حقوق الإنسان', labelEn: 'Human Rights' },
  {
    slug: 'international-relations',
    labelAr: 'العلاقات الدولية',
    labelEn: 'International Relations',
  },

  // --- PROPOSED ADDITIONS — client decides ---
  // Heavily-targeted misinformation categories for a MENA desk that the
  // original list does not cover. `religion` already appears in the project's
  // free-text tag list, so it is not a new subject for the platform — but it
  // is editorially sensitive and is explicitly the client's call.
  {
    slug: 'conflict-and-war',
    labelAr: 'النزاعات والحروب',
    labelEn: 'Conflict & War',
  },
  {
    slug: 'migration-and-refugees',
    labelAr: 'الهجرة واللاجئون',
    labelEn: 'Migration & Refugees',
  },
  { slug: 'religion', labelAr: 'الدين', labelEn: 'Religion' },
];

// ---------------------------------------------------------------------------
// COUNTRIES — ISO 3166-1 alpha-2
//
// MENA first, then the non-regional countries most likely to appear in
// international claims. This is standard reference data, not an editorial
// list; prune or extend it as coverage requires.
// ---------------------------------------------------------------------------
export const COUNTRY_SEED = [
  // MENA
  { code: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon' },
  { code: 'SY', nameAr: 'سوريا', nameEn: 'Syria' },
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan' },
  { code: 'PS', nameAr: 'فلسطين', nameEn: 'Palestine' },
  { code: 'IQ', nameAr: 'العراق', nameEn: 'Iraq' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt' },
  { code: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
  {
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
  },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { code: 'OM', nameAr: 'عُمان', nameEn: 'Oman' },
  { code: 'YE', nameAr: 'اليمن', nameEn: 'Yemen' },
  { code: 'LY', nameAr: 'ليبيا', nameEn: 'Libya' },
  { code: 'TN', nameAr: 'تونس', nameEn: 'Tunisia' },
  { code: 'DZ', nameAr: 'الجزائر', nameEn: 'Algeria' },
  { code: 'MA', nameAr: 'المغرب', nameEn: 'Morocco' },
  { code: 'SD', nameAr: 'السودان', nameEn: 'Sudan' },
  { code: 'MR', nameAr: 'موريتانيا', nameEn: 'Mauritania' },
  { code: 'SO', nameAr: 'الصومال', nameEn: 'Somalia' },
  { code: 'DJ', nameAr: 'جيبوتي', nameEn: 'Djibouti' },
  { code: 'KM', nameAr: 'جزر القمر', nameEn: 'Comoros' },
  { code: 'TR', nameAr: 'تركيا', nameEn: 'Türkiye' },
  { code: 'IR', nameAr: 'إيران', nameEn: 'Iran' },
  { code: 'IL', nameAr: 'إسرائيل', nameEn: 'Israel' },
  // Frequently referenced outside the region
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany' },
  { code: 'RU', nameAr: 'روسيا', nameEn: 'Russia' },
  { code: 'CN', nameAr: 'الصين', nameEn: 'China' },
  { code: 'IN', nameAr: 'الهند', nameEn: 'India' },
];


// ---------------------------------------------------------------------------
// LOOKUP TABLES
//
// Seeded from src/common/constants/lookups.ts so the rows and the TypeScript
// constants cannot disagree. LookupIntegrityService re-checks this at boot.
// ---------------------------------------------------------------------------
export const seedLookupTables = async (prisma: PrismaClient) => {
  const simple = [
    ['role', ROLE_SEED],
    ['contentStatus', CONTENT_STATUS_SEED],
    ['locale', LOCALE_SEED],
    ['submissionStatus', SUBMISSION_STATUS_SEED],
    ['submissionType', SUBMISSION_TYPE_SEED],
    ['evidenceType', EVIDENCE_TYPE_SEED],
    ['revisionTier', REVISION_TIER_SEED],
    ['eventType', EVENT_TYPE_SEED],
    ['eventStatus', EVENT_STATUS_SEED],
    ['notificationType', NOTIFICATION_TYPE_SEED],
    ['moderationAction', MODERATION_ACTION_SEED],
  ] as const;

  let count = 0;
  for (const [model, rows] of simple) {
    for (const row of rows) {
      await (prisma as any)[model].upsert({
        where: { code: row.code },
        update: { name: row.name, description: row.description ?? null },
        create: { code: row.code, name: row.name, description: row.description ?? null },
      });
      count++;
    }
  }

  // VeracityRating carries the published rating scale, so it has its own shape.
  for (const [i, v] of VERDICT_SEED.entries()) {
    await prisma.veracityRating.upsert({
      where: { code: v.code },
      update: {
        labelAr: v.labelAr,
        labelEn: v.labelEn,
        definitionAr: v.definitionAr,
        definitionEn: v.definitionEn,
        position: i,
      },
      create: {
        code: v.code,
        labelAr: v.labelAr,
        labelEn: v.labelEn,
        definitionAr: v.definitionAr,
        definitionEn: v.definitionEn,
        position: i,
      },
    });
    count++;
  }

  console.log(`✅ جداول القيم المرجعية: ${count} صف عبر 12 جدولاً`);
  return count;
};

export const seedReferenceData = async (prisma: PrismaClient) => {
  console.log('🌱 البدء في إضافة البيانات المرجعية...');

  // Lookup tables first — everything else has foreign keys into them.
  await seedLookupTables(prisma);

  for (const [i, t] of TOPIC_SEED.entries()) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { labelAr: t.labelAr, labelEn: t.labelEn, position: i },
      create: { ...t, position: i },
    });
  }

  for (const c of COUNTRY_SEED) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: { nameAr: c.nameAr, nameEn: c.nameEn },
      create: c,
    });
  }

  const topics = await prisma.topic.findMany({ orderBy: { position: 'asc' } });
  console.log(
    `✅ المواضيع: ${topics.length} | الدول: ${COUNTRY_SEED.length}\n`,
  );

  return topics;
};

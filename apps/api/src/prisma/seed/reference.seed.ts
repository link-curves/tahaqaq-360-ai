import { PrismaClient, VeracityRating } from '@prisma/client';

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
// VERDICT DEFINITIONS — the published rating scale
//
// ⚠️ PLACEHOLDER TEXT. IFCN expects an organisation's rating scale to be
// published, and these definitions are a public editorial commitment in the
// client's own voice. The wording below exists so the ratings page renders and
// the shape is testable — it MUST be replaced before launch.
// ---------------------------------------------------------------------------
export const VERDICT_DEFINITION_SEED = [
  {
    verdict: VeracityRating.TRUE,
    labelAr: 'صحيح',
    labelEn: 'True',
    definitionAr: 'الادعاء دقيق ومدعوم بالأدلة المتاحة.',
    definitionEn:
      'The claim is accurate and supported by the available evidence.',
  },
  {
    verdict: VeracityRating.MOSTLY_TRUE,
    labelAr: 'صحيح في معظمه',
    labelEn: 'Mostly True',
    definitionAr: 'الادعاء دقيق في جوهره مع حاجة إلى توضيح أو تفصيل إضافي.',
    definitionEn:
      'The claim is accurate in substance but needs clarification or additional context.',
  },
  {
    verdict: VeracityRating.HALF_TRUE,
    labelAr: 'صحيح جزئياً',
    labelEn: 'Half True',
    definitionAr: 'الادعاء يتضمن عناصر صحيحة وأخرى غير دقيقة.',
    definitionEn: 'The claim contains both accurate and inaccurate elements.',
  },
  {
    verdict: VeracityRating.MOSTLY_FALSE,
    labelAr: 'خاطئ في معظمه',
    labelEn: 'Mostly False',
    definitionAr: 'الادعاء يحتوي على عنصر من الحقيقة لكنه مضلل في جوهره.',
    definitionEn:
      'The claim contains an element of truth but is misleading in substance.',
  },
  {
    verdict: VeracityRating.FALSE,
    labelAr: 'خاطئ',
    labelEn: 'False',
    definitionAr: 'الادعاء غير دقيق وتناقضه الأدلة المتاحة.',
    definitionEn:
      'The claim is inaccurate and contradicted by the available evidence.',
  },
  {
    verdict: VeracityRating.MISLEADING,
    labelAr: 'مضلل',
    labelEn: 'Misleading',
    definitionAr:
      'المعلومات صحيحة في ظاهرها لكنها مقدَّمة بطريقة تقود إلى استنتاج خاطئ.',
    definitionEn:
      'The information is technically accurate but framed so as to lead to a false conclusion.',
  },
  {
    verdict: VeracityRating.SATIRE,
    labelAr: 'سخرية',
    labelEn: 'Satire',
    definitionAr: 'المحتوى ساخر في أصله وليس المقصود منه أن يُفهم على أنه خبر.',
    definitionEn:
      'The content originated as satire and was not intended to be read as news.',
  },
  {
    verdict: VeracityRating.UNVERIFIABLE,
    labelAr: 'غير قابل للتحقق',
    labelEn: 'Unverifiable',
    definitionAr: 'لا تتوفر أدلة كافية لتأكيد الادعاء أو نفيه.',
    definitionEn:
      'There is insufficient evidence available to confirm or refute the claim.',
  },
];

export const seedReferenceData = async (prisma: PrismaClient) => {
  console.log(
    '🌱 البدء في إضافة البيانات المرجعية (المواضيع والدول والتصنيفات)...',
  );

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

  for (const [i, v] of VERDICT_DEFINITION_SEED.entries()) {
    await prisma.verdictDefinition.upsert({
      where: { verdict: v.verdict },
      update: { ...v, position: i },
      create: { ...v, position: i },
    });
  }

  const topics = await prisma.topic.findMany({ orderBy: { position: 'asc' } });
  console.log(
    `✅ المواضيع: ${topics.length} | الدول: ${COUNTRY_SEED.length} | تعريفات التصنيف: ${VERDICT_DEFINITION_SEED.length}\n`,
  );

  return topics;
};

/**
 * Canonical values for the lookup tables that replaced Prisma enums.
 *
 * WHY THIS FILE EXISTS
 * Storing these as rows means values can be added without a schema change, but
 * it also means TypeScript no longer knows them. This file restores compile-time
 * safety and readable call sites (`ROLE.ADMIN` rather than `'ADMIN'`).
 *
 * THE RISK, AND THE MITIGATION
 * This is a second source of truth and can drift from the database. That is
 * mitigated, not ignored: `LookupIntegrityService` checks every code below
 * against the actual rows at startup and refuses to boot on a mismatch. Adding a
 * row in the database that no constant mentions is fine and expected — that is
 * the point of making them dynamic. Referencing a constant that has no row is a
 * bug, and it fails loudly at boot rather than as a foreign-key error in
 * production.
 *
 * This file is also the seed source, so the codes cannot disagree with what gets
 * inserted.
 */

export interface LookupRow {
  code: string;
  name: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Role — USER < MODERATOR < ADMIN < SUPER_ADMIN
// NOTE: RolesGuard matches EXACTLY; it is not a hierarchy. A route must list
// every role that should reach it.
// ---------------------------------------------------------------------------
export const ROLE = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;
export type RoleCode = (typeof ROLE)[keyof typeof ROLE];

export const ROLE_SEED: LookupRow[] = [
  {
    code: ROLE.USER,
    name: 'مستخدم',
    description: 'Registered member of the public',
  },
  {
    code: ROLE.MODERATOR,
    name: 'مشرف',
    description: 'Triages submissions and reviews content',
  },
  {
    code: ROLE.ADMIN,
    name: 'مدير',
    description: 'Administers content and users',
  },
  {
    code: ROLE.SUPER_ADMIN,
    name: 'مدير عام',
    description: 'Full system access',
  },
];

// ---------------------------------------------------------------------------
// VeracityRating — the published rating scale.
// This is the product's core IP and a public editorial commitment. Do not
// collapse, reorder, or add values without a product decision.
// ⚠️ Definition text below is PLACEHOLDER and must be written by the client.
// ---------------------------------------------------------------------------
export const VERDICT = {
  TRUE: 'TRUE',
  MOSTLY_TRUE: 'MOSTLY_TRUE',
  HALF_TRUE: 'HALF_TRUE',
  MOSTLY_FALSE: 'MOSTLY_FALSE',
  FALSE: 'FALSE',
  UNVERIFIABLE: 'UNVERIFIABLE',
  SATIRE: 'SATIRE',
  MISLEADING: 'MISLEADING',
} as const;
export type VerdictCode = (typeof VERDICT)[keyof typeof VERDICT];

export interface VerdictRow {
  code: VerdictCode;
  labelAr: string;
  labelEn: string;
  definitionAr: string;
  definitionEn: string;
}

export const VERDICT_SEED: VerdictRow[] = [
  {
    code: VERDICT.TRUE,
    labelAr: 'صحيح',
    labelEn: 'True',
    definitionAr: 'الادعاء دقيق ومدعوم بالأدلة المتاحة.',
    definitionEn:
      'The claim is accurate and supported by the available evidence.',
  },
  {
    code: VERDICT.MOSTLY_TRUE,
    labelAr: 'صحيح في معظمه',
    labelEn: 'Mostly True',
    definitionAr: 'الادعاء دقيق في جوهره مع حاجة إلى توضيح أو تفصيل إضافي.',
    definitionEn:
      'The claim is accurate in substance but needs clarification or additional context.',
  },
  {
    code: VERDICT.HALF_TRUE,
    labelAr: 'صحيح جزئياً',
    labelEn: 'Half True',
    definitionAr: 'الادعاء يتضمن عناصر صحيحة وأخرى غير دقيقة.',
    definitionEn: 'The claim contains both accurate and inaccurate elements.',
  },
  {
    code: VERDICT.MOSTLY_FALSE,
    labelAr: 'خاطئ في معظمه',
    labelEn: 'Mostly False',
    definitionAr: 'الادعاء يحتوي على عنصر من الحقيقة لكنه مضلل في جوهره.',
    definitionEn:
      'The claim contains an element of truth but is misleading in substance.',
  },
  {
    code: VERDICT.FALSE,
    labelAr: 'خاطئ',
    labelEn: 'False',
    definitionAr: 'الادعاء غير دقيق وتناقضه الأدلة المتاحة.',
    definitionEn:
      'The claim is inaccurate and contradicted by the available evidence.',
  },
  {
    code: VERDICT.MISLEADING,
    labelAr: 'مضلل',
    labelEn: 'Misleading',
    definitionAr:
      'المعلومات صحيحة في ظاهرها لكنها مقدَّمة بطريقة تقود إلى استنتاج خاطئ.',
    definitionEn:
      'The information is technically accurate but framed so as to lead to a false conclusion.',
  },
  {
    code: VERDICT.SATIRE,
    labelAr: 'سخرية',
    labelEn: 'Satire',
    definitionAr: 'المحتوى ساخر في أصله وليس المقصود منه أن يُفهم على أنه خبر.',
    definitionEn:
      'The content originated as satire and was not intended to be read as news.',
  },
  {
    code: VERDICT.UNVERIFIABLE,
    labelAr: 'غير قابل للتحقق',
    labelEn: 'Unverifiable',
    definitionAr: 'لا تتوفر أدلة كافية لتأكيد الادعاء أو نفيه.',
    definitionEn:
      'There is insufficient evidence available to confirm or refute the claim.',
  },
];

// ---------------------------------------------------------------------------
// ContentStatus — DRAFT → UNDER_REVIEW → PUBLISHED → ARCHIVED | RETRACTED
// RETRACTED exists because a published fact-check is never deleted (ADR-0006).
// ---------------------------------------------------------------------------
export const CONTENT_STATUS = {
  DRAFT: 'DRAFT',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  RETRACTED: 'RETRACTED',
} as const;
export type ContentStatusCode =
  (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];

export const CONTENT_STATUS_SEED: LookupRow[] = [
  { code: CONTENT_STATUS.DRAFT, name: 'مسودة', description: 'Being written' },
  {
    code: CONTENT_STATUS.UNDER_REVIEW,
    name: 'قيد المراجعة',
    description: 'Awaiting editorial review',
  },
  {
    code: CONTENT_STATUS.PUBLISHED,
    name: 'منشور',
    description: 'Publicly visible',
  },
  {
    code: CONTENT_STATUS.ARCHIVED,
    name: 'مؤرشف',
    description: 'Withdrawn from listings, still reachable',
  },
  {
    code: CONTENT_STATUS.RETRACTED,
    name: 'مسحوب',
    description:
      'Withdrawn after publication; keeps its URL and shows a retraction notice',
  },
];

// ---------------------------------------------------------------------------
// Locale — Arabic-first. EN is a full sibling artifact, not a translation.
// ---------------------------------------------------------------------------
export const LOCALE = { AR: 'AR', EN: 'EN' } as const;
export type LocaleCode = (typeof LOCALE)[keyof typeof LOCALE];

export const LOCALE_SEED: LookupRow[] = [
  {
    code: LOCALE.AR,
    name: 'العربية',
    description: 'Arabic — primary editorial language',
  },
  { code: LOCALE.EN, name: 'English', description: 'English' },
];

// ---------------------------------------------------------------------------
// Submission lifecycle
// ---------------------------------------------------------------------------
export const SUBMISSION_STATUS = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
} as const;
export type SubmissionStatusCode =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const SUBMISSION_STATUS_SEED: LookupRow[] = [
  { code: SUBMISSION_STATUS.PENDING, name: 'قيد الانتظار' },
  { code: SUBMISSION_STATUS.IN_REVIEW, name: 'قيد المراجعة' },
  { code: SUBMISSION_STATUS.VERIFIED, name: 'تم التحقق' },
  { code: SUBMISSION_STATUS.REJECTED, name: 'مرفوض' },
  { code: SUBMISSION_STATUS.PUBLISHED, name: 'منشور' },
];

export const SUBMISSION_TYPE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  LINK: 'LINK',
} as const;
export type SubmissionTypeCode =
  (typeof SUBMISSION_TYPE)[keyof typeof SUBMISSION_TYPE];

export const SUBMISSION_TYPE_SEED: LookupRow[] = [
  { code: SUBMISSION_TYPE.TEXT, name: 'نص' },
  { code: SUBMISSION_TYPE.IMAGE, name: 'صورة' },
  { code: SUBMISSION_TYPE.VIDEO, name: 'فيديو' },
  { code: SUBMISSION_TYPE.AUDIO, name: 'صوت' },
  { code: SUBMISSION_TYPE.LINK, name: 'رابط' },
];

// ---------------------------------------------------------------------------
// Evidence and revisions (ADR-0005 / ADR-0006)
// ---------------------------------------------------------------------------
export const EVIDENCE_TYPE = {
  PRIMARY_SOURCE: 'PRIMARY_SOURCE',
  OFFICIAL_RECORD: 'OFFICIAL_RECORD',
  EXPERT_STATEMENT: 'EXPERT_STATEMENT',
  MEDIA_REPORT: 'MEDIA_REPORT',
  DATASET: 'DATASET',
  ARCHIVE: 'ARCHIVE',
  OTHER: 'OTHER',
} as const;
export type EvidenceTypeCode =
  (typeof EVIDENCE_TYPE)[keyof typeof EVIDENCE_TYPE];

export const EVIDENCE_TYPE_SEED: LookupRow[] = [
  {
    code: EVIDENCE_TYPE.PRIMARY_SOURCE,
    name: 'مصدر أولي',
    description: 'The document, recording or dataset itself',
  },
  {
    code: EVIDENCE_TYPE.OFFICIAL_RECORD,
    name: 'سجل رسمي',
    description: 'Government, court or regulator',
  },
  {
    code: EVIDENCE_TYPE.EXPERT_STATEMENT,
    name: 'إفادة خبير',
    description: 'Named expert, on record',
  },
  {
    code: EVIDENCE_TYPE.MEDIA_REPORT,
    name: 'تقرير إعلامي',
    description: 'Journalism',
  },
  {
    code: EVIDENCE_TYPE.DATASET,
    name: 'مجموعة بيانات',
    description: 'Statistics',
  },
  {
    code: EVIDENCE_TYPE.ARCHIVE,
    name: 'نسخة مؤرشفة',
    description: 'Snapshot standing in for a dead original',
  },
  { code: EVIDENCE_TYPE.OTHER, name: 'أخرى' },
];

export const REVISION_TIER = {
  SILENT: 'SILENT',
  UPDATE: 'UPDATE',
  CORRECTION: 'CORRECTION',
  VERDICT_CHANGE: 'VERDICT_CHANGE',
} as const;
export type RevisionTierCode =
  (typeof REVISION_TIER)[keyof typeof REVISION_TIER];

export const REVISION_TIER_SEED: LookupRow[] = [
  {
    code: REVISION_TIER.SILENT,
    name: 'تعديل صامت',
    description: 'Typo or formatting — no public notice',
  },
  {
    code: REVISION_TIER.UPDATE,
    name: 'تحديث',
    description: 'New information; verdict unaffected',
  },
  {
    code: REVISION_TIER.CORRECTION,
    name: 'تصحيح',
    description: 'Something published was wrong; verdict holds',
  },
  {
    code: REVISION_TIER.VERDICT_CHANGE,
    name: 'تغيير التصنيف',
    description: 'The rating itself changed; requires a second approver',
  },
];

// ---------------------------------------------------------------------------
// Events, notifications, moderation
// ---------------------------------------------------------------------------
export const EVENT_TYPE = {
  WORKSHOP: 'WORKSHOP',
  WEBINAR: 'WEBINAR',
  EXHIBITION: 'EXHIBITION',
  CONFERENCE: 'CONFERENCE',
  TRAINING: 'TRAINING',
} as const;
export type EventTypeCode = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

export const EVENT_TYPE_SEED: LookupRow[] = [
  { code: EVENT_TYPE.WORKSHOP, name: 'ورشة عمل' },
  { code: EVENT_TYPE.WEBINAR, name: 'ندوة عبر الإنترنت' },
  { code: EVENT_TYPE.EXHIBITION, name: 'معرض' },
  { code: EVENT_TYPE.CONFERENCE, name: 'مؤتمر' },
  { code: EVENT_TYPE.TRAINING, name: 'تدريب' },
];

export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type EventStatusCode = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_STATUS_SEED: LookupRow[] = [
  { code: EVENT_STATUS.UPCOMING, name: 'قادم' },
  { code: EVENT_STATUS.ONGOING, name: 'جارٍ' },
  { code: EVENT_STATUS.COMPLETED, name: 'منتهٍ' },
  { code: EVENT_STATUS.CANCELLED, name: 'ملغى' },
];

export const NOTIFICATION_TYPE = {
  SUBMISSION_UPDATE: 'SUBMISSION_UPDATE',
  EVENT_REMINDER: 'EVENT_REMINDER',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  CERTIFICATE_ISSUED: 'CERTIFICATE_ISSUED',
  SYSTEM: 'SYSTEM',
} as const;
export type NotificationTypeCode =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export const NOTIFICATION_TYPE_SEED: LookupRow[] = [
  { code: NOTIFICATION_TYPE.SUBMISSION_UPDATE, name: 'تحديث طلب' },
  { code: NOTIFICATION_TYPE.EVENT_REMINDER, name: 'تذكير بفعالية' },
  { code: NOTIFICATION_TYPE.ACHIEVEMENT_UNLOCKED, name: 'إنجاز جديد' },
  { code: NOTIFICATION_TYPE.CERTIFICATE_ISSUED, name: 'إصدار شهادة' },
  { code: NOTIFICATION_TYPE.SYSTEM, name: 'إشعار نظام' },
];

export const MODERATION_ACTION = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  FLAG: 'FLAG',
  ESCALATE: 'ESCALATE',
} as const;
export type ModerationActionCode =
  (typeof MODERATION_ACTION)[keyof typeof MODERATION_ACTION];

export const MODERATION_ACTION_SEED: LookupRow[] = [
  { code: MODERATION_ACTION.APPROVE, name: 'موافقة' },
  { code: MODERATION_ACTION.REJECT, name: 'رفض' },
  { code: MODERATION_ACTION.FLAG, name: 'تمييز' },
  { code: MODERATION_ACTION.ESCALATE, name: 'تصعيد' },
];

/**
 * Drives both the seeder and the startup integrity check.
 *
 * `model` is the Prisma delegate name — it must stay in step with the schema.
 */
export const LOOKUP_REGISTRY = [
  { model: 'role', label: 'Role', codes: Object.values(ROLE) as string[] },
  {
    model: 'veracityRating',
    label: 'VeracityRating',
    codes: Object.values(VERDICT) as string[],
  },
  {
    model: 'contentStatus',
    label: 'ContentStatus',
    codes: Object.values(CONTENT_STATUS) as string[],
  },
  {
    model: 'locale',
    label: 'Locale',
    codes: Object.values(LOCALE) as string[],
  },
  {
    model: 'submissionStatus',
    label: 'SubmissionStatus',
    codes: Object.values(SUBMISSION_STATUS) as string[],
  },
  {
    model: 'submissionType',
    label: 'SubmissionType',
    codes: Object.values(SUBMISSION_TYPE) as string[],
  },
  {
    model: 'evidenceType',
    label: 'EvidenceType',
    codes: Object.values(EVIDENCE_TYPE) as string[],
  },
  {
    model: 'revisionTier',
    label: 'RevisionTier',
    codes: Object.values(REVISION_TIER) as string[],
  },
  {
    model: 'eventType',
    label: 'EventType',
    codes: Object.values(EVENT_TYPE) as string[],
  },
  {
    model: 'eventStatus',
    label: 'EventStatus',
    codes: Object.values(EVENT_STATUS) as string[],
  },
  {
    model: 'notificationType',
    label: 'NotificationType',
    codes: Object.values(NOTIFICATION_TYPE) as string[],
  },
  {
    model: 'moderationAction',
    label: 'ModerationAction',
    codes: Object.values(MODERATION_ACTION) as string[],
  },
] as const;

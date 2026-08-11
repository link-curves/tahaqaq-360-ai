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
 * This file is also the seed source, so codes and labels cannot disagree with
 * what gets inserted.
 */

/**
 * A label in every language it exists in, keyed by lowercase locale code:
 * `{ ar: 'صحيح', en: 'True' }`. Adding French is adding a key — no migration,
 * no schema change, no API change (ADR-0008).
 */
export type LocalizedText = Record<string, string>;

export interface LookupRow {
  code: string;
  labels: LocalizedText;
  descriptions?: LocalizedText;
}

/** The editorial default. Arabic-first desk, so Arabic is the fallback. */
export const DEFAULT_LOCALE = 'AR';

/**
 * Resolve a localized map to a single string.
 *
 * Falls back requested -> Arabic -> any present key -> `fallbackKey`, so a
 * partially translated language degrades to Arabic rather than rendering a blank
 * chip, and never throws.
 */
export const resolveLocalized = (
  value: unknown,
  locale: string,
  fallbackKey = '',
): string => {
  if (!value || typeof value !== 'object') return fallbackKey;
  const map = value as LocalizedText;
  const requested = map[locale.toLowerCase()];
  if (typeof requested === 'string' && requested) return requested;
  const fallback = map[DEFAULT_LOCALE.toLowerCase()];
  if (typeof fallback === 'string' && fallback) return fallback;
  const any = Object.values(map).find((v) => typeof v === 'string' && v);
  return any ?? fallbackKey;
};

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
    labels: { ar: 'مستخدم', en: 'User' },
    descriptions: { en: 'Registered member of the public' },
  },
  {
    code: ROLE.MODERATOR,
    labels: { ar: 'مشرف', en: 'Moderator' },
    descriptions: { en: 'Triages submissions and reviews content' },
  },
  {
    code: ROLE.ADMIN,
    labels: { ar: 'مدير', en: 'Administrator' },
    descriptions: { en: 'Administers content and users' },
  },
  {
    code: ROLE.SUPER_ADMIN,
    labels: { ar: 'مدير عام', en: 'Super administrator' },
    descriptions: { en: 'Full system access' },
  },
];

// ---------------------------------------------------------------------------
// VeracityRating — the published rating scale.
// The product's core IP and a public editorial commitment. Do not collapse,
// reorder, or add values without a product decision.
// ⚠️ Definition text is PLACEHOLDER and must be written by the client.
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

export const VERDICT_SEED: LookupRow[] = [
  {
    code: VERDICT.TRUE,
    labels: { ar: 'صحيح', en: 'True' },
    descriptions: {
      ar: 'الادعاء دقيق ومدعوم بالأدلة المتاحة.',
      en: 'The claim is accurate and supported by the available evidence.',
    },
  },
  {
    code: VERDICT.MOSTLY_TRUE,
    labels: { ar: 'صحيح في معظمه', en: 'Mostly True' },
    descriptions: {
      ar: 'الادعاء دقيق في جوهره مع حاجة إلى توضيح أو تفصيل إضافي.',
      en: 'The claim is accurate in substance but needs clarification or additional context.',
    },
  },
  {
    code: VERDICT.HALF_TRUE,
    labels: { ar: 'صحيح جزئياً', en: 'Half True' },
    descriptions: {
      ar: 'الادعاء يتضمن عناصر صحيحة وأخرى غير دقيقة.',
      en: 'The claim contains both accurate and inaccurate elements.',
    },
  },
  {
    code: VERDICT.MOSTLY_FALSE,
    labels: { ar: 'خاطئ في معظمه', en: 'Mostly False' },
    descriptions: {
      ar: 'الادعاء يحتوي على عنصر من الحقيقة لكنه مضلل في جوهره.',
      en: 'The claim contains an element of truth but is misleading in substance.',
    },
  },
  {
    code: VERDICT.FALSE,
    labels: { ar: 'خاطئ', en: 'False' },
    descriptions: {
      ar: 'الادعاء غير دقيق وتناقضه الأدلة المتاحة.',
      en: 'The claim is inaccurate and contradicted by the available evidence.',
    },
  },
  {
    code: VERDICT.MISLEADING,
    labels: { ar: 'مضلل', en: 'Misleading' },
    descriptions: {
      ar: 'المعلومات صحيحة في ظاهرها لكنها مقدَّمة بطريقة تقود إلى استنتاج خاطئ.',
      en: 'The information is technically accurate but framed so as to lead to a false conclusion.',
    },
  },
  {
    code: VERDICT.SATIRE,
    labels: { ar: 'سخرية', en: 'Satire' },
    descriptions: {
      ar: 'المحتوى ساخر في أصله وليس المقصود منه أن يُفهم على أنه خبر.',
      en: 'The content originated as satire and was not intended to be read as news.',
    },
  },
  {
    code: VERDICT.UNVERIFIABLE,
    labels: { ar: 'غير قابل للتحقق', en: 'Unverifiable' },
    descriptions: {
      ar: 'لا تتوفر أدلة كافية لتأكيد الادعاء أو نفيه.',
      en: 'There is insufficient evidence available to confirm or refute the claim.',
    },
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
  { code: CONTENT_STATUS.DRAFT, labels: { ar: 'مسودة', en: 'Draft' } },
  {
    code: CONTENT_STATUS.UNDER_REVIEW,
    labels: { ar: 'قيد المراجعة', en: 'Under review' },
  },
  { code: CONTENT_STATUS.PUBLISHED, labels: { ar: 'منشور', en: 'Published' } },
  { code: CONTENT_STATUS.ARCHIVED, labels: { ar: 'مؤرشف', en: 'Archived' } },
  {
    code: CONTENT_STATUS.RETRACTED,
    labels: { ar: 'مسحوب', en: 'Retracted' },
    descriptions: {
      en: 'Withdrawn after publication; keeps its URL and shows a retraction notice',
    },
  },
];

// ---------------------------------------------------------------------------
// Locale — Arabic-first. EN is a full sibling artifact, not a translation.
// A third language is a row here plus a key in each `labels` map (ADR-0008).
// ---------------------------------------------------------------------------
export const LOCALE = { AR: 'AR', EN: 'EN' } as const;
export type LocaleCode = (typeof LOCALE)[keyof typeof LOCALE];

export const LOCALE_SEED: LookupRow[] = [
  {
    code: LOCALE.AR,
    labels: { ar: 'العربية', en: 'Arabic' },
    descriptions: { en: 'Primary editorial language' },
  },
  { code: LOCALE.EN, labels: { ar: 'الإنجليزية', en: 'English' } },
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
  {
    code: SUBMISSION_STATUS.PENDING,
    labels: { ar: 'قيد الانتظار', en: 'Pending' },
  },
  {
    code: SUBMISSION_STATUS.IN_REVIEW,
    labels: { ar: 'قيد المراجعة', en: 'In review' },
  },
  {
    code: SUBMISSION_STATUS.VERIFIED,
    labels: { ar: 'تم التحقق', en: 'Verified' },
  },
  { code: SUBMISSION_STATUS.REJECTED, labels: { ar: 'مرفوض', en: 'Rejected' } },
  {
    code: SUBMISSION_STATUS.PUBLISHED,
    labels: { ar: 'منشور', en: 'Published' },
  },
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
  { code: SUBMISSION_TYPE.TEXT, labels: { ar: 'نص', en: 'Text' } },
  { code: SUBMISSION_TYPE.IMAGE, labels: { ar: 'صورة', en: 'Image' } },
  { code: SUBMISSION_TYPE.VIDEO, labels: { ar: 'فيديو', en: 'Video' } },
  { code: SUBMISSION_TYPE.AUDIO, labels: { ar: 'صوت', en: 'Audio' } },
  { code: SUBMISSION_TYPE.LINK, labels: { ar: 'رابط', en: 'Link' } },
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
    labels: { ar: 'مصدر أولي', en: 'Primary source' },
    descriptions: { en: 'The document, recording or dataset itself' },
  },
  {
    code: EVIDENCE_TYPE.OFFICIAL_RECORD,
    labels: { ar: 'سجل رسمي', en: 'Official record' },
    descriptions: { en: 'Government, court or regulator' },
  },
  {
    code: EVIDENCE_TYPE.EXPERT_STATEMENT,
    labels: { ar: 'إفادة خبير', en: 'Expert statement' },
    descriptions: { en: 'Named expert, on record' },
  },
  {
    code: EVIDENCE_TYPE.MEDIA_REPORT,
    labels: { ar: 'تقرير إعلامي', en: 'Media report' },
  },
  {
    code: EVIDENCE_TYPE.DATASET,
    labels: { ar: 'مجموعة بيانات', en: 'Dataset' },
  },
  {
    code: EVIDENCE_TYPE.ARCHIVE,
    labels: { ar: 'نسخة مؤرشفة', en: 'Archived copy' },
    descriptions: { en: 'Snapshot standing in for a dead original' },
  },
  { code: EVIDENCE_TYPE.OTHER, labels: { ar: 'أخرى', en: 'Other' } },
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
    labels: { ar: 'تعديل صامت', en: 'Silent edit' },
    descriptions: { en: 'Typo or formatting — no public notice' },
  },
  {
    code: REVISION_TIER.UPDATE,
    labels: { ar: 'تحديث', en: 'Update' },
    descriptions: { en: 'New information; verdict unaffected' },
  },
  {
    code: REVISION_TIER.CORRECTION,
    labels: { ar: 'تصحيح', en: 'Correction' },
    descriptions: { en: 'Something published was wrong; verdict holds' },
  },
  {
    code: REVISION_TIER.VERDICT_CHANGE,
    labels: { ar: 'تغيير التصنيف', en: 'Verdict change' },
    descriptions: {
      en: 'The rating itself changed; requires a second approver',
    },
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
  { code: EVENT_TYPE.WORKSHOP, labels: { ar: 'ورشة عمل', en: 'Workshop' } },
  {
    code: EVENT_TYPE.WEBINAR,
    labels: { ar: 'ندوة عبر الإنترنت', en: 'Webinar' },
  },
  { code: EVENT_TYPE.EXHIBITION, labels: { ar: 'معرض', en: 'Exhibition' } },
  { code: EVENT_TYPE.CONFERENCE, labels: { ar: 'مؤتمر', en: 'Conference' } },
  { code: EVENT_TYPE.TRAINING, labels: { ar: 'تدريب', en: 'Training' } },
];

export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type EventStatusCode = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_STATUS_SEED: LookupRow[] = [
  { code: EVENT_STATUS.UPCOMING, labels: { ar: 'قادم', en: 'Upcoming' } },
  { code: EVENT_STATUS.ONGOING, labels: { ar: 'جارٍ', en: 'Ongoing' } },
  { code: EVENT_STATUS.COMPLETED, labels: { ar: 'منتهٍ', en: 'Completed' } },
  { code: EVENT_STATUS.CANCELLED, labels: { ar: 'ملغى', en: 'Cancelled' } },
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
  {
    code: NOTIFICATION_TYPE.SUBMISSION_UPDATE,
    labels: { ar: 'تحديث طلب', en: 'Submission update' },
  },
  {
    code: NOTIFICATION_TYPE.EVENT_REMINDER,
    labels: { ar: 'تذكير بفعالية', en: 'Event reminder' },
  },
  {
    code: NOTIFICATION_TYPE.ACHIEVEMENT_UNLOCKED,
    labels: { ar: 'إنجاز جديد', en: 'Achievement unlocked' },
  },
  {
    code: NOTIFICATION_TYPE.CERTIFICATE_ISSUED,
    labels: { ar: 'إصدار شهادة', en: 'Certificate issued' },
  },
  {
    code: NOTIFICATION_TYPE.SYSTEM,
    labels: { ar: 'إشعار نظام', en: 'System' },
  },
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
  { code: MODERATION_ACTION.APPROVE, labels: { ar: 'موافقة', en: 'Approve' } },
  { code: MODERATION_ACTION.REJECT, labels: { ar: 'رفض', en: 'Reject' } },
  { code: MODERATION_ACTION.FLAG, labels: { ar: 'تمييز', en: 'Flag' } },
  { code: MODERATION_ACTION.ESCALATE, labels: { ar: 'تصعيد', en: 'Escalate' } },
];

// ---------------------------------------------------------------------------
// Request/registration statuses — previously free-text string columns with the
// allowed values in a trailing comment, which is exactly the pattern the
// lookup tables exist to remove.
// ---------------------------------------------------------------------------
export const EVENT_REGISTRATION_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  ATTENDED: 'ATTENDED',
} as const;
export type EventRegistrationStatusCode =
  (typeof EVENT_REGISTRATION_STATUS)[keyof typeof EVENT_REGISTRATION_STATUS];

export const EVENT_REGISTRATION_STATUS_SEED: LookupRow[] = [
  {
    code: EVENT_REGISTRATION_STATUS.CONFIRMED,
    labels: { ar: 'مؤكد', en: 'Confirmed' },
  },
  {
    code: EVENT_REGISTRATION_STATUS.CANCELLED,
    labels: { ar: 'ملغى', en: 'Cancelled' },
  },
  {
    code: EVENT_REGISTRATION_STATUS.ATTENDED,
    labels: { ar: 'حضر', en: 'Attended' },
  },
];

export const HOST_REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type HostRequestStatusCode =
  (typeof HOST_REQUEST_STATUS)[keyof typeof HOST_REQUEST_STATUS];

export const HOST_REQUEST_STATUS_SEED: LookupRow[] = [
  {
    code: HOST_REQUEST_STATUS.PENDING,
    labels: { ar: 'قيد الانتظار', en: 'Pending' },
  },
  {
    code: HOST_REQUEST_STATUS.APPROVED,
    labels: { ar: 'موافق عليه', en: 'Approved' },
  },
  {
    code: HOST_REQUEST_STATUS.REJECTED,
    labels: { ar: 'مرفوض', en: 'Rejected' },
  },
];

export const TRAINING_REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CONTACTED: 'CONTACTED',
} as const;
export type TrainingRequestStatusCode =
  (typeof TRAINING_REQUEST_STATUS)[keyof typeof TRAINING_REQUEST_STATUS];

export const TRAINING_REQUEST_STATUS_SEED: LookupRow[] = [
  {
    code: TRAINING_REQUEST_STATUS.PENDING,
    labels: { ar: 'قيد الانتظار', en: 'Pending' },
  },
  {
    code: TRAINING_REQUEST_STATUS.APPROVED,
    labels: { ar: 'موافق عليه', en: 'Approved' },
  },
  {
    code: TRAINING_REQUEST_STATUS.REJECTED,
    labels: { ar: 'مرفوض', en: 'Rejected' },
  },
  {
    code: TRAINING_REQUEST_STATUS.CONTACTED,
    labels: { ar: 'تم التواصل', en: 'Contacted' },
  },
];

export const CONTACT_MESSAGE_STATUS = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
} as const;
export type ContactMessageStatusCode =
  (typeof CONTACT_MESSAGE_STATUS)[keyof typeof CONTACT_MESSAGE_STATUS];

export const CONTACT_MESSAGE_STATUS_SEED: LookupRow[] = [
  { code: CONTACT_MESSAGE_STATUS.NEW, labels: { ar: 'جديد', en: 'New' } },
  {
    code: CONTACT_MESSAGE_STATUS.IN_PROGRESS,
    labels: { ar: 'قيد المعالجة', en: 'In progress' },
  },
  {
    code: CONTACT_MESSAGE_STATUS.RESOLVED,
    labels: { ar: 'تم الحل', en: 'Resolved' },
  },
];

/**
 * Drives both the seeder and the startup integrity check.
 *
 * `model` is the Prisma delegate name — it must stay in step with the schema.
 */
export const LOOKUP_REGISTRY = [
  { model: 'role', label: 'Role', rows: ROLE_SEED },
  { model: 'veracityRating', label: 'VeracityRating', rows: VERDICT_SEED },
  { model: 'contentStatus', label: 'ContentStatus', rows: CONTENT_STATUS_SEED },
  { model: 'locale', label: 'Locale', rows: LOCALE_SEED },
  {
    model: 'submissionStatus',
    label: 'SubmissionStatus',
    rows: SUBMISSION_STATUS_SEED,
  },
  {
    model: 'submissionType',
    label: 'SubmissionType',
    rows: SUBMISSION_TYPE_SEED,
  },
  { model: 'evidenceType', label: 'EvidenceType', rows: EVIDENCE_TYPE_SEED },
  { model: 'revisionTier', label: 'RevisionTier', rows: REVISION_TIER_SEED },
  { model: 'eventType', label: 'EventType', rows: EVENT_TYPE_SEED },
  { model: 'eventStatus', label: 'EventStatus', rows: EVENT_STATUS_SEED },
  {
    model: 'notificationType',
    label: 'NotificationType',
    rows: NOTIFICATION_TYPE_SEED,
  },
  {
    model: 'moderationAction',
    label: 'ModerationAction',
    rows: MODERATION_ACTION_SEED,
  },
  {
    model: 'eventRegistrationStatus',
    label: 'EventRegistrationStatus',
    rows: EVENT_REGISTRATION_STATUS_SEED,
  },
  {
    model: 'hostRequestStatus',
    label: 'HostRequestStatus',
    rows: HOST_REQUEST_STATUS_SEED,
  },
  {
    model: 'trainingRequestStatus',
    label: 'TrainingRequestStatus',
    rows: TRAINING_REQUEST_STATUS_SEED,
  },
  {
    model: 'contactMessageStatus',
    label: 'ContactMessageStatus',
    rows: CONTACT_MESSAGE_STATUS_SEED,
  },
] as const;

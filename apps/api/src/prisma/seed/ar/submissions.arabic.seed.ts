import { PrismaClient, Submission, User } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import { arabicClaimTexts, arabicSubmissionContexts } from './data/arabic.data';
import { SubmissionStatusCode, SubmissionTypeCode } from '../../../common/constants/lookups';

export const seedArabicSubmissions = async (
  prisma: PrismaClient,
  users: User[],
): Promise<Submission[]> => {
  console.log('🌱 البدء في إضافة الطلبات بالعربية...');

  const submissions: Submission[] = [];
  const regularUsers = users.filter((u) => u.roleCode === 'USER');
  const statuses: SubmissionStatusCode[] = [
    'PENDING',
    'IN_REVIEW',
    'VERIFIED',
    'REJECTED',
    'PUBLISHED',
  ];
  const types: SubmissionTypeCode[] = ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'LINK'];

  for (let i = 0; i < 250; i++) {
    const user = randomElement(regularUsers);
    const content = randomElement(arabicClaimTexts);
    const status = randomElement(statuses);
    const type = randomElement(types);
    const priority = randomInt(0, 3); // 0=low, 1=medium, 2=high, 3=urgent

    // Create submissions in the past 6 months
    const daysAgo = randomInt(0, 180);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const submission = await prisma.submission.create({
      data: {
        typeCode: type,
        content,
        context: randomElement(arabicSubmissionContexts),
        sourceUrl:
          Math.random() > 0.3
            ? `https://example.com/source/${i + 1}`
            : undefined,
        mediaUrls:
          type === 'IMAGE' || type === 'VIDEO'
            ? [
                `https://picsum.photos/seed/submission-ar-${i + 1}/800/600`,
                ...(Math.random() > 0.7
                  ? [
                      `https://picsum.photos/seed/submission-ar-${i + 1}-2/800/600`,
                    ]
                  : []),
              ]
            : [],
        submitterId: user.id,
        submitterEmail: Math.random() > 0.8 ? user.email : undefined,
        isAnonymous: Math.random() > 0.9,
        statusCode: status,
        priority,
        internalNotes:
          status !== 'PENDING'
            ? `تم المراجعة بواسطة فريق التحقق. ${
                status === 'VERIFIED'
                  ? 'تم التحقق من المحتوى بنجاح.'
                  : status === 'REJECTED'
                    ? 'لا يوجد دليل كافٍ للتحقق.'
                    : status === 'PUBLISHED'
                      ? 'تم النشر كفحص حقائق.'
                      : 'قيد المراجعة المتقدمة.'
              }`
            : undefined,
        reviewedBy:
          status !== 'PENDING'
            ? users.find((u) => u.roleCode === 'MODERATOR' || u.roleCode === 'ADMIN')
                ?.id
            : undefined,
        reviewedAt:
          status !== 'PENDING'
            ? new Date(
                createdAt.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000,
              )
            : undefined,
        rejectionReason:
          status === 'REJECTED'
            ? randomElement([
                'معلومات غير كافية',
                'مصدر غير موثوق',
                'ادعاء غامض',
                'تكرار لطلب سابق',
                'خارج نطاق الخدمة',
              ])
            : undefined,
        createdAt,
        updatedAt:
          status !== 'PENDING'
            ? new Date(
                createdAt.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000,
              )
            : createdAt,
      },
    });

    submissions.push(submission);
  }

  console.log(`✅ تم إنشاء ${submissions.length} طلب\n`);

  return submissions;
};

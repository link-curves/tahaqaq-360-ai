import { Comment, FactCheck, PrismaClient, User } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import { arabicCommentTexts } from './data/arabic.data';

export const seedArabicComments = async (
  prisma: PrismaClient,
  users: User[],
  factChecks: FactCheck[],
): Promise<Comment[]> => {
  console.log('🌱 البدء في إضافة التعليقات بالعربية...');

  const comments: Comment[] = [];
  const publishedFactChecks = factChecks.filter(
    (fc) => fc.status === 'PUBLISHED',
  );

  // Create comments on fact-checks
  for (let i = 0; i < 300; i++) {
    const user = randomElement(users);
    const factCheck = randomElement(publishedFactChecks);
    const content = randomElement(arabicCommentTexts);

    // Create comments in the past 90 days
    const daysAgo = randomInt(0, 90);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    // Some comments are edited
    const isEdited = Math.random() > 0.85;
    const updatedAt = isEdited
      ? new Date(createdAt.getTime() + randomInt(1, 48) * 60 * 60 * 1000)
      : createdAt;

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        factCheckId: factCheck.id,
        isEdited,
        createdAt,
        updatedAt,
      },
    });

    comments.push(comment);
  }

  // Create some reply comments (nested comments)
  const topLevelComments = comments.slice(0, 100);
  for (let i = 0; i < 50; i++) {
    const parentComment = randomElement(topLevelComments);
    const user = randomElement(users);
    const content = randomElement([
      'أوافقك الرأي تماماً، شكراً على التوضيح.',
      'معلومات قيمة، استفدت كثيراً.',
      'هل يمكنك تقديم المزيد من التفاصيل؟',
      'نقطة مهمة، شكراً على المشاركة.',
      'ممتاز، هذا يوضح الصورة بشكل أفضل.',
      'أشكرك على هذه الإضافة المفيدة.',
      'معلومة رائعة، لم أكن أعلم بذلك.',
      'هل هناك مصادر إضافية يمكن الرجوع إليها؟',
      'تحليل دقيق، أحسنت.',
      'مفيد جداً، بارك الله فيك.',
    ]);

    const daysAgo = randomInt(0, 60);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const reply = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        factCheckId: parentComment.factCheckId,
        parentId: parentComment.id,
        isEdited: false,
        createdAt,
        updatedAt: createdAt,
      },
    });

    comments.push(reply);
  }

  console.log(
    `✅ تم إنشاء ${comments.length} تعليق (${comments.length - 50} تعليق رئيسي، 50 رد)\n`,
  );

  return comments;
};

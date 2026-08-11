import { PrismaClient, SavedContent, User } from '@prisma/client';
import { SeededFactCheck } from './factChecks.arabic.seed';
import { randomElement, randomInt } from '../helpers/seed.helper';

export const seedArabicSavedContent = async (
  prisma: PrismaClient,
  users: User[],
  factChecks: SeededFactCheck[],
): Promise<SavedContent[]> => {
  console.log('🌱 البدء في إضافة المحتوى المحفوظ بالعربية...');

  const savedContent: SavedContent[] = [];
  const publishedFactChecks = factChecks.filter((fc) => fc.hasPublishedArticle);
  const activeUsers = users.filter((u) => u.role === 'USER');

  // Each user saves 0-10 fact-checks
  for (const user of activeUsers) {
    const saveCount = randomInt(0, 10);
    const factChecksToSave = new Set<string>();

    // Pick random unique fact-checks to save
    while (
      factChecksToSave.size < saveCount &&
      factChecksToSave.size < publishedFactChecks.length
    ) {
      const factCheck = randomElement(publishedFactChecks);
      factChecksToSave.add(factCheck.id);
    }

    for (const factCheckId of factChecksToSave) {
      // Saved at some point in the past 90 days
      const daysAgo = randomInt(0, 90);
      const savedAt = new Date();
      savedAt.setDate(savedAt.getDate() - daysAgo);

      try {
        const saved = await prisma.savedContent.create({
          data: {
            userId: user.id,
            factCheckId,
            savedAt,
          },
        });

        savedContent.push(saved);
      } catch (error) {
        // Skip if duplicate (unique constraint)
        continue;
      }
    }
  }

  console.log(`✅ تم إنشاء ${savedContent.length} محتوى محفوظ\n`);

  return savedContent;
};

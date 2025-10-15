import {
  PrismaClient,
  Role,
  Submission,
  SubmissionStatus,
  SubmissionType,
  User,
} from '@prisma/client';
import { claimTexts } from './data/primary.data';
import { randomDate, randomElement, randomInt } from './helpers/seed.helper';

export const seedSubmissions = async (
  prisma: PrismaClient,
  users: User[],
): Promise<Submission[]> => {
  const submissions = [];

  const regularUsers = users.filter((u) => u.role === Role.USER);

  const moderators = users.filter((u) =>
    [Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN, Role.USER].includes(u.role),
  );

  for (let i = 1; i <= 250; i++) {
    const submitter = randomElement(regularUsers);
    const type = randomElement(Object.values(SubmissionType));
    const status = randomElement(Object.values(SubmissionStatus));

    const submission = await prisma.submission.create({
      data: {
        type,
        content: `I found this ${type.toLowerCase()} on social media claiming that ${randomElement(claimTexts)}. Can you verify this?`,
        sourceUrl:
          Math.random() > 0.3
            ? `https://socialmedia.com/post/${randomInt(10000, 99999)}`
            : null,
        mediaUrls:
          type === SubmissionType.IMAGE || type === SubmissionType.VIDEO
            ? [`https://example.com/${type.toLowerCase()}${i}.jpg`]
            : [],
        context:
          Math.random() > 0.5
            ? `This was shared by a popular account with ${randomInt(1000, 100000)} followers. It has been shared ${randomInt(100, 10000)} times.`
            : null,
        status,
        priority: randomInt(0, 10),
        submitterId: submitter.id,
        submitterEmail: submitter.email,
        isAnonymous: Math.random() > 0.8,
        reviewedBy:
          status !== SubmissionStatus.PENDING
            ? randomElement(moderators).id
            : null,
        reviewedAt:
          status !== SubmissionStatus.PENDING
            ? randomDate(new Date(2024, 0, 1), new Date())
            : null,
        rejectionReason:
          status === SubmissionStatus.REJECTED
            ? 'Insufficient information provided'
            : null,
        createdAt: randomDate(new Date(2023, 6, 1), new Date()),
      },
    });
    submissions.push(submission);
  }

  return submissions;
};

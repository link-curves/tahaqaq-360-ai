import { PrismaClient, Submission, User } from '@prisma/client';
import { claimTexts } from '../en/data/english.data';
import { randomDate, randomElement, randomInt } from '../helpers/seed.helper';
import { ROLE, SUBMISSION_STATUS, SUBMISSION_TYPE } from '../../../common/constants/lookups';

export const seedSubmissions = async (
  prisma: PrismaClient,
  users: User[],
): Promise<Submission[]> => {
  const submissions = [];

  const regularUsers = users.filter((u) => u.roleCode === ROLE.USER);

  const moderators = users.filter((u) =>
    ([ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.USER] as string[]).includes(
      u.roleCode,
    ),
  );

  for (let i = 1; i <= 250; i++) {
    const submitter = randomElement(regularUsers);
    const type = randomElement(Object.values(SUBMISSION_TYPE));
    const status = randomElement(Object.values(SUBMISSION_STATUS));

    const submission = await prisma.submission.create({
      data: {
        typeCode: type,
        content: `I found this ${type.toLowerCase()} on social media claiming that ${randomElement(claimTexts)}. Can you verify this?`,
        sourceUrl:
          Math.random() > 0.3
            ? `https://socialmedia.com/post/${randomInt(10000, 99999)}`
            : null,
        mediaUrls:
          type === SUBMISSION_TYPE.IMAGE || type === SUBMISSION_TYPE.VIDEO
            ? [`https://example.com/${type.toLowerCase()}${i}.jpg`]
            : [],
        context:
          Math.random() > 0.5
            ? `This was shared by a popular account with ${randomInt(1000, 100000)} followers. It has been shared ${randomInt(100, 10000)} times.`
            : null,
        statusCode: status,
        priority: randomInt(0, 10),
        submitterId: submitter.id,
        submitterEmail: submitter.email,
        isAnonymous: Math.random() > 0.8,
        reviewedBy:
          status !== SUBMISSION_STATUS.PENDING
            ? randomElement(moderators).id
            : null,
        reviewedAt:
          status !== SUBMISSION_STATUS.PENDING
            ? randomDate(new Date(2024, 0, 1), new Date())
            : null,
        rejectionReason:
          status === SUBMISSION_STATUS.REJECTED
            ? 'Insufficient information provided'
            : null,
        createdAt: randomDate(new Date(2023, 6, 1), new Date()),
      },
    });
    submissions.push(submission);
  }

  return submissions;
};

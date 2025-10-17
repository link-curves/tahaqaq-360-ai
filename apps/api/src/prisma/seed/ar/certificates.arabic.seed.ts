import { Certificate, Course, PrismaClient, User } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';

export const seedArabicCertificates = async (
  prisma: PrismaClient,
  users: User[],
  courses: Course[],
): Promise<Certificate[]> => {
  console.log('🌱 البدء في إضافة الشهادات بالعربية...');

  const certificates: Certificate[] = [];
  const publishedCourses = courses.filter((c) => c.isPublished);

  // Create certificates for some users who completed courses
  const eligibleUsers = users.filter((u) => u.role === 'USER');
  const certificateCount = Math.min(100, eligibleUsers.length);

  for (let i = 0; i < certificateCount; i++) {
    const user = randomElement(eligibleUsers);
    const course = randomElement(publishedCourses);

    // Generate unique certificate number and verification code
    const certificateNumber = `CERT-AR-${new Date().getFullYear()}-${String(i + 1).padStart(6, '0')}`;
    const verificationCode = `VER-${randomInt(100000, 999999)}-${randomInt(100, 999)}`;

    // Issue date in the past 6 months
    const daysAgo = randomInt(0, 180);
    const issuedDate = new Date();
    issuedDate.setDate(issuedDate.getDate() - daysAgo);

    // Some certificates expire after 2 years
    const hasExpiry = Math.random() > 0.7;
    const expiryDate = hasExpiry
      ? new Date(issuedDate.getTime() + 730 * 24 * 60 * 60 * 1000)
      : null;

    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        verificationCode,
        userId: user.id,
        courseId: course.id,
        recipientName: `${user.firstName} ${user.lastName}`,
        issuedDate,
        expiryDate,
        pdfUrl: `https://certificates.tahaqaq360.com/ar/${certificateNumber}.pdf`,
      },
    });

    certificates.push(certificate);
  }

  console.log(`✅ تم إنشاء ${certificates.length} شهادة\n`);

  return certificates;
};

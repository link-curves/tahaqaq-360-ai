import { PrismaClient, Role, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomDate, randomElement, randomInt } from '../helpers/seed.helper';
import {
  arabicCategories,
  arabicFirstNames,
  arabicLastNames,
} from './data/arabic.data';
import { ROLE } from '../../../common/constants/lookups';

export const seedArabicUsers = async (
  prisma: PrismaClient,
): Promise<User[]> => {
  console.log('🌱 البدء في إضافة المستخدمين بالعربية...');

  const hashedPassword = await argon2.hash('Password123!');

  const users = [];

  // مدير عام
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@tahaqaq360.com',
      password: hashedPassword,
      firstName: 'محمد',
      lastName: 'الأحمد',
      username: 'superadmin',
      roleCode: ROLE.SUPER_ADMIN,
      isEmailVerified: true,
      reputation: 1000,
      totalPoints: 10000,
      level: 10,
      bio: 'مدير المنصة',
    },
  });
  users.push(superAdmin);

  // 5 مديرين
  for (let i = 1; i <= 5; i++) {
    const admin = await prisma.user.create({
      data: {
        email: `admin${i}@tahaqaq360.com`,
        password: hashedPassword,
        firstName: randomElement(arabicFirstNames),
        lastName: randomElement(arabicLastNames),
        username: `admin${i}`,
        roleCode: ROLE.ADMIN,
        isEmailVerified: true,
        reputation: randomInt(500, 900),
        totalPoints: randomInt(5000, 9000),
        level: randomInt(7, 9),
        bio: `مدير متخصص في التحقق من الحقائق`,
      },
    });
    users.push(admin);
  }

  // 10 مشرفين
  for (let i = 1; i <= 10; i++) {
    const moderator = await prisma.user.create({
      data: {
        email: `moderator${i}@tahaqaq360.com`,
        password: hashedPassword,
        firstName: randomElement(arabicFirstNames),
        lastName: randomElement(arabicLastNames),
        username: `moderator${i}`,
        roleCode: ROLE.MODERATOR,
        isEmailVerified: true,
        reputation: randomInt(200, 500),
        totalPoints: randomInt(2000, 5000),
        level: randomInt(4, 7),
        bio: `مشرف محتوى متخصص في ${randomElement(arabicCategories)}`,
      },
    });
    users.push(moderator);
  }

  // 84 مستخدم عادي
  for (let i = 1; i <= 84; i++) {
    const firstName = randomElement(arabicFirstNames);
    const lastName = randomElement(arabicLastNames);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName,
        lastName,
        username: `${firstName}_${lastName}_${i}`,
        roleCode: ROLE.USER,
        isEmailVerified: Math.random() > 0.3,
        reputation: randomInt(0, 200),
        totalPoints: randomInt(0, 2000),
        level: randomInt(1, 4),
        bio:
          Math.random() > 0.5
            ? `مهتم بـ${randomElement(arabicCategories)} والتحقق من الحقائق`
            : null,
        lastLoginAt: randomDate(new Date(2024, 0, 1), new Date()),
      },
    });
    users.push(user);
  }

  console.log(`✅ تم إنشاء ${users.length} مستخدم\n`);

  return users;
};

import { PrismaClient, Role, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { categories, firstNames, lastNames } from '../en/data/english.data';

export const seedUsers = async (prisma: PrismaClient): Promise<User[]> => {
  console.log('🌱 Starting user seeding...');
  // Helper functions
  const randomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomDate = (start: Date, end: Date) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );

  const hashedPassword = await argon2.hash('Password123!');

  // ============================================
  // 1. CREATE 100 USERS
  // ============================================
  console.log('👥 Creating 100 users...');
  const users = [];

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@tahaqaq360.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      username: 'superadmin',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
      reputation: 1000,
      totalPoints: 10000,
      level: 10,
      bio: 'Platform Administrator',
    },
  });
  users.push(superAdmin);

  // 5 Admins
  for (let i = 1; i <= 5; i++) {
    const admin = await prisma.user.create({
      data: {
        email: `admin${i}@tahaqaq360.com`,
        password: hashedPassword,
        firstName: randomElement(firstNames),
        lastName: randomElement(lastNames),
        username: `admin${i}`,
        role: Role.ADMIN,
        isEmailVerified: true,
        reputation: randomInt(500, 900),
        totalPoints: randomInt(5000, 9000),
        level: randomInt(7, 9),
        bio: `Admin user with expertise in fact-checking`,
      },
    });
    users.push(admin);
  }

  // 10 Moderators
  for (let i = 1; i <= 10; i++) {
    const moderator = await prisma.user.create({
      data: {
        email: `moderator${i}@tahaqaq360.com`,
        password: hashedPassword,
        firstName: randomElement(firstNames),
        lastName: randomElement(lastNames),
        username: `moderator${i}`,
        role: Role.MODERATOR,
        isEmailVerified: true,
        reputation: randomInt(200, 500),
        totalPoints: randomInt(2000, 5000),
        level: randomInt(4, 7),
        bio: `Content moderator specializing in ${randomElement(categories).toLowerCase()}`,
      },
    });
    users.push(moderator);
  }

  // 84 Regular Users
  for (let i = 1; i <= 84; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName,
        lastName,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`,
        role: Role.USER,
        isEmailVerified: Math.random() > 0.3,
        reputation: randomInt(0, 200),
        totalPoints: randomInt(0, 2000),
        level: randomInt(1, 4),
        bio:
          Math.random() > 0.5
            ? `Interested in ${randomElement(categories).toLowerCase()} and fact-checking`
            : null,
        lastLoginAt: randomDate(new Date(2024, 0, 1), new Date()),
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} users\n`);

  return users;
};

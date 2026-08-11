import { Certificate, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { seedAchievements } from './en/achievement.seed';
import {
  categories,
  firstNames,
  lastNames,
  tags,
} from './en/data/english.data';
import { seedFactChecks } from './en/factChecks.seed';
import { seedReferenceData } from './reference.seed';
import { seedFAQs } from './en/faq.seed';
import { seedSubmissions } from './en/submission.seed';
import { seedUsers } from './en/user.seed';
import { randomDate, randomElement, shuffle } from './helpers/seed.helper';
import { CONTENT_STATUS, EVENT_STATUS, EVENT_TYPE, MODERATION_ACTION, NOTIFICATION_TYPE, ROLE, SUBMISSION_STATUS } from '../../common/constants/lookups';
import { createPrismaAdapter } from '../../database/prisma-connection';

const prisma = new PrismaClient({ adapter: createPrismaAdapter() });

// Data generators

async function main() {
  console.log('🌱 Starting comprehensive database seed...\n');

  // ============================================
  // 1. CREATE 100 USERS
  // ============================================
  console.log('👥 Creating 100 users...');
  // Lookup tables must exist first — every other model has a foreign key
  // into them.
  const topics = await seedReferenceData(prisma);

  const users = await seedUsers(prisma);

  // ============================================
  // 2. CREATE 50 ACHIEVEMENTS
  // ============================================
  console.log('🏆 Creating 50 achievements...');
  const achievements = await seedAchievements(prisma);

  // ============================================
  // 3. CREATE 200 FACT CHECKS
  // ============================================
  console.log('📰 Creating 200 fact checks...');
  const factChecks = await seedFactChecks(prisma, users, topics);
  const moderators = users.filter((u) =>
    ([ROLE.MODERATOR, ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.USER] as string[]).includes(
      u.roleCode,
    ),
  );

  // ============================================
  // 4. CREATE 250 SUBMISSIONS
  // ============================================
  console.log('📝 Creating 250 submissions...');

  const submissions = await seedSubmissions(prisma, users);

  const regularUsers = users.filter((u) => u.roleCode === ROLE.USER);

  console.log(`✅ Created ${submissions.length} submissions\n`);

  // ============================================
  // 5. CREATE 50 COURSES with LESSONS and QUIZZES
  // ============================================
  console.log('📚 Creating 50 courses with lessons...');
  const courses = [];

  const courseTopics = [
    'Introduction to Media Literacy',
    'Detecting Misinformation Online',
    'Critical Thinking Skills',
    'Fact-Checking Fundamentals',
    'Source Verification Techniques',
    'Understanding Bias in Media',
    'Social Media Literacy',
    'Digital Citizenship',
    'News Literacy',
    'Visual Verification',
  ];

  for (let i = 1; i <= 50; i++) {
    const course = await prisma.course.create({
      data: {
        title: `${randomElement(courseTopics)} - Level ${Math.ceil(i / 10)}`,
        slug: `course-${i}-${Date.now()}`,
        description: `Comprehensive course covering essential aspects of ${randomElement(courseTopics).toLowerCase()}. Learn practical skills to identify and combat misinformation.`,
        coverImage: `https://picsum.photos/seed/course${i}/600/400`,
        difficulty: randomElement(['Beginner', 'Intermediate', 'Advanced']),
        duration: randomInt(60, 480),
        order: i,
        isPublished: i <= 45,
        prerequisites: i > 10 ? [`course-${i - 10}`] : [],
        learningObjectives: [
          'Understand key concepts and terminology',
          'Apply critical thinking to real-world scenarios',
          'Develop practical fact-checking skills',
          'Recognize common misinformation patterns',
        ],
        lessons: {
          create: Array.from(
            { length: randomInt(5, 12) },
            (_, lessonIndex) => ({
              title: `Lesson ${lessonIndex + 1}: ${randomElement(['Introduction', 'Core Concepts', 'Advanced Techniques', 'Case Studies', 'Practical Application'])}`,
              slug: `lesson-${lessonIndex + 1}`,
              content: `# Lesson Content\n\nThis lesson covers important concepts in ${randomElement(categories).toLowerCase()}.\n\n## Learning Outcomes\n\n- Understand key principles\n- Apply knowledge practically\n- Develop critical skills\n\n## Content\n\nDetailed educational content goes here with examples and exercises.`,
              videoUrl:
                Math.random() > 0.5
                  ? `https://youtube.com/watch?v=example${lessonIndex}`
                  : null,
              duration: randomInt(15, 60),
              order: lessonIndex + 1,
              resources: [
                {
                  title: 'Reading Material',
                  url: 'https://example.com/reading.pdf',
                  type: 'pdf',
                },
                {
                  title: 'Practice Exercises',
                  url: 'https://example.com/exercises',
                  type: 'interactive',
                },
              ],
              ...(lessonIndex % 3 === 2 && {
                quiz: {
                  create: {
                    title: `Quiz: Lesson ${lessonIndex + 1}`,
                    passingScore: randomInt(60, 80),
                    timeLimit: randomInt(10, 30),
                    questions: [
                      {
                        question: 'What is the primary goal of fact-checking?',
                        options: [
                          'To prove people wrong',
                          'To verify information accuracy',
                          'To censor content',
                          'To create controversy',
                        ],
                        correctAnswer: 1,
                        explanation:
                          'Fact-checking aims to verify the accuracy of information and help people make informed decisions.',
                      },
                      {
                        question:
                          'Which source type is generally most reliable?',
                        options: [
                          'Social media posts',
                          'Peer-reviewed journals',
                          'Anonymous blogs',
                          'Viral videos',
                        ],
                        correctAnswer: 1,
                        explanation:
                          'Peer-reviewed journals undergo rigorous verification processes.',
                      },
                      {
                        question: 'What does confirmation bias mean?',
                        options: [
                          'Confirming facts',
                          'Seeking info that supports existing beliefs',
                          'Verifying sources',
                          'Checking references',
                        ],
                        correctAnswer: 1,
                        explanation:
                          'Confirmation bias is the tendency to seek information that confirms what we already believe.',
                      },
                    ],
                  },
                },
              }),
            }),
          ),
        },
      },
      include: {
        lessons: {
          include: {
            quiz: true,
          },
        },
      },
    });
    courses.push(course);
  }

  console.log(`✅ Created ${courses.length} courses with lessons\n`);

  // ============================================
  // 6. CREATE 100 EVENTS
  // ============================================
  console.log('📅 Creating 100 events...');
  const events = [];

  const eventTitles = [
    'Media Literacy Workshop',
    'Fact-Checking Masterclass',
    'Digital Citizenship Training',
    'Misinformation Detection Seminar',
    'Critical Thinking Conference',
    'News Literacy Bootcamp',
    'Social Media Verification Workshop',
    'Deepfake Detection Training',
    'Data Journalism Symposium',
    'Online Safety Workshop',
  ];

  for (let i = 1; i <= 100; i++) {
    const startDate = randomDate(new Date(2024, 0, 1), new Date(2026, 11, 31));
    const endDate = new Date(
      startDate.getTime() + randomInt(2, 8) * 60 * 60 * 1000,
    );
    const isVirtual = Math.random() > 0.4;
    const isPast = startDate < new Date();

    const event = await prisma.event.create({
      data: {
        title: `${randomElement(eventTitles)} ${new Date(startDate).getFullYear()}`,
        slug: `event-${i}-${Date.now()}`,
        description: `Join us for an engaging ${randomElement(eventTitles).toLowerCase()} where experts will share insights on combating misinformation and improving media literacy.`,
        typeCode: randomElement(Object.values(EVENT_TYPE)),
        statusCode: isPast
          ? EVENT_STATUS.COMPLETED
          : i <= 20
            ? EVENT_STATUS.UPCOMING
            : EVENT_STATUS.UPCOMING,
        coverImage: `https://picsum.photos/seed/event${i}/800/400`,
        startDate,
        endDate,
        location: isVirtual
          ? null
          : `${randomElement(['Beirut', 'Dubai', 'Riyadh', 'Cairo', 'Amman', 'Abu Dhabi', 'Doha'])}`,
        virtualLink: isVirtual
          ? `https://zoom.us/j/${randomInt(100000000, 999999999)}`
          : null,
        isVirtual,
        maxAttendees: isVirtual ? null : randomInt(30, 200),
        speakers: [
          {
            name: `Dr. ${randomElement(firstNames)} ${randomElement(lastNames)}`,
            title: randomElement([
              'Media Expert',
              'Journalist',
              'Researcher',
              'Professor',
              'Analyst',
            ]),
            bio: 'Leading expert in media literacy and fact-checking',
            image: `https://i.pravatar.cc/150?u=${randomInt(1, 1000)}`,
          },
        ],
        agenda: [
          { time: '10:00', title: 'Registration and Welcome', duration: 30 },
          { time: '10:30', title: 'Keynote Speech', duration: 60 },
          { time: '11:30', title: 'Panel Discussion', duration: 60 },
          { time: '12:30', title: 'Lunch Break', duration: 60 },
          { time: '13:30', title: 'Interactive Workshop', duration: 90 },
          { time: '15:00', title: 'Q&A and Closing', duration: 30 },
        ],
        requirements: [
          'Laptop or tablet',
          'Basic internet knowledge',
          'Interest in media literacy',
        ],
        tags: shuffle(tags).slice(0, randomInt(3, 5)),
      },
    });
    events.push(event);
  }

  console.log(`✅ Created ${events.length} events\n`);

  // ============================================
  // 7. CREATE EVENT REGISTRATIONS
  // ============================================
  console.log('🎫 Creating event registrations...');
  let registrationCount = 0;

  for (const event of events.slice(0, 50)) {
    const numRegistrations = randomInt(5, 30);
    const registeredUsers = shuffle([...regularUsers]).slice(
      0,
      numRegistrations,
    );

    for (const user of registeredUsers) {
      await prisma.eventRegistration.create({
        data: {
          userId: user.id,
          eventId: event.id,
          status:
            event.statusCode === EVENT_STATUS.COMPLETED ? 'ATTENDED' : 'CONFIRMED',
          attendedAt:
            event.statusCode === EVENT_STATUS.COMPLETED ? event.startDate : null,
          feedback:
            event.statusCode === EVENT_STATUS.COMPLETED && Math.random() > 0.5
              ? 'Great event! Learned a lot.'
              : null,
          rating:
            event.statusCode === EVENT_STATUS.COMPLETED && Math.random() > 0.5
              ? randomInt(4, 5)
              : null,
          registeredAt: randomDate(
            new Date(event.startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
            event.startDate,
          ),
        },
      });
      registrationCount++;
    }
  }

  console.log(`✅ Created ${registrationCount} event registrations\n`);

  // ============================================
  // 8. CREATE COURSE ENROLLMENTS AND PROGRESS
  // ============================================
  console.log('📖 Creating course enrollments...');
  let enrollmentCount = 0;

  for (const user of regularUsers.slice(0, 70)) {
    const numCourses = randomInt(1, 8);
    const enrolledCourses = shuffle([
      ...courses.filter((c) => c.isPublished),
    ]).slice(0, numCourses);

    for (const course of enrolledCourses) {
      const progress = randomInt(0, 100);
      const isCompleted = progress === 100;

      await prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId: course.id,
          progress,
          isCompleted,
          completedAt: isCompleted
            ? randomDate(new Date(2024, 0, 1), new Date())
            : null,
          lastAccessedAt: randomDate(new Date(2024, 6, 1), new Date()),
          startedAt: randomDate(new Date(2024, 0, 1), new Date(2024, 6, 1)),
        },
      });
      enrollmentCount++;
    }
  }

  console.log(`✅ Created ${enrollmentCount} course enrollments\n`);

  // ============================================
  // 9. CREATE QUIZ ATTEMPTS
  // ============================================
  console.log('📝 Creating quiz attempts...');
  let quizAttemptCount = 0;

  for (const course of courses.slice(0, 30)) {
    for (const lesson of course.lessons) {
      if (lesson.quiz) {
        const numAttempts = randomInt(5, 20);
        const attemptUsers = shuffle([...regularUsers]).slice(0, numAttempts);

        for (const user of attemptUsers) {
          const score = randomInt(40, 100);
          await prisma.quizAttempt.create({
            data: {
              userId: user.id,
              quizId: lesson.quiz.id,
              score,
              isPassed: score >= lesson.quiz.passingScore,
              answers: { answer1: 1, answer2: 2, answer3: 1 },
              timeSpent: randomInt(300, 1800),
              createdAt: randomDate(new Date(2024, 0, 1), new Date()),
            },
          });
          quizAttemptCount++;
        }
      }
    }
  }

  console.log(`✅ Created ${quizAttemptCount} quiz attempts\n`);

  // ============================================
  // 10. CREATE CERTIFICATES
  // ============================================
  console.log('🎓 Creating certificates...');
  const certificates: Certificate[] = [];

  const completedProgress = await prisma.courseProgress.findMany({
    where: { isCompleted: true },
    include: { user: true, course: true },
  });

  for (const progress of completedProgress.slice(0, 100)) {
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber: `TC-2024-${String(certificates.length + 1).padStart(8, '0')}`,
        verificationCode: `${randomInt(100000, 999999)}-${randomInt(100000, 999999)}`,
        userId: progress.userId,
        courseId: progress.courseId,
        recipientName: `${progress.user.firstName} ${progress.user.lastName}`,
        issuedDate: progress.completedAt || new Date(),
        pdfUrl: `https://storage.example.com/certificates/${certificates.length + 1}.pdf`,
        expiryDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 2),
        ),
        createdAt: new Date(),
      },
    });
    certificates.push(certificate);
  }

  console.log(`✅ Created ${certificates.length} certificates\n`);

  // ============================================
  // 11. CREATE 50 RESEARCH PAPERS
  // ============================================
  console.log('📊 Creating 50 research papers...');
  const research = [];

  const researchTitles = [
    'The Impact of Social Media on Information Spread',
    'Misinformation Trends in Digital Age',
    'Fact-Checking Effectiveness Study',
    'Media Literacy in Educational Systems',
    'The Role of AI in Content Moderation',
    'Understanding Cognitive Biases in Information Processing',
    'The Psychology of Belief in Misinformation',
    'Digital Literacy Gaps Across Generations',
    'The Evolution of Fake News',
    'Trust in Media: A Comprehensive Analysis',
  ];

  for (let i = 1; i <= 50; i++) {
    const paper = await prisma.research.create({
      data: {
        title: `${randomElement(researchTitles)} - ${2020 + Math.floor(i / 10)}`,
        slug: `research-${i}-${Date.now()}`,
        summary: `This comprehensive study examines ${randomElement(categories).toLowerCase()} trends and their impact on society. The research was conducted over ${randomInt(6, 24)} months with ${randomInt(100, 5000)} participants.`,
        fullContent: `# Abstract\n\nThis research paper presents findings from an extensive study on ${randomElement(categories).toLowerCase()}.\n\n## Introduction\n\nThe digital age has transformed how information spreads...\n\n## Methodology\n\nWe employed a mixed-methods approach...\n\n## Results\n\nOur findings indicate several key trends...\n\n## Discussion\n\nThese results have important implications...\n\n## Conclusion\n\nThis study contributes to our understanding...`,
        authors: [
          `Dr. ${randomElement(firstNames)} ${randomElement(lastNames)}`,
          `Prof. ${randomElement(firstNames)} ${randomElement(lastNames)}`,
        ],
        category: randomElement(categories),
        tags: shuffle(tags).slice(0, randomInt(4, 7)),
        coverImage: `https://picsum.photos/seed/research${i}/800/600`,
        attachments: [
          {
            name: 'Full Paper PDF',
            url: 'https://example.com/paper.pdf',
            size: '2.4 MB',
          },
          {
            name: 'Data Set',
            url: 'https://example.com/data.csv',
            size: '856 KB',
          },
        ],
        statusCode: i <= 45 ? CONTENT_STATUS.PUBLISHED : CONTENT_STATUS.DRAFT,
        publishedAt:
          i <= 45 ? randomDate(new Date(2023, 0, 1), new Date()) : null,
        views: randomInt(100, 5000),
        downloads: randomInt(50, 1000),
      },
    });
    research.push(paper);
  }

  console.log(`✅ Created ${research.length} research papers\n`);

  // ============================================
  // 12. CREATE 30 RECORDED SESSIONS
  // ============================================
  console.log('🎥 Creating 30 recorded sessions...');
  const sessions = [];

  const sessionTitles = [
    'Detecting Deepfakes: Tools and Techniques',
    'Advanced Fact-Checking Methodology',
    'Social Media Verification Masterclass',
    'Understanding Algorithmic Bias',
    'The Future of Journalism',
    'Combating Online Misinformation',
    'Data Privacy in Digital Age',
    'Visual Verification Techniques',
    'Investigating Coordinated Inauthentic Behavior',
    'Building Resilience Against Manipulation',
  ];

  for (let i = 1; i <= 30; i++) {
    const session = await prisma.session.create({
      data: {
        title: `${randomElement(sessionTitles)} - Session ${i}`,
        slug: `session-${i}-${Date.now()}`,
        description: `In this recorded session, experts discuss ${randomElement(categories).toLowerCase()} and demonstrate practical techniques for ${randomElement(['verification', 'analysis', 'investigation', 'detection'])}.`,
        videoUrl: `https://youtube.com/watch?v=example${i}`,
        thumbnailUrl: `https://picsum.photos/seed/session${i}/1280/720`,
        duration: randomInt(30, 120),
        views: randomInt(500, 50000),
        speakers: [
          {
            name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
            title: randomElement([
              'Journalist',
              'Researcher',
              'Expert',
              'Professor',
            ]),
            bio: 'Expert in digital media and fact-checking',
          },
        ],
        topics: shuffle(tags).slice(0, randomInt(3, 6)),
        resources: [
          {
            title: 'Presentation Slides',
            url: 'https://example.com/slides.pdf',
          },
          {
            title: 'Additional Resources',
            url: 'https://example.com/resources',
          },
        ],
        statusCode: i <= 28 ? CONTENT_STATUS.PUBLISHED : CONTENT_STATUS.DRAFT,
        publishedAt:
          i <= 28 ? randomDate(new Date(2023, 6, 1), new Date()) : null,
        recordedAt: randomDate(new Date(2023, 0, 1), new Date()),
      },
    });
    sessions.push(session);
  }

  console.log(`✅ Created ${sessions.length} recorded sessions\n`);

  // ============================================
  // 13. CREATE 50 FAQs
  // ============================================
  console.log('❓ Creating 50 FAQs...');

  const faqs = await seedFAQs(prisma);

  console.log(`✅ Created ${faqs.length} FAQs\n`);

  // ============================================
  // 14. CREATE COMMENTS
  // ============================================
  console.log('💬 Creating comments...');
  let commentCount = 0;

  for (const factCheck of factChecks.slice(0, 100)) {
    const numComments = randomInt(2, 15);

    for (let i = 0; i < numComments; i++) {
      const commenter = randomElement(users);
      const comment = await prisma.comment.create({
        data: {
          content: randomElement([
            'This is very informative. Thank you for the thorough analysis!',
            'Great fact-check! More people need to see this.',
            'Excellent work on verifying the sources.',
            'This helped me understand the issue better.',
            'Could you provide more details about the methodology?',
            'I shared this with my network. Very important information.',
            'The evidence presented is compelling.',
            'Thank you for fighting misinformation!',
          ]),
          userId: commenter.id,
          factCheckId: factCheck.id,
          createdAt: randomDate(
            factCheck.publishedAt || new Date(2024, 0, 1),
            new Date(),
          ),
        },
      });
      commentCount++;

      // Add some replies
      if (Math.random() > 0.7) {
        const replier = randomElement(
          users.filter((u) => u.id !== commenter.id),
        );
        await prisma.comment.create({
          data: {
            content: randomElement([
              'I agree with your point.',
              'Thanks for your feedback!',
              'Interesting perspective.',
              'Good question, let me elaborate...',
            ]),
            userId: replier.id,
            factCheckId: factCheck.id,
            parentId: comment.id,
            createdAt: randomDate(comment.createdAt, new Date()),
          },
        });
        commentCount++;
      }
    }
  }

  console.log(`✅ Created ${commentCount} comments\n`);

  // ============================================
  // 15. CREATE SAVED CONTENT
  // ============================================
  console.log('🔖 Creating saved content...');
  let savedCount = 0;

  for (const user of regularUsers.slice(0, 60)) {
    const numSaved = randomInt(3, 20);
    const savedFactChecks = shuffle([
      ...factChecks.filter((fc) => fc.hasPublishedArticle),
    ]).slice(0, numSaved);

    for (const factCheck of savedFactChecks) {
      await prisma.savedContent.create({
        data: {
          userId: user.id,
          factCheckId: factCheck.id,
          savedAt: randomDate(
            factCheck.publishedAt || new Date(2024, 0, 1),
            new Date(),
          ),
        },
      });
      savedCount++;
    }
  }

  console.log(`✅ Created ${savedCount} saved content entries\n`);

  // ============================================
  // 16. CREATE NOTIFICATIONS
  // ============================================
  console.log('🔔 Creating notifications...');
  let notificationCount = 0;

  for (const user of users.slice(0, 80)) {
    const numNotifications = randomInt(5, 30);

    for (let i = 0; i < numNotifications; i++) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          typeCode: randomElement(Object.values(NOTIFICATION_TYPE)),
          title: randomElement([
            'Submission Updated',
            'New Achievement Unlocked',
            'Event Reminder',
            'Certificate Issued',
            'Welcome to Tahaqaq 360',
          ]),
          message: randomElement([
            'Your submission has been reviewed',
            'You earned 100 points!',
            'Event starts tomorrow',
            'Your certificate is ready',
            'Complete your profile to earn points',
          ]),
          actionUrl: randomElement([
            '/submissions',
            '/achievements',
            '/events',
            '/certificates',
            '/profile',
          ]),
          isRead: Math.random() > 0.4,
          createdAt: randomDate(new Date(2024, 0, 1), new Date()),
          readAt:
            Math.random() > 0.4
              ? randomDate(new Date(2024, 0, 1), new Date())
              : null,
        },
      });
      notificationCount++;
    }
  }

  console.log(`✅ Created ${notificationCount} notifications\n`);

  // ============================================
  // 17. CREATE MODERATION LOGS
  // ============================================
  console.log('🛡️ Creating moderation logs...');
  let moderationCount = 0;

  for (const submission of submissions.filter(
    (s) => s.statusCode !== SUBMISSION_STATUS.PENDING,
  )) {
    const moderator = randomElement(moderators);
    await prisma.moderationLog.create({
      data: {
        actionCode:
          submission.statusCode === SUBMISSION_STATUS.REJECTED
            ? MODERATION_ACTION.REJECT
            : MODERATION_ACTION.APPROVE,
        reason:
          submission.statusCode === SUBMISSION_STATUS.REJECTED
            ? 'Insufficient evidence'
            : 'Meets quality standards',
        notes: `Reviewed by ${moderator.firstName}. ${submission.statusCode === SUBMISSION_STATUS.VERIFIED ? 'High quality submission' : 'Standard review process'}.`,
        moderatorId: moderator.id,
        submissionId: submission.id,
        createdAt:
          submission.reviewedAt || randomDate(new Date(2024, 0, 1), new Date()),
      },
    });
    moderationCount++;
  }

  console.log(`✅ Created ${moderationCount} moderation logs\n`);

  // ============================================
  // 18. CREATE USER ACHIEVEMENTS
  // ============================================
  console.log('🏅 Assigning achievements to users...');
  let achievementAssignCount = 0;

  for (const user of users.slice(0, 70)) {
    const numAchievements = randomInt(2, 5);
    const userAchievements = shuffle([...achievements]).slice(
      0,
      numAchievements,
    );

    for (const achievement of userAchievements) {
      try {
        await prisma.userAchievement.create({
          data: {
            userId: user.id,
            achievementId: achievement.id,
            unlockedAt: randomDate(new Date(2024, 0, 1), new Date()),
          },
        });
        achievementAssignCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Assigned ${achievementAssignCount} achievements to users\n`);

  // ============================================
  // 19. CREATE CONTACT MESSAGES
  // ============================================
  console.log('📧 Creating contact messages...');
  const contactMessages = [];

  for (let i = 1; i <= 50; i++) {
    const sender = Math.random() > 0.3 ? randomElement(regularUsers) : null;
    const message = await prisma.contactMessage.create({
      data: {
        name: sender
          ? `${sender.firstName} ${sender.lastName}`
          : `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        email: sender ? sender.email : `contact${i}@example.com`,
        phone:
          Math.random() > 0.5 ? `+961${randomInt(70000000, 79999999)}` : null,
        subject: randomElement([
          'Question about fact-checking process',
          'Partnership opportunity',
          'Technical issue',
          'Feedback on the platform',
          'Event collaboration',
          'Media inquiry',
          'Feature request',
        ]),
        message: `Hello, I wanted to reach out regarding ${randomElement(categories).toLowerCase()}. I have some questions and would appreciate your assistance.`,
        status: randomElement(['NEW', 'IN_PROGRESS', 'RESOLVED']),
        userId: sender?.id,
        createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      },
    });
    contactMessages.push(message);
  }

  console.log(`✅ Created ${contactMessages.length} contact messages\n`);

  // ============================================
  // 20. CREATE HOST REQUESTS
  // ============================================
  console.log('🎤 Creating host requests...');
  const hostRequests = [];

  for (let i = 1; i <= 25; i++) {
    const request = await prisma.hostRequest.create({
      data: {
        name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        email: `host${i}@example.com`,
        phone: `+961${randomInt(70000000, 79999999)}`,
        organization:
          Math.random() > 0.5
            ? `${randomElement(categories)} Organization`
            : null,
        proposedTitle: `${randomElement(['Workshop', 'Seminar', 'Training', 'Conference'])} on ${randomElement(categories)}`,
        description: `I would like to organize an event focused on ${randomElement(categories).toLowerCase()} and media literacy for our community.`,
        eventTypeCode: randomElement(Object.values(EVENT_TYPE)),
        preferredDate: randomDate(new Date(), new Date(2025, 11, 31)),
        expectedAttendees: randomInt(20, 200),
        location: randomElement([
          'Beirut',
          'Dubai',
          'Riyadh',
          'Cairo',
          'Amman',
        ]),
        status: randomElement(['PENDING', 'APPROVED', 'REJECTED']),
        createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      },
    });
    hostRequests.push(request);
  }

  console.log(`✅ Created ${hostRequests.length} host requests\n`);

  // ============================================
  // 21. CREATE ACTIVITY LOGS
  // ============================================
  console.log('📝 Creating activity logs...');
  let activityCount = 0;

  const actions = [
    'USER_LOGIN',
    'PROFILE_UPDATE',
    'SUBMISSION_CREATED',
    'COURSE_ENROLLED',
    'EVENT_REGISTERED',
    'FACT_CHECK_VIEWED',
    'CERTIFICATE_DOWNLOADED',
  ];

  for (const user of users.slice(0, 70)) {
    const numActivities = randomInt(10, 50);

    for (let i = 0; i < numActivities; i++) {
      await prisma.activityLog.create({
        data: {
          action: randomElement(actions),
          entity: randomElement([
            'user',
            'submission',
            'course',
            'event',
            'factCheck',
          ]),
          entityId: randomInt(1, 100).toString(),
          userId: user.id,
          metadata: {
            userAgent: 'Mozilla/5.0',
            platform: randomElement(['web', 'mobile']),
          },
          ipAddress: `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`,
          createdAt: randomDate(new Date(2024, 0, 1), new Date()),
        },
      });
      activityCount++;
    }
  }

  console.log(`✅ Created ${activityCount} activity logs\n`);

  // ============================================
  // 22. CREATE SYSTEM METRICS
  // ============================================
  console.log('📊 Creating system metrics...');
  let metricsCount = 0;

  const metricTypes = [
    'api_response_time',
    'database_queries',
    'active_users',
    'submissions_per_day',
    'fact_checks_published',
  ];

  for (let day = 0; day < 90; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);

    for (const metric of metricTypes) {
      await prisma.systemMetric.create({
        data: {
          metric,
          value: randomInt(10, 1000) + Math.random(),
          metadata: { source: 'automated', environment: 'production' },
          recordedAt: date,
        },
      });
      metricsCount++;
    }
  }

  console.log(`✅ Created ${metricsCount} system metrics\n`);

  // ============================================
  // FINAL SUMMARY
  // ============================================
  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('═══════════════════════════════════════════');
  console.log('📊 SEEDING SUMMARY:');
  console.log('═══════════════════════════════════════════');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏆 Achievements: ${achievements.length}`);
  console.log(`📰 Fact Checks: ${factChecks.length}`);
  console.log(`📝 Submissions: ${submissions.length}`);
  console.log(`📚 Courses: ${courses.length}`);
  console.log(`🎓 Certificates: ${certificates.length}`);
  console.log(`📅 Events: ${events.length}`);
  console.log(`🎫 Event Registrations: ${registrationCount}`);
  console.log(`📖 Course Enrollments: ${enrollmentCount}`);
  console.log(`📝 Quiz Attempts: ${quizAttemptCount}`);
  console.log(`📊 Research Papers: ${research.length}`);
  console.log(`🎥 Recorded Sessions: ${sessions.length}`);
  console.log(`❓ FAQs: ${faqs.length}`);
  console.log(`💬 Comments: ${commentCount}`);
  console.log(`🔖 Saved Content: ${savedCount}`);
  console.log(`🔔 Notifications: ${notificationCount}`);
  console.log(`🛡️ Moderation Logs: ${moderationCount}`);
  console.log(`🏅 User Achievements: ${achievementAssignCount}`);
  console.log(`📧 Contact Messages: ${contactMessages.length}`);
  console.log(`🎤 Host Requests: ${hostRequests.length}`);
  console.log(`📝 Activity Logs: ${activityCount}`);
  console.log(`📊 System Metrics: ${metricsCount}`);
  console.log('═══════════════════════════════════════════');

  const totalRecords =
    users.length +
    achievements.length +
    factChecks.length +
    submissions.length +
    courses.length +
    certificates.length +
    events.length +
    registrationCount +
    enrollmentCount +
    quizAttemptCount +
    research.length +
    sessions.length +
    faqs.length +
    commentCount +
    savedCount +
    notificationCount +
    moderationCount +
    achievementAssignCount +
    contactMessages.length +
    hostRequests.length +
    activityCount +
    metricsCount;

  console.log(`\n✨ TOTAL RECORDS CREATED: ${totalRecords.toLocaleString()}\n`);

  console.log('🔐 LOGIN CREDENTIALS:\n');
  console.log('Super Admin:');
  console.log('  Email: admin@tahaqaq360.com');
  console.log('  Password: Password123!\n');

  console.log('Admin (5 accounts):');
  console.log('  Email: admin1@tahaqaq360.com to admin5@tahaqaq360.com');
  console.log('  Password: Password123!\n');

  console.log('Moderators (10 accounts):');
  console.log(
    '  Email: moderator1@tahaqaq360.com to moderator10@tahaqaq360.com',
  );
  console.log('  Password: Password123!\n');

  console.log('Regular Users (84 accounts):');
  console.log('  Email: user1@example.com to user84@example.com');
  console.log('  Password: Password123!\n');

  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

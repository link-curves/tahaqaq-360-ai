import { PrismaClient } from '@prisma/client';
import { seedArabicAchievements } from './ar/achievements.arabic.seed';
import { seedBlogPosts } from './ar/blog.arabic.seed';
import { seedArabicCertificates } from './ar/certificates.arabic.seed';
import { seedArabicComments } from './ar/comments.arabic.seed';
import { seedArabicCourses } from './ar/courses.arabic.seed';
import { seedArabicEvents } from './ar/events.arabic.seed';
import { seedArabicFactChecks } from './ar/factChecks.arabic.seed';
import { seedReferenceData } from './reference.seed';
import { seedArabicFAQs } from './ar/faqs.arabic.seed';
import { seedArabicNotifications } from './ar/notifications.arabic.seed';
import { seedArabicResearch } from './ar/research.arabic.seed';
import { seedArabicSavedContent } from './ar/savedContent.arabic.seed';
import { seedArabicSessions } from './ar/sessions.arabic.seed';
import { seedArabicSubmissions } from './ar/submissions.arabic.seed';
import { seedArabicUsers } from './ar/users.arabic.seed';
import { CONTENT_STATUS } from '../../common/constants/lookups';
import { createPrismaAdapter } from '../../database/prisma-connection';

const prisma = new PrismaClient({ adapter: createPrismaAdapter() });

async function main() {
  console.log('🌱 بدء إضافة البيانات العربية الشاملة...\n');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Initialize arrays to store results
    let users: any[] = [];
    let achievements: any[] = [];
    let factChecks: any[] = [];
    let submissions: any[] = [];
    let courses: any[] = [];
    let events: any[] = [];
    let research: any[] = [];
    let sessions: any[] = [];
    let faqs: any[] = [];
    let certificates: any[] = [];
    let notifications: any[] = [];
    let comments: any[] = [];
    let savedContent: any[] = [];
    let blogPosts: any[] = [];

    // ============================================
    // 1. إنشاء 100 مستخدم (Users)
    // ============================================
    // Lookup tables (roles, statuses, locales…) must exist FIRST: every other
    // model has a foreign key into them, so seeding users before roles fails
    // with a foreign-key violation.
    const topics = await seedReferenceData(prisma);

    console.log('👥 المرحلة 1/14: فحص المستخدمين...');
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      users = await seedArabicUsers(prisma);
      console.log(`   ✅ تم إنشاء ${users.length} مستخدم\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${userCount} مستخدم\n`);
      users = await prisma.user.findMany();
    }

    // ============================================
    // 2. إنشاء 50 إنجاز (Achievements)
    // ============================================
    console.log('🏆 المرحلة 2/14: فحص الإنجازات...');
    const achievementCount = await prisma.achievement.count();
    if (achievementCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      achievements = await seedArabicAchievements(prisma);
      console.log(`   ✅ تم إنشاء ${achievements.length} إنجاز\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${achievementCount} إنجاز\n`);
      achievements = await prisma.achievement.findMany();
    }

    // ============================================
    // 3. إنشاء 200 فحص حقائق (Fact Checks)
    // ============================================
    console.log('📰 المرحلة 3/14: فحص فحوصات الحقائق...');
    const factCheckCount = await prisma.factCheck.count();
    if (factCheckCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      factChecks = await seedArabicFactChecks(prisma, users, topics);
      console.log(`   ✅ تم إنشاء ${factChecks.length} فحص حقائق\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${factCheckCount} فحص حقائق\n`);
      // `status` lives on the article now, so recompute the published flag
      // rather than reading a field that no longer exists on FactCheck.
      const existing = await prisma.factCheck.findMany({
        include: { articles: { select: { statusCode: true } } },
      });
      factChecks = existing.map(({ articles, ...fc }) => ({
        ...fc,
        hasPublishedArticle: articles.some((a) => a.statusCode === CONTENT_STATUS.PUBLISHED),
      }));
    }

    // ============================================
    // 4. إنشاء 250 طلب (Submissions)
    // ============================================
    console.log('📝 المرحلة 4/14: فحص الطلبات...');
    const submissionCount = await prisma.submission.count();
    if (submissionCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      submissions = await seedArabicSubmissions(prisma, users);
      console.log(`   ✅ تم إنشاء ${submissions.length} طلب\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${submissionCount} طلب\n`);
      submissions = await prisma.submission.findMany();
    }

    // ============================================
    // 5. إنشاء 50 دورة (Courses)
    // ============================================
    console.log('📚 المرحلة 5/14: فحص الدورات...');
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      courses = await seedArabicCourses(prisma);
      console.log(`   ✅ تم إنشاء ${courses.length} دورة\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${courseCount} دورة\n`);
      courses = await prisma.course.findMany();
    }

    // ============================================
    // 6. إنشاء 100 فعالية (Events)
    // ============================================
    console.log('🎪 المرحلة 6/14: فحص الفعاليات...');
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      events = await seedArabicEvents(prisma);
      console.log(`   ✅ تم إنشاء ${events.length} فعالية\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${eventCount} فعالية\n`);
      events = await prisma.event.findMany();
    }

    // ============================================
    // 7. إنشاء 50 بحث (Research)
    // ============================================
    console.log('🔬 المرحلة 7/14: فحص الأبحاث...');
    const researchCount = await prisma.research.count();
    if (researchCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      research = await seedArabicResearch(prisma);
      console.log(`   ✅ تم إنشاء ${research.length} بحث\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${researchCount} بحث\n`);
      research = await prisma.research.findMany();
    }

    // ============================================
    // 8. إنشاء 30 جلسة مسجلة (Sessions)
    // ============================================
    console.log('🎥 المرحلة 8/14: فحص الجلسات المسجلة...');
    const sessionCount = await prisma.session.count();
    if (sessionCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      sessions = await seedArabicSessions(prisma);
      console.log(`   ✅ تم إنشاء ${sessions.length} جلسة مسجلة\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${sessionCount} جلسة مسجلة\n`);
      sessions = await prisma.session.findMany();
    }

    // ============================================
    // 9. إنشاء الأسئلة الشائعة (FAQs)
    // ============================================
    console.log('❓ المرحلة 9/14: فحص الأسئلة الشائعة...');
    const faqCount = await prisma.fAQ.count();
    if (faqCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      faqs = await seedArabicFAQs(prisma);
      console.log(`   ✅ تم إنشاء ${faqs.length} سؤال شائع\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${faqCount} سؤال شائع\n`);
      faqs = await prisma.fAQ.findMany();
    }

    // ============================================
    // 10. إنشاء 100 شهادة (Certificates)
    // ============================================
    console.log('📜 المرحلة 10/14: فحص الشهادات...');
    const certificateCount = await prisma.certificate.count();
    if (certificateCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      certificates = await seedArabicCertificates(prisma, users, courses);
      console.log(`   ✅ تم إنشاء ${certificates.length} شهادة\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${certificateCount} شهادة\n`);
      certificates = await prisma.certificate.findMany();
    }

    // ============================================
    // 11. إنشاء 300 إشعار (Notifications)
    // ============================================
    console.log('🔔 المرحلة 11/14: فحص الإشعارات...');
    const notificationCount = await prisma.notification.count();
    if (notificationCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      notifications = await seedArabicNotifications(prisma, users);
      console.log(`   ✅ تم إنشاء ${notifications.length} إشعار\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${notificationCount} إشعار\n`);
      notifications = await prisma.notification.findMany();
    }

    // ============================================
    // 12. إنشاء 350 تعليق (Comments)
    // ============================================
    console.log('💬 المرحلة 12/14: فحص التعليقات...');
    const commentCount = await prisma.comment.count();
    if (commentCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      comments = await seedArabicComments(prisma, users, factChecks);
      console.log(`   ✅ تم إنشاء ${comments.length} تعليق\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${commentCount} تعليق\n`);
      comments = await prisma.comment.findMany();
    }

    // ============================================
    // 13. إنشاء المحتوى المحفوظ (Saved Content)
    // ============================================
    console.log('💾 المرحلة 13/14: فحص المحتوى المحفوظ...');
    const savedContentCount = await prisma.savedContent.count();
    if (savedContentCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      savedContent = await seedArabicSavedContent(prisma, users, factChecks);
      console.log(`   ✅ تم إنشاء ${savedContent.length} محتوى محفوظ\n`);
    } else {
      console.log(
        `   ⏭️  تم تخطي: يوجد بالفعل ${savedContentCount} محتوى محفوظ\n`,
      );
      savedContent = await prisma.savedContent.findMany();
    }

    // ============================================
    // 14. إنشاء 40 منشور مدونة (Blog Posts)
    // ============================================
    console.log('📝 المرحلة 14/14: فحص منشورات المدونة...');
    const blogPostCount = await prisma.blog.count();
    if (blogPostCount === 0) {
      console.log('   ⏳ لا توجد بيانات، جارٍ الإضافة...');
      blogPosts = await seedBlogPosts(prisma, users);
      console.log(`   ✅ تم إنشاء ${blogPosts.length} منشور مدونة\n`);
    } else {
      console.log(`   ⏭️  تم تخطي: يوجد بالفعل ${blogPostCount} منشور مدونة\n`);
      blogPosts = await prisma.blog.findMany();
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🎉 اكتمل إنشاء البيانات العربية بنجاح!\n');
    console.log('📊 ملخص البيانات المُنشأة:');
    console.log('───────────────────────────────────────────────────────');
    console.log(`   👥 المستخدمون:           ${users.length}`);
    console.log(`   🏆 الإنجازات:            ${achievements.length}`);
    console.log(`   📰 فحوصات الحقائق:       ${factChecks.length}`);
    console.log(`   📝 الطلبات:              ${submissions.length}`);
    console.log(`   📚 الدورات:              ${courses.length}`);
    console.log(`   🎪 الفعاليات:            ${events.length}`);
    console.log(`   🔬 الأبحاث:              ${research.length}`);
    console.log(`   🎥 الجلسات المسجلة:      ${sessions.length}`);
    console.log(`   ❓ الأسئلة الشائعة:       ${faqs.length}`);
    console.log(`   📜 الشهادات:             ${certificates.length}`);
    console.log(`   🔔 الإشعارات:            ${notifications.length}`);
    console.log(`   💬 التعليقات:            ${comments.length}`);
    console.log(`   💾 المحتوى المحفوظ:      ${savedContent.length}`);
    console.log(`   📝 منشورات المدونة:      ${blogPosts.length}`);
    console.log('───────────────────────────────────────────────────────');

    const total =
      users.length +
      achievements.length +
      factChecks.length +
      submissions.length +
      courses.length +
      events.length +
      research.length +
      sessions.length +
      faqs.length +
      certificates.length +
      notifications.length +
      comments.length +
      savedContent.length +
      blogPosts.length;

    console.log(`   📈 إجمالي السجلات:       ${total}`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('✨ يمكنك الآن استخدام المنصة بالمحتوى العربي الكامل!\n');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إنشاء البيانات:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

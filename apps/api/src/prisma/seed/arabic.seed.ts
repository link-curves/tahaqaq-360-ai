import { PrismaClient } from '@prisma/client';
import { seedArabicAchievements } from './ar/achievements.arabic.seed';
import { seedArabicCertificates } from './ar/certificates.arabic.seed';
import { seedArabicComments } from './ar/comments.arabic.seed';
import { seedArabicCourses } from './ar/courses.arabic.seed';
import { seedArabicEvents } from './ar/events.arabic.seed';
import { seedArabicFactChecks } from './ar/factChecks.arabic.seed';
import { seedArabicFAQs } from './ar/faqs.arabic.seed';
import { seedArabicNotifications } from './ar/notifications.arabic.seed';
import { seedArabicResearch } from './ar/research.arabic.seed';
import { seedArabicSavedContent } from './ar/savedContent.arabic.seed';
import { seedArabicSessions } from './ar/sessions.arabic.seed';
import { seedArabicSubmissions } from './ar/submissions.arabic.seed';
import { seedArabicUsers } from './ar/users.arabic.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات العربية الشاملة...\n');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // ============================================
    // 1. إنشاء 100 مستخدم (Users)
    // ============================================
    console.log('👥 المرحلة 1/14: إنشاء المستخدمين...');
    const users = await seedArabicUsers(prisma);
    console.log(`   ✅ تم إنشاء ${users.length} مستخدم\n`);

    // ============================================
    // 2. إنشاء 50 إنجاز (Achievements)
    // ============================================
    console.log('🏆 المرحلة 2/14: إنشاء الإنجازات...');
    const achievements = await seedArabicAchievements(prisma);
    console.log(`   ✅ تم إنشاء ${achievements.length} إنجاز\n`);

    // ============================================
    // 3. إنشاء 200 فحص حقائق (Fact Checks)
    // ============================================
    console.log('📰 المرحلة 3/14: إنشاء فحوصات الحقائق...');
    const factChecks = await seedArabicFactChecks(prisma, users);
    console.log(`   ✅ تم إنشاء ${factChecks.length} فحص حقائق\n`);

    // ============================================
    // 4. إنشاء 250 طلب (Submissions)
    // ============================================
    console.log('📝 المرحلة 4/14: إنشاء الطلبات...');
    const submissions = await seedArabicSubmissions(prisma, users);
    console.log(`   ✅ تم إنشاء ${submissions.length} طلب\n`);

    // ============================================
    // 5. إنشاء 50 دورة (Courses)
    // ============================================
    console.log('📚 المرحلة 5/14: إنشاء الدورات مع الدروس...');
    const courses = await seedArabicCourses(prisma);
    console.log(`   ✅ تم إنشاء ${courses.length} دورة\n`);

    // ============================================
    // 6. إنشاء 100 فعالية (Events)
    // ============================================
    console.log('🎪 المرحلة 6/14: إنشاء الفعاليات...');
    const events = await seedArabicEvents(prisma);
    console.log(`   ✅ تم إنشاء ${events.length} فعالية\n`);

    // ============================================
    // 7. إنشاء 50 بحث (Research)
    // ============================================
    console.log('🔬 المرحلة 7/14: إنشاء الأبحاث...');
    const research = await seedArabicResearch(prisma);
    console.log(`   ✅ تم إنشاء ${research.length} بحث\n`);

    // ============================================
    // 8. إنشاء 30 جلسة مسجلة (Sessions)
    // ============================================
    console.log('🎥 المرحلة 8/14: إنشاء الجلسات المسجلة...');
    const sessions = await seedArabicSessions(prisma);
    console.log(`   ✅ تم إنشاء ${sessions.length} جلسة مسجلة\n`);

    // ============================================
    // 9. إنشاء الأسئلة الشائعة (FAQs)
    // ============================================
    console.log('❓ المرحلة 9/14: إنشاء الأسئلة الشائعة...');
    const faqs = await seedArabicFAQs(prisma);
    console.log(`   ✅ تم إنشاء ${faqs.length} سؤال شائع\n`);

    // ============================================
    // 10. إنشاء 100 شهادة (Certificates)
    // ============================================
    console.log('📜 المرحلة 10/14: إنشاء الشهادات...');
    const certificates = await seedArabicCertificates(prisma, users, courses);
    console.log(`   ✅ تم إنشاء ${certificates.length} شهادة\n`);

    // ============================================
    // 11. إنشاء 300 إشعار (Notifications)
    // ============================================
    console.log('🔔 المرحلة 11/14: إنشاء الإشعارات...');
    const notifications = await seedArabicNotifications(prisma, users);
    console.log(`   ✅ تم إنشاء ${notifications.length} إشعار\n`);

    // ============================================
    // 12. إنشاء 350 تعليق (Comments)
    // ============================================
    console.log('💬 المرحلة 12/14: إنشاء التعليقات...');
    const comments = await seedArabicComments(prisma, users, factChecks);
    console.log(`   ✅ تم إنشاء ${comments.length} تعليق\n`);

    // ============================================
    // 13. إنشاء المحتوى المحفوظ (Saved Content)
    // ============================================
    console.log('💾 المرحلة 13/14: إنشاء المحتوى المحفوظ...');
    const savedContent = await seedArabicSavedContent(
      prisma,
      users,
      factChecks,
    );
    console.log(`   ✅ تم إنشاء ${savedContent.length} محتوى محفوظ\n`);

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
      savedContent.length;

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

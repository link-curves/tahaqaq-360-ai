import {
  Notification,
  NotificationType,
  PrismaClient,
  User,
} from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';

export const seedArabicNotifications = async (
  prisma: PrismaClient,
  users: User[],
): Promise<Notification[]> => {
  console.log('🌱 البدء في إضافة الإشعارات بالعربية...');

  const notifications: Notification[] = [];
  const types: NotificationType[] = [
    'SUBMISSION_UPDATE',
    'EVENT_REMINDER',
    'ACHIEVEMENT_UNLOCKED',
    'CERTIFICATE_ISSUED',
    'SYSTEM',
  ];

  // Create notifications for random users
  for (let i = 0; i < 300; i++) {
    const user = randomElement(users);
    const type = randomElement(types);
    const isRead = Math.random() > 0.4;

    // Create notifications in the past 30 days
    const daysAgo = randomInt(0, 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    let title = '';
    let message = '';
    let actionUrl: string | undefined;

    switch (type) {
      case 'SUBMISSION_UPDATE':
        title = 'تحديث على طلبك';
        message = randomElement([
          'تم البدء في مراجعة طلبك للتحقق من الحقائق.',
          'طلبك قيد المراجعة من قبل فريق الخبراء.',
          'تم نشر نتيجة التحقق من طلبك.',
          'طلبك يحتاج إلى معلومات إضافية.',
          'تم التحقق من الادعاء الذي قدمته بنجاح.',
        ]);
        actionUrl = `/submissions/${randomInt(1, 100)}`;
        break;

      case 'EVENT_REMINDER':
        title = 'تذكير بالفعالية';
        message = randomElement([
          'ورشة العمل التي سجلت فيها ستبدأ غداً.',
          'الندوة عبر الإنترنت ستبدأ خلال ساعة واحدة.',
          'لا تنسَ حضور الفعالية المجدولة اليوم.',
          'المؤتمر الذي سجلت فيه سيبدأ خلال 3 أيام.',
          'ورشة العمل ستبدأ خلال 30 دقيقة.',
        ]);
        actionUrl = `/events/${randomInt(1, 100)}`;
        break;

      case 'ACHIEVEMENT_UNLOCKED':
        title = 'إنجاز جديد! 🎉';
        message = randomElement([
          'تهانينا! لقد حصلت على إنجاز "المساهم النشط".',
          'أحسنت! فتحت إنجاز "باحث عن المعرفة".',
          'رائع! حصلت على إنجاز "خبير التحقق".',
          'مبروك! فتحت إنجاز "حاضر الفعاليات".',
          'عمل ممتاز! حصلت على إنجاز "مكمل الدورات".',
        ]);
        actionUrl = `/profile/achievements`;
        break;

      case 'CERTIFICATE_ISSUED':
        title = 'شهادة جديدة 📜';
        message = randomElement([
          'تهانينا! شهادتك من دورة "التحقق من الحقائق" جاهزة للتحميل.',
          'شهادة إتمامك لدورة "التعليم الإعلامي" متاحة الآن.',
          'أحسنت! شهادتك من الدورة المتقدمة جاهزة.',
          'مبروك! يمكنك الآن تحميل شهادة إتمام الدورة.',
          'شهادتك الجديدة متاحة في ملفك الشخصي.',
        ]);
        actionUrl = `/certificates`;
        break;

      case 'SYSTEM':
        title = randomElement([
          'تحديث النظام',
          'إشعار هام',
          'ميزة جديدة',
          'صيانة مجدولة',
          'إعلان',
        ]);
        message = randomElement([
          'لقد أضفنا ميزات جديدة لتحسين تجربتك.',
          'سيكون الموقع غير متاح لفترة قصيرة للصيانة.',
          'تحديثات جديدة على منصة التحقق من الحقائق.',
          'تم تحسين أداء الموقع وإصلاح بعض المشاكل.',
          'نرحب بك في تحقق 360! استكشف جميع الميزات.',
        ]);
        actionUrl = Math.random() > 0.5 ? '/announcements' : undefined;
        break;
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        actionUrl,
        userId: user.id,
        isRead,
        createdAt,
        readAt: isRead
          ? new Date(createdAt.getTime() + randomInt(1, 48) * 60 * 60 * 1000)
          : null,
      },
    });

    notifications.push(notification);
  }

  console.log(`✅ تم إنشاء ${notifications.length} إشعار\n`);

  return notifications;
};

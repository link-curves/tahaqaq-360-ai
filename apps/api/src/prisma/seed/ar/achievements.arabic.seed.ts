import { Achievement, PrismaClient } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';

export const seedArabicAchievements = async (
  prisma: PrismaClient,
): Promise<Achievement[]> => {
  console.log('🌱 البدء في إضافة الإنجازات بالعربية...');

  const achievementCategories = [
    'المساهمة',
    'التعلم',
    'الاجتماعي',
    'الخبرة',
    'التقدم',
  ];
  const achievements = [];

  const achievementData = [
    {
      name: 'الخطوات الأولى',
      description: 'أنشئ حسابك',
      points: 10,
      criteria: { type: 'signup', count: 1 },
    },
    {
      name: 'الطلب الأول',
      description: 'قدم طلب التحقق الأول من الحقائق',
      points: 25,
      criteria: { type: 'submissions', count: 1 },
    },
    {
      name: 'مساهم نشط',
      description: 'قدم 10 طلبات للتحقق من الحقائق',
      points: 100,
      criteria: { type: 'submissions', count: 10 },
    },
    {
      name: 'مساهم متميز',
      description: 'قدم 50 طلباً للتحقق من الحقائق',
      points: 500,
      criteria: { type: 'submissions', count: 50 },
    },
    {
      name: 'مساهم محترف',
      description: 'قدم 100 طلب للتحقق من الحقائق',
      points: 1000,
      criteria: { type: 'submissions', count: 100 },
    },
    {
      name: 'بداية التعلم',
      description: 'سجل في دورتك الأولى',
      points: 20,
      criteria: { type: 'enrollments', count: 1 },
    },
    {
      name: 'مكمل الدورات',
      description: 'أكمل دورتك الأولى',
      points: 100,
      criteria: { type: 'completions', count: 1 },
    },
    {
      name: 'باحث عن المعرفة',
      description: 'أكمل 5 دورات',
      points: 500,
      criteria: { type: 'completions', count: 5 },
    },
    {
      name: 'عالم',
      description: 'أكمل 10 دورات',
      points: 1000,
      criteria: { type: 'completions', count: 10 },
    },
    {
      name: 'متعلم خبير',
      description: 'أكمل 25 دورة',
      points: 2500,
      criteria: { type: 'completions', count: 25 },
    },
    {
      name: 'حاضر الفعاليات',
      description: 'احضر فعاليتك الأولى',
      points: 30,
      criteria: { type: 'events', count: 1 },
    },
    {
      name: 'عاشق الفعاليات',
      description: 'احضر 5 فعاليات',
      points: 150,
      criteria: { type: 'events', count: 5 },
    },
    {
      name: 'مواظب على الفعاليات',
      description: 'احضر 10 فعاليات',
      points: 300,
      criteria: { type: 'events', count: 10 },
    },
    {
      name: 'بطل الفعاليات',
      description: 'احضر 25 فعالية',
      points: 750,
      criteria: { type: 'events', count: 25 },
    },
    {
      name: 'المعلق',
      description: 'اترك تعليقك الأول',
      points: 15,
      criteria: { type: 'comments', count: 1 },
    },
    {
      name: 'مناقش نشط',
      description: 'اترك 25 تعليقاً',
      points: 100,
      criteria: { type: 'comments', count: 25 },
    },
    {
      name: 'قائد النقاش',
      description: 'اترك 100 تعليق',
      points: 500,
      criteria: { type: 'comments', count: 100 },
    },
    {
      name: 'إنجاز النقاط الأول',
      description: 'اكسب 100 نقطة',
      points: 50,
      criteria: { type: 'points', count: 100 },
    },
    {
      name: 'إنجاز النقاط الثاني',
      description: 'اكسب 500 نقطة',
      points: 100,
      criteria: { type: 'points', count: 500 },
    },
    {
      name: 'إنجاز النقاط الثالث',
      description: 'اكسب 1000 نقطة',
      points: 200,
      criteria: { type: 'points', count: 1000 },
    },
    {
      name: 'إنجاز النقاط الرابع',
      description: 'اكسب 5000 نقطة',
      points: 500,
      criteria: { type: 'points', count: 5000 },
    },
    {
      name: 'سيد النقاط',
      description: 'اكسب 10000 نقطة',
      points: 1000,
      criteria: { type: 'points', count: 10000 },
    },
    {
      name: 'نجم صاعد',
      description: 'وصل للمستوى 5',
      points: 250,
      criteria: { type: 'level', count: 5 },
    },
    {
      name: 'مخضرم',
      description: 'وصل للمستوى 10',
      points: 500,
      criteria: { type: 'level', count: 10 },
    },
    {
      name: 'أسطورة',
      description: 'وصل للمستوى 20',
      points: 1000,
      criteria: { type: 'level', count: 20 },
    },
    {
      name: 'المتبني المبكر',
      description: 'انضم في الشهر الأول',
      points: 100,
      criteria: { type: 'early', count: 1 },
    },
    {
      name: 'سلسلة أسبوع',
      description: 'سجل دخول لمدة 7 أيام متتالية',
      points: 50,
      criteria: { type: 'streak', count: 7 },
    },
    {
      name: 'سلسلة شهر',
      description: 'سجل دخول لمدة 30 يوماً متتالياً',
      points: 250,
      criteria: { type: 'streak', count: 30 },
    },
    {
      name: 'مفيد',
      description: 'احصل على 10 إعجابات على تعليقاتك',
      points: 100,
      criteria: { type: 'upvotes', count: 10 },
    },
    {
      name: 'مفيد جداً',
      description: 'احصل على 50 إعجاباً على تعليقاتك',
      points: 500,
      criteria: { type: 'upvotes', count: 50 },
    },
    {
      name: 'خبير الاختبارات',
      description: 'اجتز 10 اختبارات',
      points: 200,
      criteria: { type: 'quizzes', count: 10 },
    },
    {
      name: 'الدرجة الكاملة',
      description: 'احصل على 100% في 5 اختبارات',
      points: 300,
      criteria: { type: 'perfect', count: 5 },
    },
    {
      name: 'حاصل على شهادة',
      description: 'احصل على شهادتك الأولى',
      points: 200,
      criteria: { type: 'certificates', count: 1 },
    },
    {
      name: 'متعدد الشهادات',
      description: 'احصل على 5 شهادات',
      points: 1000,
      criteria: { type: 'certificates', count: 5 },
    },
    {
      name: 'بناء السمعة',
      description: 'وصل لسمعة 100',
      points: 100,
      criteria: { type: 'reputation', count: 100 },
    },
    {
      name: 'معروف جيداً',
      description: 'وصل لسمعة 500',
      points: 500,
      criteria: { type: 'reputation', count: 500 },
    },
    {
      name: 'مؤثر',
      description: 'وصل لسمعة 1000',
      points: 1000,
      criteria: { type: 'reputation', count: 1000 },
    },
    {
      name: 'حافظ المحتوى',
      description: 'احفظ 10 فحوصات حقائق',
      points: 50,
      criteria: { type: 'saved', count: 10 },
    },
    {
      name: 'جامع الحقائق',
      description: 'احفظ 50 فحص حقائق',
      points: 250,
      criteria: { type: 'saved', count: 50 },
    },
    {
      name: 'المشارك',
      description: 'شارك 10 فحوصات حقائق',
      points: 100,
      criteria: { type: 'shares', count: 10 },
    },
    {
      name: 'المشارك المتفاعل',
      description: 'شارك 50 فحص حقائق',
      points: 500,
      criteria: { type: 'shares', count: 50 },
    },
    {
      name: 'بومة الليل',
      description: 'قدم محتوى بعد منتصف الليل',
      points: 25,
      criteria: { type: 'night', count: 1 },
    },
    {
      name: 'الطائر المبكر',
      description: 'قدم محتوى قبل الساعة 6 صباحاً',
      points: 25,
      criteria: { type: 'morning', count: 1 },
    },
    {
      name: 'محارب نهاية الأسبوع',
      description: 'قدم 10 عناصر في عطلة نهاية الأسبوع',
      points: 150,
      criteria: { type: 'weekend', count: 10 },
    },
    {
      name: 'خبير التحقق',
      description: 'تحقق من 10 طلبات',
      points: 500,
      criteria: { type: 'verified', count: 10 },
    },
    {
      name: 'مساهم عالي الجودة',
      description: 'تحقق من 20 طلباً',
      points: 1000,
      criteria: { type: 'verified', count: 20 },
    },
    {
      name: 'المكتمل',
      description: 'أكمل ملفك الشخصي 100%',
      points: 50,
      criteria: { type: 'profile', count: 100 },
    },
    {
      name: 'الفراشة الاجتماعية',
      description: 'تواصل مع 25 مستخدماً',
      points: 200,
      criteria: { type: 'connections', count: 25 },
    },
    {
      name: 'لاعب الفريق',
      description: 'تعاون في 5 فحوصات حقائق',
      points: 300,
      criteria: { type: 'collaborations', count: 5 },
    },
    {
      name: 'الداعم طويل الأمد',
      description: 'نشط لمدة 6 أشهر',
      points: 500,
      criteria: { type: 'tenure', count: 180 },
    },
  ];

  for (const data of achievementData) {
    const achievement = await prisma.achievement.create({
      data: {
        ...data,
        icon: ['🏆', '⭐', '💯', '🎯', '🔥', '✨', '🎖️', '👑', '💎', '🌟'][
          randomInt(0, 9)
        ],
        category: randomElement(achievementCategories),
      },
    });
    achievements.push(achievement);
  }

  console.log(`✅ تم إنشاء ${achievements.length} إنجاز\n`);

  return achievements;
};

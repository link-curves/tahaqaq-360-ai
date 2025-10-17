import { ContentStatus, PrismaClient, Session } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import { arabicTags } from './data/arabic.data';

export const seedArabicSessions = async (
  prisma: PrismaClient,
): Promise<Session[]> => {
  console.log('🌱 البدء في إضافة الجلسات المسجلة بالعربية...');

  const sessions: Session[] = [];
  const statuses: ContentStatus[] = ['PUBLISHED', 'DRAFT', 'ARCHIVED'];

  const sessionTitles = [
    'مقدمة في التحقق من الحقائق',
    'تقنيات التعليم الإعلامي المتقدمة',
    'كيفية اكتشاف المعلومات المضللة',
    'أدوات التحقق الرقمي',
    'التفكير النقدي في العصر الرقمي',
    'مكافحة الأخبار الكاذبة على وسائل التواصل الاجتماعي',
    'التحقق من الصور والفيديوهات',
    'تحليل المصادر الإعلامية',
    'استراتيجيات البحث المتقدم',
    'الذكاء الاصطناعي في التحقق من الحقائق',
    'أخلاقيات الصحافة والتحقق',
    'التعامل مع نظريات المؤامرة',
    'التحقق من البيانات والإحصائيات',
    'دور وسائل الإعلام في نشر المعلومات',
    'بناء مهارات البحث الصحفي',
    'التحقق السريع: تقنيات عملية',
    'فهم تحيزات الإعلام',
    'التعليم الإعلامي للشباب',
    'حماية الخصوصية الرقمية',
    'التحقق من الادعاءات الصحية',
    'الأمن السيبراني والمعلومات المضللة',
    'استخدام المصادر المفتوحة للتحقق',
    'تحليل الخطاب الإعلامي',
    'التحقق من المحتوى الفيروسي',
    'استراتيجيات التواصل الفعال',
    'دراسات حالة في التحقق من الحقائق',
    'التعامل مع الضغوط النفسية للمحققين',
    'التحقق من الادعاءات السياسية',
    'بناء محتوى موثوق',
    'المستقبل الرقمي والتحديات القادمة',
  ];

  for (let i = 0; i < 30; i++) {
    const title = randomElement(sessionTitles);
    const status = i < 25 ? 'PUBLISHED' : randomElement(statuses);
    const duration = randomInt(30, 180);

    // Recorded in the past year
    const daysAgo = randomInt(0, 365);
    const recordedAt = new Date();
    recordedAt.setDate(recordedAt.getDate() - daysAgo);

    const publishedAt =
      status === 'PUBLISHED'
        ? new Date(recordedAt.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000)
        : null;

    const session = await prisma.session.create({
      data: {
        title,
        slug: `session-ar-${i + 1}-${title.split(' ').slice(0, 3).join('-').toLowerCase()}`,
        description: `جلسة مسجلة حول ${title}. هذه الجلسة تقدم رؤى عميقة ومهارات عملية في مجال التحقق من الحقائق والتعليم الإعلامي. مناسبة للمبتدئين والمتقدمين على حد سواء.`,
        videoUrl: `https://videos.tahaqaq360.com/ar/session-${i + 1}`,
        thumbnailUrl: `https://picsum.photos/seed/session-ar-${i + 1}/1280/720`,
        duration,
        views: status === 'PUBLISHED' ? randomInt(100, 10000) : 0,
        speakers: [
          {
            name: randomElement([
              'د. محمد الأحمد',
              'أ. فاطمة الزهراء',
              'د. أحمد خالد',
              'أ. سارة محمود',
              'د. عبدالله سعيد',
              'أ. مريم العلي',
            ]),
            title: randomElement([
              'خبير التحقق من الحقائق',
              'أستاذ الإعلام',
              'مدير الأبحاث',
              'محلل المعلومات المضللة',
            ]),
            bio: 'خبير بارز في مجال التحقق من الحقائق والتعليم الإعلامي.',
            photo: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`,
          },
        ],
        topics: Array.from({ length: randomInt(3, 6) }, () =>
          randomElement(arabicTags),
        ),
        resources: [
          {
            title: 'العرض التقديمي',
            url: `https://resources.tahaqaq360.com/ar/session-${i + 1}/slides.pdf`,
            type: 'pdf',
          },
          {
            title: 'ملاحظات الجلسة',
            url: `https://resources.tahaqaq360.com/ar/session-${i + 1}/notes.pdf`,
            type: 'pdf',
          },
          ...(Math.random() > 0.5
            ? [
                {
                  title: 'مصادر إضافية',
                  url: `https://resources.tahaqaq360.com/ar/session-${i + 1}/references.pdf`,
                  type: 'pdf',
                },
              ]
            : []),
        ],
        status,
        publishedAt,
        recordedAt,
      },
    });

    sessions.push(session);
  }

  console.log(`✅ تم إنشاء ${sessions.length} جلسة مسجلة\n`);

  return sessions;
};

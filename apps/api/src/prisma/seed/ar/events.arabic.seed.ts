import { Event, PrismaClient } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import { arabicEventTitles, arabicTags } from './data/arabic.data';
import { EventStatusCode, EventTypeCode } from '../../../common/constants/lookups';

export const seedArabicEvents = async (
  prisma: PrismaClient,
): Promise<Event[]> => {
  console.log('🌱 البدء في إضافة الفعاليات بالعربية...');

  const events: Event[] = [];
  const now = new Date();

  const eventTypes: EventTypeCode[] = [
    'WORKSHOP',
    'WEBINAR',
    'CONFERENCE',
    'TRAINING',
    'EXHIBITION',
  ];
  const eventStatuses: EventStatusCode[] = [
    'UPCOMING',
    'ONGOING',
    'COMPLETED',
    'CANCELLED',
  ];

  for (let i = 0; i < 100; i++) {
    const title = randomElement(arabicEventTitles);
    const type = randomElement(eventTypes);
    const isVirtual = Math.random() > 0.4;

    // Create events in past, present, and future
    const daysOffset = randomInt(-90, 180);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + daysOffset);
    startDate.setHours(randomInt(9, 18), 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + randomInt(2, 8));

    let status: EventStatusCode;
    if (daysOffset < -7) {
      status = Math.random() > 0.1 ? 'COMPLETED' : 'CANCELLED';
    } else if (daysOffset < 0) {
      status = 'ONGOING';
    } else {
      status = 'UPCOMING';
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug: `event-ar-${i + 1}-${title.split(' ').slice(0, 3).join('-').toLowerCase()}`,
        description: `انضم إلينا في ${title}. هذه ${type === 'WORKSHOP' ? 'ورشة عمل' : type === 'WEBINAR' ? 'ندوة عبر الإنترنت' : type === 'CONFERENCE' ? 'مؤتمر' : type === 'TRAINING' ? 'تدريب' : 'معرض'} شاملة تستكشف موضوعات مهمة في التحقق من الحقائق والتعليم الإعلامي. سيكتسب المشاركون رؤى قيمة ومهارات عملية.`,
        typeCode: type,
        statusCode: status,
        startDate,
        endDate,
        isVirtual,
        location: isVirtual
          ? null
          : randomElement([
              'مركز الرياض للمؤتمرات',
              'فندق هيلتون جدة',
              'مركز دبي الدولي للمؤتمرات والمعارض',
              'قاعة الملك فيصل للمؤتمرات',
              'مركز الشيخ جابر الأحمد الثقافي',
              'مركز بيروت الدولي للمعارض والترفيه',
              'مركز القاهرة الدولي للمؤتمرات',
              'فندق الريتز كارلتون',
              'مركز الملك عبدالعزيز الثقافي العالمي',
              'مركز عمان للمؤتمرات والمعارض',
            ]),
        virtualLink: isVirtual
          ? `https://meet.tahaqaq360.com/ar/event-${i + 1}`
          : null,
        maxAttendees: randomInt(50, 500),
        coverImage: `https://picsum.photos/seed/event-ar-${i + 1}/800/450`,
        tags: Array.from({ length: randomInt(3, 6) }, () =>
          randomElement(arabicTags),
        ),
        speakers: [
          {
            name: randomElement([
              'د. محمد الأحمد',
              'أ. فاطمة الزهراء',
              'د. أحمد خالد',
              'أ. سارة محمود',
              'د. عبدالله سعيد',
              'أ. مريم العلي',
              'د. خالد العتيبي',
              'أ. نورة المطيري',
            ]),
            title: randomElement([
              'خبير التحقق من الحقائق',
              'أستاذ الإعلام',
              'مدير الأبحاث',
              'محلل المعلومات المضللة',
              'مدرب التعليم الإعلامي',
              'باحث أول',
            ]),
            bio: 'خبير بارز في مجال التحقق من الحقائق والتعليم الإعلامي مع أكثر من 10 سنوات من الخبرة.',
            photo: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`,
          },
          {
            name: randomElement([
              'د. عمر الحسن',
              'أ. ليلى السالم',
              'د. يوسف الكريم',
              'أ. هدى الشمري',
            ]),
            title: randomElement([
              'استشاري الاتصالات',
              'مختص الأمن السيبراني',
              'محلل البيانات',
              'خبير التكنولوجيا',
            ]),
            bio: 'متحدث ذو خبرة واسعة في التواصل الرقمي والأمن الإلكتروني.',
            photo: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`,
          },
        ],
        agenda: [
          {
            time: '09:00',
            title: 'التسجيل والقهوة الترحيبية',
            duration: '30 دقيقة',
          },
          {
            time: '09:30',
            title: 'الكلمة الافتتاحية',
            duration: '45 دقيقة',
          },
          {
            time: '10:15',
            title: 'استراحة',
            duration: '15 دقيقة',
          },
          {
            time: '10:30',
            title: 'الجلسة الأولى: أساسيات التحقق من الحقائق',
            duration: '60 دقيقة',
          },
          {
            time: '11:30',
            title: 'الجلسة الثانية: أدوات وتقنيات متقدمة',
            duration: '60 دقيقة',
          },
          {
            time: '12:30',
            title: 'استراحة الغداء',
            duration: '60 دقيقة',
          },
          {
            time: '13:30',
            title: 'ورشة عمل تفاعلية',
            duration: '90 دقيقة',
          },
          {
            time: '15:00',
            title: 'جلسة أسئلة وأجوبة',
            duration: '30 دقيقة',
          },
          {
            time: '15:30',
            title: 'الملاحظات الختامية',
            duration: '30 دقيقة',
          },
        ],
        requirements:
          type === 'TRAINING'
            ? [
                'إحضار جهاز كمبيوتر محمول',
                'معرفة أساسية باستخدام الإنترنت',
                'التسجيل المسبق مطلوب',
              ]
            : type === 'WORKSHOP'
              ? ['إحضار جهاز كمبيوتر محمول', 'التسجيل المسبق مطلوب']
              : ['التسجيل المسبق مطلوب'],
      },
    });

    events.push(event);
  }

  console.log(`✅ تم إنشاء ${events.length} فعالية\n`);

  return events;
};

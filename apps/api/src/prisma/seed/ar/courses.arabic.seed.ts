import { Course, PrismaClient } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import { arabicCourseTitles, arabicLessonTitles } from './data/arabic.data';

export const seedArabicCourses = async (
  prisma: PrismaClient,
): Promise<Course[]> => {
  console.log('🌱 البدء في إضافة الدورات بالعربية...');

  const courses: Course[] = [];

  for (let i = 0; i < 50; i++) {
    const title = randomElement(arabicCourseTitles);
    const difficulty = randomElement(['Beginner', 'Intermediate', 'Advanced']);
    const lessonCount = randomInt(5, 20);
    const duration = lessonCount * randomInt(10, 30);

    const course = await prisma.course.create({
      data: {
        title,
        slug: `course-ar-${i + 1}-${title.split(' ').slice(0, 3).join('-').toLowerCase()}`,
        description: `تعلم كل شيء عن ${title}. هذه الدورة تغطي جميع الجوانب الأساسية والمتقدمة التي تحتاج إلى معرفتها.`,
        difficulty,
        duration,
        order: i,
        isPublished: i < 45,
        learningObjectives: [
          'فهم المفاهيم الأساسية',
          'تطبيق التقنيات المتقدمة',
          'تطوير مهارات التفكير النقدي',
          'تحليل المعلومات بفعالية',
          'التعرف على الأنماط الشائعة',
        ],
        prerequisites:
          difficulty === 'Advanced'
            ? [
                'معرفة أساسية بالموضوع',
                'اكتمال الدورات التمهيدية',
                'مهارات البحث الأساسية',
              ]
            : [],
        coverImage: `https://picsum.photos/seed/course-ar-${i + 1}/800/450`,
        lessons: {
          create: Array.from({ length: lessonCount }, (_, j) => ({
            title: randomElement(arabicLessonTitles),
            slug: `lesson-ar-${j + 1}`,
            content: `<h2>نظرة عامة</h2><p>هذا الدرس يستكشف ${randomElement(arabicLessonTitles)}. سوف نتعمق في المفاهيم الأساسية ونقدم أمثلة عملية.</p><h3>الأهداف التعليمية</h3><ul><li>فهم المبادئ الأساسية</li><li>تحديد العناصر الرئيسية</li><li>تطبيق المعرفة عملياً</li><li>تقييم النتائج بشكل نقدي</li></ul><h3>المحتوى الرئيسي</h3><p>سنبدأ باستكشاف الإطار النظري، ثم ننتقل إلى التطبيقات العملية. تأكد من متابعة الأمثلة بعناية.</p>`,
            duration: randomInt(10, 30),
            order: j + 1,
            videoUrl:
              j % 2 === 0 ? `https://example.com/video-ar-${i}-${j}` : null,
            resources:
              j % 3 === 0
                ? [
                    {
                      title: 'دليل الدرس',
                      url: `https://example.com/resource-ar-${i}-${j}.pdf`,
                      type: 'pdf',
                    },
                  ]
                : [],
          })),
        },
      },
    });

    courses.push(course);
  }

  console.log(`✅ تم إنشاء ${courses.length} دورة\n`);

  return courses;
};

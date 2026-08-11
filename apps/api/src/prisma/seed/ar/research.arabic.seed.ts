import { PrismaClient, Research } from '@prisma/client';
import { randomElement, randomInt } from '../helpers/seed.helper';
import {
  arabicFirstNames,
  arabicLastNames,
  arabicResearchCategories,
  arabicResearchTitles,
  arabicTags,
} from './data/arabic.data';
import { ContentStatusCode } from '../../../common/constants/lookups';

export const seedArabicResearch = async (
  prisma: PrismaClient,
): Promise<Research[]> => {
  console.log('🌱 البدء في إضافة الأبحاث بالعربية...');

  const researchPapers: Research[] = [];
  const statuses: ContentStatusCode[] = ['PUBLISHED', 'DRAFT', 'ARCHIVED'];

  for (let i = 0; i < 50; i++) {
    const title = randomElement(arabicResearchTitles);
    const status = i < 45 ? 'PUBLISHED' : randomElement(statuses);
    const category = randomElement(arabicResearchCategories);

    // Create authors (1-4 authors per paper)
    const authorCount = randomInt(1, 4);
    const authors = Array.from(
      { length: authorCount },
      () =>
        `${randomElement(arabicFirstNames)} ${randomElement(arabicLastNames)}`,
    );

    const publishedAt =
      status === 'PUBLISHED'
        ? new Date(Date.now() - randomInt(0, 365) * 24 * 60 * 60 * 1000)
        : null;

    const research = await prisma.research.create({
      data: {
        title,
        slug: `research-ar-${i + 1}-${title.split(' ').slice(0, 4).join('-').toLowerCase()}`,
        summary: `${title} - بحث شامل يستكشف الجوانب المختلفة لهذا الموضوع المهم. يقدم هذا البحث تحليلاً معمقاً للاتجاهات الحالية والتحديات والفرص في مجال ${category}. من خلال منهجية صارمة وتحليل بيانات شامل، نقدم رؤى قيمة للباحثين والممارسين على حد سواء.`,
        fullContent: `
          <article class="research-paper">
            <h1>${title}</h1>
            
            <div class="authors">
              <p><strong>الباحثون:</strong> ${authors.join('، ')}</p>
            </div>
            
            <h2>الملخص</h2>
            <p>
              يستكشف هذا البحث الجوانب الحاسمة لـ${category} في السياق المعاصر. 
              من خلال الفحص الدقيق للاتجاهات الحالية والأساليب الناشئة، نقدم تحليلاً شاملاً 
              للتحديات والفرص في هذا المجال. تسلط النتائج التي توصلنا إليها الضوء على 
              الحاجة إلى زيادة الوعي والأدوات الأفضل لمكافحة المعلومات المضللة.
            </p>
            
            <h2>المقدمة</h2>
            <p>
              في عصر تتزايد فيه المعلومات المضللة بشكل كبير، أصبح فهم ${category} 
              أكثر أهمية من أي وقت مضى. يهدف هذا البحث إلى سد الفجوة بين النظرية والتطبيق، 
              مقدماً رؤى قابلة للتنفيذ للممارسين والباحثين.
            </p>
            
            <h3>خلفية البحث</h3>
            <p>
              يعتمد بحثنا على دراسات سابقة في مجال التحقق من الحقائق والتعليم الإعلامي، 
              موسعاً نطاق المعرفة من خلال دراسات حالة جديدة وتحليل بيانات شامل. 
              لقد حددنا العديد من الفجوات في الأدبيات الموجودة التي يسعى بحثنا إلى معالجتها.
            </p>
            
            <h2>المنهجية</h2>
            <p>
              استخدمنا منهجية بحث مختلطة تجمع بين التحليل الكمي والنوعي. 
              يتضمن ذلك:
            </p>
            <ul>
              <li>مسح شامل لـ 500+ مشارك</li>
              <li>مقابلات متعمقة مع خبراء في المجال</li>
              <li>تحليل محتوى لأكثر من 1000 ادعاء تم التحقق منه</li>
              <li>النمذجة الإحصائية وتحليل الاتجاهات</li>
            </ul>
            
            <h3>جمع البيانات</h3>
            <p>
              تم جمع البيانات على مدى فترة ستة أشهر، مما يضمن توزيعاً تمثيلياً 
              عبر مختلف الفئات السكانية والمناطق الجغرافية. تمت الموافقة على البروتوكول 
              البحثي من قبل لجنة الأخلاقيات المؤسسية.
            </p>
            
            <h2>النتائج</h2>
            <p>
              كشف تحليلنا عن عدة نتائج رئيسية:
            </p>
            <ol>
              <li><strong>الاتجاه 1:</strong> هناك علاقة قوية بين مستوى التعليم الإعلامي وقدرة تحديد المعلومات المضللة</li>
              <li><strong>الاتجاه 2:</strong> منصات التواصل الاجتماعي تلعب دوراً حاسماً في انتشار المعلومات الكاذبة</li>
              <li><strong>الاتجاه 3:</strong> هناك حاجة متزايدة لأدوات تحقق آلية من الحقائق</li>
              <li><strong>الاتجاه 4:</strong> التدخلات التعليمية تظهر نتائج واعدة في بناء المرونة ضد المعلومات المضللة</li>
            </ol>
            
            <h3>تحليل البيانات</h3>
            <p>
              أظهر التحليل الإحصائي علاقات ذات دلالة إحصائية (p < 0.05) بين 
              العديد من المتغيرات الرئيسية. النتائج قوية عبر مختلف اختبارات الحساسية 
              والنماذج البديلة.
            </p>
            
            <h2>المناقشة</h2>
            <p>
              تحمل نتائجنا آثاراً مهمة لكل من النظرية والتطبيق. تؤكد على 
              الحاجة إلى نهج متعدد الأوجه لمكافحة المعلومات المضللة، يجمع بين 
              التدخلات التعليمية والحلول التكنولوجية وإصلاحات السياسات.
            </p>
            
            <h3>الآثار المترتبة على الممارسة</h3>
            <p>
              يمكن للممارسين الاستفادة من نتائجنا من خلال تنفيذ برامج تعليمية 
              إعلامية أكثر فعالية واستخدام أدوات التحقق من الحقائق القائمة على الأدلة. 
              نقدم توصيات محددة لمنظمات الإعلام والمؤسسات التعليمية وصانعي السياسات.
            </p>
            
            <h2>الخلاصة</h2>
            <p>
              يساهم هذا البحث في الفهم المتزايد لـ${category} من خلال تقديم 
              أدلة تجريبية ورؤى قابلة للتنفيذ. بينما تبقى تحديات، فإن النتائج التي توصلنا 
              إليها تشير إلى طرق واعدة للمضي قدماً في مكافحة المعلومات المضللة 
              وبناء محو الأمية الإعلامية.
            </p>
            
            <h3>الأبحاث المستقبلية</h3>
            <p>
              نوصي بالبحث المستقبلي في المجالات التالية:
            </p>
            <ul>
              <li>دراسات طولية لتتبع التغيرات بمرور الوقت</li>
              <li>أبحاث عبر ثقافية لفهم السياقات المختلفة</li>
              <li>استكشاف التقنيات الناشئة في التحقق من الحقائق</li>
              <li>تحليل تأثير التدخلات على السلوك الفعلي</li>
            </ul>
            
            <h2>المراجع</h2>
            <ol>
              <li>أحمد، م.، وخالد، س. (2023). التحقق من الحقائق في العصر الرقمي. مجلة البحوث الإعلامية العربية، 15(2), 45-67.</li>
              <li>فاطمة، أ.، وعلي، ه. (2023). التعليم الإعلامي واستراتيجيات المرونة. مجلة الاتصال والتكنولوجيا، 8(1), 112-134.</li>
              <li>سعيد، ع.، ومحمد، ن. (2022). دور وسائل التواصل الاجتماعي في انتشار المعلومات. المجلة الدولية لدراسات الإعلام، 20(4), 301-325.</li>
              <li>مريم، ل.، ويوسف، ك. (2022). الأدوات الآلية للتحقق من الحقائق: مراجعة شاملة. مجلة علوم الكمبيوتر والمعلومات، 12(3), 189-215.</li>
            </ol>
          </article>
        `,
        authors,
        category,
        tags: Array.from({ length: randomInt(4, 8) }, () =>
          randomElement(arabicTags),
        ),
        coverImage: `https://picsum.photos/seed/research-ar-${i + 1}/1200/630`,
        attachments: [
          {
            title: 'ورقة البحث الكاملة (PDF)',
            url: `https://example.com/research/ar/${i + 1}/full-paper.pdf`,
            type: 'pdf',
            size: randomInt(500, 5000) + 'KB',
          },
          {
            title: 'مجموعة البيانات',
            url: `https://example.com/research/ar/${i + 1}/dataset.csv`,
            type: 'csv',
            size: randomInt(100, 2000) + 'KB',
          },
          {
            title: 'العرض التقديمي',
            url: `https://example.com/research/ar/${i + 1}/presentation.pptx`,
            type: 'pptx',
            size: randomInt(1000, 10000) + 'KB',
          },
        ],
        statusCode: status,
        publishedAt,
        views: status === 'PUBLISHED' ? randomInt(50, 5000) : 0,
        downloads: status === 'PUBLISHED' ? randomInt(10, 500) : 0,
      },
    });

    researchPapers.push(research);
  }

  console.log(`✅ تم إنشاء ${researchPapers.length} بحث\n`);

  return researchPapers;
};

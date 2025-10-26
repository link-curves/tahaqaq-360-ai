import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "الأسئلة العامة",
      faqs: [
        {
          question: "ما هي منصة تحقق 360؟",
          answer:
            "تحقق 360 هي منصة رائدة لفحص الحقائق والتحقق من صحة المعلومات باستخدام تقنيات الذكاء الاصطناعي المتقدمة. نهدف إلى مكافحة المعلومات المضللة وتعزيز الوعي الإعلامي في المجتمع العربي.",
        },
        {
          question: "كيف تعمل تقنية فحص الحقائق؟",
          answer:
            "تستخدم منصتنا خوارزميات الذكاء الاصطناعي المتطورة لتحليل المحتوى ومقارنته بمصادر موثوقة متعددة. النظام يفحص النصوص والصور ومقاطع الفيديو ويقدم تقييماً شاملاً لمصداقية المعلومات.",
        },
        {
          question: "هل الخدمة مجانية؟",
          answer:
            "نعم، الخدمات الأساسية لفحص الحقائق مجانية تماماً. كما نوفر خطط مدفوعة للمؤسسات والشركات التي تحتاج ميزات متقدمة وإمكانيات أكبر للتحليل.",
        },
      ],
    },
    {
      title: "استخدام المنصة",
      faqs: [
        {
          question: "كيف أقوم بفحص معلومة معينة؟",
          answer:
            "يمكنك ببساطة نسخ النص أو رفع الصورة أو إدراج رابط المقال في أداة الفحص الخاصة بنا. سيقوم النظام بتحليل المحتوى وتقديم تقرير مفصل عن مصداقيته خلال ثوانٍ معدودة.",
        },
        {
          question: "ما هي أنواع المحتوى التي يمكن فحصها؟",
          answer:
            "نحن نفحص النصوص والمقالات الإخبارية والصور ومقاطع الفيديو والتسجيلات الصوتية. كما نتحقق من المعلومات الإحصائية والبيانات والاقتباسات.",
        },
        {
          question: "كم من الوقت يستغرق الحصول على النتائج؟",
          answer:
            "معظم عمليات الفحص تكتمل خلال 10-30 ثانية للنصوص البسيطة، وقد تستغرق دقيقة إلى دقيقتين للمحتوى المعقد أو الملفات الكبيرة.",
        },
      ],
    },
    {
      title: "الحساب والأمان",
      faqs: [
        {
          question: "هل أحتاج لإنشاء حساب؟",
          answer:
            "يمكنك استخدام الخدمات الأساسية بدون حساب، لكن إنشاء حساب يتيح لك حفظ تاريخ عمليات البحث والوصول للميزات المتقدمة والتسجيل في الدورات التعليمية.",
        },
        {
          question: "كيف تحمون بياناتي الشخصية؟",
          answer:
            "نلتزم بأعلى معايير الأمان والخصوصية. جميع البيانات مشفرة ولا نشارك معلوماتك الشخصية مع أي طرف ثالث. يمكنك مراجعة سياسة الخصوصية الكاملة للمزيد من التفاصيل.",
        },
        {
          question: "كيف أغير كلمة المرور؟",
          answer:
            "يمكنك تغيير كلمة المرور من خلال الذهاب إلى إعدادات الحساب والنقر على 'تغيير كلمة المرور'. ستحتاج إلى إدخال كلمة المرور الحالية ثم كلمة المرور الجديدة مرتين للتأكيد.",
        },
      ],
    },
    {
      title: "الدورات والفعاليات",
      faqs: [
        {
          question: "كيف أسجل في الدورات التعليمية؟",
          answer:
            "تصفح قسم الدورات في الموقع واختر الدورة المناسبة لك. انقر على 'التسجيل' وأكمل النموذج المطلوب. ستتلقى بريداً إلكترونياً بتفاصيل الدورة ورابط الحضور.",
        },
        {
          question: "هل الدورات مجانية؟",
          answer:
            "معظم دوراتنا مجانية كجزء من مهمتنا في نشر الوعي الإعلامي. بعض الدورات المتخصصة والشهادات المهنية قد تتطلب رسوماً رمزية.",
        },
        {
          question: "هل أحصل على شهادة بعد انتهاء الدورة؟",
          answer:
            "نعم، نقدم شهادات إتمام معتمدة لجميع الدورات. يمكنك تحميل الشهادة من حسابك بعد اجتياز الاختبار النهائي بنجاح.",
        },
      ],
    },
    {
      title: "المشاكل التقنية",
      faqs: [
        {
          question: "الموقع لا يعمل بشكل صحيح، ماذا أفعل؟",
          answer:
            "جرب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت للمتصفح. إذا استمرت المشكلة، تأكد من أن متصفحك محدث أو جرب متصفحاً آخر. يمكنك أيضاً التواصل مع الدعم الفني.",
        },
        {
          question: "لا أستطيع رفع الملفات، ما السبب؟",
          answer:
            "تأكد من أن حجم الملف لا يتجاوز الحد المسموح (عادة 10MB للصور و 50MB للفيديو). تأكد أيضاً من أن نوع الملف مدعوم (JPG, PNG, MP4, PDF، إلخ).",
        },
        {
          question: "نتائج الفحص غير دقيقة، كيف أبلغ عن خطأ؟",
          answer:
            "يمكنك الإبلاغ عن الأخطاء من خلال النقر على 'الإبلاغ عن مشكلة' في صفحة النتائج، أو التواصل معنا مباشرة عبر البريد الإلكتروني مع تفاصيل المشكلة.",
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const id = categoryIndex * 1000 + faqIndex;
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 mt-18"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              إجابات شاملة على أكثر الأسئلة شيوعاً حول منصة تحقق 360
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 text-lg text-gray-900 bg-white rounded-2xl border-0 shadow-lg pl-14"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const id = categoryIndex * 1000 + faqIndex;
                  const isOpen = openFAQ === id;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full px-6 py-6 text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {faq.question}
                          </h3>
                          <div className="mr-4 flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              لم نجد نتائج مطابقة
            </h3>
            <p className="text-gray-600">
              جرب البحث بكلمات أخرى أو تصفح الأقسام المختلفة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;

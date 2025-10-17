import { Button } from "@/components/ui/button";
import {
  Accessibility,
  Eye,
  Heart,
  Keyboard,
  Monitor,
  Volume2,
} from "lucide-react";

const AccessibilityStatement = () => {
  const features = [
    {
      icon: Eye,
      title: "الدعم البصري",
      description: "تباين ألوان عالي، خطوط واضحة، وإمكانية تكبير النصوص",
      details: [
        "نسبة تباين لا تقل عن 4.5:1 للنصوص العادية",
        "إمكانية تكبير النصوص حتى 200% بدون فقدان الوظائف",
        "ألوان واضحة وتباين جيد للمستخدمين ضعاف البصر",
        "رموز وأيقونات واضحة مع نصوص بديلة",
      ],
    },
    {
      icon: Keyboard,
      title: "التنقل بلوحة المفاتيح",
      description: "إمكانية التنقل الكامل باستخدام لوحة المفاتيح فقط",
      details: [
        "جميع العناصر التفاعلية قابلة للوصول بـ Tab",
        "ترتيب منطقي للتنقل بين العناصر",
        "مؤشرات واضحة للعنصر المحدد حالياً",
        "اختصارات لوحة مفاتيح للوظائف الرئيسية",
      ],
    },
    {
      icon: Volume2,
      title: "دعم قارئات الشاشة",
      description: "متوافق مع أشهر برامج قراءة الشاشة",
      details: [
        "علامات ARIA صحيحة لجميع العناصر",
        "نصوص بديلة شاملة للصور والمحتوى المرئي",
        "تسميات واضحة للنماذج والأزرار",
        "تحديثات ديناميكية للمحتوى المتغير",
      ],
    },
    {
      icon: Monitor,
      title: "التوافق مع المتصفحات",
      description: "يعمل على جميع المتصفحات الحديثة والأجهزة المختلفة",
      details: [
        "متوافق مع Chrome, Firefox, Safari, Edge",
        "يعمل على أجهزة سطح المكتب والجوال واللوحية",
        "استجابة ممتازة لأحجام الشاشات المختلفة",
        "أداء سريع وموثوق عبر جميع الأجهزة",
      ],
    },
  ];

  const standards = [
    {
      name: "WCAG 2.1 Level AA",
      description: "نلتزم بإرشادات إمكانية الوصول للمحتوى الويب المستوى AA",
    },
    {
      name: "Section 508",
      description: "متوافق مع معايير Section 508 الأمريكية",
    },
    {
      name: "EN 301 549",
      description: "يتبع المعيار الأوروبي لإمكانية الوصول",
    },
    {
      name: "ADA Compliance",
      description: "متوافق مع قانون الأمريكيين ذوي الإعاقة",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Accessibility className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              بيان إمكانية الوصول
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              التزامنا بجعل منصة تحقق 360 متاحة ومفيدة للجميع
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Commitment Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            التزامنا بإمكانية الوصول
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            نؤمن في تحقق 360 بأن الوصول إلى المعلومات الصحيحة حق للجميع، بغض
            النظر عن قدراتهم أو إعاقاتهم. نعمل باستمرار على تحسين إمكانية الوصول
            لمنصتنا لضمان تجربة شاملة ومريحة لجميع المستخدمين.
          </p>
        </div>

        {/* Accessibility Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            ميزات إمكانية الوصول
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-xl">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{feature.description}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            المعايير المتبعة
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {standards.map((standard, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {standard.name}
                </h3>
                <p className="text-gray-600">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testing and Monitoring */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            الاختبار والمراقبة المستمرة
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                عملية الاختبار
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• اختبارات يدوية منتظمة من قبل مستخدمين حقيقيين</li>
                <li>• استخدام أدوات اختبار إمكانية الوصول الآلية</li>
                <li>• مراجعة دورية من خبراء إمكانية الوصول</li>
                <li>• اختبار مع قارئات الشاشة المختلفة</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                التحسين المستمر
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• تحديثات منتظمة بناءً على ملاحظات المستخدمين</li>
                <li>• مواكبة أحدث معايير إمكانية الوصول</li>
                <li>• تدريب مستمر لفريق التطوير</li>
                <li>• رصد وإصلاح المشاكل بسرعة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Known Issues */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-16">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">
            المشاكل المعروفة والتحسينات القادمة
          </h2>
          <div className="text-yellow-700 space-y-2">
            <p>• نعمل على تحسين دعم اللغة العربية في قارئات الشاشة</p>
            <p>• تطوير خاصية الوصف الصوتي للرسوم البيانية والصور المعقدة</p>
            <p>• إضافة المزيد من اختصارات لوحة المفاتيح للوظائف المتقدمة</p>
            <p>• تحسين أداء المنصة على الأجهزة المساعدة القديمة</p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ملاحظاتكم مهمة
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            إذا واجهتم أي صعوبات في الوصول إلى أي جزء من منصتنا، أو لديكم
            اقتراحات لتحسين إمكانية الوصول، يرجى التواصل معنا. نحن نقدر
            ملاحظاتكم ونعمل على تطبيقها بسرعة.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl inline-block mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                البريد الإلكتروني
              </h3>
              <p className="text-gray-600 text-sm">
                accessibility@tahaqaq360.com
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl inline-block mb-3">
                <Volume2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">الهاتف</h3>
              <p className="text-gray-600 text-sm">+971 4 123 4567</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl inline-block mb-3">
                <Keyboard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                نموذج التواصل
              </h3>
              <p className="text-gray-600 text-sm">استخدم صفحة التواصل</p>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold">
            تواصل معنا بخصوص إمكانية الوصول
          </Button>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            مصادر إضافية
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="#"
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                دليل إمكانية الوصول
              </h3>
              <p className="text-gray-600 text-sm">
                تعلم كيفية استخدام ميزات إمكانية الوصول في المنصة
              </p>
            </a>

            <a
              href="#"
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                اختصارات لوحة المفاتيح
              </h3>
              <p className="text-gray-600 text-sm">
                قائمة شاملة بجميع اختصارات لوحة المفاتيح المتاحة
              </p>
            </a>

            <a
              href="#"
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                تقرير إمكانية الوصول
              </h3>
              <p className="text-gray-600 text-sm">
                تقرير مفصل عن حالة إمكانية الوصول الحالية والخطط المستقبلية
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;

import { AlertTriangle, Calendar, FileText, Shield } from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "1 يناير 2025";

  const sections = [
    {
      id: "acceptance",
      title: "قبول الشروط",
      icon: FileText,
      content: `
        مرحباً بكم في منصة تحقق 360. هذه الشروط والأحكام ("الشروط") تحكم استخدامكم لموقعنا الإلكتروني وخدماتنا 
        ("الخدمة") التي تديرها شركة تحقق 360 ("نحن"، "لنا"، أو "الخاص بنا").

        باستخدامكم لخدمتنا، فإنكم توافقون على الالتزام بهذه الشروط. إذا كنتم لا توافقون على أي جزء من هذه الشروط، 
        فلا يجوز لكم الوصول إلى الخدمة أو استخدامها.

        هذه الشروط تطبق على جميع الزوار والمستخدمين وغيرهم ممن يصلون إلى الخدمة أو يستخدمونها.
      `,
    },
    {
      id: "service-description",
      title: "وصف الخدمة",
      icon: Shield,
      content: `
        تحقق 360 هي منصة إلكترونية تقدم خدمات فحص الحقائق والتحقق من صحة المعلومات باستخدام تقنيات الذكاء الاصطناعي.

        **الخدمات المتاحة:**
        • فحص النصوص والمقالات والأخبار للتحقق من صحتها
        • تحليل الصور ومقاطع الفيديو للكشف عن التلاعب
        • تقديم تقارير مفصلة حول مصداقية المعلومات
        • دورات تعليمية في محو الأمية الإعلامية
        • فعاليات وورش عمل متخصصة
        • واجهة برمجة تطبيقات (API) للمطورين

        **قيود الخدمة:**
        • الخدمة متاحة باللغتين العربية والإنجليزية
        • قد تتطلب بعض الميزات المتقدمة اشتراكاً مدفوعاً
        • النتائج هي اجتهادات تقنية وليست أحكاماً قضائية نهائية
        • لا نضمن دقة النتائج بنسبة 100% في جميع الحالات
      `,
    },
    {
      id: "user-accounts",
      title: "حسابات المستخدمين",
      icon: Shield,
      content: `
        **إنشاء الحساب:**
        • يجب أن تكونوا بعمر 16 سنة على الأقل لإنشاء حساب
        • المعلومات المقدمة يجب أن تكون دقيقة وحديثة
        • أنتم مسؤولون عن الحفاظ على سرية كلمة المرور
        • حساب واحد فقط مسموح لكل شخص

        **أمان الحساب:**
        • يجب إبلاغنا فوراً عن أي استخدام غير مصرح به لحسابكم
        • نحن غير مسؤولين عن أي خسائر ناتجة عن عدم حماية بيانات دخولكم
        • يحق لنا تعليق أو إنهاء الحسابات المشبوهة أو المخالفة

        **إدارة الحساب:**
        • يمكنكم تحديث معلوماتكم الشخصية في أي وقت
        • يمكنكم حذف حسابكم نهائياً عبر الإعدادات
        • سنحتفظ ببعض المعلومات حسب متطلبات القانون
      `,
    },
    {
      id: "acceptable-use",
      title: "الاستخدام المقبول",
      icon: AlertTriangle,
      content: `
        **الاستخدامات المسموحة:**
        • فحص المعلومات للأغراض المشروعة والتعليمية
        • استخدام النتائج للبحث الأكاديمي والصحفي
        • المشاركة في الدورات والفعاليات التعليمية
        • تطوير تطبيقات تعليمية باستخدام API

        **الاستخدامات المحظورة:**
        • نشر معلومات مضللة أو كاذبة
        • محاولة اختراق أو إلحاق الضرر بالنظام
        • انتهاك حقوق الطبع والنشر أو الملكية الفكرية
        • التحايل على قيود الاستخدام أو الرسوم
        • استخدام الخدمة لأغراض إجرامية أو ضارة
        • إنشاء حسابات وهمية أو متعددة
        • إرسال رسائل عشوائية أو محتوى إعلاني غير مرغوب

        **العقوبات:**
        • تحذير أو تعليق مؤقت للحساب
        • إنهاء نهائي للحساب في الحالات الخطيرة
        • اتخاذ إجراءات قانونية عند الضرورة
      `,
    },
    {
      id: "intellectual-property",
      title: "الملكية الفكرية",
      icon: Shield,
      content: `
        **حقوقنا:**
        • جميع حقوق الملكية الفكرية للمنصة والخدمات تعود لنا
        • العلامة التجارية "تحقق 360" والشعار محميان قانونياً
        • خوارزميات الذكاء الاصطناعي والتقنيات المستخدمة ملكنا
        • لا يجوز نسخ أو تقليد أو استخدام تقنياتنا بدون إذن

        **حقوق المحتوى المرسل:**
        • تحتفظون بحقوق الملكية للمحتوى الذي ترسلونه للفحص
        • تمنحوننا حق استخدام المحتوى لأغراض التحليل والتحسين
        • لن نشارك محتواكم مع أطراف ثالثة بدون موافقتكم
        • يمكنكم طلب حذف المحتوى من خوادمنا في أي وقت

        **استخدام النتائج:**
        • يحق لكم استخدام ومشاركة نتائج الفحص
        • يجب ذكر المصدر عند نقل النتائج (تحقق 360)
        • لا يجوز بيع أو تجارة النتائج بشكل منفصل
        • النتائج للاستخدام الشخصي والتعليمي فقط (ما لم ينص على خلاف ذلك)
      `,
    },
    {
      id: "payments",
      title: "المدفوعات والاشتراكات",
      icon: FileText,
      content: `
        **الخدمات المدفوعة:**
        • بعض الميزات المتقدمة تتطلب اشتراكاً مدفوعاً
        • الأسعار واضحة ومعلنة على الموقع
        • جميع المدفوعات تتم عبر بوابات دفع آمنة
        • الأسعار قابلة للتغيير مع إشعار مسبق 30 يوماً

        **الفوترة:**
        • الاشتراكات تتجدد تلقائياً ما لم تلغوها
        • الفواتير ترسل عبر البريد الإلكتروني
        • جميع الرسوم المحلية والضرائب مسؤوليتكم
        • لا نسترد الرسوم المدفوعة إلا في حالات خاصة

        **الإلغاء والاسترداد:**
        • يمكن إلغاء الاشتراك في أي وقت من إعدادات الحساب
        • الإلغاء يصبح سارياً في نهاية دورة الفوترة الحالية
        • استرداد نسبي متاح في حالة إيقاف الخدمة من جانبنا
        • لا استرداد في حالة انتهاك شروط الاستخدام
      `,
    },
    {
      id: "disclaimers",
      title: "إخلاء المسؤولية",
      icon: AlertTriangle,
      content: `
        **طبيعة الخدمة:**
        • نتائج فحص الحقائق هي اجتهادات تقنية وليست أحكاماً نهائية
        • التقنية قد تحتوي على أخطاء أو قيود في بعض الحالات
        • النتائج للاسترشاد فقط ولا تغني عن التحقق اليدوي المتخصص
        • لا نضمن اتخاذ قرارات صحيحة بناءً على نتائجنا

        **قيود المسؤولية:**
        • غير مسؤولين عن أي أضرار مباشرة أو غير مباشرة
        • لا نتحمل مسؤولية القرارات المتخذة بناءً على نتائج الخدمة
        • مسؤوليتنا القصوى محدودة بقيمة الاشتراك المدفوع (إن وجد)
        • لا نضمن توفر الخدمة بدون انقطاع أو أخطاء

        **استخدام النتائج:**
        • النتائج للأغراض الإعلامية والتعليمية فقط
        • لا يجوز الاعتماد عليها كدليل وحيد في قضايا مهمة
        • ننصح بالتحقق من مصادر متعددة للموضوعات الحساسة
        • المسؤولية النهائية عن التحقق تقع على عاتق المستخدم
      `,
    },
    {
      id: "termination",
      title: "إنهاء الخدمة",
      icon: AlertTriangle,
      content: `
        **إنهاء من جانبكم:**
        • يمكنكم إنهاء حسابكم في أي وقت عبر الإعدادات
        • الإنهاء لا يؤثر على الالتزامات السابقة
        • قد نحتفظ ببعض البيانات حسب متطلبات القانون
        • يمكن استعادة الحساب خلال 30 يوماً من الحذف

        **إنهاء من جانبنا:**
        • يحق لنا إنهاء أو تعليق حسابكم عند انتهاك الشروط
        • سنحاول إشعاركم مسبقاً إلا في الحالات الطارئة
        • في حالة الإنهاء، تفقدون الوصول فوراً للخدمة
        • البيانات المخزنة قد تحذف خلال 90 يوماً

        **آثار الإنهاء:**
        • توقف جميع الخدمات والوصول للحساب
        • الاشتراكات المدفوعة لا تسترد (إلا في حالات خاصة)
        • يمكن تحميل البيانات قبل الإنهاء النهائي
        • الشروط المتعلقة بالملكية الفكرية تبقى سارية
      `,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">شروط الخدمة</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto mb-6">
              الشروط والأحكام التي تحكم استخدام منصة تحقق 360
            </p>
            <div className="flex items-center justify-center gap-2 text-red-100">
              <Calendar className="h-5 w-5" />
              <span>آخر تحديث: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-12 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 ml-4 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                تنبيه مهم
              </h3>
              <p className="text-yellow-700">
                يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا. استخدام المنصة
                يعني موافقتكم الكاملة على جميع هذه الشروط والأحكام.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">المحتويات</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <section.icon className="h-5 w-5 text-red-600 group-hover:text-red-700" />
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-xl">
                  <section.icon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                {section.content
                  .trim()
                  .split("\n\n")
                  .map((paragraph, pIndex) => {
                    if (
                      paragraph.trim().startsWith("**") &&
                      paragraph.trim().endsWith("**")
                    ) {
                      return (
                        <h3
                          key={pIndex}
                          className="text-xl font-bold text-gray-900 mt-8 mb-4"
                        >
                          {paragraph.replace(/\*\*/g, "")}
                        </h3>
                      );
                    }

                    if (paragraph.trim().startsWith("•")) {
                      const items = paragraph
                        .split("\n")
                        .filter((item) => item.trim().startsWith("•"));
                      return (
                        <ul
                          key={pIndex}
                          className="list-disc list-inside space-y-2 mr-6"
                        >
                          {items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-gray-600">
                              {item.replace("•", "").trim()}
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <p key={pIndex} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-8 text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">أسئلة حول الشروط؟</h2>
          <p className="text-red-100 mb-6">
            إذا كانت لديكم أي أسئلة حول شروط الخدمة، نحن هنا للمساعدة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-red-100">
              البريد الإلكتروني: legal@tahaqaq360.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

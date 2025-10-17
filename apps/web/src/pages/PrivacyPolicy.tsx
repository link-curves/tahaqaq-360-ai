import { Calendar, Lock, Shield, Users } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "1 يناير 2025";

  const sections = [
    {
      id: "introduction",
      title: "المقدمة",
      icon: Shield,
      content: `
        مرحباً بكم في منصة تحقق 360. نحن نقدر ثقتكم بنا ونلتزم بحماية خصوصيتكم ومعلوماتكم الشخصية. 
        تهدف سياسة الخصوصية هذه إلى شرح كيفية جمع واستخدام وحماية المعلومات التي تقدمونها لنا عند استخدام منصتنا.
        
        باستخدامكم لخدماتنا، فإنكم توافقون على الممارسات الموضحة في هذه السياسة. إذا كنتم لا توافقون على أي جزء من هذه السياسة، 
        يرجى عدم استخدام خدماتنا.
      `,
    },
    {
      id: "information-collection",
      title: "المعلومات التي نجمعها",
      icon: Users,
      content: `
        نجمع أنواعاً مختلفة من المعلومات لتقديم خدماتنا وتحسينها:

        **المعلومات الشخصية:**
        • الاسم والبريد الإلكتروني عند التسجيل
        • معلومات الاتصال (رقم الهاتف، العنوان) إذا قدمتموها طوعاً
        • بيانات الملف الشخصي والتفضيلات

        **معلومات الاستخدام:**
        • عناوين IP والمتصفح ونظام التشغيل
        • سجلات النشاط وتفاعلكم مع المنصة
        • محتوى فحص الحقائق المرسل للتحليل
        • ملفات تعريف الارتباط وتقنيات التتبع المشابهة

        **المعلومات التقنية:**
        • معرفات الجهاز والمعلومات الفنية للجهاز
        • بيانات الموقع الجغرافي (إذا سمحتم بذلك)
        • معلومات الشبكة والاتصال
      `,
    },
    {
      id: "information-use",
      title: "كيفية استخدام المعلومات",
      icon: Lock,
      content: `
        نستخدم المعلومات المجمعة للأغراض التالية:

        **تقديم الخدمات:**
        • معالجة طلبات فحص الحقائق وتقديم النتائج
        • إدارة حساباتكم وتفضيلاتكم
        • تقديم الدعم الفني والرد على استفساراتكم

        **التحسين والتطوير:**
        • تحليل أداء المنصة وتحسين الخدمات
        • تطوير ميزات جديدة وتحسين الموجود منها
        • إجراء البحوث والتحليلات لفهم احتياجات المستخدمين

        **التواصل:**
        • إرسال إشعارات مهمة حول الخدمة
        • تقديم معلومات حول التحديثات والميزات الجديدة
        • إرسال نشرات إخبارية (بموافقتكم)

        **الأمان والامتثال:**
        • حماية المنصة من الاحتيال وسوء الاستخدام
        • الامتثال للقوانين واللوائح المعمول بها
        • حل النزاعات وإنفاذ شروط الخدمة
      `,
    },
    {
      id: "information-sharing",
      title: "مشاركة المعلومات",
      icon: Users,
      content: `
        نحن لا نبيع أو نؤجر أو نتاجر بمعلوماتكم الشخصية. قد نشارك المعلومات في الحالات المحدودة التالية:

        **مقدمو الخدمات:**
        • شركاء تقنيون موثوقون يساعدون في تشغيل المنصة
        • خدمات الحوسبة السحابية وتخزين البيانات
        • أدوات التحليلات والمراقبة (مع إخفاء الهوية)

        **المتطلبات القانونية:**
        • عند وجود أمر قضائي أو طلب حكومي ساري المفعول
        • لحماية حقوقنا القانونية أو سلامة المستخدمين
        • في حالات الاندماج أو الاستحواذ (بعد إشعاركم)

        **الموافقة الصريحة:**
        • عندما تمنحوننا موافقة صريحة لمشاركة معلومات محددة
        • لتقديم خدمات إضافية طلبتموها
      `,
    },
    {
      id: "data-security",
      title: "أمان البيانات",
      icon: Shield,
      content: `
        نطبق تدابير أمنية صارمة لحماية معلوماتكم:

        **التشفير:**
        • جميع البيانات المنقولة محمية بتشفير SSL/TLS
        • تشفير البيانات المخزنة باستخدام معايير الصناعة
        • تشفير كلمات المرور باستخدام خوارزميات آمنة

        **التحكم في الوصول:**
        • المصادقة الثنائية للحسابات الحساسة
        • صلاحيات محدودة للموظفين حسب الحاجة
        • مراجعة دورية لصلاحيات الوصول

        **المراقبة والحماية:**
        • مراقبة مستمرة للأنشطة المشبوهة
        • أنظمة كشف التسلل والحماية من الهجمات
        • نسخ احتياطية منتظمة ومشفرة للبيانات

        **الامتثال:**
        • اتباع معايير الأمان الدولية (ISO 27001)
        • مراجعات أمنية دورية من جهات خارجية
        • خطط طوارئ للاستجابة للحوادث الأمنية
      `,
    },
    {
      id: "user-rights",
      title: "حقوقكم",
      icon: Users,
      content: `
        لديكم حقوق مهمة فيما يتعلق بمعلوماتكم الشخصية:

        **الوصول والاطلاع:**
        • طلب نسخة من جميع المعلومات التي نحتفظ بها عنكم
        • الاطلاع على كيفية استخدام معلوماتكم
        • معرفة من شاركنا معلوماتكم معه (إن وجد)

        **التصحيح والتحديث:**
        • تصحيح المعلومات غير الدقيقة
        • تحديث المعلومات القديمة أو المتغيرة
        • إكمال المعلومات الناقصة

        **الحذف والإلغاء:**
        • طلب حذف حسابكم ومعلوماتكم نهائياً
        • إلغاء الاشتراك في النشرات الإخبارية
        • سحب الموافقة على معالجة معلومات محددة

        **النقل والتصدير:**
        • الحصول على نسخة قابلة للقراءة آلياً من بياناتكم
        • نقل بياناتكم إلى خدمة أخرى (حيثما أمكن)

        لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@tahaqaq360.com
      `,
    },
    {
      id: "cookies",
      title: "ملفات تعريف الارتباط",
      icon: Lock,
      content: `
        نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتكم:

        **ملفات تعريف الارتباط الضرورية:**
        • إدارة جلسات تسجيل الدخول
        • حفظ تفضيلات الأمان واللغة
        • ضمان عمل الوظائف الأساسية للموقع

        **ملفات تعريف الارتباط التحليلية:**
        • فهم كيفية استخدام الموقع وتحسينه
        • قياس أداء الصفحات والميزات
        • تحديد المحتوى الأكثر شعبية

        **ملفات تعريف الارتباط الوظيفية:**
        • تذكر تفضيلاتكم وإعداداتكم
        • تخصيص المحتوى والتوصيات
        • تسهيل المشاركة على وسائل التواصل الاجتماعي

        يمكنكم التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح، لكن تذكروا أن تعطيل بعضها قد يؤثر على وظائف الموقع.
      `,
    },
    {
      id: "updates",
      title: "تحديثات السياسة",
      icon: Calendar,
      content: `
        قد نقوم بتحديث هذه السياسة من وقت لآخر لتعكس التغييرات في خدماتنا أو القوانين المعمول بها:

        **إشعارات التحديث:**
        • سنعلمكم بأي تغييرات جوهرية عبر البريد الإلكتروني
        • سننشر إشعاراً على الموقع قبل تطبيق التغييرات
        • سنحدث تاريخ "آخر تحديث" في أعلى هذه الصفحة

        **مراجعة منتظمة:**
        • ننصحكم بمراجعة هذه السياسة بانتظام
        • التحديثات الطفيفة قد لا تتطلب إشعاراً منفصلاً
        • استمرار استخدام الخدمة يعني موافقتكم على التحديثات

        **حقوق التراجع:**
        • إذا لم توافقوا على التحديثات، يمكنكم إنهاء حسابكم
        • لديكم 30 يوماً من تاريخ الإشعار للتراجع
        • سنحتفظ بالسياسة السابقة لمدة سنة للمرجعية
      `,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              التزامنا بحماية خصوصيتكم وبياناتكم الشخصية
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Calendar className="h-5 w-5" />
              <span>آخر تحديث: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                <section.icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
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
                <div className="bg-blue-100 p-3 rounded-xl">
                  <section.icon className="h-6 w-6 text-blue-600" />
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">أسئلة حول الخصوصية؟</h2>
          <p className="text-blue-100 mb-6">
            إذا كانت لديكم أي أسئلة أو مخاوف حول سياسة الخصوصية، لا تترددوا في
            التواصل معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-blue-100">
              البريد الإلكتروني: privacy@tahaqaq360.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

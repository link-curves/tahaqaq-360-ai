import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const FactCheckingSection = () => {
  const recentChecks = [
    {
      claim: "تقنية الذكاء الاصطناعي الجديدة يمكنها التنبؤ بالزلازل بدقة 100%",
      status: "false",
      summary:
        "رغم تحسن الذكاء الاصطناعي في التنبؤ بالزلازل، إلا أن ادعاءات الدقة 100% مضللة.",
      date: "2024-06-15",
      image:
        "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=200&fit=crop",
    },
    {
      claim:
        "استخدام وسائل التواصل الاجتماعي مرتبط بانخفاض فترة التركيز لدى الطلاب",
      status: "partially-true",
      summary: "تظهر الدراسات وجود علاقة لكن السببية ما زالت قيد البحث.",
      date: "2024-06-14",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    },
    {
      claim: "اختراق جديد في الطاقة المتجددة يمكنه تشغيل مدن بأكملها",
      status: "true",
      summary: "التحسينات الأخيرة في كفاءة الألواح الشمسية تدعم هذا الادعاء.",
      date: "2024-06-13",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop",
    },
    {
      claim: "اللقاحات الجديدة ضد كوفيد-19 تحتوي على رقائق تتبع",
      status: "false",
      summary: "لا يوجد أي دليل علمي يدعم وجود رقائق تتبع في اللقاحات.",
      date: "2024-06-12",
      image:
        "https://images.unsplash.com/photo-1584118624012-df056829fbd0?w=400&h=200&fit=crop",
    },
    {
      claim: "القهوة تقلل من خطر الإصابة بأمراض القلب",
      status: "partially-true",
      summary: "بعض الدراسات تدعم هذا، لكن الكمية والنوعية مهمان.",
      date: "2024-06-11",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop",
    },
    {
      claim: "تغير المناخ سبب رئيسي في زيادة الكوارث الطبيعية",
      status: "true",
      summary:
        "الأدلة العلمية تؤكد الصلة بين تغير المناخ وزيادة شدة الكوارث الطبيعية.",
      date: "2024-06-10",
      image:
        "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "true":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "false":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "partially-true":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "true":
        return "bg-green-100 text-green-800";
      case "false":
        return "bg-red-100 text-red-800";
      case "partially-true":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "true":
        return "صحيح";
      case "false":
        return "خاطئ";
      case "partially-true":
        return "صحيح جزئياً";
      default:
        return "قيد المراجعة";
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-50/30 to-indigo-50/50 py-20"
      id="fact-checking"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {" "}
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            فحص الحقائق بالذكاء الاصطناعي
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-['Cairo']">
            أرسل الادعاءات للتحقق باستخدام خوارزميات الذكاء الاصطناعي المتقدمة
            التي تحلل المصادر وتتقاطع مع البيانات وتقدم تقارير مفصلة لفحص
            الحقائق
          </p>
          {/* Coming Soon Overlay */}
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 opacity-30">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="أدخل ادعاءً أو عنوان خبر للتحقق منه..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right"
                    disabled
                  />
                </div>
                <Button
                  disabled
                  className="bg-red-600 hover:bg-red-700 px-8 py-3 whitespace-nowrap"
                >
                  <Search className="h-4 w-4 ml-2" />
                  التحقق من الادعاء
                </Button>
              </div>

              {/* Coming Soon Badge */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold shadow-lg">
                    <span className="animate-pulse mr-2">🚀</span>
                    قريباً
                  </div>{" "}
                  <p className="mt-3 text-gray-600 font-['Cairo']">
                    نعمل على تطوير هذه الميزة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {" "}
          <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center font-['Cairo']">
            فحوصات الحقائق الأخيرة
          </h3>{" "}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentChecks.map((check, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative"
              >
                {/* Card Image with Enhanced Effects */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={check.image}
                    alt={check.claim}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                  {/* Floating Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg ${getStatusColor(
                        check.status
                      )} border-0`}
                    >
                      {getStatusIcon(check.status)}
                      <span className="text-xs font-semibold font-['Cairo']">
                        {getStatusText(check.status)}
                      </span>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-xs text-gray-700 font-medium font-['Cairo']">
                        {check.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content with Flex Layout for Equal Height */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed text-lg group-hover:text-red-600 transition-colors duration-300 flex-grow-0">
                    {check.claim}
                  </h4>

                  <p className="text-gray-600 text-sm mb-6 text-right font-['Cairo'] leading-relaxed flex-grow">
                    {check.summary}
                  </p>

                  {/* Button with Enhanced Hover Effects */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg group-hover:border-red-300"
                  >
                    <span className="flex items-center justify-center space-x-2 space-x-reverse">
                      <span>اقرأ التحليل الكامل</span>
                      <svg
                        className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </span>
                  </Button>
                </div>

                {/* Subtle Card Accent */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-['Cairo']">
            عرض جميع فحوصات الحقائق
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FactCheckingSection;

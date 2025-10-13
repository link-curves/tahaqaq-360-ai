import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Users, Award } from "lucide-react";

const MediaLiteracySection = () => {
  const courses = [
    {
      title: "مقدمة في محو الأمية الإعلامية",
      description: "تعلم أساسيات تحديد المصادر الموثوقة والتعرف على التحيز",
      icon: BookOpen,
      level: "مبتدئ",
      duration: "ساعتان",
      students: "1,250",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
    },
    {
      title: "كشف التزييف العميق والمحتوى المولد بالذكاء الاصطناعي",
      description:
        "تقنيات متقدمة لاكتشاف الوسائط المتلاعب بها والمحتوى الاصطناعي",
      icon: Video,
      level: "متقدم",
      duration: "3 ساعات",
      students: "850",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
    },
    {
      title: "التحقق من وسائل التواصل الاجتماعي",
      description: "الأدوات والطرق للتحقق من المعلومات على المنصات الاجتماعية",
      icon: Users,
      level: "متوسط",
      duration: "ساعتان ونصف",
      students: "2,100",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    },
    {
      title: "تحليل الأخبار المزيفة والشائعات",
      description:
        "استراتيجيات فعالة لتحليل وفضح الأخبار المضللة والمعلومات الخاطئة",
      icon: BookOpen,
      level: "متوسط",
      duration: "ساعتان ونصف",
      students: "1,680",
      image:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
    },
    {
      title: "أمان الطفل الرقمي ومحو الأمية الإعلامية",
      description: "حماية الأطفال من المعلومات المضللة وتعليم التفكير النقدي",
      icon: Users,
      level: "مبتدئ",
      duration: "ساعة ونصف",
      students: "3,200",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop",
    },
    {
      title: "صحافة البيانات والتحقق من الإحصائيات",
      description: "فهم وتحليل البيانات الإحصائية والرسوم البيانية المضللة",
      icon: Video,
      level: "متقدم",
      duration: "4 ساعات",
      students: "920",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    },
  ];
  return (
    <div
      className="bg-gradient-to-br from-emerald-50/30 to-teal-50/50 py-20"
      id="education"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            تعليم محو الأمية الإعلامية
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Cairo']">
            دورات وموارد شاملة لمساعدتك في التنقل في المشهد الرقمي للمعلومات
            وتطوير مهارات التفكير النقدي للعصر الحديث
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                {/* Floating Level Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                    <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Icon Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-red-600/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                    <course.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed group-hover:text-red-600 transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 font-['Cairo']">
                  <span className="flex items-center">
                    <span className="ml-1">⏱️</span>
                    {course.duration}
                  </span>
                  <span className="flex items-center">
                    <span className="ml-1">👥</span>
                    {course.students} طالب
                  </span>
                </div>

                <Button className="w-full mt-auto bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg text-white">
                  <span className="flex items-center justify-center space-x-2 space-x-reverse text-white">
                    <span className="text-white">ابدأ التعلم</span>
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

              {/* Card Accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>{" "}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-0">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {" "}
              <div className="mb-4 text-right">
                <h3 className="text-2xl font-bold text-gray-900 font-['Cairo'] inline-flex items-center">
                  <Award className="h-8 w-8 text-red-600 ml-3" />
                  احصل على الشهادة
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-right font-['Cairo'] leading-relaxed">
                أكمل برنامج محو الأمية الإعلامية الشامل واحصل على شهادة معتمدة
                لإظهار خبرتك في التحقق من المعلومات الرقمية
              </p>{" "}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="pr-3">شهادة معترف بها في الصناعة</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="pr-3">شارة رقمية قابلة للمشاركة</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="pr-3">نقاط التعليم المستمر</span>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 px-8 rounded-lg text-white">
                ابدأ مسار الشهادة
              </Button>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 text-center border border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-2 font-['Cairo']">
                5,000+
              </div>
              <div className="text-gray-700 font-medium mb-4 font-['Cairo']">
                خريج معتمد
              </div>
              <div className="text-sm text-gray-600 font-['Cairo'] text-center leading-relaxed">
                انضم إلى آلاف المعلمين والصحفيين والمواطنين الرقميين الذين
                أكملوا برنامج الشهادة لدينا
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLiteracySection;

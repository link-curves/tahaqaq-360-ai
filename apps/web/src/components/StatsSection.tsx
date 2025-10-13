import { TrendingUp, Users, BookOpen, Shield } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Shield,
      number: "10,000+",
      label: "حقيقة تم التحقق منها",
      color: "text-red-500",
    },
    {
      icon: Users,
      number: "50,000+",
      label: "طالب تم تعليمه",
      color: "text-red-500",
    },
    {
      icon: BookOpen,
      number: "200+",
      label: "مورد تعليمي",
      color: "text-red-500",
    },
    {
      icon: TrendingUp,
      number: "99.2%",
      label: "معدل الدقة",
      color: "text-red-500",
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-red-50 to-rose-50 py-20"
      dir="rtl"
      style={{ fontFamily: "Noto Sans Arabic, Cairo, Amiri, serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            موثوق به من قبل المعلمين في جميع أنحاء العالم
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ساعدت منصتنا الآلاف في مكافحة المعلومات المضللة وبناء مهارات محو
            الأمية الإعلامية
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-red-100 hover:border-red-200">
                <div className="relative mb-6">
                  <stat.icon className={`h-12 w-12 ${stat.color} mx-auto`} />
                  <div className="absolute -inset-3 bg-red-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-4xl font-bold text-red-600 mb-3">
                  {stat.number}
                </div>{" "}
                <div className="text-gray-700 text-base font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

import { CheckCircle, BookOpen, Users } from "lucide-react";
import React from "react";

const FeaturedSection = () => {
  return (
    <div
      id="features"
      className="relative bg-gradient-to-br from-slate-50 to-gray-50 py-24"
      dir="rtl"
      style={{ fontFamily: "Noto Sans Arabic, Cairo, Amiri, serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            خدماتنا المميزة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات والأدوات المتطورة لمساعدتك في التحقق من
            صحة الأخبار ومحاربة المعلومات المضللة
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
            <div className="relative mb-6">
              <CheckCircle className="h-16 w-16 text-red-500" />
              <div className="absolute -inset-3 bg-red-500/20 rounded-full blur-lg"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              التحقق بالذكاء الاصطناعي
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              خوارزميات متقدمة تكشف المعلومات المضللة وتتحقق من مصادر الأخبار
              بدقة عالية ومعايير علمية موثوقة
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
            <div className="relative mb-6">
              <BookOpen className="h-16 w-16 text-red-500" />
              <div className="absolute -inset-3 bg-red-500/20 rounded-full blur-lg"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              الموارد التعليمية
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              دورات ومواد شاملة لمحو الأمية الإعلامية والتفكير النقدي مع أحدث
              الأساليب التعليمية التفاعلية
            </p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200">
            <div className="relative mb-6">
              <Users className="h-16 w-16 text-red-500" />
              <div className="absolute -inset-3 bg-red-500/20 rounded-full blur-lg"></div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              فعاليات المجتمع
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              ورش عمل وندوات وبرامج تدريبية متخصصة لتعزيز الوعي الإعلامي وبناء
              مجتمع واعٍ ومتمكن
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;

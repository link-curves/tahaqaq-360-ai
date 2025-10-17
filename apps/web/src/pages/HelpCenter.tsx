import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  HelpCircle,
  MessageSquare,
  Search,
  Video,
} from "lucide-react";
import { useState } from "react";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const helpCategories = [
    {
      icon: BookOpen,
      title: "الدليل الشامل",
      description: "تعلم كيفية استخدام جميع ميزات المنصة",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      articles: 12,
    },
    {
      icon: Video,
      title: "الفيديوهات التعليمية",
      description: "شاهد الفيديوهات التوضيحية لاستخدام المنصة",
      color: "text-green-600",
      bgColor: "bg-green-100",
      articles: 8,
    },
    {
      icon: HelpCircle,
      title: "الأسئلة الشائعة",
      description: "إجابات على أكثر الأسئلة شيوعاً",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      articles: 25,
    },
    {
      icon: MessageSquare,
      title: "الدعم الفني",
      description: "تواصل مع فريق الدعم للحصول على مساعدة فورية",
      color: "text-red-600",
      bgColor: "bg-red-100",
      articles: 0,
    },
  ];

  const popularArticles = [
    {
      title: "كيفية إنشاء حساب جديد على المنصة",
      category: "البداية",
      views: "12,543",
      timeToRead: "3 دقائق",
    },
    {
      title: "شرح عملية فحص الحقائق باستخدام الذكاء الاصطناعي",
      category: "فحص الحقائق",
      views: "8,921",
      timeToRead: "5 دقائق",
    },
    {
      title: "التسجيل في الدورات التعليمية والفعاليات",
      category: "التعليم",
      views: "6,754",
      timeToRead: "4 دقائق",
    },
    {
      title: "فهم نتائج تقارير فحص الحقائق",
      category: "فحص الحقائق",
      views: "5,432",
      timeToRead: "6 دقائق",
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
              مركز المساعدة
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              ابحث عن الإجابات على أسئلتك أو تصفح دليل الاستخدام الشامل
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="ابحث عن المساعدة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 text-lg text-gray-900 bg-white rounded-2xl border-0 shadow-lg pl-14"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            كيف يمكننا مساعدتك؟
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`${category.bgColor} p-4 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                {category.articles > 0 && (
                  <span className="text-sm text-gray-500">
                    {category.articles} مقال
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            المقالات الأكثر شيوعاً
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {article.timeToRead}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm">{article.views} مشاهدة</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
          <p className="text-red-100 mb-6 text-lg">
            فريق الدعم الفني متاح على مدار الساعة للمساعدة
          </p>
          <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300">
            تواصل مع الدعم الفني
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

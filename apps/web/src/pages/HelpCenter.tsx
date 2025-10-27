import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  Video,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch popular blog posts
  const { data: blogsResponse, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs-popular"],
    queryFn: () =>
      apiClient.getBlogPosts({
        page: 1,
        limit: 4,
        sortBy: "views",
        sortOrder: "desc",
      }),
    staleTime: 5 * 60 * 1000,
  });

  const popularBlogs = Array.isArray(blogsResponse)
    ? blogsResponse
    : blogsResponse?.data || [];

  // Fetch FAQ count
  const { data: faqsResponse } = useQuery({
    queryKey: ["faqs-count"],
    queryFn: () => apiClient.getFaqs({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const faqCount = Array.isArray(faqsResponse)
    ? faqsResponse.filter((faq) => faq.isPublished).length
    : 0;

  const handleWhatsAppContact = () => {
    const phoneNumber = "96170946882"; // +961 70 946 882
    const message = encodeURIComponent(
      "مرحباً، أحتاج مساعدة بخصوص منصة تحقق 360"
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const helpCategories = [
    {
      icon: BookOpen,
      title: "المدونة",
      description: "تعلم كيفية استخدام جميع ميزات المنصة",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      articles: popularBlogs.length,
      onClick: () => navigate("/blog"),
    },
    {
      icon: Video,
      title: "الدورات التعليمية",
      description: "شاهد الدورات التعليمية المتاحة",
      color: "text-green-600",
      bgColor: "bg-green-100",
      articles: 0,
      onClick: () => navigate("/courses"),
    },
    {
      icon: HelpCircle,
      title: "الأسئلة الشائعة",
      description: "إجابات على أكثر الأسئلة شيوعاً",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      articles: faqCount,
      onClick: () => navigate("/faq"),
    },
    {
      icon: MessageSquare,
      title: "الدعم الفني",
      description: "تواصل مع فريق الدعم للحصول على مساعدة فورية",
      color: "text-red-600",
      bgColor: "bg-red-100",
      articles: 0,
      onClick: handleWhatsAppContact,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 mt-18">
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
                onClick={category.onClick}
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
                    {category.articles}{" "}
                    {category.title === "المدونة" ? "مقالة" : "سؤال"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Popular Blog Posts */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              المقالات الأكثر شيوعاً
            </h2>
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              عرض جميع المقالات
            </Button>
          </div>

          {blogsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : popularBlogs.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {popularBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {blog.readTime} دقيقة قراءة
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {blog.views?.toLocaleString("ar-EG")} مشاهدة
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">لا توجد مقالات متاحة حالياً</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
          <p className="text-red-100 mb-6 text-lg">
            فريق الدعم الفني متاح على مدار الساعة للمساعدة عبر واتساب
          </p>
          <Button
            onClick={handleWhatsAppContact}
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <MessageSquare className="h-5 w-5" />
            تواصل معنا على واتساب
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

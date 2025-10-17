import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestResearch } from "@/hooks/useApi";
import {
  formatDate,
  generateExcerpt,
  getImageUrl,
  getTextDirection,
} from "@/lib/utils";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogSection = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useLatestResearch();

  const research = data?.data || [];

  return (
    <div
      className="bg-gradient-to-br from-red-50/30 to-rose-50/50 py-20"
      id="blog"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            أحدث الرؤى والأبحاث
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Cairo']">
            ابق على اطلاع بأحدث أبحاثنا وتحليلاتنا ورؤانا حول اتجاهات المعلومات
            المضللة وأفضل ممارسات محو الأمية الإعلامية ومنهجيات فحص الحقائق
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {isLoading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-52 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))
          ) : research.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl font-['Cairo']">
                لا توجد أبحاث متاحة حالياً
              </p>
            </div>
          ) : (
            research.slice(0, 6).map((article) => {
              const cardDirection = getTextDirection(article.title);
              return (
                <Card
                  key={article.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative cursor-pointer"
                  onClick={() => navigate(`/research/${article.slug}`)}
                  dir={cardDirection}
                >
                  {/* Article Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getImageUrl(article.coverImage)}
                      alt={article.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                    {/* Floating Category Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                        <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Views Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg">
                        <span className="text-xs text-white font-medium font-['Cairo']">
                          {article.views} مشاهدة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed group-hover:text-red-600 transition-colors duration-300 flex-grow-0">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed flex-grow">
                      {generateExcerpt(article.summary, 25)}
                    </p>

                    {/* Author and Date Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6 font-['Cairo']">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        <span>
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                      </div>
                      {article.authors && article.authors.length > 0 && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 ml-1" />
                          <span>{article.authors[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Read More Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-auto border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg group-hover:border-red-300"
                    >
                      <span className="flex items-center justify-center space-x-2 space-x-reverse">
                        <span>اقرأ المزيد</span>
                        <ArrowRight className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-['Cairo'] px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/research")}
          >
            عرض جميع الأبحاث
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

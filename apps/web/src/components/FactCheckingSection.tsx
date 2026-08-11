import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFactChecks } from "@/hooks/useApi";
import { VeracityRating, VeracityRatingValue } from "@/lib/api";
import {
  formatDate,
  generateExcerpt,
  getImageUrl,
  getVeracityColor,
  getVeracityLabel,
} from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FactCheckingSection = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch fact checks with pagination and featured filter
  const {
    data: factChecksData,
    isLoading,
    error,
  } = useFactChecks({
    page: currentPage,
    limit: pageSize,
    isFeatured: true,
  });

  const factChecks = factChecksData?.data || [];
  const totalPages = factChecksData?.totalPages || 1;
  const hasMore = currentPage < totalPages;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleLoadPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const getStatusIcon = (rating: string) => {
    switch (rating) {
      case VeracityRating.TRUE:
      case VeracityRating.MOSTLY_TRUE:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case VeracityRating.FALSE:
      case VeracityRating.MOSTLY_FALSE:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case VeracityRating.HALF_TRUE:
      case VeracityRating.MISLEADING:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        id="fact-checking"
        className="bg-gradient-to-br from-white to-gray-50 py-24"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-20" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    const isRateLimit =
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests");

    return (
      <div
        id="fact-checking"
        className="bg-gradient-to-br from-white to-gray-50 py-24"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`${isRateLimit ? "text-amber-600" : "text-red-600"} mb-4`}
          >
            {isRateLimit ? (
              <Clock className="h-12 w-12 mx-auto mb-4" />
            ) : (
              <XCircle className="h-12 w-12 mx-auto mb-4" />
            )}
            <p className="text-lg font-semibold mb-2">
              {isRateLimit
                ? "تم تجاوز الحد المسموح من الطلبات"
                : "حدث خطأ في تحميل البيانات"}
            </p>
            {isRateLimit && (
              <p className="text-sm text-gray-600">
                يرجى الانتظار لحظة قبل المحاولة مرة أخرى
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <h3 className="text-4xl font-bold text-gray-900 mb-20 text-center font-['Cairo']">
            فحوصات الحقائق الأخيرة
          </h3>
          {factChecks.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl">
                لا توجد فحوصات حقائق متاحة حالياً
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {factChecks.map((factCheck) => (
                <Card
                  key={factCheck.id}
                  onClick={() => navigate(`/fact-checks/${factCheck.slug}`)}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative cursor-pointer"
                >
                  {/* Card Image with Enhanced Effects */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={getImageUrl(factCheck.featuredImage)}
                      alt={factCheck.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                    {/* Floating Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${getVeracityColor(factCheck.factCheck.verdict.code)} border-0 shadow-lg backdrop-blur-sm`}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(factCheck.factCheck.verdict.code)}
                          {getVeracityLabel(factCheck.factCheck.verdict.code)}
                        </span>
                      </Badge>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                        <span className="text-xs text-gray-700 font-medium font-['Cairo'] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {factCheck.publishedAt
                            ? formatDate(factCheck.publishedAt)
                            : formatDate(factCheck.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-300 font-['Cairo']">
                      {factCheck.title}
                    </h4>

                    <p className="text-sm text-gray-600 mb-3 leading-relaxed font-['Cairo']">
                      <strong>الادعاء:</strong>{" "}
                      {generateExcerpt(factCheck.factCheck.claim.text, 15)}
                    </p>

                    <p className="text-sm text-gray-700 flex-1 leading-relaxed font-['Cairo'] line-clamp-3">
                      {generateExcerpt(factCheck.summary, 20)}
                    </p>

                    {/* Author and Views */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-['Cairo']">
                        بواسطة: {factCheck.author.firstName}{" "}
                        {factCheck.author.lastName}
                      </span>
                      <span className="font-['Cairo']">
                        {factCheck.views} مشاهدة
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* CTA Section */}
          <div className="text-center mt-16">
            <Button
              onClick={() => navigate("/fact-checks")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-['Cairo'] cursor-pointer"
            >
              عرض جميع فحوصات الحقائق
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactCheckingSection;

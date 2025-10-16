import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFactChecks } from "@/hooks/useApi";
import { VeracityRating } from "@/lib/api";
import {
  formatDate,
  generateExcerpt,
  getImageUrl,
  getVeracityColor,
  getVeracityLabel,
} from "@/lib/utils";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FactChecksPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<VeracityRating | "">("");

  // Build params object - NO page parameter (backend doesn't support it)
  const params = {
    ...(search && { search }),
    ...(verdictFilter && { verdict: verdictFilter }),
  };

  const { data, isLoading, error } = useFactChecks(params);

  console.log("FactChecks Debug:", { data, isLoading, error, params });

  // Client-side pagination
  const allFactChecks = data?.data || [];
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allFactChecks.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const factChecks = allFactChecks.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            فحص الحقائق
          </h1>
          <p className="text-xl text-white/90 font-['Cairo']">
            تصفح جميع التحققات من الحقائق والأخبار
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن حقيقة..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10 font-['Cairo']"
              />
            </div>

            {/* Verdict Filter */}
            <Select
              value={verdictFilter || "all"}
              onValueChange={(value) => {
                setVerdictFilter(
                  value === "all" ? "" : (value as VeracityRating)
                );
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-64 font-['Cairo']">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="تصفية حسب الحكم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value={VeracityRating.TRUE}>صحيح</SelectItem>
                <SelectItem value={VeracityRating.MOSTLY_TRUE}>
                  صحيح في الغالب
                </SelectItem>
                <SelectItem value={VeracityRating.HALF_TRUE}>
                  نصف صحيح
                </SelectItem>
                <SelectItem value={VeracityRating.MOSTLY_FALSE}>
                  خاطئ في الغالب
                </SelectItem>
                <SelectItem value={VeracityRating.FALSE}>خاطئ</SelectItem>
                <SelectItem value={VeracityRating.MISLEADING}>مضلل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-xl font-['Cairo']">
              حدث خطأ في تحميل البيانات
            </p>
          </div>
        ) : factChecks.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-['Cairo']">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-['Cairo']">
                عرض {factChecks.length} من أصل {data?.total || 0} نتيجة
              </p>
            </div>

            {/* Fact Checks Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {factChecks.map((factCheck) => (
                <Card
                  key={factCheck.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/fact-checks/${factCheck.slug}`)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(factCheck.featuredImage)}
                      alt={factCheck.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Verdict Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${getVeracityColor(factCheck.verdict)} border-0 shadow-lg`}
                      >
                        {getVeracityLabel(factCheck.verdict)}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs text-gray-700 font-medium font-['Cairo']">
                          {formatDate(
                            factCheck.publishedAt || factCheck.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors font-['Cairo']">
                      {factCheck.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 font-['Cairo']">
                      <strong>الادعاء:</strong>{" "}
                      {generateExcerpt(factCheck.claim, 15)}
                    </p>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-['Cairo']">
                      {generateExcerpt(factCheck.summary, 20)}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                      <span className="font-['Cairo']">
                        {factCheck.views} مشاهدة
                      </span>
                      <span className="font-['Cairo']">
                        {factCheck.author.firstName} {factCheck.author.lastName}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FactChecksPage;

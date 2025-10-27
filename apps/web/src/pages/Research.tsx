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
import { useResearch } from "@/hooks/useApi";
import {
  formatDate,
  generateExcerpt,
  getImageUrl,
  getTextDirection,
} from "@/lib/utils";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Research = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Build params object
  const params = {
    ...(search && { search }),
    ...(categoryFilter && { category: categoryFilter }),
  };

  const { data, isLoading, error } = useResearch(params);

  // Client-side pagination
  const allResearch = data?.data || [];
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allResearch.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const research = allResearch.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Get unique categories
  const categories = Array.from(new Set(allResearch.map((r) => r.category)));

  return (
    <div className="min-h-screen bg-gray-50 mt-18" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            الأبحاث والرؤى
          </h1>
          <p className="text-xl text-white/90 font-['Cairo']">
            تصفح مكتبتنا الشاملة من الأبحاث والدراسات حول محو الأمية الإعلامية
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
                placeholder="ابحث عن بحث..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10 font-['Cairo']"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-64 font-['Cairo']">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
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
                <Skeleton className="h-52 w-full" />
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
        ) : research.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-['Cairo']">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : (
          <>
            {/* Research Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {research.map((article) => {
                const cardDirection = getTextDirection(article.title);
                return (
                  <Card
                    key={article.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => navigate(`/research/${article.slug}`)}
                    dir={cardDirection}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={getImageUrl(article.coverImage)}
                        alt={article.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-red-600 border-0 shadow-lg backdrop-blur-sm">
                          {article.category}
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                          <span className="text-xs text-gray-700 font-medium font-['Cairo']">
                            {formatDate(
                              article.publishedAt || article.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors font-['Cairo']">
                        {article.title}
                      </h3>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-3 font-['Cairo']">
                        {generateExcerpt(article.summary, 20)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                        <span className="font-['Cairo']">
                          {article.views} مشاهدة
                        </span>
                        {article.authors && article.authors.length > 0 && (
                          <span className="font-['Cairo'] flex items-center">
                            <User className="h-3 w-3 ml-1" />
                            {article.authors[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
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

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                    className={
                      page === i + 1
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : ""
                    }
                  >
                    {i + 1}
                  </Button>
                ))}

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
    </div>
  );
};

export default Research;

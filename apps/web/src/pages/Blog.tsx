import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogCategories, useBlogPosts, useBlogTags } from "@/hooks/useApi";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Calendar, Clock, Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "ALL"
  );
  const [selectedTag, setSelectedTag] = useState(
    searchParams.get("tag") || "ALL"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 9;

  // Fetch blog posts with filters
  const { data: postsData, isLoading } = useBlogPosts({
    page,
    limit,
    search: searchTerm || undefined,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    tag: selectedTag !== "ALL" ? selectedTag : undefined,
    status: "PUBLISHED",
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  // Fetch categories and tags for filters
  const { data: categories } = useBlogCategories();
  const { data: tags } = useBlogTags();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "ALL") params.set("category", selectedCategory);
    if (selectedTag !== "ALL") params.set("tag", selectedTag);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedTag, page, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const posts = postsData?.data || [];
  const totalPages = postsData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50 mt-18" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Cairo']">
            المدونة
          </h1>
          <p className="text-lg text-white/90 max-w-2xl font-['Cairo']">
            اكتشف أحدث المقالات حول التحقق من الحقائق، التربية الإعلامية،
            ومكافحة المعلومات المضللة
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 font-['Cairo']"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 font-['Cairo']">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="font-['Cairo']  bg-white">
                  جميع الفئات
                </SelectItem>
                {categories?.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="font-['Cairo']  bg-white"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-48 font-['Cairo']">
                <SelectValue placeholder="جميع الوسوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="font-['Cairo'] bg-white">
                  جميع الوسوم
                </SelectItem>
                {tags?.map((tag) => (
                  <SelectItem
                    key={tag}
                    value={tag}
                    className="font-['Cairo'] bg-white"
                  >
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchTerm ||
              selectedCategory !== "ALL" ||
              selectedTag !== "ALL") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("ALL");
                  setSelectedTag("ALL");
                  setPage(1);
                }}
                className="font-['Cairo']"
              >
                إعادة تعيين
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
              لم يتم العثور على مقالات
            </h3>
            <p className="text-gray-600 mb-6 font-['Cairo']">
              جرب تغيير معايير البحث أو الفلاتر
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setSelectedTag("ALL");
                setPage(1);
              }}
              className="font-['Cairo']"
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {/* Cover Image */}
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(post.coverImage)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {post.isFeatured && (
                        <Badge className="absolute top-3 right-3 bg-red-600 text-white border-0 shadow-lg font-['Cairo']">
                          مميز
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    {post.category && (
                      <Badge
                        variant="secondary"
                        className="mb-3 font-['Cairo'] bg-red-50 text-red-700"
                      >
                        {post.category}
                      </Badge>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 font-['Cairo'] line-clamp-2 group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 font-['Cairo'] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                      {post.author && (
                        <span className="font-['Cairo']">{post.author}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-['Cairo']">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="font-['Cairo']">
                            {post.readTime} دقيقة
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="font-['Cairo']">{post.views}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs font-['Cairo'] text-gray-600"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-['Cairo'] text-gray-600"
                          >
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="font-['Cairo']"
                >
                  السابق
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        className="font-['Cairo']"
                      >
                        {pageNum}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="font-['Cairo']"
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;

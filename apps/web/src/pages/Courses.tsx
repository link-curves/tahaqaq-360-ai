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
import { useCourses } from "@/hooks/useApi";
import { CourseDifficulty } from "@/lib/api";
import { getImageUrl, getTextDirection } from "@/lib/utils";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const params = {
    ...(search && { search }),
    ...(difficultyFilter && {
      difficulty: difficultyFilter as CourseDifficulty,
    }),
    isPublished: true,
  };

  const { data, isLoading } = useCourses(params);

  const allCourses = data?.data || [];
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allCourses.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const courses = allCourses.slice(startIndex, endIndex);

  const getDifficultyLabel = (difficulty: CourseDifficulty) => {
    switch (difficulty) {
      case CourseDifficulty.BEGINNER:
        return "مبتدئ";
      case CourseDifficulty.INTERMEDIATE:
        return "متوسط";
      case CourseDifficulty.ADVANCED:
        return "متقدم";
      default:
        return difficulty;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} دقيقة`;
    if (mins === 0) return `${hours} ساعة`;
    return `${hours} ساعة و${mins} دقيقة`;
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-18" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            دورات محو الأمية الإعلامية
          </h1>
          <p className="text-xl text-white/90 font-['Cairo']">
            تعلم مهارات التفكير النقدي والتحقق من المعلومات
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن دورة..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10 font-['Cairo']"
              />
            </div>

            <Select
              value={difficultyFilter}
              onValueChange={(value) => {
                setDifficultyFilter(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-64 font-['Cairo']">
                <SelectValue placeholder="جميع المستويات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value={CourseDifficulty.BEGINNER}>مبتدئ</SelectItem>
                <SelectItem value={CourseDifficulty.INTERMEDIATE}>
                  متوسط
                </SelectItem>
                <SelectItem value={CourseDifficulty.ADVANCED}>متقدم</SelectItem>
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
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-['Cairo']">
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 font-['Cairo']">
                عرض {courses.length} من أصل {data?.total || 0} نتيجة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {courses.map((course) => {
                const cardDirection = getTextDirection(course.title);
                return (
                  <Card
                    key={course.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                    dir={cardDirection}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(course.coverImage)}
                        alt={course.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-emerald-600 border-0 shadow-lg">
                          {getDifficultyLabel(course.difficulty)}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors font-['Cairo']">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2 font-['Cairo']">
                        {course.description.length > 100
                          ? course.description.substring(0, 100) + "..."
                          : course.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                        <span className="flex items-center font-['Cairo']">
                          <Clock className="h-3 w-3 ml-1" />
                          {formatDuration(course.duration)}
                        </span>
                        <span className="flex items-center font-['Cairo']">
                          <Users className="h-3 w-3 ml-1" />
                          {course._count?.enrollments || 0} طالب
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

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
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
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

export default Courses;

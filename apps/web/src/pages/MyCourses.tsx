import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useMyCourses } from "@/hooks/useApi";
import { CourseDifficulty, CourseDifficultyValue } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: courses, isLoading, error } = useMyCourses();

  const getDifficultyLabel = (difficulty: CourseDifficultyValue) => {
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

  const getDifficultyColor = (difficulty: CourseDifficultyValue) => {
    switch (difficulty) {
      case CourseDifficulty.BEGINNER:
        return "bg-green-100 text-green-800";
      case CourseDifficulty.INTERMEDIATE:
        return "bg-yellow-100 text-yellow-800";
      case CourseDifficulty.ADVANCED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ساعة${mins > 0 ? ` و ${mins} دقيقة` : ""}`;
    }
    return `${mins} دقيقة`;
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            يجب تسجيل الدخول أولاً
          </h2>
          <p className="text-gray-600 mb-6 font-['Cairo']">
            قم بتسجيل الدخول لعرض الدورات التي سجلت فيها
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-['Cairo']"
          >
            تسجيل الدخول
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <div className="text-red-500 text-xl mb-4 font-['Cairo']">
            حدث خطأ أثناء تحميل الدورات
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="font-['Cairo']"
          >
            حاول مرة أخرى
          </Button>
        </Card>
      </div>
    );
  }

  // Separate completed and in-progress courses
  const completedCourses =
    courses?.filter((c) => c.enrollmentProgress?.isCompleted) || [];
  const inProgressCourses =
    courses?.filter((c) => !c.enrollmentProgress?.isCompleted) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 mt-18">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-12 w-12 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900 font-['Cairo']">
              دوراتي
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-['Cairo']">
            تابع تقدمك في الدورات التدريبية
          </p>
        </div>

        {/* Stats Summary */}
        {courses && courses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600 font-['Cairo']">
                إجمالي الدورات
              </div>
            </Card>
            <Card className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {inProgressCourses.length}
              </div>
              <div className="text-sm text-gray-600 font-['Cairo']">
                قيد التقدم
              </div>
            </Card>
            <Card className="p-6 text-center">
              <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {completedCourses.length}
              </div>
              <div className="text-sm text-gray-600 font-['Cairo']">مكتملة</div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {(!courses || courses.length === 0) && (
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
              لم تسجل في أي دورة بعد
            </h2>
            <p className="text-gray-600 mb-6 font-['Cairo']">
              استكشف مكتبة الدورات التدريبية وابدأ رحلة التعلم الخاصة بك
            </p>
            <Button
              onClick={() => navigate("/learning")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-['Cairo']"
            >
              تصفح الدورات
            </Button>
          </Card>
        )}

        {/* In Progress Courses */}
        {inProgressCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
              قيد التقدم ({inProgressCourses.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/learning/${course.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(course.coverImage)}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop";
                      }}
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${getDifficultyColor(course.difficulty)}`}
                    >
                      {getDifficultyLabel(course.difficulty)}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-['Cairo']">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-['Cairo']">
                        {course.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-['Cairo']">
                          التقدم
                        </span>
                        <span className="font-bold text-emerald-600">
                          {Math.round(course.enrollmentProgress?.progress || 0)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={course.enrollmentProgress?.progress || 0}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 font-['Cairo']">
                        {course.enrollmentProgress?.completedLessons || 0} من{" "}
                        {course.enrollmentProgress?.totalLessons || 0} دروس
                      </p>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-['Cairo']">
                          {formatDuration(course.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-['Cairo']">
                          {course.lessons?.length || 0} دروس
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-['Cairo']">
                      متابعة التعلم
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
              الدورات المكتملة ({completedCourses.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/learning/${course.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(course.coverImage)}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop";
                      }}
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${getDifficultyColor(course.difficulty)}`}
                    >
                      {getDifficultyLabel(course.difficulty)}
                    </Badge>
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-bold">مكتملة</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-['Cairo']">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-['Cairo']">
                        {course.description}
                      </p>
                    )}

                    {/* Certificate Badge */}
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                      <Award className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-900 font-['Cairo']">
                          حصلت على الشهادة
                        </p>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-['Cairo']">
                          {formatDuration(course.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-['Cairo']">
                          {course.lessons?.length || 0} دروس
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="font-['Cairo']"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/learning/${course.slug}`);
                        }}
                      >
                        مراجعة
                      </Button>
                      <Button
                        className="bg-amber-600 hover:bg-amber-700 text-white font-['Cairo']"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/profile/certificates");
                        }}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        الشهادة
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

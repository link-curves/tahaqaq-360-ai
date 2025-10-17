import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourse } from "@/hooks/useApi";
import { CourseDifficulty } from "@/lib/api";
import { getImageUrl, getTextDirection } from "@/lib/utils";
import { BookOpen, CheckCircle, Clock, PlayCircle, Users } from "lucide-react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useCourse(slug!);

  const course = data?.data;

  const direction = getTextDirection(course?.title || "");

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full mb-8 rounded-lg" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-['Cairo']">
            الدورة غير موجودة
          </h1>
          <p className="text-gray-600 font-['Cairo']">
            عذراً، لم نتمكن من العثور على الدورة المطلوبة
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={getImageUrl(course.coverImage)}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-4 bg-white/90 text-emerald-600 border-0">
              {getDifficultyLabel(course.difficulty)}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <span className="flex items-center font-['Cairo']">
                <Clock className="h-4 w-4 ml-2" />
                {formatDuration(course.duration)}
              </span>
              <span className="flex items-center font-['Cairo']">
                <Users className="h-4 w-4 ml-2" />
                {course._count?.enrollments || 0} طالب
              </span>
              <span className="flex items-center font-['Cairo']">
                <BookOpen className="h-4 w-4 ml-2" />
                {course.lessons?.length || 0} درس
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
                عن الدورة
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 font-['Cairo']"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </Card>

            {/* Lessons */}
            {course.lessons && course.lessons.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
                  محتوى الدورة
                </h2>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 font-['Cairo']">
                          {lesson.title}
                        </h3>
                        {lesson.duration && (
                          <p className="text-sm text-gray-500 font-['Cairo']">
                            {lesson.duration} دقيقة
                          </p>
                        )}
                      </div>
                      <PlayCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Learning Objectives */}
            {course.learningObjectives &&
              course.learningObjectives.length > 0 && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
                    ماذا ستتعلم؟
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-['Cairo']">
                          {objective}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
                  المتطلبات الأساسية
                </h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 font-['Cairo']"
                    >
                      <span className="text-emerald-600 font-bold">•</span>
                      {prerequisite}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <img
                  src={getImageUrl(course.coverImage)}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop";
                  }}
                />
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-['Cairo']">
                  ابدأ التعلم الآن
                </Button>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">المستوى</span>
                  <span className="font-semibold text-gray-900 font-['Cairo']">
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">المدة</span>
                  <span className="font-semibold text-gray-900 font-['Cairo']">
                    {formatDuration(course.duration)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">
                    عدد الدروس
                  </span>
                  <span className="font-semibold text-gray-900 font-['Cairo']">
                    {course.lessons?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">الطلاب</span>
                  <span className="font-semibold text-gray-900 font-['Cairo']">
                    {course._count?.enrollments || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;

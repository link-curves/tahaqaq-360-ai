import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCourse,
  useCourseProgress,
  useEnrollInCourse,
  useMarkLessonComplete,
} from "@/hooks/useApi";
import { CourseDifficulty, CourseDifficultyValue } from "@/lib/api";
import { getImageUrl, getTextDirection } from "@/lib/utils";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  Users,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: course, isLoading } = useCourse(slug!);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  // Get course progress only if authenticated and course is loaded
  const {
    data: progress,
    isLoading: progressLoading,
    error: progressError,
  } = useCourseProgress(course?.id || "");

  const enrollMutation = useEnrollInCourse();
  const markLessonMutation = useMarkLessonComplete();

  const isEnrolled = progress !== undefined && !progressError;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    if (!course?.id) return;

    enrollMutation.mutate(course.id, {
      onSuccess: () => {
        toast.success("تم التسجيل في الدورة بنجاح!");
      },
      onError: (error: any) => {
        toast.error(error.message || "حدث خطأ أثناء التسجيل");
      },
    });
  };

  const handleToggleLessonComplete = async (
    lessonId: string,
    isCompleted: boolean
  ) => {
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    markLessonMutation.mutate(
      { lessonId, isCompleted: !isCompleted },
      {
        onSuccess: () => {
          toast.success(
            isCompleted ? "تم إلغاء اكتمال الدرس" : "تم تحديد الدرس كمكتمل!"
          );
        },
        onError: (error: any) => {
          toast.error(error.message || "حدث خطأ");
        },
      }
    );
  };

  const getLessonProgress = (lessonId: string) => {
    if (!progress?.course?.lessons) return null;
    const lesson = progress.course.lessons.find((l) => l.id === lessonId);
    return lesson?.lessonProgress?.[0];
  };

  const direction = getTextDirection(course?.title || "");

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
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full mb-8 rounded-lg" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 mt-18" dir="rtl">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-['Cairo']">
            الدورة غير موجودة
          </h1>
          <p className="text-gray-600 font-['Cairo']">
            عذراً، لم نتمكن من العثور على الدورة المطلوبة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
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
                className="prose prose-xl max-w-none
                [&>*]:font-['Cairo']
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:leading-tight [&_h1]:border-b [&_h1]:border-gray-200 [&_h1]:pb-4
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:leading-snug [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-3
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:leading-normal
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mb-3 [&_h4]:mt-6
                [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-gray-700 [&_h5]:mb-2 [&_h5]:mt-4
                [&_p]:text-gray-700 [&_p]:text-lg [&_p]:leading-loose [&_p]:mb-6
                [&_a]:text-red-600 [&_a]:font-semibold [&_a]:no-underline [&_a:hover]:text-red-700 [&_a:hover]:underline
                [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:bg-yellow-50 [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:rounded
                [&_em]:italic [&_em]:text-gray-800
                [&_ul]:my-6 [&_ul]:space-y-2 [&_ul]:pr-6
                [&_ol]:my-6 [&_ol]:space-y-2 [&_ol]:pr-6
                [&_li]:text-gray-700 [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2
                [&_ul>li]:list-disc [&_ul>li]:marker:text-red-600 [&_ul>li]:marker:text-xl
                [&_ol>li]:list-decimal [&_ol>li]:marker:text-red-600 [&_ol>li]:marker:font-bold
                [&_blockquote]:border-r-4 [&_blockquote]:border-red-600 [&_blockquote]:bg-gradient-to-l [&_blockquote]:from-red-50 [&_blockquote]:to-transparent
                [&_blockquote]:pr-6 [&_blockquote]:pl-4 [&_blockquote]:py-5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-gray-800
                [&_blockquote]:rounded-r-lg [&_blockquote]:shadow-sm
                [&_code]:font-mono [&_code]:bg-gray-100 [&_code]:text-red-600 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:shadow-lg
                [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0
                [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-8 [&_img]:w-full
                [&_hr]:border-gray-300 [&_hr]:my-10
                [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200
                [&_thead]:bg-red-50 [&_thead]:border-b-2 [&_thead]:border-red-600
                [&_th]:px-6 [&_th]:py-3 [&_th]:text-right [&_th]:font-bold [&_th]:text-gray-900
                [&_td]:px-6 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-200 [&_td]:text-gray-700
                [&>*:first-child]:mt-0
                [&>*:last-child]:mb-0"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {course.description}
                </ReactMarkdown>
              </div>
            </Card>

            {/* Lessons */}
            {course.lessons && course.lessons.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
                  محتوى الدورة
                </h2>
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => {
                    const lessonProgress = getLessonProgress(lesson.id);
                    const isCompleted = lessonProgress?.isCompleted || false;

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Completion checkbox - only show if enrolled */}
                        {isEnrolled && (
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() =>
                              handleToggleLessonComplete(lesson.id, isCompleted)
                            }
                            disabled={markLessonMutation.isPending}
                            className="flex-shrink-0"
                          />
                        )}

                        {/* Lesson number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>

                        {/* Lesson info */}
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

                        {/* External link or lock icon */}
                        {isEnrolled ? (
                          lesson.videoUrl && (
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="text-sm font-['Cairo']">
                                شاهد الآن
                              </span>
                            </a>
                          )
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    );
                  })}
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

                {/* Enrollment / Progress */}
                {!isAuthenticated ? (
                  <Button
                    onClick={() => {
                      toast.error("يجب تسجيل الدخول أولاً");
                      navigate("/login");
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-['Cairo']"
                  >
                    سجل دخول للتسجيل
                  </Button>
                ) : !isEnrolled ? (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-['Cairo']"
                  >
                    {enrollMutation.isPending
                      ? "جاري التسجيل..."
                      : "سجل في الدورة"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-['Cairo']">
                        <span className="text-gray-600">تقدمك</span>
                        <span className="font-bold text-emerald-600">
                          {Math.round(progress?.progress || 0)}%
                        </span>
                      </div>
                      <Progress
                        value={progress?.progress || 0}
                        className="h-3"
                      />
                      <p className="text-xs text-gray-500 text-center font-['Cairo']">
                        {progress?.completedLessons || 0} من{" "}
                        {progress?.totalLessons || 0} دروس مكتملة
                      </p>
                    </div>

                    {/* Certificate Notification */}
                    {progress?.isCompleted && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Award className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-900 font-['Cairo']">
                            تهانينا! حصلت على شهادة
                          </p>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs text-amber-700 font-['Cairo']"
                            onClick={() => navigate("/profile/certificates")}
                          >
                            عرض الشهادة →
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-['Cairo']"
                      onClick={() => {
                        // Scroll to lessons section
                        document
                          .querySelector('[class*="محتوى الدورة"]')
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      متابعة التعلم
                    </Button>
                  </div>
                )}
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
    </div>
  );
};

export default CourseDetail;

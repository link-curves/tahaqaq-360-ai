import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedCourses } from "@/hooks/useApi";
import { CourseDifficulty, CourseDifficultyValue } from "@/lib/api";
import { getImageUrl, getTextDirection } from "@/lib/utils";
import { Award, BookOpen, Clock, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MediaLiteracySection = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useFeaturedCourses();

  const courses = data?.data || [];

  const getIconForCourse = (index: number) => {
    const icons = [BookOpen, Video, Users, BookOpen, Users, Video];
    return icons[index % icons.length];
  };

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
    if (hours === 1) return `ساعة و${mins} دقيقة`;
    return `${hours} ساعة و${mins} دقيقة`;
  };

  return (
    <div
      className="bg-gradient-to-br from-emerald-50/30 to-teal-50/50 py-20"
      id="education"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            تعليم محو الأمية الإعلامية
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Cairo']">
            دورات وموارد شاملة لمساعدتك في التنقل في المشهد الرقمي للمعلومات
            وتطوير مهارات التفكير النقدي للعصر الحديث
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {isLoading ? (
            // Loading skeletons
            [...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))
          ) : courses.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl font-['Cairo']">
                لا توجد دورات متاحة حالياً
              </p>
            </div>
          ) : (
            courses.slice(0, 6).map((course, index) => {
              const Icon = getIconForCourse(index);
              const cardDirection = getTextDirection(course.title);
              return (
                <Card
                  key={course.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative cursor-pointer"
                  onClick={() => navigate(`/courses/${course.slug}`)}
                  dir={cardDirection}
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(course.coverImage)}
                      alt={course.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                    {/* Floating Level Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                        <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                          {getDifficultyLabel(course.difficulty)}
                        </span>
                      </div>
                    </div>

                    {/* Icon Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-red-600/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed group-hover:text-red-600 transition-colors duration-300">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed flex-grow">
                      {course.description.length > 120
                        ? course.description.substring(0, 120) + "..."
                        : course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6 font-['Cairo']">
                      <span className="flex items-center">
                        <Clock className="ml-1 h-4 w-4" />
                        {formatDuration(course.duration)}
                      </span>
                      <span className="flex items-center">
                        <Users className="ml-1 h-4 w-4" />
                        {course._count?.enrollments || 0} طالب
                      </span>
                    </div>

                    <Button className="w-full mt-auto bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg text-white">
                      <span className="flex items-center justify-center space-x-2 space-x-reverse text-white">
                        <span className="text-white">ابدأ التعلم</span>
                        <svg
                          className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            <Award className="h-16 w-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4 font-['Cairo']">
              احصل على الشهادة
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-['Cairo']">
              أكمل برنامج محو الأمية الإعلامية الشامل واحصل على شهادة معتمدة
              تثبت مهاراتك
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center text-white font-['Cairo']">
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="pr-3">شهادة معترف بها في الصناعة</span>
              </div>
              <div className="flex items-center text-white font-['Cairo']">
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>يمكن مشاركتها على LinkedIn</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold font-['Cairo'] text-lg px-8 py-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/courses")}
            >
              ابدأ مسار الشهادة
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2 font-['Cairo']">
              {courses.length}+
            </div>
            <div className="text-gray-600 font-['Cairo']">دورة تفاعلية</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2 font-['Cairo']">
              {courses
                .reduce(
                  (sum, course) => sum + (course._count?.enrollments || 0),
                  0
                )
                .toLocaleString()}
              +
            </div>
            <div className="text-gray-600 font-['Cairo']">
              أكملوا برنامج الشهادة لدينا
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2 font-['Cairo']">
              98%
            </div>
            <div className="text-gray-600 font-['Cairo']">
              معدل رضا المشاركين
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2 font-['Cairo']">
              24/7
            </div>
            <div className="text-gray-600 font-['Cairo']">وصول غير محدود</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLiteracySection;

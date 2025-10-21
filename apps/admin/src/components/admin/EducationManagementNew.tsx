import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Course } from "@/lib/adminApi";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";

const EducationManagementNew = () => {
  const [currentPage] = useState(1);
  const [pageSize] = useState(100); // Get more for stats

  // Fetch courses with their stats
  const { data: coursesResponse, isLoading } = useQuery({
    queryKey: ["education-stats", currentPage, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/media-literacy/courses?page=${currentPage}&limit=${pageSize}`
      );
      const result = await response.json();
      return result;
    },
  });

  const courses = coursesResponse?.data || [];

  // Calculate statistics
  const stats = {
    totalCourses: coursesResponse?.meta?.total || 0,
    publishedCourses: courses.filter((c: Course) => c.isPublished).length,
    totalLessons: courses.reduce(
      (sum: number, c: Course) => sum + (c._count?.lessons || 0),
      0
    ),
    totalStudents: courses.reduce(
      (sum: number, c: Course) => sum + (c._count?.enrollments || 0),
      0
    ),
  };

  // Group courses by difficulty
  const coursesByDifficulty = {
    Beginner: courses.filter((c: Course) => c.difficulty === "Beginner"),
    Intermediate: courses.filter(
      (c: Course) => c.difficulty === "Intermediate"
    ),
    Advanced: courses.filter((c: Course) => c.difficulty === "Advanced"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">المحتوى التعليمي</h2>
          <p className="text-gray-600">
            نظرة شاملة على دورات ومواد محو الأمية الإعلامية
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              إجمالي الدورات
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {isLoading ? "..." : stats.totalCourses}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {stats.publishedCourses} دورة منشورة
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              إجمالي الدروس
            </CardTitle>
            <Video className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {isLoading ? "..." : stats.totalLessons}
            </div>
            <p className="text-xs text-green-700 mt-1">في جميع الدورات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              الطلاب المسجلين
            </CardTitle>
            <Users className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {isLoading ? "..." : stats.totalStudents}
            </div>
            <p className="text-xs text-purple-700 mt-1">طالب نشط</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              الشهادات الصادرة
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {isLoading ? "..." : "0"}
            </div>
            <p className="text-xs text-orange-700 mt-1">شهادة إتمام</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses by Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beginner Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              دورات المبتدئين
            </CardTitle>
            <CardDescription>
              دورات تأسيسية للمبتدئين في محو الأمية الإعلامية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
            ) : coursesByDifficulty.Beginner.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد دورات للمبتدئين</p>
            ) : (
              coursesByDifficulty.Beginner.slice(0, 5).map((course: Course) => (
                <div
                  key={course.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {course._count?.lessons || 0} درس
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course._count?.enrollments || 0} طالب
                        </span>
                      </div>
                    </div>
                    {course.isPublished ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        منشور
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        مسودة
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            {coursesByDifficulty.Beginner.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Navigate to courses management filtered by Beginner
                }}
              >
                عرض الكل ({coursesByDifficulty.Beginner.length})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Intermediate Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-yellow-600" />
              </div>
              دورات المتوسطين
            </CardTitle>
            <CardDescription>
              دورات متقدمة لتعميق المهارات الإعلامية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
            ) : coursesByDifficulty.Intermediate.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد دورات للمتوسطين</p>
            ) : (
              coursesByDifficulty.Intermediate.slice(0, 5).map(
                (course: Course) => (
                  <div
                    key={course.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {course._count?.lessons || 0} درس
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course._count?.enrollments || 0} طالب
                          </span>
                        </div>
                      </div>
                      {course.isPublished ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          منشور
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          مسودة
                        </span>
                      )}
                    </div>
                  </div>
                )
              )
            )}
            {coursesByDifficulty.Intermediate.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Navigate to courses management filtered by Intermediate
                }}
              >
                عرض الكل ({coursesByDifficulty.Intermediate.length})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Advanced Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-red-600" />
              </div>
              دورات المتقدمين
            </CardTitle>
            <CardDescription>دورات متخصصة للخبراء في المجال</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
            ) : coursesByDifficulty.Advanced.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد دورات للمتقدمين</p>
            ) : (
              coursesByDifficulty.Advanced.slice(0, 5).map((course: Course) => (
                <div
                  key={course.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {course._count?.lessons || 0} درس
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course._count?.enrollments || 0} طالب
                        </span>
                      </div>
                    </div>
                    {course.isPublished ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        منشور
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        مسودة
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            {coursesByDifficulty.Advanced.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Navigate to courses management filtered by Advanced
                }}
              >
                عرض الكل ({coursesByDifficulty.Advanced.length})
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>قم بإدارة المحتوى التعليمي من هنا</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => {
                // Navigate to course management
                window.location.hash = "#courses";
              }}
            >
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold">إدارة الدورات</div>
                <div className="text-xs text-gray-500">
                  إنشاء وتحرير الدورات التدريبية
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => {
                // Navigate to lessons/video management
                window.location.hash = "#courses";
              }}
            >
              <Video className="h-8 w-8 text-green-600" />
              <div className="text-center">
                <div className="font-semibold">إدارة الدروس</div>
                <div className="text-xs text-gray-500">
                  إضافة وتحرير الدروس التعليمية
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => {
                // Navigate to resources/materials
                window.location.hash = "#research";
              }}
            >
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="text-center">
                <div className="font-semibold">المواد التعليمية</div>
                <div className="text-xs text-gray-500">
                  الأبحاث والمقالات التعليمية
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course: Course) => (
              <div
                key={course.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      آخر تحديث:{" "}
                      {new Date(course.updatedAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {course._count?.enrollments || 0} طالب
                  </p>
                  <p className="text-xs text-gray-500">
                    {course._count?.lessons || 0} درس
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationManagementNew;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi, type DashboardStats } from "@/lib/adminApi";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Calendar,
  CheckCircle,
  FileText,
  GraduationCap,
  MessageSquare,
  Users,
} from "lucide-react";
import { StatsCard } from "./StatsCard";

const DashboardOverviewNew = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">فشل في تحميل الإحصائيات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          مرحباً بك في لوحة التحكم
        </h2>
        <p className="text-gray-600">نظرة عامة على أداء منصة تحقق 360</p>
      </div>

      {/* User Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">إحصائيات المستخدمين</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="إجمالي المستخدمين"
            value={stats.users.total.toLocaleString("ar-SA")}
            description={`${stats.users.newToday} مستخدم جديد اليوم`}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="مستخدمون جدد هذا الشهر"
            value={stats.users.newThisMonth.toLocaleString("ar-SA")}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="نشطون الأسبوع الماضي"
            value={stats.users.activeLastWeek.toLocaleString("ar-SA")}
            icon={Users}
            color="purple"
          />
          <StatsCard
            title="مستخدمون جدد اليوم"
            value={stats.users.newToday.toLocaleString("ar-SA")}
            icon={Users}
            color="orange"
          />
        </div>
      </div>

      {/* Content Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">إحصائيات المحتوى</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="تدقيقات الحقائق"
            value={stats.content.factChecks.total.toLocaleString("ar-SA")}
            description={`${stats.content.factChecks.published} منشور | ${stats.content.factChecks.draft} مسودة`}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="الأبحاث"
            value={stats.content.research.total.toLocaleString("ar-SA")}
            description={`${stats.content.research.published} منشور | ${stats.content.research.draft} مسودة`}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="الدورات"
            value={stats.content.courses.total.toLocaleString("ar-SA")}
            description={`${stats.content.courses.published} منشور | ${stats.content.courses.draft} مسودة`}
            icon={GraduationCap}
            color="purple"
          />
          <StatsCard
            title="الأحداث"
            value={stats.content.events.total.toLocaleString("ar-SA")}
            description={`${stats.content.events.upcoming} قادم`}
            icon={Calendar}
            color="orange"
          />
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">إحصائيات التفاعل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="المساهمات"
            value={stats.engagement.submissions.total.toLocaleString("ar-SA")}
            description={`${stats.engagement.submissions.pending} قيد المراجعة`}
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            title="مساهمات موثقة"
            value={stats.engagement.submissions.verified.toLocaleString(
              "ar-SA"
            )}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="التعليقات"
            value={stats.engagement.comments.total.toLocaleString("ar-SA")}
            icon={MessageSquare}
            color="purple"
          />
          <StatsCard
            title="الشهادات الصادرة"
            value={stats.engagement.certificates.total.toLocaleString("ar-SA")}
            icon={Award}
            color="orange"
          />
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>نشاط اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  مستخدمون جدد
                </span>
                <span className="font-semibold">
                  {stats.users.newToday.toLocaleString("ar-SA")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  تدقيقات جديدة
                </span>
                <span className="font-semibold">
                  {stats.content.factChecks.newToday.toLocaleString("ar-SA")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  مساهمات جديدة
                </span>
                <span className="font-semibold">
                  {stats.engagement.submissions.newToday.toLocaleString(
                    "ar-SA"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نظرة عامة على المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  أسئلة شائعة
                </span>
                <span className="font-semibold">
                  {stats.content.faqs.total.toLocaleString("ar-SA")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  مساهمات مرفوضة
                </span>
                <span className="font-semibold">
                  {stats.engagement.submissions.rejected.toLocaleString(
                    "ar-SA"
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  أحداث قادمة
                </span>
                <span className="font-semibold">
                  {stats.content.events.upcoming.toLocaleString("ar-SA")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground text-left">
        آخر تحديث: {new Date(stats.timestamp).toLocaleString("ar-SA")}
      </div>
    </div>
  );
};

export default DashboardOverviewNew;

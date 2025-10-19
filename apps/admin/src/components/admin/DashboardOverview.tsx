import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  Eye,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

const DashboardOverview = () => {
  const stats = [
    {
      title: "إجمالي المقالات",
      value: "147",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "الأحداث النشطة",
      value: "23",
      change: "+5%",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "التحققات المنجزة",
      value: "89",
      change: "+18%",
      icon: CheckCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "المستخدمون النشطون",
      value: "1,234",
      change: "+25%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "نمو الزيارات",
      value: "45%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "إجمالي المشاهدات",
      value: "12.5K",
      change: "+15%",
      icon: Eye,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          مرحباً بك في لوحة التحكم
        </h2>
        <p className="text-gray-600">نظرة عامة على أداء منصة تحقق 360</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 font-medium">
                  {stat.change} من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>آخر المقالات المنشورة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "كيفية التحقق من الأخبار المزيفة",
                  date: "منذ ساعتين",
                  status: "منشور",
                },
                {
                  title: "تحليل الصور المفبركة",
                  date: "منذ 4 ساعات",
                  status: "مراجعة",
                },
                {
                  title: "دليل محو الأمية الإعلامية",
                  date: "أمس",
                  status: "منشور",
                },
              ].map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      article.status === "منشور"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأحداث القادمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "ورشة محو الأمية الإعلامية",
                  date: "15 يونيو 2025",
                  location: "الرياض",
                },
                {
                  title: "مؤتمر التحقق من الأخبار",
                  date: "20 يونيو 2025",
                  location: "جدة",
                },
                {
                  title: "ندوة الذكاء الاصطناعي",
                  date: "25 يونيو 2025",
                  location: "الدمام",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;

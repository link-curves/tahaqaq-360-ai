
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

const AnalyticsView = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الإحصائيات والتحليلات</h2>
        <p className="text-gray-600">تحليل أداء الموقع وتفاعل المستخدمين</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              إحصائيات الزيارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>زيارات هذا الشهر</span>
                <span className="font-bold">12,540</span>
              </div>
              <div className="flex justify-between items-center">
                <span>الزوار الجدد</span>
                <span className="font-bold">8,320</span>
              </div>
              <div className="flex justify-between items-center">
                <span>معدل الارتداد</span>
                <span className="font-bold">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              نمو المنصة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>نمو المستخدمين</span>
                <span className="font-bold text-green-600">+25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>نمو المحتوى</span>
                <span className="font-bold text-blue-600">+18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>نمو التفاعل</span>
                <span className="font-bold text-purple-600">+32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsView;

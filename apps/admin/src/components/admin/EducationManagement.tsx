
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Video, FileText } from "lucide-react";

const EducationManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المحتوى التعليمي</h2>
          <p className="text-gray-600">إدارة دورات ومواد محو الأمية الإعلامية</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="ml-2 h-4 w-4" />
          محتوى جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              الدورات التدريبية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">إدارة الدورات التعليمية ومحو الأمية الإعلامية</p>
            <Button variant="outline" className="w-full">
              عرض الدورات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              الفيديوهات التعليمية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">مكتبة الفيديوهات التعليمية والشروحات</p>
            <Button variant="outline" className="w-full">
              إدارة الفيديوهات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              المواد التعليمية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">الكتب والمقالات والموارد التعليمية</p>
            <Button variant="outline" className="w-full">
              إدارة المواد
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationManagement;

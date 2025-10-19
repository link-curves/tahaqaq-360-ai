
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const FactCheckManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const factChecks = [
    {
      id: 1,
      title: "فيديو مزعوم لحادث في الرياض",
      source: "تويتر",
      date: "2025-06-20",
      status: "زائف",
      priority: "عالية",
      reviewer: "فريق التحقق"
    },
    {
      id: 2,
      title: "إحصائية عن معدل التضخم",
      source: "واتساب",
      date: "2025-06-19",
      status: "صحيح جزئياً",
      priority: "متوسطة",
      reviewer: "أحمد محمد"
    },
    {
      id: 3,
      title: "خبر عن قرار حكومي جديد",
      source: "فيسبوك",
      date: "2025-06-18",
      status: "صحيح",
      priority: "منخفضة",
      reviewer: "سارة أحمد"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "صحيح":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "زائف":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "صحيح جزئياً":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "صحيح":
        return "bg-green-100 text-green-800";
      case "زائف":
        return "bg-red-100 text-red-800";
      case "صحيح جزئياً":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">التحقق من الأخبار</h2>
          <p className="text-gray-600">مراجعة وتحليل الأخبار والمعلومات المشكوك فيها</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="ml-2 h-4 w-4" />
          تحقق جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">34</p>
                <p className="text-xs text-gray-600">أخبار صحيحة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-gray-600">أخبار زائفة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-gray-600">صحيح جزئياً</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-600">قيد المراجعة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع التحققات</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في التحققات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {factChecks.map((factCheck) => (
              <Card key={factCheck.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {factCheck.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>المصدر: {factCheck.source}</span>
                        <span>التاريخ: {factCheck.date}</span>
                        <span>المراجع: {factCheck.reviewer}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(factCheck.status)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(factCheck.status)}`}>
                            {factCheck.status}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          factCheck.priority === "عالية" 
                            ? "bg-red-100 text-red-800" 
                            : factCheck.priority === "متوسطة"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          أولوية {factCheck.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactCheckManagement;

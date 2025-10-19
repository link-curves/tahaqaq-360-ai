
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, MapPin, Calendar } from "lucide-react";

const EventManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const events = [
    {
      id: 1,
      title: "ورشة محو الأمية الإعلامية للطلاب",
      date: "2025-06-25",
      time: "10:00 ص",
      location: "جامعة الملك سعود، الرياض",
      status: "قادم",
      attendees: 45
    },
    {
      id: 2,
      title: "مؤتمر التحقق من الأخبار والذكاء الاصطناعي",
      date: "2025-07-01",
      time: "2:00 م",
      location: "مركز الملك عبدالعزيز الثقافي، الظهران",
      status: "قادم",
      attendees: 120
    },
    {
      id: 3,
      title: "ندوة مواجهة المعلومات المضللة",
      date: "2025-06-15",
      time: "7:00 م",
      location: "مكتبة الملك فهد الوطنية، الرياض",
      status: "مكتمل",
      attendees: 89
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">إدارة الأحداث</h2>
          <p className="text-gray-600">تنظيم وإدارة الفعاليات والورش التدريبية</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="ml-2 h-4 w-4" />
          حدث جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-gray-600">أحداث قادمة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-gray-600">مواقع مختلفة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع الأحداث</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الأحداث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date} • {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === "قادم" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {event.attendees} مشارك
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

export default EventManagement;

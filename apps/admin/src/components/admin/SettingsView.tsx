
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";

const SettingsView = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إعدادات الموقع</h2>
        <p className="text-gray-600">تخصيص إعدادات الموقع والمنصة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              الإعدادات العامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input id="siteName" defaultValue="تحقق 360" />
            </div>
            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Input id="siteDescription" defaultValue="منصة التحقق من الأخبار ومحو الأمية الإعلامية" />
            </div>
            <div>
              <Label htmlFor="contactEmail">البريد الإلكتروني للتواصل</Label>
              <Input id="contactEmail" defaultValue="info@tahaqaq360.com" />
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Save className="ml-2 h-4 w-4" />
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات الأمان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminPassword">تغيير كلمة مرور المدير</Label>
              <Input id="adminPassword" type="password" placeholder="كلمة المرور الجديدة" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input id="confirmPassword" type="password" placeholder="تأكيد كلمة المرور" />
            </div>
            <Button variant="outline" className="w-full">
              تحديث كلمة المرور
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView;

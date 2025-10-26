import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  console.log("[AdminLogin] isAuthenticated:", isAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    console.log("[AdminLogin] useEffect - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("[AdminLogin] Already authenticated, redirecting to /");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      // Error is already handled by toast in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0" dir="rtl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-white">
                لوحة التحكم
              </CardTitle>
              <CardDescription className="text-base text-white">
                تحقق-360 • نظام إدارة المحتوى
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-white"
                  >
                    البريد الإلكتروني
                  </Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tahaqaq360.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 text-base text-white"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-white"
                  >
                    كلمة المرور
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 text-base text-white"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin text-white" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white">مخصص للمسؤولين والمشرفين فقط</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-300">
          <p>© 2025 تحقق-360. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

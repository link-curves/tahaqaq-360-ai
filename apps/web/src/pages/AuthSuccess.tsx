import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Loader } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for authentication state to be determined
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Loader className="h-6 w-6 animate-spin" />
              جاري التحقق من الهوية...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              يرجى الانتظار بينما نقوم بتأكيد تسجيل دخولك
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            تم تسجيل الدخول بنجاح!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            مرحباً بك في تحقق 360. سيتم توجيهك إلى الصفحة الرئيسية خلال لحظات.
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSuccessPage;

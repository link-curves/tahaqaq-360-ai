import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Lock, Mail, Shield, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface TahqaqLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const TahqaqLogo: React.FC<TahqaqLogoProps> = ({
  className = "",
  width = 28,
  height = 28,
}) => {
  return (
    <img
      src="/tahaqa_360_logo.png"
      alt="Tahqaq 360 Logo"
      width={width}
      height={height}
      className={className}
      style={{
        objectFit: "contain",
        display: "block",
      }}
    />
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Show session expired message if redirected with expired parameter
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.error("انتهت جلستك", {
        description: "يرجى تسجيل الدخول مرة أخرى",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData);
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div
      className="h-screen bg-gradient-to-br from-slate-900 via-red-900 to-rose-900 flex items-center justify-center p-4 relative overflow-hidden"
      dir="rtl"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center text-white space-y-8 p-8">
          {/* Logo */}
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="absolute -inset-8 bg-white/15 rounded-full blur-2xl group-hover:bg-white/25 transition-all duration-300"></div>
            <div className="absolute -inset-6 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-xl group-hover:from-white/30 group-hover:to-gray-200/30 transition-all duration-300"></div>
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-full p-6 shadow-2xl group-hover:shadow-3xl group-hover:scale-105 transition-all duration-300">
              <TahqaqLogo className="h-24 w-24" />
            </div>
            <div className="absolute -inset-2 border-2 border-white/30 rounded-full animate-pulse group-hover:border-white/50 transition-all duration-300"></div>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-wide">تحقق 360</h1>
            <p className="text-xl text-white/90">منصة التحقق من الحقائق</p>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Shield className="h-5 w-5 text-red-400" />
              <span>موثوق | دقيق | شامل</span>
              <TrendingUp className="h-5 w-5 text-rose-400" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 text-right w-full max-w-md">
            {[
              { icon: Shield, text: "تحقق موثوق من المعلومات" },
              { icon: TrendingUp, text: "تحليلات متقدمة بالذكاء الاصطناعي" },
              { icon: Lock, text: "حماية وخصوصية مضمونة" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="h-6 w-6 text-red-400 flex-shrink-0" />
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-6">
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-xl group-hover:from-red-500/30 group-hover:to-rose-500/30 transition-all duration-300"></div>
              <div className="relative bg-white rounded-full p-4 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <TahqaqLogo className="h-16 w-16" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              مرحباً بعودتك
            </h2>
            <p className="text-slate-600">سجل دخولك للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  البريد الإلكتروني
                </Label>
              </div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pr-10 h-12 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div>
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  كلمة المرور
                </Label>
              </div>

              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-10 pl-10 h-12 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-slate-600">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">أو</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-12 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-slate-600">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                سجل الآن
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

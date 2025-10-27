import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";

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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultView?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultView = "login",
}) => {
  const { login, register: registerUser, loginWithGoogle } = useAuth();
  const [view, setView] = useState<"login" | "register">(defaultView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setLoginData({ email: "", password: "" });
      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    setIsLoading(true);
    try {
      await registerUser({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    loginWithGoogle();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl p-0 gap-0 overflow-hidden bg-gradient-to-br from-slate-900 via-red-900 to-rose-900"
        dir="rtl"
      >
        {/* Hidden accessibility elements */}
        <DialogTitle className="sr-only">
          {view === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === "login"
            ? "سجل دخولك للوصول إلى حسابك"
            : "أنشئ حساباً جديداً للانضمام إلى منصة تحقق 360"}
        </DialogDescription>

        <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center text-white space-y-6 p-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Logo */}
              <div className="relative group cursor-pointer mx-auto w-fit">
                <div className="absolute -inset-6 bg-white/15 rounded-full blur-2xl group-hover:bg-white/25 transition-all duration-300"></div>
                <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-full p-5 shadow-2xl">
                  <TahqaqLogo width={80} height={80} />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold tracking-wide">تحقق 360</h1>
                <p className="text-lg text-white/90">منصة التحقق من الحقائق</p>
                <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                  <Shield className="h-4 w-4 text-red-400" />
                  <span>موثوق | دقيق | شامل</span>
                  <TrendingUp className="h-4 w-4 text-rose-400" />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 text-right w-full max-w-xs mx-auto">
                {[
                  { icon: Shield, text: "تحقق موثوق من المعلومات" },
                  {
                    icon: TrendingUp,
                    text: "تحليلات متقدمة بالذكاء الاصطناعي",
                  },
                  { icon: Lock, text: "حماية وخصوصية مضمونة" },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <feature.icon className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-white/90 text-sm">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white/95 backdrop-blur-xl p-8 overflow-y-auto max-h-[600px]">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-white rounded-full p-3 shadow-lg">
                  <TahqaqLogo width={48} height={48} />
                </div>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setView("login")}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  view === "login"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setView("register")}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  view === "register"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Login Form */}
            {view === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    مرحباً بعودتك
                  </h2>
                  <p className="text-slate-600 text-sm">سجل دخولك للمتابعة</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-700">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="example@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="pr-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-700">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="pr-10 pl-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                      required
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                  <a
                    href="/forgot-password"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 border-slate-300 hover:bg-slate-50 rounded-xl"
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
              </form>
            )}

            {/* Register Form */}
            {view === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    إنشاء حساب جديد
                  </h2>
                  <p className="text-slate-600 text-sm">
                    انضم إلى منصة تحقق 360
                  </p>
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700">
                      الاسم الأول
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="أحمد"
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            firstName: e.target.value,
                          })
                        }
                        className="pr-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700">
                      الاسم الأخير
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="محمد"
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            lastName: e.target.value,
                          })
                        }
                        className="pr-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-slate-700">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="example@email.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      className="pr-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-slate-700">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      className="pr-10 pl-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                      required
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-700">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pr-10 pl-10 h-11 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>جاري إنشاء الحساب...</span>
                    </div>
                  ) : (
                    "إنشاء حساب"
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

                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-11 border-slate-300 hover:bg-slate-50 rounded-xl"
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

                {/* Terms */}
                <p className="text-xs text-slate-600 text-center">
                  بإنشائك لحساب، أنت توافق على{" "}
                  <a
                    href="/terms-of-service"
                    className="text-red-600 hover:underline"
                  >
                    شروط الخدمة
                  </a>{" "}
                  و
                  <a
                    href="/privacy-policy"
                    className="text-red-600 hover:underline"
                  >
                    {" "}
                    سياسة الخصوصية
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

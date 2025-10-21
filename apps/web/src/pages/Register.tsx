import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    setIsLoading(true);
    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
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
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl animate-pulse delay-500"></div>
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
        {/* Left Side - Branding & Benefits */}
        <div className="hidden md:flex flex-col items-center justify-center text-white space-y-8 p-8">
          {/* Logo */}
          <div className="relative group">
            <div className="absolute -inset-8 bg-white/15 rounded-full blur-2xl"></div>
            <div className="absolute -inset-6 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-xl"></div>
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-full p-6 shadow-2xl">
              <TahqaqLogo className="h-24 w-24" />
            </div>
            <div className="absolute -inset-2 border-2 border-white/30 rounded-full animate-pulse"></div>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-wide">
              انضم إلى تحقق 360
            </h1>
            <p className="text-xl text-white/90">ابدأ رحلتك في عالم الحقائق</p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 text-right w-full max-w-md">
            {[
              { icon: CheckCircle2, text: "وصول غير محدود لجميع الدورات" },
              { icon: Shield, text: "تحقق موثوق من المعلومات" },
              { icon: TrendingUp, text: "متابعة تقدمك الشخصي" },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
              >
                <benefit.icon className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {[
              { number: "200+", label: "فحص حقائق" },
              { number: "50+", label: "دورة تعليمية" },
              { number: "100+", label: "فعالية" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20"
              >
                <div className="text-2xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-xs text-white/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 max-h-[95vh] overflow-hidden flex flex-col">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <TahqaqLogo className="h-16 w-16" />
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              إنشاء حساب جديد
            </h2>
            <p className="text-sm text-slate-600">
              انضم إلينا اليوم وابدأ التحقق من الحقائق
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 flex-1 overflow-hidden"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="firstName"
                  className="text-slate-700 font-medium text-sm"
                >
                  الاسم الأول
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="أحمد"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="pr-9 h-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="lastName"
                  className="text-slate-700 font-medium text-sm"
                >
                  الاسم الأخير
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="محمد"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="pr-9 h-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <div>
                <Label
                  htmlFor="email"
                  className="text-slate-700 font-medium text-sm"
                >
                  البريد الإلكتروني
                </Label>
              </div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pr-9 h-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl text-sm"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div>
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium text-sm"
                >
                  كلمة المرور
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-9 pl-9 h-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl text-sm"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-slate-700 font-medium text-sm"
                >
                  تأكيد كلمة المرور
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="pr-9 pl-9 h-10 bg-white border-slate-300 focus:border-red-500 focus:ring-red-500 rounded-xl text-sm"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
                className="w-4 h-4 mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                أوافق على{" "}
                <Link
                  to="/terms"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link
                  to="/privacy"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري إنشاء الحساب...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>إنشاء حساب</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  أو سجل باستخدام
                </span>
              </div>
            </div>

            {/* Social Registration */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleRegister}
                className="h-10 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 text-sm"
              >
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24">
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

            {/* Login Link */}
            <div className="text-center text-sm text-slate-600">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                سجل دخولك هنا
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

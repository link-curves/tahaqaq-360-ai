import { Button } from "@/components/ui/button";
import { usePlatformStats } from "@/hooks/useApi";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Eye,
  Search,
  Send,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({
  end,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count.toLocaleString("ar-SA")}</span>;
};

const Hero = () => {
  const navigate = useNavigate();
  const { data: statsData, isLoading } = usePlatformStats();
  const stats = statsData?.data;
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={heroRef}
      id="hero"
      className="relative bg-white text-gray-900 min-h-screen flex items-center overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Noto Sans Arabic, Cairo, Amiri, serif" }}
    >
      {/* Elegant Background with Red Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-red-50/30">
        {/* Animated Red Gradient Orb */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
          style={{
            background: `radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, rgba(244, 63, 94, 0.2) 40%, transparent 70%)`,
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Bottom Left Accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-red-100/40 via-rose-50/20 to-transparent opacity-60" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-red-200/30 rounded-lg rotate-12 animate-float" />
        <div className="absolute top-40 right-32 w-16 h-16 border-2 border-rose-300/20 rounded-full animate-float-delayed" />
        <div className="absolute bottom-32 right-20 w-12 h-12 bg-red-100/20 rounded-lg rotate-45 animate-float-slow" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-right space-y-8">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-full px-6 py-3 shadow-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-20 animate-pulse" />
                <TahqaqLogo className="h-8 w-8 relative z-10" />
              </div>
              <span className="text-lg font-bold text-red-600">تحقق 360</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">منصة التحقق من</span>
                <span className="block bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent">
                  الحقائق بالذكاء الاصطناعي
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                نساعدك في التحقق من صحة المعلومات والأخبار باستخدام تقنيات
                الذكاء الاصطناعي المتقدمة ونوفر لك تقارير دقيقة وموثوقة
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white border border-red-100 rounded-full px-4 py-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  تحقق فوري
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-red-100 rounded-full px-4 py-2 shadow-sm">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  موثوق 100%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-red-100 rounded-full px-4 py-2 shadow-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  ذكاء اصطناعي متقدم
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                onClick={() => navigate("/submit")}
                size="lg"
                className="group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  <span>ابدأ التحقق الآن</span>
                </div>
              </Button>

              <Button
                onClick={() => scrollToSection("#features")}
                size="lg"
                variant="outline"
                className="group border-2 border-red-200 hover:border-red-300 bg-white hover:bg-red-50 text-gray-900 font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  <span>اكتشف المزيد</span>
                </div>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>موثوق من آلاف المستخدمين</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>حائز على جوائز عالمية</span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Stats Display */}
          <div className="relative h-[600px] flex items-center justify-center">
            {/* Central Verification Badge */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="relative group cursor-pointer">
                {/* Pulsing Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-64 h-64 border-2 border-red-200/40 rounded-full animate-ping"
                    style={{ animationDuration: "3s" }}
                  />
                  <div
                    className="absolute w-48 h-48 border-2 border-rose-200/30 rounded-full animate-ping"
                    style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                  />
                </div>

                {/* Center Badge */}
                <div className="relative bg-gradient-to-br from-white to-red-50 border-4 border-red-100 rounded-full w-40 h-40 flex items-center justify-center shadow-2xl group-hover:shadow-red-200 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/10 rounded-full animate-pulse-slow" />
                  <div className="text-center relative z-10">
                    <CheckCircle2 className="w-16 h-16 text-red-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-700">موثوق</p>
                    <p className="text-xs text-gray-500">100%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Stats Cards */}
            {!isLoading && stats && (
              <>
                {/* Fact Checks - Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="group bg-white border-2 border-red-100 hover:border-red-300 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-red-100 to-rose-100 p-3 rounded-xl">
                        <Shield className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={stats.factChecks} />
                        </div>
                        <div className="text-xs font-semibold text-gray-600">
                          عملية تحقق
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>

                {/* Users - Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
                  <div className="group bg-white border-2 border-blue-100 hover:border-blue-300 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={stats.events} />
                        </div>
                        <div className="text-xs font-semibold text-gray-600">
                          فعالية
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>

                {/* Courses - Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="group bg-white border-2 border-emerald-100 hover:border-emerald-300 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-3 rounded-xl">
                        <BookOpen className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={stats.courses} />
                        </div>
                        <div className="text-xs font-semibold text-gray-600">
                          دورة تعليمية
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>

                {/* Research - Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                  <div className="group bg-white border-2 border-purple-100 hover:border-purple-300 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={stats.research} />
                        </div>
                        <div className="text-xs font-semibold text-gray-600">
                          بحث علمي
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </div>

                {/* Additional Feature Icons - Diagonal Positions */}
                <div className="absolute top-20 right-20 z-10">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Eye className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                <div className="absolute bottom-20 right-20 z-10">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Search className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>

                <div className="absolute top-20 left-20 z-10">
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Zap className="w-8 h-8 text-rose-600" />
                  </div>
                </div>

                <div className="absolute bottom-20 left-20 z-10">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </>
            )}

            {/* Connecting Lines (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <defs>
                <linearGradient
                  id="line-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
                  <stop offset="50%" stopColor="rgba(239, 68, 68, 0.2)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </linearGradient>
              </defs>
              {/* Lines from center to each stat card */}
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="10%"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse-slow"
              />
              <line
                x1="50%"
                y1="50%"
                x2="90%"
                y2="50%"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse-slow"
              />
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="90%"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse-slow"
              />
              <line
                x1="50%"
                y1="50%"
                x2="10%"
                y2="50%"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse-slow"
              />
            </svg>

            {/* Decorative Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 3}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={() => scrollToSection("#features")}
        >
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            اكتشف المزيد
          </span>
          <div className="w-6 h-10 border-2 border-gray-300 group-hover:border-red-500 rounded-full flex items-start justify-center p-2 transition-colors">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-scroll" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

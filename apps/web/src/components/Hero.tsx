import { Button } from "@/components/ui/button";
import { usePlatformStats } from "@/hooks/useApi";
import { BookOpen, Eye, Search, Target, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
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

      // Easing function for smooth animation
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

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="hero"
      className="relative bg-gradient-to-br from-slate-900 via-red-900 to-rose-900 text-white h-screen flex items-center overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Noto Sans Arabic, Cairo, Amiri, serif" }}
    >
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0">
        {/* Large floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-red-400/30 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-rose-400/20 rounded-full animate-pulse delay-300"></div>

        {/* Gradient overlays with animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent animate-pulse"></div>
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

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 z-10">
        <div className="text-center">
          {/* Logo with enhanced effects */}
          <div className="flex justify-center mb-8 relative">
            <div className="relative group">
              {/* Multiple layered background effects */}
              <div className="absolute -inset-8 bg-white/15 rounded-full blur-2xl"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-br from-white/25 via-gray-100/25 to-white/25 rounded-full backdrop-blur-sm border border-white/20 group-hover:border-white/30 transition-all duration-300"></div>

              {/* Logo container */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-full p-4 shadow-2xl group-hover:bg-white transition-all duration-300 transform group-hover:scale-105">
                <TahqaqLogo className="h-20 w-20 relative z-10" />
              </div>

              {/* Animated ring effects */}
              <div className="absolute -inset-2 border-2 border-white/30 rounded-full animate-pulse"></div>
              <div className="absolute -inset-1 border border-red-300/50 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Main heading with enhanced animation */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight tracking-wide animate-fade-in">
            تحقق 360
          </h1>

          {/* Subtitle with icons */}
          <div className="flex items-center justify-center mb-4 animate-slide-up">
            <Eye className="h-6 w-6 text-red-400 ml-2 animate-pulse" />
            <p className="text-lg md:text-xl font-medium text-white">
              كاشف الحقائق | محارب المعلومات المضللة
            </p>
            <Target className="h-6 w-6 text-red-400 mr-2 animate-pulse delay-150" />
          </div>

          {/* Main description */}
          <p className="text-xl md:text-2xl mb-12 text-white max-w-4xl mx-auto leading-relaxed font-light animate-slide-up delay-200">
            منصتك الموثوقة للتحقق من صحة الأخبار وتعليم محو الأمية الإعلامية
            <br className="hidden md:block" />
            ومحاربة المعلومات المضللة
            <br className="hidden md:block" />
            باستخدام أدوات التحقق المدعومة بالذكاء الاصطناعي
          </p>

          {/* Dynamic Statistics Section */}
          {!isLoading && stats && (
            <div className="mb-12 animate-slide-up delay-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {/* Fact Checks Stat */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-center mb-2">
                    <Search className="h-6 w-6 text-red-400 group-hover:animate-pulse" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stats.factChecks} />
                  </div>
                  <div className="text-sm text-white/80">فحص حقائق</div>
                </div>

                {/* Events Stat */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-rose-400 group-hover:animate-pulse" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stats.events} />
                  </div>
                  <div className="text-sm text-white/80">فعالية</div>
                </div>

                {/* Courses Stat */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-emerald-400 group-hover:animate-pulse" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stats.courses} />
                  </div>
                  <div className="text-sm text-white/80">دورة تعليمية</div>
                </div>

                {/* Users/Research Stat */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-400 group-hover:animate-pulse" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter end={stats.research} />
                  </div>
                  <div className="text-sm text-white/80">بحث علمي</div>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Users className="h-4 w-4" />
                    <span className="text-2xl font-bold">
                      <AnimatedCounter end={stats.enrollments} />
                    </span>
                    <span className="text-sm">طالب مسجل</span>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Target className="h-4 w-4" />
                    <span className="text-2xl font-bold">
                      <AnimatedCounter end={stats.submissions} />
                    </span>
                    <span className="text-sm">طلب تحقق</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up delay-400">
            <Button
              onClick={() => navigate("/fact-checks")}
              className="bg-white hover:bg-red-600 text-red-600 hover:text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20 font-semibold"
            >
              <Search className="ml-2 h-5 w-5 transition-colors duration-300" />
              ابدأ التحقق من الأخبار
            </Button>
            <Button
              onClick={() => scrollToSection("#education")}
              variant="outline"
              className="bg-white hover:bg-red-600 border-2 border-white hover:border-red-600 text-red-600 hover:text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
            >
              <BookOpen className="ml-2 h-5 w-5 transition-colors duration-300" />
              تعلم محو الأمية الإعلامية
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

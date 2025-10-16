import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Search, Target } from "lucide-react";
import React from "react";

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

const Hero = () => {
  return (
    <div
      id="hero"
      className="relative bg-gradient-to-br from-slate-900 via-red-900 to-rose-900 text-white h-screen flex items-center overflow-hidden"
      dir="rtl"
      style={{ fontFamily: "Noto Sans Arabic, Cairo, Amiri, serif" }}
    >
      {/* Animated background elements for detective theme */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>
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
      </div>{" "}
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 z-10">
        <div className="text-center">
          {" "}
          {/* Logo with creative background effect */}
          <div className="flex justify-center mb-8 relative">
            <div className="relative group">
              {/* Multiple layered background effects */}
              <div className="absolute -inset-8 bg-white/15 rounded-full blur-2xl"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-white/20 to-gray-200/20 rounded-full blur-xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-br from-white/25 via-gray-100/25 to-white/25 rounded-full backdrop-blur-sm border border-white/20 group-hover:border-white/30 transition-all duration-300"></div>
              {/* Logo container with white background */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-full p-4 shadow-2xl group-hover:bg-white transition-all duration-300 transform group-hover:scale-105">
                <TahqaqLogo className="h-20 w-20 relative z-10" />
              </div>{" "}
              {/* Animated ring effect */}
              <div className="absolute -inset-2 border-2 border-white/30 rounded-full animate-pulse"></div>
              <div className="absolute -inset-1 border border-red-300/50 rounded-full animate-ping"></div>
            </div>
          </div>{" "}
          {/* Main heading with Arabic text */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight tracking-wide">
            تحقق 360
          </h1>
          {/* Subtitle with detective theme */}
          <div className="flex items-center justify-center mb-4">
            <Eye className="h-6 w-6 text-red-400 ml-2" />
            <p className="text-lg md:text-xl font-medium text-white">
              كاشف الحقائق | محارب المعلومات المضللة
            </p>
            <Target className="h-6 w-6 text-red-400 mr-2" />
          </div>{" "}
          {/* Main description */}
          <p className="text-xl md:text-2xl mb-12 text-white max-w-4xl mx-auto leading-relaxed font-light">
            منصتك الموثوقة للتحقق من صحة الأخبار وتعليم محو الأمية الإعلامية
            <br className="hidden md:block" />
            ومحاربة المعلومات المضللة
            <br className="hidden md:block" />
            باستخدام أدوات التحقق المدعومة بالذكاء الاصطناعي
          </p>{" "}
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white hover:bg-red-600 text-red-600 hover:text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-white/20 font-semibold">
              <Search className="ml-2 h-5 w-5 transition-colors duration-300" />
              ابدأ التحقق من الأخبار
            </Button>
            <Button
              variant="outline"
              className="bg-white hover:bg-red-600 border-2 border-white hover:border-red-600 text-red-600 hover:text-white px-10 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
            >
              <BookOpen className="ml-2 h-5 w-5 transition-colors duration-300" />
              تعلم محو الأمية الإعلامية{" "}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import { Button } from "@/components/ui/button";
import {
  Award,
  CheckCircle2,
  Search,
  Send,
  Shield,
  Target,
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

const Hero = () => {
  const navigate = useNavigate();
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
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">نحو وعي رقمي</span>
                <span className="block bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent mt-3">
                  لا يخدعك أحد
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

                {/* Center Badge - 360° Verification Hub */}
                <div className="relative w-100 h-100 flex items-center justify-center">
                  {/* Rotating Outer Ring with Verification Icons */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="relative w-full h-full">
                      {/* AI Icon - Top */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-3 shadow-xl">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Shield Icon - Right */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 shadow-xl">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Check Icon - Bottom */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 shadow-xl">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Search Icon - Left */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                        <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-3 shadow-xl">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Ring - Counter Rotate */}
                  <div className="absolute inset-10 border-4 border-dashed border-red-200 rounded-full animate-spin-reverse" />

                  {/* Inner Glow Ring */}
                  <div className="absolute inset-16 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full blur-lg animate-pulse-slow" />

                  {/* Central Core */}
                  <div className="relative bg-gradient-to-br from-white via-red-50 to-rose-50 border-6 border-red-100 rounded-full w-48 h-48 flex items-center justify-center shadow-3xl group-hover:shadow-red-300 transition-all duration-500 group-hover:scale-110 z-10">
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-rose-600/10 rounded-full animate-pulse-slow" />

                    {/* 360° Text with Logo */}
                    <div className="text-center relative z-10">
                      <div className="relative mb-3">
                        <TahqaqLogo
                          width={60}
                          height={60}
                          className="mx-auto drop-shadow-lg"
                        />
                        {/* Orbiting Sparkles */}
                        <div className="absolute -top-2 -right-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                        </div>
                      </div>
                      <div className="text-4xl font-black bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent leading-none">
                        360
                      </div>
                      <p className="text-sm font-bold text-gray-600 mt-2">
                        تحقق شامل
                      </p>
                    </div>

                    {/* Scanning Line Effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

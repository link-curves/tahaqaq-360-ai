import { useFactCheckStats } from "@/hooks/useApi";
import { BookOpen, Shield, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Animated Counter Component
const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
  suffix?: string;
  formatAsNumber?: boolean;
}> = ({ end, duration = 2000, suffix = "", formatAsNumber = true }) => {
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

  const displayValue = formatAsNumber ? count.toLocaleString("ar-SA") : count;

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const { data: statsData, isLoading, error } = useFactCheckStats();

  // Default fallback stats
  const defaultStats = [
    {
      icon: Shield,
      value: 0,
      suffix: "",
      label: "حقيقة تم التحقق منها",
      color: "text-red-500",
      bgColor: "from-red-50 to-rose-50",
      borderColor: "border-red-100 hover:border-red-200",
    },
    {
      icon: Users,
      value: 0,
      suffix: "",
      label: "مستخدم نشط",
      color: "text-blue-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-100 hover:border-blue-200",
    },
    {
      icon: BookOpen,
      value: 0,
      suffix: "",
      label: "مورد تعليمي",
      color: "text-emerald-500",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-100 hover:border-emerald-200",
    },
    {
      icon: TrendingUp,
      value: 99.2,
      suffix: "%",
      label: "معدل الدقة",
      color: "text-purple-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-100 hover:border-purple-200",
      formatAsNumber: false,
    },
  ];

  // Use real data if available, otherwise use defaults
  const stats =
    statsData?.data && !isLoading
      ? [
          {
            icon: Shield,
            value: statsData.data.totalFactChecks || 12000,
            suffix: "+",
            label: "حقيقة تم التحقق منها",
            color: "text-red-500",
            bgColor: "bg-white",
            borderColor: "border-red-100 hover:border-red-200",
          },
          {
            icon: Users,
            value: 50000,
            suffix: "+",
            label: "مستخدم نشط",
            color: "text-blue-500",
            bgColor: "bg-white",
            borderColor: "border-blue-100 hover:border-blue-200",
          },
          {
            icon: BookOpen,
            value: 200,
            suffix: "+",
            label: "مورد تعليمي",
            color: "text-emerald-500",
            bgColor: "bg-white",
            borderColor: "border-emerald-100 hover:border-emerald-200",
          },
          {
            icon: TrendingUp,
            value: 99.2,
            suffix: "%",
            label: "معدل الدقة",
            color: "text-purple-500",
            bgColor: "bg-white",
            borderColor: "border-purple-100 hover:border-purple-200",
            formatAsNumber: false,
          },
        ]
      : defaultStats;

  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            موثوق به من قبل المعلمين في جميع أنحاء العالم
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ساعدت منصتنا الآلاف في مكافحة المعلومات المضللة وبناء مهارات محو
            الأمية الإعلامية
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className={`bg-gradient-to-br ${stat.bgColor || "from-white to-gray-50"} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 border-2 ${stat.borderColor} hover:shadow-2xl`}
              >
                <div className="relative mb-6">
                  <div
                    className={`bg-gradient-to-br ${stat.bgColor} p-4 rounded-xl inline-block`}
                  >
                    <stat.icon className={`h-12 w-12 ${stat.color}`} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                <div className={`text-4xl font-black mb-3 ${stat.color}`}>
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    formatAsNumber={stat.formatAsNumber !== false}
                    duration={2500}
                  />
                </div>
                <div className="text-gray-700 text-base font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

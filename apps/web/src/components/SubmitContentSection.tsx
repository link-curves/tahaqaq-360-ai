import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Image, Link, Music, Send, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubmitContentSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const contentTypes = [
    { icon: FileText, label: "نص", color: "from-blue-500 to-cyan-500" },
    { icon: Image, label: "صورة", color: "from-purple-500 to-pink-500" },
    { icon: Video, label: "فيديو", color: "from-red-500 to-orange-500" },
    { icon: Music, label: "صوت", color: "from-green-500 to-emerald-500" },
    { icon: Link, label: "رابط", color: "from-yellow-500 to-amber-500" },
  ];

  return (
    <section
      className="relative py-20 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 overflow-hidden"
      dir="rtl"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            شارك معنا في مكافحة المعلومات المضللة
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            ساعدنا في التحقق من الأخبار والمعلومات المنتشرة. أرسل المحتوى
            المشكوك به وسيقوم فريقنا بالتحقق منه
          </p>
        </div>

        {/* Content Types */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12 max-w-5xl mx-auto">
          {contentTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                ></div>
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`bg-gradient-to-br ${type.color} p-4 rounded-xl`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {type.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6">
          <Button
            onClick={() => navigate(isAuthenticated ? "/submit" : "/login")}
            size="lg"
            className="group relative bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-10 py-7 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Send className="h-6 w-6 ml-2" />
            <span className="relative text-lg">
              {isAuthenticated ? "إرسال محتوى للتحقق" : "سجل الدخول للمساهمة"}
            </span>
          </Button>

          <div className="flex items-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>مجاني تماماً</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>نتائج سريعة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>موثوق ودقيق</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitContentSection;

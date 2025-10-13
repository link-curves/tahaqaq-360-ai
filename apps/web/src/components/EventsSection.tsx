import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const EventsSection = () => {
  const events = [
    {
      title: "ورشة عمل محو الأمية الإعلامية للمعلمين",
      date: "25 يونيو 2024",
      time: "2:00 مساءً - 5:00 مساءً",
      location: "ندوة عبر الإنترنت",
      attendees: "156 مسجل",
      type: "ورشة عمل",
      description:
        "انضم إلينا في ورشة عمل تفاعلية مصممة خصيصاً للمعلمين الذين يتطلعون إلى دمج محو الأمية الإعلامية في مناهجهم الدراسية.",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop",
    },
    {
      title: "الذكاء الاصطناعي والمعلومات المضللة: نقاش خبراء",
      date: "5 يوليو 2024",
      time: "7:00 مساءً - 8:30 مساءً",
      location: "مركز التكنولوجيا، دبي",
      attendees: "89 مسجل",
      type: "نقاش",
      description:
        "خبراء رائدون يناقشون أحدث الاتجاهات في المعلومات المضللة المولدة بالذكاء الاصطناعي وتقنيات الكشف.",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
    },
    {
      title: "معسكر تدريبي لفحص الحقائق للصحفيين",
      date: "15 يوليو 2024",
      time: "9:00 صباحاً - 4:00 مساءً",
      location: "نادي الصحافة، أبو ظبي",
      attendees: "45 مسجل",
      type: "تدريب",
      description:
        "برنامج تدريبي مكثف يغطي منهجيات فحص الحقائق المتقدمة وأدوات التحقق الرقمية.",
      image:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
    },
    {
      title: "مؤتمر مكافحة الأخبار المزيفة في الشرق الأوسط",
      date: "20 يوليو 2024",
      time: "9:00 صباحاً - 6:00 مساءً",
      location: "مركز دبي التجاري العالمي",
      attendees: "320 مسجل",
      type: "مؤتمر",
      description:
        "مؤتمر إقليمي يجمع خبراء من جميع أنحاء المنطقة لمناقشة أفضل الممارسات في مكافحة الأخبار المزيفة.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    },
    {
      title: "ورشة حماية الأطفال من المعلومات المضللة",
      date: "25 يوليو 2024",
      time: "10:00 صباحاً - 2:00 مساءً",
      location: "مركز الشارقة الثقافي",
      attendees: "78 مسجل",
      type: "ورشة عمل",
      description:
        "دورة تدريبية للآباء والمعلمين حول كيفية حماية الأطفال من المعلومات المضللة عبر الإنترنت.",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop",
    },
    {
      title: "دورة التحقق من المحتوى المرئي والصوتي",
      date: "30 يوليو 2024",
      time: "6:00 مساءً - 9:00 مساءً",
      location: "جامعة الإمارات، العين",
      attendees: "62 مسجل",
      type: "دورة",
      description:
        "تعلم أحدث التقنيات للتحقق من صحة الصور ومقاطع الفيديو والملفات الصوتية المنتشرة على وسائل التواصل.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    },
  ];
  return (
    <div
      className="bg-gradient-to-br from-amber-50/30 to-orange-50/50 py-20"
      id="events"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            الفعاليات وورش العمل القادمة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Cairo']">
            انضم إلى فعاليات مجتمعنا وورش العمل وجلسات التدريب لتعزيز مهاراتك في
            محو الأمية الإعلامية والتواصل مع زملائك في فحص الحقائق والمعلمين
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {events.map((event, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                {/* Floating Type Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                    <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Attendees Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg flex items-center">
                    <Users className="h-3 w-3 text-white ml-1" />
                    <span className="text-xs text-white font-medium font-['Cairo']">
                      {event.attendees}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed group-hover:text-red-600 transition-colors duration-300 flex-grow-0">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed flex-grow">
                  {event.description}
                </p>
                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                    <span>{event.date}</span>
                    <Calendar className="h-4 w-4 ml-3 text-red-500" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                    <span>{event.time}</span>
                    <Clock className="h-4 w-4 ml-3 text-red-500" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                    <span>{event.location}</span>
                    <MapPin className="h-4 w-4 ml-3 text-red-500" />
                  </div>
                </div>{" "}
                {/* Register Button */}
                <Button className="w-full mt-auto bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg text-white">
                  <span className="flex items-center justify-center space-x-2 space-x-reverse text-white">
                    <span>سجل الآن</span>
                    <svg
                      className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </span>
                </Button>
              </div>

              {/* Card Accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>{" "}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-0">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
              هل تريد استضافة فعالية؟
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-right font-['Cairo'] leading-relaxed">
              تشارك معنا في جلب التدريب على محو الأمية الإعلامية إلى مؤسستك أو
              مدرستك أو مجتمعك. نحن نقدم ورش عمل وبرامج تدريبية مخصصة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 px-8 rounded-lg">
                اطلب تدريباً
              </Button>
              <Button
                variant="outline"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-['Cairo'] font-semibold py-3 px-8 rounded-lg"
              >
                عرض جميع الفعاليات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;

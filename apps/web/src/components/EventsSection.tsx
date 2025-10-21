import { TrainingRequestModal } from "@/components/TrainingRequestModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingEvents } from "@/hooks/useApi";
import { EventType, EventTypeValue } from "@/lib/api";
import { formatDate, generateExcerpt, getImageUrl } from "@/lib/utils";
import { AlertCircle, Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventsSection = () => {
  const { data: eventsData, isLoading, error } = useUpcomingEvents(4);
  const navigate = useNavigate();
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const getEventTypeLabel = (type: EventTypeValue) => {
    switch (type) {
      case EventType.WORKSHOP:
        return "ورشة عمل";
      case EventType.CONFERENCE:
        return "مؤتمر";
      case EventType.WEBINAR:
        return "ندوة إلكترونية";
      case EventType.TRAINING:
        return "تدريب";
      default:
        return "فعالية";
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        id="events"
        className="bg-gradient-to-br from-red-50 to-white py-24"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        id="events"
        className="bg-gradient-to-br from-red-50 to-white py-24"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>حدث خطأ في تحميل الفعاليات</p>
          </div>
        </div>
      </div>
    );
  }

  const events = eventsData?.data || [];

  return (
    <div
      id="events"
      className="bg-gradient-to-br from-red-50 to-white py-24"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-['Cairo']">
            الفعاليات والورش
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-['Cairo']">
            انضم إلى فعالياتنا التعليمية وورش العمل المتخصصة في محو الأمية
            الإعلامية وفحص الحقائق
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xl">
              لا توجد فعاليات مجدولة حالياً
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-16">
            {events.map((event) => (
              <Card
                key={event.id}
                onClick={() => navigate(`/events/${event.slug}`)}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative cursor-pointer"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(event.coverImage)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=200&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                  {/* Floating Type Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                      <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>

                  {/* Attendees Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg flex items-center">
                      <Users className="h-3 w-3 text-white ml-1" />
                      <span className="text-xs text-white font-medium font-['Cairo']">
                        {event.maxAttendees
                          ? `${event.maxAttendees} مقعد`
                          : "مقاعد محدودة"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title - Fixed height for 2 lines */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-tight group-hover:text-red-600 transition-colors duration-300 min-h-[3.5rem] overflow-hidden">
                    {event.title}
                  </h3>

                  {/* Description - Fixed height for 3 lines */}
                  <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed min-h-[4rem] overflow-hidden">
                    {generateExcerpt(event.description, 100)}
                  </p>

                  {/* Event Details - Fixed height */}
                  <div className="space-y-3 mb-6 min-h-[4rem]">
                    <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                      <span>{formatDate(event.startDate)}</span>
                      <Calendar className="h-4 w-4 ml-3 text-red-500" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 text-right font-['Cairo']">
                      <span className="line-clamp-1">
                        {event.location ||
                          (event.isVirtual
                            ? "فعالية افتراضية"
                            : "الموقع سيحدد لاحقاً")}
                      </span>
                      <MapPin className="h-4 w-4 ml-3 text-red-500 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Register Button - Always at bottom */}
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
          </div>
        )}

        {/* Call to Action Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-0">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
              هل تريد استضافة فعالية؟
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-right font-['Cairo'] leading-relaxed">
              شارك معنا في جلب التدريب على محو الأمية الإعلامية إلى مؤسستك أو
              مدرستك أو مجتمعك. نحن نقدم ورش عمل وبرامج تدريبية مخصصة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsTrainingModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-bold py-3 px-8 rounded-lg text-amber-50"
              >
                اطلب تدريباً
              </Button>
              <Button
                onClick={() => navigate("/events")}
                variant="outline"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-['Cairo'] font-semibold py-3 px-8 rounded-lg"
              >
                عرض جميع الفعاليات
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Training Request Modal */}
      <TrainingRequestModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
      />
    </div>
  );
};

export default EventsSection;

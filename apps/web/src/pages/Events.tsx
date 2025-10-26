import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/useApi";
import { EventType, EventTypeValue } from "@/lib/api";
import { formatDate, getImageUrl, getTextDirection } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState<EventTypeValue | "">("");

  // Build params object - NO page parameter (backend doesn't support it)
  const params = {
    ...(search && { search }),
    ...(eventType && { type: eventType }),
  };

  const { data, isLoading } = useEvents(params);

  console.log("Events Debug:", { data, isLoading, params });

  // Client-side pagination
  const allEvents = data?.data || [];
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allEvents.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const events = allEvents.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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

  const getEventTypeBadgeColor = (type: EventTypeValue) => {
    switch (type) {
      case EventType.WORKSHOP:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case EventType.CONFERENCE:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case EventType.WEBINAR:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case EventType.TRAINING:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleEventClick = (slug: string) => {
    navigate(`/events/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-18" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Cairo']">
            الفعاليات
          </h1>
          <p className="text-xl text-white/90 font-['Cairo']">
            اكتشف فعالياتنا وورش العمل والمؤتمرات القادمة
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن فعالية..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10 text-right font-['Cairo']"
              />
            </div>
            <Select
              value={eventType || "all"}
              onValueChange={(value) => {
                setEventType(value === "all" ? "" : (value as EventTypeValue));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48 font-['Cairo']">
                <SelectValue placeholder="نوع الفعالية" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="font-['Cairo']">
                  جميع الأنواع
                </SelectItem>
                <SelectItem
                  value={EventType.WORKSHOP}
                  className="font-['Cairo']"
                >
                  ورشة عمل
                </SelectItem>
                <SelectItem
                  value={EventType.CONFERENCE}
                  className="font-['Cairo']"
                >
                  مؤتمر
                </SelectItem>
                <SelectItem
                  value={EventType.WEBINAR}
                  className="font-['Cairo']"
                >
                  ندوة إلكترونية
                </SelectItem>
                <SelectItem
                  value={EventType.TRAINING}
                  className="font-['Cairo']"
                >
                  تدريب
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Cairo']">
              لا توجد فعاليات
            </h2>
            <p className="text-gray-600 font-['Cairo']">
              لم يتم العثور على أي فعاليات في الوقت الحالي
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const cardDirection = getTextDirection(event.title);
                return (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                    onClick={() => handleEventClick(event.slug)}
                    dir={cardDirection}
                  >
                    {/* Event Image */}
                    <div className="relative h-48 bg-gradient-to-br from-red-600 to-red-800 flex-shrink-0">
                      {event.coverImage && (
                        <img
                          src={getImageUrl(event.coverImage)}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={`${getEventTypeBadgeColor(
                            event.type
                          )} border-0 shadow-md font-['Cairo']`}
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      {event.isVirtual && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white text-gray-900 border-0 shadow-md font-['Cairo']">
                            افتراضي
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title - Fixed height for 2 lines */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Cairo'] leading-tight min-h-[3.5rem] overflow-hidden">
                        {event.title}
                      </h3>

                      {/* Description - Fixed height for 3 lines */}
                      <div
                        className="text-gray-600 text-sm mb-4 font-['Cairo'] leading-relaxed min-h-[4.5rem] overflow-hidden"
                        dangerouslySetInnerHTML={{
                          __html: event.description.substring(0, 200) + "...",
                        }}
                      />

                      {/* Event Details - Fixed height */}
                      <div className="space-y-2 text-sm text-gray-700 mb-4 min-h-[3.5rem]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-red-600 flex-shrink-0" />
                          <span className="font-['Cairo']">
                            {formatDate(event.startDate)}
                          </span>
                        </div>

                        {event.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span className="line-clamp-1 font-['Cairo']">
                              {event.location}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span className="line-clamp-1 font-['Cairo']">
                              {event.isVirtual
                                ? "فعالية افتراضية"
                                : "الموقع سيحدد لاحقاً"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags Section - Fixed height whether tags exist or not */}
                      <div className="min-h-[3rem] mb-4">
                        {event.tags && event.tags.length > 0 && (
                          <div className="pt-4 border-t flex flex-wrap gap-2">
                            {event.tags
                              .slice(0, 3)
                              .map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-sm font-['Cairo'] bg-red-50 text-red-700 hover:bg-red-10"
                                >
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Button - Always at bottom */}
                      <div className="mt-auto">
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-amber-50 font-bold font-['Cairo']">
                          التفاصيل والتسجيل
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {data.totalPages && data.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(data.totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={page === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(index + 1)}
                      className={
                        page === index + 1
                          ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.totalPages}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;

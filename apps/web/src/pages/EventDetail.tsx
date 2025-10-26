import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEvent } from "@/hooks/useApi";
import { EventType, EventTypeValue } from "@/lib/api";
import { formatDate, getTextDirection } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: eventData, isLoading, error } = useEvent(slug || "");

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

  const handleRegister = () => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول للتسجيل في هذه الفعالية",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // TODO: Implement event registration API call
    toast({
      title: "تم التسجيل بنجاح!",
      description: "تم تسجيلك في هذه الفعالية بنجاح",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            لم يتم العثور على الفعالية
          </h1>
          <Button onClick={() => navigate("/events")}>
            العودة إلى قائمة الفعاليات
          </Button>
        </div>
      </div>
    );
  }

  const event = eventData;

  // Detect text direction based on the title
  const textDirection = getTextDirection(event.title);

  return (
    <div className="min-h-screen bg-gray-50" dir={textDirection}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-red-600 to-red-800">
        {event.coverImage && (
          <>
            <img
              src={event.coverImage}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 self-start"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            رجوع
          </Button>

          <Badge className="bg-white text-red-600 border-0 shadow-lg mb-4 self-start text-lg px-4 py-2 font-['Cairo']">
            {getEventTypeLabel(event.type)}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-['Cairo']">
                {formatDate(event.startDate)}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-['Cairo']">
                  {event.location || (event.isVirtual ? "فعالية افتراضية" : "")}
                </span>
              </div>
            )}
            {event.maxAttendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-['Cairo']">
                  {event.maxAttendees} مقعد
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Description */}
            <div className="mb-8 bg-white rounded-2xl shadow-sm p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Cairo']">
                عن الفعالية
              </h2>
              <div
                className="prose prose-xl max-w-none
                [&>*]:font-['Cairo']
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:leading-tight [&_h1]:border-b [&_h1]:border-gray-200 [&_h1]:pb-4
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:leading-snug [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-3
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:leading-normal
                [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mb-3 [&_h4]:mt-6
                [&_h5]:text-lg [&_h5]:font-semibold [&_h5]:text-gray-700 [&_h5]:mb-2 [&_h5]:mt-4
                [&_p]:text-gray-700 [&_p]:text-lg [&_p]:leading-loose [&_p]:mb-6
                [&_a]:text-red-600 [&_a]:font-semibold [&_a]:no-underline [&_a:hover]:text-red-700 [&_a:hover]:underline
                [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:bg-yellow-50 [&_strong]:px-1 [&_strong]:py-0.5 [&_strong]:rounded
                [&_em]:italic [&_em]:text-gray-800
                [&_ul]:my-6 [&_ul]:space-y-2 [&_ul]:pr-6
                [&_ol]:my-6 [&_ol]:space-y-2 [&_ol]:pr-6
                [&_li]:text-gray-700 [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2
                [&_ul>li]:list-disc [&_ul>li]:marker:text-red-600 [&_ul>li]:marker:text-xl
                [&_ol>li]:list-decimal [&_ol>li]:marker:text-red-600 [&_ol>li]:marker:font-bold
                [&_blockquote]:border-r-4 [&_blockquote]:border-red-600 [&_blockquote]:bg-gradient-to-l [&_blockquote]:from-red-50 [&_blockquote]:to-transparent
                [&_blockquote]:pr-6 [&_blockquote]:pl-4 [&_blockquote]:py-5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-gray-800
                [&_blockquote]:rounded-r-lg [&_blockquote]:shadow-sm
                [&_code]:font-mono [&_code]:bg-gray-100 [&_code]:text-red-600 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:shadow-lg
                [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0
                [&_img]:rounded-2xl [&_img]:shadow-xl [&_img]:my-8 [&_img]:w-full
                [&_hr]:border-gray-300 [&_hr]:my-10
                [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-200
                [&_thead]:bg-red-50 [&_thead]:border-b-2 [&_thead]:border-red-600
                [&_th]:px-6 [&_th]:py-3 [&_th]:text-right [&_th]:font-bold [&_th]:text-gray-900
                [&_td]:px-6 [&_td]:py-3 [&_td]:border-b [&_td]:border-gray-200 [&_td]:text-gray-700
                [&>*:first-child]:mt-0
                [&>*:last-child]:mb-0"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {event.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
                  جدول الأعمال
                </h2>
                <div className="space-y-4">
                  {event.agenda.map((item: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 font-['Cairo']">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-gray-700 font-['Cairo']">
                            {item.title}
                          </p>
                          {item.speaker && (
                            <p className="text-sm text-gray-600 mt-1 font-['Cairo']">
                              المتحدث: {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
                  المتحدثون
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker: any, index: number) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                          {speaker.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 font-['Cairo']">
                            {speaker.name}
                          </p>
                          <p className="text-sm text-gray-600 font-['Cairo']">
                            {speaker.title}
                          </p>
                        </div>
                      </div>
                      {speaker.bio && (
                        <p className="text-sm text-gray-700 font-['Cairo']">
                          {speaker.bio}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
                  المتطلبات
                </h2>
                <ul className="space-y-2">
                  {event.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-['Cairo']">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-['Cairo']">
                التفاصيل
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 font-['Cairo']">
                      التاريخ
                    </p>
                    <p className="text-sm text-gray-700 font-['Cairo']">
                      {formatDate(event.startDate)}
                      {event.endDate && event.endDate !== event.startDate && (
                        <> - {formatDate(event.endDate)}</>
                      )}
                    </p>
                  </div>
                </div>

                {(event.location || event.isVirtual) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900 font-['Cairo']">
                        الموقع
                      </p>
                      <p className="text-sm text-gray-700 font-['Cairo']">
                        {event.location || "فعالية افتراضية"}
                      </p>
                      {event.isVirtual && event.virtualLink && (
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mt-1"
                        >
                          رابط الفعالية
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {event.maxAttendees && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900 font-['Cairo']">
                        المقاعد المتاحة
                      </p>
                      <p className="text-sm text-gray-700 font-['Cairo']">
                        {event.maxAttendees} مقعد
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 font-['Cairo'] font-semibold text-lg text-amber-50 py-6"
                onClick={handleRegister}
              >
                سجل الآن
              </Button>

              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <p className="font-bold text-gray-900 mb-3 font-['Cairo']">
                    الوسوم
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm font-['Cairo'] bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                        onClick={() =>
                          navigate(`/events?tag=${encodeURIComponent(tag)}`)
                        }
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchArticle } from "@/hooks/useApi";
import { formatDate, getImageUrl, getTextDirection } from "@/lib/utils";
import { ArrowLeft, Calendar, Download, Eye, Share2, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ResearchDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    data: researchData,
    isLoading,
    error,
  } = useResearchArticle(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !researchData) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            لم يتم العثور على البحث
          </h1>
          <Button onClick={() => navigate("/research")}>
            العودة إلى قائمة الأبحاث
          </Button>
        </div>
      </div>
    );
  }

  const research = researchData;
  const textDirection = getTextDirection(research.title);

  return (
    <div className="min-h-screen bg-gray-50" dir={textDirection}>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-red-600 to-red-800">
        {research.coverImage && (
          <>
            <img
              src={getImageUrl(research.coverImage)}
              alt={research.title}
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
            {research.category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            {research.title}
          </h1>

          <div className="flex items-center gap-6 text-white/90 text-sm flex-wrap">
            {research.authors && research.authors.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-['Cairo']">
                  {research.authors.join(", ")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-['Cairo']">
                {formatDate(research.publishedAt || research.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-['Cairo']">{research.views} مشاهدة</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 ml-2" />
              مشاركة
            </Button>
            {research.downloads > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل ({research.downloads})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Summary */}
        <div className="mb-8 bg-red-50/50 p-8 rounded-xl border-r-4 border-red-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            ملخص البحث
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-['Cairo']">
            {research.summary}
          </p>
        </div>

        {/* Full Content */}
        <div className="mb-8">
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-['Cairo']"
            dangerouslySetInnerHTML={{ __html: research.fullContent }}
          />
        </div>

        {/* Tags */}
        {research.tags && research.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Cairo']">
              الوسوم
            </h3>
            <div className="flex flex-wrap gap-2">
              {research.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-['Cairo']"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {research.attachments && research.attachments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Cairo']">
              المرفقات
            </h3>
            <div className="space-y-3">
              {research.attachments.map((attachment: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-red-600 hover:text-red-700"
                  >
                    <span className="font-['Cairo']">
                      {attachment.name || attachment.url}
                    </span>
                    <Download className="h-4 w-4 mr-2" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDetail;

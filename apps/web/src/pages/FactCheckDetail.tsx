import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFactCheck, useRelatedFactChecks } from "@/hooks/useApi";
import {
  formatDate,
  getImageUrl,
  getVeracityColor,
  getVeracityLabel,
} from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ExternalLink,
  Eye,
  Share2,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const FactCheckDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: factCheckData, isLoading, error } = useFactCheck(slug || "");
  const { data: relatedData } = useRelatedFactChecks(slug || "");

  const getStatusIcon = (rating: string) => {
    switch (rating) {
      case "TRUE":
      case "MOSTLY_TRUE":
        return <CheckCircle className="h-6 w-6" />;
      case "FALSE":
      case "MOSTLY_FALSE":
        return <XCircle className="h-6 w-6" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !factCheckData?.data) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            لم يتم العثور على التحقق
          </h1>
          <Button onClick={() => navigate("/fact-checks")}>
            العودة إلى قائمة التحققات
          </Button>
        </div>
      </div>
    );
  }

  const factCheck = factCheckData.data;
  const related = relatedData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-red-600 to-red-800">
        {factCheck.featuredImage && (
          <>
            <img
              src={getImageUrl(factCheck.featuredImage)}
              alt={factCheck.title}
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

          <Badge
            className={`${getVeracityColor(factCheck.verdict)} border-0 shadow-lg backdrop-blur-sm mb-4 self-start text-lg px-4 py-2`}
          >
            <span className="flex items-center gap-2">
              {getStatusIcon(factCheck.verdict)}
              {getVeracityLabel(factCheck.verdict)}
            </span>
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
            {factCheck.title}
          </h1>

          <div className="flex items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-['Cairo']">
                {formatDate(factCheck.publishedAt || factCheck.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-['Cairo']">{factCheck.views} مشاهدة</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Claim Section */}
        <Card className="p-8 mb-8 border-r-4 border-red-600 bg-red-50/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            الادعاء
          </h2>
          <p className="text-xl text-gray-800 leading-relaxed font-['Cairo']">
            {factCheck.claim}
          </p>
          {factCheck.claimant && (
            <p className="text-sm text-gray-600 mt-4 font-['Cairo']">
              <strong>المصدر:</strong> {factCheck.claimant}
              {factCheck.claimDate && ` - ${formatDate(factCheck.claimDate)}`}
            </p>
          )}
        </Card>

        {/* Summary */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
            الملخص
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed font-['Cairo']">
            {factCheck.summary}
          </p>
        </div>

        {/* Full Analysis */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
            التحليل الكامل
          </h2>
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-['Cairo']"
            dangerouslySetInnerHTML={{ __html: factCheck.fullAnalysis }}
          />
        </div>

        {/* Methodology */}
        {factCheck.methodology && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
              المنهجية
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-['Cairo']"
              dangerouslySetInnerHTML={{ __html: factCheck.methodology }}
            />
          </div>
        )}

        {/* Sources */}
        {factCheck.sources && factCheck.sources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Cairo']">
              المصادر
            </h2>
            <div className="space-y-3">
              {factCheck.sources.map((source: any, index: number) => (
                <Card
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-red-600 hover:text-red-700"
                  >
                    <span className="font-['Cairo']">
                      {source.title || source.url}
                    </span>
                    <ExternalLink className="h-4 w-4 mr-2" />
                  </a>
                  {source.description && (
                    <p className="text-sm text-gray-600 mt-2 font-['Cairo']">
                      {source.description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {factCheck.tags && factCheck.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Cairo']">
              الوسوم
            </h3>
            <div className="flex flex-wrap gap-2">
              {factCheck.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="font-['Cairo']"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <Card className="p-6 mb-8 bg-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Cairo']">
            عن الكاتب
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
              {factCheck.author.firstName[0]}
              {factCheck.author.lastName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 font-['Cairo']">
                {factCheck.author.firstName} {factCheck.author.lastName}
              </p>
              <p className="text-sm text-gray-600 font-['Cairo']">
                {factCheck.author.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Related Fact Checks */}
        {related.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Cairo']">
              تحققات ذات صلة
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {related.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/fact-checks/${item.slug}`)}
                >
                  {item.featuredImage && (
                    <img
                      src={getImageUrl(item.featuredImage)}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <Badge className={`${getVeracityColor(item.verdict)} mb-3`}>
                      {getVeracityLabel(item.verdict)}
                    </Badge>
                    <h3 className="font-bold text-gray-900 mb-2 font-['Cairo'] line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-['Cairo'] line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FactCheckDetail;

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmissions } from "@/hooks/useApi";
import { SubmissionStatus, SubmissionStatusValue } from "@/lib/api";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Image,
  Link as LinkIcon,
  Loader2,
  Music,
  Plus,
  RefreshCw,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MySubmissions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<
    SubmissionStatusValue | "ALL"
  >("ALL");

  const { data: submissionsData, isLoading } = useSubmissions();
  const submissions = submissionsData?.data || [];

  const statusConfig = {
    PENDING: {
      label: "قيد الانتظار",
      icon: Clock,
      color: "yellow",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    UNDER_REVIEW: {
      label: "قيد المراجعة",
      icon: RefreshCw,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    APPROVED: {
      label: "تمت الموافقة",
      icon: CheckCircle2,
      color: "green",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    REJECTED: {
      label: "مرفوض",
      icon: XCircle,
      color: "red",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const typeIcons = {
    TEXT: FileText,
    IMAGE: Image,
    VIDEO: Video,
    AUDIO: Music,
    LINK: LinkIcon,
  };

  const filteredSubmissions =
    filterStatus === "ALL"
      ? submissions
      : submissions.filter((s) => s.status === filterStatus);

  const getStatusStats = () => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === SubmissionStatus.PENDING)
        .length,
      underReview: submissions.filter(
        (s) => s.status === SubmissionStatus.UNDER_REVIEW
      ).length,
      approved: submissions.filter(
        (s) => s.status === SubmissionStatus.APPROVED
      ).length,
      rejected: submissions.filter(
        (s) => s.status === SubmissionStatus.REJECTED
      ).length,
    };
  };

  const stats = getStatusStats();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 mt-18"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">طلباتي</h1>
              <p className="text-lg text-white/90">
                تتبع حالة طلبات التحقق التي أرسلتها
              </p>
            </div>
            <Button
              onClick={() => navigate("/submit")}
              className="bg-white text-red-600 hover:bg-gray-100 h-12 px-6 rounded-xl shadow-lg font-bold"
            >
              <Plus className="h-5 w-5 ml-2" />
              طلب جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-gray-500">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">إجمالي الطلبات</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-600">قيد الانتظار</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.underReview}
            </div>
            <div className="text-sm text-gray-600">قيد المراجعة</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-600">تمت الموافقة</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-600">مرفوض</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">تصفية حسب الحالة</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filterStatus === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              الكل ({stats.total})
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as SubmissionStatusValue)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filterStatus === status
                    ? `${config.bg} ${config.text} border-2 ${config.border}`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {config.label} (
                {
                  stats[
                    status.toLowerCase() === "under_review"
                      ? "underReview"
                      : (status.toLowerCase() as keyof typeof stats)
                  ]
                }
                )
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="text-gray-600">جاري تحميل الطلبات...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 rounded-full p-6">
                <AlertCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {filterStatus === "ALL"
                  ? "لا توجد طلبات بعد"
                  : "لا توجد طلبات بهذه الحالة"}
              </h3>
              <p className="text-gray-600 max-w-md">
                {filterStatus === "ALL"
                  ? "ابدأ بإرسال محتوى للتحقق منه وسيظهر هنا"
                  : "جرب تغيير الفلتر لعرض طلبات أخرى"}
              </p>
              {filterStatus === "ALL" && (
                <Button
                  onClick={() => navigate("/submit")}
                  className="mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 h-12 px-8 rounded-xl text-amber-50 font-bold"
                >
                  <Plus className="h-5 w-5 ml-2" />
                  إرسال طلب جديد
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const StatusIcon = statusConfig[submission.status].icon;
              const TypeIcon =
                typeIcons[submission.type as keyof typeof typeIcons] ||
                FileText;

              return (
                <div
                  key={submission.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Type Icon */}
                      <div className="bg-gray-100 rounded-xl p-3">
                        <TypeIcon className="h-6 w-6 text-gray-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {submission.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-900 text-lg line-clamp-3 mb-2">
                          {submission.content}
                        </p>
                        {submission.sourceUrl && (
                          <a
                            href={submission.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            dir="ltr"
                          >
                            <LinkIcon className="h-3 w-3" />
                            {submission.sourceUrl}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`${statusConfig[submission.status].bg} ${statusConfig[submission.status].text} ${statusConfig[submission.status].border} border-2 rounded-xl px-4 py-2 flex items-center gap-2 whitespace-nowrap`}
                    >
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-semibold">
                        {statusConfig[submission.status].label}
                      </span>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {submission.status === SubmissionStatus.REJECTED &&
                    submission.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 mb-1">
                            سبب الرفض:
                          </p>
                          <p className="text-red-700">
                            {submission.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Fact Check Link */}
                  {submission.status === SubmissionStatus.APPROVED &&
                    submission.factCheck && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-900">
                              تم نشر التحقق
                            </p>
                            <p className="text-sm text-green-700">
                              {submission.factCheck.title}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            navigate(
                              `/fact-checks/${submission.factCheck!.slug}`
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 h-10 px-6 rounded-xl"
                        >
                          عرض التحقق
                        </Button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateSubmission } from "@/hooks/useApi";
import { SubmissionType } from "@/lib/api";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Image,
  Link as LinkIcon,
  Loader2,
  Music,
  Send,
  Video,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormData {
  type: SubmissionType;
  content: string;
  sourceUrl: string;
  mediaUrls: string[];
  context: string;
  isAnonymous: boolean;
  submitterEmail: string;
}

const SubmitContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createSubmission = useCreateSubmission();
  const [formData, setFormData] = useState<FormData>({
    type: SubmissionType.TEXT,
    content: "",
    sourceUrl: "",
    mediaUrls: [],
    context: "",
    isAnonymous: false,
    submitterEmail: user?.email || "",
  });
  const [currentMediaUrl, setCurrentMediaUrl] = useState("");

  const submissionTypes = [
    { value: SubmissionType.TEXT, label: "نص", icon: FileText, color: "blue" },
    { value: SubmissionType.IMAGE, label: "صورة", icon: Image, color: "green" },
    { value: SubmissionType.VIDEO, label: "فيديو", icon: Video, color: "red" },
    { value: SubmissionType.AUDIO, label: "صوت", icon: Music, color: "purple" },
    {
      value: SubmissionType.LINK,
      label: "رابط",
      icon: LinkIcon,
      color: "orange",
    },
  ];

  const handleAddMediaUrl = () => {
    if (currentMediaUrl && currentMediaUrl.trim()) {
      setFormData({
        ...formData,
        mediaUrls: [...formData.mediaUrls, currentMediaUrl.trim()],
      });
      setCurrentMediaUrl("");
    }
  };

  const handleRemoveMediaUrl = (index: number) => {
    setFormData({
      ...formData,
      mediaUrls: formData.mediaUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.content.length < 20) {
      toast.error("يجب أن يحتوي المحتوى على 20 حرفاً على الأقل");
      return;
    }

    try {
      await createSubmission.mutateAsync({
        type: formData.type,
        content: formData.content,
        sourceUrl: formData.sourceUrl || undefined,
        mediaUrls:
          formData.mediaUrls.length > 0 ? formData.mediaUrls : undefined,
        context: formData.context || undefined,
        isAnonymous: formData.isAnonymous,
        submitterEmail: formData.isAnonymous
          ? formData.submitterEmail
          : undefined,
      });

      toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته قريباً");
      navigate("/my-submissions");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 mt-18"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Send className="h-10 w-10" />
            <h1 className="text-4xl md:text-5xl font-bold">
              إرسال محتوى للتحقق
            </h1>
          </div>
          <p className="text-lg text-white/90">
            شاركنا المحتوى المشكوك فيه وسيقوم فريقنا بالتحقق منه
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Info Card */}
        <div className="bg-blue-50 border-r-4 border-blue-500 rounded-lg p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">معلومات هامة</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• سيتم مراجعة طلبك من قبل فريق الخبراء</li>
              <li>• قد تستغرق المراجعة من 24 إلى 72 ساعة</li>
              <li>• يمكنك إرسال طلبك بشكل مجهول إذا رغبت</li>
              <li>• ستتلقى إشعاراً عند اكتمال التحقق</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Submission Type Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-slate-900">
              نوع المحتوى *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {submissionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: type.value as SubmissionType,
                      })
                    }
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg scale-105`
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon
                        className={`h-8 w-8 ${
                          isSelected
                            ? `text-${type.color}-600`
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? `text-${type.color}-900`
                            : "text-gray-600"
                        }`}
                      >
                        {type.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-3">
            <Label
              htmlFor="content"
              className="text-lg font-semibold text-slate-900"
            >
              المحتوى المراد التحقق منه *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="اكتب أو الصق المحتوى المشكوك فيه هنا... (على الأقل 20 حرفاً)"
              className="min-h-[200px] text-lg resize-none border-2 focus:border-red-500 rounded-xl"
              required
            />
            <p className="text-sm text-gray-500">
              عدد الأحرف: {formData.content.length} / 20 كحد أدنى
            </p>
          </div>

          {/* Source URL */}
          <div className="space-y-3">
            <Label
              htmlFor="sourceUrl"
              className="text-lg font-semibold text-slate-900"
            >
              رابط المصدر
              <span className="text-sm font-normal text-gray-500 mr-2">
                (اختياري)
              </span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) =>
                  setFormData({ ...formData, sourceUrl: e.target.value })
                }
                placeholder="https://example.com/article"
                className="pr-10 h-12 border-2 focus:border-red-500 rounded-xl"
                dir="ltr"
              />
            </div>
          </div>

          {/* Media URLs */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-slate-900">
              روابط الوسائط
              <span className="text-sm font-normal text-gray-500 mr-2">
                (صور، فيديوهات)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={currentMediaUrl}
                onChange={(e) => setCurrentMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 h-12 border-2 focus:border-red-500 rounded-xl"
                dir="ltr"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMediaUrl();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddMediaUrl}
                className="h-12 px-6 bg-gray-600 hover:bg-gray-700"
              >
                إضافة
              </Button>
            </div>

            {/* Display Added Media URLs */}
            {formData.mediaUrls.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg group"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span
                      className="flex-1 text-sm text-gray-700 truncate"
                      dir="ltr"
                    >
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMediaUrl(index)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Context */}
          <div className="space-y-3">
            <Label
              htmlFor="context"
              className="text-lg font-semibold text-slate-900"
            >
              سياق إضافي
              <span className="text-sm font-normal text-gray-500 mr-2">
                (لماذا تعتقد أن هذا المحتوى مضلل؟)
              </span>
            </Label>
            <Textarea
              id="context"
              value={formData.context}
              onChange={(e) =>
                setFormData({ ...formData, context: e.target.value })
              }
              placeholder="أضف أي معلومات إضافية قد تساعدنا في التحقق..."
              className="min-h-[120px] text-lg resize-none border-2 focus:border-red-500 rounded-xl"
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData({ ...formData, isAnonymous: e.target.checked })
              }
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="anonymous" className="flex-1 cursor-pointer">
              <span className="font-semibold text-slate-900 block mb-1">
                إرسال بشكل مجهول
              </span>
              <span className="text-sm text-gray-600">
                لن يظهر اسمك في التقرير النهائي (سيتم استخدام بريدك الإلكتروني
                للتواصل فقط)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={
                createSubmission.isPending || formData.content.length < 20
              }
              className="flex-1 h-14 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {createSubmission.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري الإرسال...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  <span>إرسال للتحقق</span>
                </div>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/my-submissions")}
              className="h-14 px-8 border-2 rounded-xl"
            >
              طلباتي
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitContent;

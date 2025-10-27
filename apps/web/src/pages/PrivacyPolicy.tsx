import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const {
    data: privacyPolicy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["privacy-policy"],
    queryFn: () => apiClient.getPrivacyPolicy(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل سياسة الخصوصية...</p>
        </div>
      </div>
    );
  }

  if (error || !privacyPolicy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            غير متاح حالياً
          </h2>
          <p className="text-gray-600 mb-6">
            عذراً، سياسة الخصوصية غير متاحة حالياً. يرجى المحاولة لاحقاً.
          </p>
          <Link
            to="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-18" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-red-600">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              سياسة الخصوصية
            </h1>
            <div className="flex items-center justify-center text-gray-600 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <span>
                  آخر تحديث:{" "}
                  {new Date(privacyPolicy.createdAt).toLocaleDateString(
                    "ar-EG",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>الإصدار: {privacyPolicy.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-red-600">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-red-600 hover:text-red-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-r-4 border-red-600 pr-4 py-2 my-4 bg-red-50 text-gray-700 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {privacyPolicy.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link to="/terms-of-service">
            <Button
              variant="outline"
              className="w-full sm:w-auto cursor-pointer hover:shadow-lg hover:transition-shadow duration-300"
            >
              شروط الخدمة
            </Button>
          </Link>
          <Link to="/accessibility">
            <Button
              variant="outline"
              className="w-full sm:w-auto cursor-pointer hover:shadow-lg hover:transition-shadow duration-300"
            >
              بيان إمكانية الوصول
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Accessibility, Calendar, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const AccessibilityStatement = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["accessibility-statement"],
    queryFn: () => apiClient.getAccessibilityStatement(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const accessibilityStatement = data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            جاري تحميل بيان إمكانية الوصول...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Accessibility className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            عذراً، حدث خطأ
          </h2>
          <p className="text-gray-600 mb-6">
            لم نتمكن من تحميل بيان إمكانية الوصول. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!accessibilityStatement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Accessibility className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            غير متوفر حالياً
          </h2>
          <p className="text-gray-600 mb-6">
            بيان إمكانية الوصول غير متوفر في الوقت الحالي. يرجى المحاولة لاحقاً.
          </p>
          <Link to="/">
            <Button>العودة إلى الصفحة الرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 mt-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-red-600 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              بيان إمكانية الوصول
            </h1>
            <div className="flex items-center justify-center text-gray-600 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <span>
                  آخر تحديث:{" "}
                  {new Date(
                    accessibilityStatement.createdAt
                  ).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>الإصدار: {accessibilityStatement.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dir="rtl"
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-green-600">
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
                      className="text-green-600 hover:text-green-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-r-4 border-green-600 pr-4 py-2 my-4 bg-green-50 text-gray-700 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {accessibilityStatement.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link to="/privacy-policy">
              <Button
                variant="outline"
                className="w-full sm:w-auto cursor-pointer hover:shadow-lg hover:transition-shadow duration-300"
              >
                سياسة الخصوصية
              </Button>
            </Link>
            <Link to="/terms-of-service">
              <Button
                variant="outline"
                className="w-full sm:w-auto cursor-pointer hover:shadow-lg hover:transition-shadow duration-300"
              >
                شروط الخدمة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;

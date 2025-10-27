import { Input } from "@/components/ui/input";
import { apiClient, type FAQ as FAQType } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  // Fetch FAQs from API
  const {
    data: faqsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => apiClient.getFaqs({ limit: 100 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // API returns { data: FAQ[] } structure
  const faqs = Array.isArray(faqsResponse)
    ? faqsResponse
    : faqsResponse?.data || [];

  // Group FAQs by category
  const faqCategories = useMemo(() => {
    const categoriesMap = new Map<string, FAQType[]>();

    faqs
      .filter((faq) => faq.isPublished)
      .sort((a, b) => a.order - b.order)
      .forEach((faq) => {
        if (!categoriesMap.has(faq.category)) {
          categoriesMap.set(faq.category, []);
        }
        categoriesMap.get(faq.category)!.push(faq);
      });

    const result = Array.from(categoriesMap.entries()).map(([title, faqs]) => ({
      title,
      faqs,
    }));

    console.log("faqCategories:", result);
    return result;
  }, [faqs]);

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqCategories;

    return faqCategories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [faqCategories, searchTerm]);

  console.log("filteredFAQs:", filteredFAQs);
  console.log("filteredFAQs length:", filteredFAQs.length);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 mt-18"
      dir="rtl"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
              إجابات شاملة على أكثر الأسئلة شيوعاً حول منصة تحقق 360
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="ابحث في الأسئلة الشائعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 text-lg text-gray-900 bg-white rounded-2xl border-0 shadow-lg pl-14"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              حدث خطأ في تحميل الأسئلة
            </h3>
            <p className="text-gray-600">
              يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني
            </p>
          </div>
        ) : filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq) => {
                  const isOpen = openFAQ === faq.id;

                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-6 py-6 text-right focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {faq.question}
                          </h3>
                          <div className="mr-4 flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              لم نجد نتائج مطابقة
            </h3>
            <p className="text-gray-600">
              جرب البحث بكلمات أخرى أو تصفح الأقسام المختلفة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;

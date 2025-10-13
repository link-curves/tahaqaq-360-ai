import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      title:
        "صعود المعلومات المضللة المولدة بالذكاء الاصطناعي: ما تحتاج إلى معرفته",
      excerpt:
        "مع تطور الذكاء الاصطناعي، تتطور أيضاً الطرق المستخدمة لإنشاء ونشر المعلومات الكاذبة. تعلم كيفية تحديد المحتوى المولد بالذكاء الاصطناعي.",
      author: "د. سارة تشين",
      date: "15 يونيو 2024",
      category: "الذكاء الاصطناعي والتكنولوجيا",
      readTime: "5 دقائق",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop",
    },
    {
      title: "بناء محو الأمية الإعلامية في العصر الرقمي: دليل المعلم",
      excerpt:
        "استراتيجيات وأدوات عملية للمعلمين لمساعدة الطلاب على تطوير مهارات التفكير النقدي والتنقل في المشهد المعلوماتي المعقد.",
      author: "أ.د. مايكل رودريغيز",
      date: "12 يونيو 2024",
      category: "التعليم",
      readTime: "7 دقائق",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop",
    },
    {
      title: "دراسة حالة: كيف فندنا أسطورة تغير المناخ الفيروسية",
      excerpt:
        "تحليل مفصل لعملية فحص الحقائق الخاصة بنا لادعاء تغير المناخ المنتشر على نطاق واسع والذي تبين أنه مضلل.",
      author: "فريق تحقق 360",
      date: "10 يونيو 2024",
      category: "دراسات حالة",
      readTime: "6 دقائق",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    },
    {
      title: "تأثير وسائل التواصل الاجتماعي على انتشار المعلومات المضللة",
      excerpt:
        "دراسة شاملة حول كيفية تأثير خوارزميات المنصات الاجتماعية على انتشار الأخبار الكاذبة والمعلومات المضللة.",
      author: "د. أحمد الشريف",
      date: "8 يونيو 2024",
      category: "وسائل التواصل الاجتماعي",
      readTime: "8 دقائق",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    },
    {
      title: "دور الصحافة الاستقصائية في مكافحة المعلومات المضللة",
      excerpt:
        "كيف يمكن للصحفيين الاستقصائيين استخدام الأدوات الحديثة والتقنيات المتطورة لكشف الحقائق ومحاربة الأخبار المزيفة.",
      author: "نور عبدالله",
      date: "5 يونيو 2024",
      category: "الصحافة الاستقصائية",
      readTime: "9 دقائق",
      image:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
    },
    {
      title: "التحديات النفسية لمحو الأمية الإعلامية في المجتمع العربي",
      excerpt:
        "تحليل للعوامل النفسية والاجتماعية التي تؤثر على قبول المعلومات وكيفية تطوير برامج محو الأمية الإعلامية الفعالة.",
      author: "د. فاطمة الزهراني",
      date: "2 يونيو 2024",
      category: "علم النفس الاجتماعي",
      readTime: "6 دقائق",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
    },
  ];
  return (
    <div
      className="bg-gradient-to-br from-red-50/30 to-rose-50/50 py-20"
      id="blog"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Cairo']">
            أحدث الرؤى والأبحاث
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Cairo']">
            ابق على اطلاع بأحدث أبحاثنا وتحليلاتنا ورؤانا حول اتجاهات المعلومات
            المضللة وأفضل ممارسات محو الأمية الإعلامية ومنهجيات فحص الحقائق
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-xl flex flex-col h-full relative"
            >
              {/* Article Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/30"></div>

                {/* Floating Category Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-2 rounded-full backdrop-blur-sm bg-white/90 shadow-lg border-0">
                    <span className="text-xs font-semibold text-red-600 font-['Cairo']">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Read Time Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-xs text-white font-medium font-['Cairo']">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right font-['Cairo'] leading-relaxed group-hover:text-red-600 transition-colors duration-300 flex-grow-0">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm text-right font-['Cairo'] leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                {/* Author and Date Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-6 font-['Cairo']">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 ml-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 ml-1" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-['Cairo'] font-semibold py-3 rounded-lg group-hover:border-red-300"
                >
                  <span className="flex items-center justify-center space-x-2 space-x-reverse">
                    <span>اقرأ المزيد</span>
                    <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 rotate-180" />
                  </span>
                </Button>
              </div>

              {/* Card Accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-['Cairo'] font-semibold rounded-lg">
            عرض جميع المقالات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

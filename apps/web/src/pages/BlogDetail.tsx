import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/hooks/useApi";
import { formatDate, getImageUrl, getTextDirection } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, Eye, Share2, User } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: blogPost, isLoading, error } = useBlogPost(slug || "");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full mb-8 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">
            لم يتم العثور على المقال
          </h1>
          <Button onClick={() => navigate("/blog")}>
            العودة إلى قائمة المقالات
          </Button>
        </div>
      </div>
    );
  }

  const textDirection = getTextDirection(blogPost.title);

  return (
    <div className="min-h-screen bg-gray-50 mt-18" dir={textDirection}>
      {/* Hero Section */}
      <div className="relative h-[28rem] bg-gradient-to-br from-red-600 to-red-800">
        {blogPost.coverImage && (
          <>
            <img
              src={getImageUrl(blogPost.coverImage)}
              alt={blogPost.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 self-start"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            رجوع
          </Button>

          {blogPost.category && (
            <Badge className="bg-white text-red-600 border-0 shadow-lg mb-4 self-start text-base px-4 py-1.5 font-['Cairo']">
              {blogPost.category}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Cairo'] leading-tight">
            {blogPost.title}
          </h1>

          {blogPost.excerpt && (
            <p className="text-lg text-white/90 mb-6 font-['Cairo'] leading-relaxed max-w-3xl">
              {blogPost.excerpt}
            </p>
          )}

          <div className="flex items-center gap-6 text-white/90 text-sm flex-wrap">
            {blogPost.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-['Cairo']">{blogPost.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-['Cairo']">
                {formatDate(blogPost.publishedAt || blogPost.createdAt)}
              </span>
            </div>
            {blogPost.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-['Cairo']">
                  {blogPost.readTime} دقيقة
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="font-['Cairo']">{blogPost.views} مشاهدة</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blogPost.title,
                    text: blogPost.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="h-4 w-4 ml-2" />
              مشاركة
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Content */}
        <article className="mb-12 bg-white rounded-2xl shadow-sm p-8 md:p-12">
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
              {blogPost.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Tags */}
        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Cairo']">
              الوسوم
            </h3>
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm font-['Cairo'] bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                  onClick={() =>
                    navigate(`/blog?tag=${encodeURIComponent(tag)}`)
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3 font-['Cairo']">
            هل أعجبك هذا المقال؟
          </h3>
          <p className="text-white/90 mb-6 font-['Cairo']">
            اكتشف المزيد من المقالات حول التحقق من الحقائق والتربية الإعلامية
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100 font-['Cairo']"
              onClick={() => navigate("/blog")}
            >
              تصفح جميع المقالات
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-['Cairo']"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blogPost.title,
                    text: blogPost.excerpt,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="h-5 w-5 ml-2" />
              مشاركة المقال
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

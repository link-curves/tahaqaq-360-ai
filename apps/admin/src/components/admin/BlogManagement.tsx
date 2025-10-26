import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type {
  BlogPost,
  ContentStatusValue,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from "@/lib/adminApi";
import { blogApi } from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContentStatusValue | "ALL">(
    "ALL"
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<
    Partial<CreateBlogPostDto | UpdateBlogPostDto>
  >({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "",
    tags: [],
    isFeatured: false,
    status: "DRAFT",
    readTime: undefined,
    metaTitle: "",
    metaDescription: "",
  });

  // Fetch blog posts
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-blog-posts", page, searchTerm, statusFilter],
    queryFn: () =>
      blogApi.getAll({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBlogPostDto) => blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "تم إنشاء المقال",
        description: "تم إنشاء المقال بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء المقال",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostDto }) =>
      blogApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      resetForm();
      toast({
        title: "تم تحديث المقال",
        description: "تم تحديث المقال بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث المقال",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
      toast({
        title: "تم حذف المقال",
        description: "تم حذف المقال بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف المقال",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "",
      category: "",
      tags: [],
      isFeatured: false,
      status: "DRAFT",
      readTime: undefined,
      metaTitle: "",
      metaDescription: "",
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      isFeatured: post.isFeatured,
      status: post.status,
      readTime: post.readTime,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    if (
      !formData.title ||
      !formData.slug ||
      !formData.excerpt ||
      !formData.content ||
      !formData.author ||
      !formData.category
    ) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData as CreateBlogPostDto);
  };

  const handleUpdateSubmit = () => {
    if (!selectedPost) return;

    updateMutation.mutate({
      id: selectedPost.id,
      data: formData as UpdateBlogPostDto,
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedPost) return;
    deleteMutation.mutate(selectedPost.id);
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !selectedPost) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, selectedPost]);

  const blogPosts = data?.data || [];
  const meta = data?.meta;

  const getStatusBadge = (status: ContentStatusValue) => {
    const styles = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      ARCHIVED: "bg-red-100 text-red-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    };

    const labels = {
      PUBLISHED: "منشور",
      DRAFT: "مسودة",
      ARCHIVED: "مؤرشف",
      UNDER_REVIEW: "قيد المراجعة",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            إدارة المقالات
          </h2>
          <p className="text-gray-600">إنشاء وتحرير مقالات المدونة</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={handleCreateClick}
        >
          <Plus className="ml-2 h-4 w-4" />
          مقال جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>جميع المقالات</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ContentStatusValue | "ALL")
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ALL">الكل</SelectItem>
                <SelectItem value="PUBLISHED">منشور</SelectItem>
                <SelectItem value="DRAFT">مسودة</SelectItem>
                <SelectItem value="UNDER_REVIEW">قيد المراجعة</SelectItem>
                <SelectItem value="ARCHIVED">مؤرشف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد مقالات</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">الكاتب</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">المشاهدات</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{post.title}</div>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>{post.views.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString("ar")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              window.open(`/blog/${post.slug}`, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    السابق
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    صفحة {page} من {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedPost(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "تحرير المقال" : "إنشاء مقال جديد"}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? "قم بتعديل تفاصيل المقال"
                : "املأ جميع الحقول المطلوبة"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="عنوان المقال"
              />
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label htmlFor="slug">الرابط (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="article-slug"
              />
            </div>

            {/* Excerpt */}
            <div className="grid gap-2">
              <Label htmlFor="excerpt">الملخص *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="ملخص قصير للمقال"
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="grid gap-2">
              <Label htmlFor="content">المحتوى *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="محتوى المقال الكامل (Markdown supported)"
                rows={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Author */}
              <div className="grid gap-2">
                <Label htmlFor="author">الكاتب *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="اسم الكاتب"
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">التصنيف *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="التصنيف"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="grid gap-2">
              <Label htmlFor="coverImage">صورة الغلاف (URL)</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
              <Input
                id="tags"
                value={formData.tags?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                placeholder="وسم1, وسم2, وسم3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Status */}
              <div className="grid gap-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ContentStatusValue) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">مسودة</SelectItem>
                    <SelectItem value="PUBLISHED">منشور</SelectItem>
                    <SelectItem value="UNDER_REVIEW">قيد المراجعة</SelectItem>
                    <SelectItem value="ARCHIVED">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read Time */}
              <div className="grid gap-2">
                <Label htmlFor="readTime">وقت القراءة (دقيقة)</Label>
                <Input
                  id="readTime"
                  type="number"
                  value={formData.readTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readTime: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="5"
                />
              </div>

              {/* Is Featured */}
              <div className="grid gap-2">
                <Label htmlFor="isFeatured">مميز</Label>
                <Select
                  value={formData.isFeatured ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isFeatured: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">لا</SelectItem>
                    <SelectItem value="true">نعم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SEO Fields */}
            <div className="grid gap-2">
              <Label htmlFor="metaTitle">عنوان SEO</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="عنوان للبحث"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metaDescription">وصف SEO</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="وصف للبحث"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedPost(null);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={
                isEditDialogOpen ? handleUpdateSubmit : handleCreateSubmit
              }
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              {isEditDialogOpen ? "تحديث" : "إنشاء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المقال "{selectedPost?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPost(null);
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;

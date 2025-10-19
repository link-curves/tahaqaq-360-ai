import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CreateResearchDto,
  type Research,
  researchApi,
} from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { ContentEditor } from "./ContentEditor";
import { type Column, DataTable, renderStatusBadge } from "./DataTable";

const ResearchManagement = () => {
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    slug: string | null;
  }>({ open: false, slug: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    research: Research | null;
  }>({ open: false, research: null });

  const [createDialog, setCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch research from the main API with pagination
  const { data: researchData, isLoading } = useQuery({
    queryKey: ["research", currentPage, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/research?page=${currentPage}&limit=${pageSize}`
      );
      return response.json();
    },
  });

  const research = researchData?.data || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: researchApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("تم حذف البحث بنجاح");
      setDeleteDialog({ open: false, slug: null });
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف البحث: ${error.message}`);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: researchApi.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("تم تحديث حالة النشر");
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: researchApi.toggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("تم تحديث حالة البحث المميز");
    },
  });

  const columns: Column<Research>[] = [
    {
      header: "العنوان",
      accessor: "title",
      sortable: true,
    },
    {
      header: "الفئة",
      accessor: "category",
      sortable: true,
    },
    {
      header: "المؤلفون",
      accessor: (row) => row.authors.join(", "),
    },
    {
      header: "الحالة",
      accessor: "status",
      cell: (value) => renderStatusBadge(value),
      sortable: true,
    },
    {
      header: "مميز",
      accessor: "isFeatured",
      cell: (value) =>
        value ? (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        ) : null,
    },
    {
      header: "المشاهدات",
      accessor: "views",
      sortable: true,
      cell: (value) => (value || 0).toLocaleString("ar-SA"),
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt",
      sortable: true,
      cell: (value) => new Date(value).toLocaleDateString("ar-SA"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الأبحاث</h2>
          <p className="text-muted-foreground">
            إدارة المقالات البحثية والدراسات
          </p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة بحث جديد
        </Button>
      </div>

      <DataTable
        data={research}
        columns={columns}
        actions={[
          {
            label: "عرض",
            onClick: (row) => window.open(`/research/${row.slug}`, "_blank"),
            icon: <Eye className="w-4 h-4" />,
          },
          {
            label: "تحرير",
            onClick: (row) => setEditDialog({ open: true, research: row }),
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: "نشر/إلغاء",
            onClick: (row) => togglePublishMutation.mutate(row.slug),
          },
          {
            label: "تمييز",
            onClick: (row) => toggleFeaturedMutation.mutate(row.slug),
            icon: <Star className="w-4 h-4" />,
          },
          {
            label: "حذف",
            onClick: (row) => setDeleteDialog({ open: true, slug: row.slug }),
            variant: "destructive",
            icon: <Trash2 className="w-4 h-4" />,
          },
        ]}
        searchable
        searchPlaceholder="البحث في الأبحاث..."
        isLoading={isLoading}
        emptyMessage="لا توجد أبحاث"
        pagination={{
          currentPage,
          pageSize,
          totalItems: researchData?.meta?.total || research.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, slug: deleteDialog.slug })
        }
        title="حذف البحث"
        description="هل أنت متأكد من حذف هذا البحث؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.slug) {
            deleteMutation.mutate(deleteDialog.slug);
          }
        }}
      />

      <ResearchFormDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["research"] });
          setCreateDialog(false);
        }}
      />

      {editDialog.research && (
        <ResearchFormDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog({ open, research: null })}
          research={editDialog.research}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["research"] });
            setEditDialog({ open: false, research: null });
          }}
        />
      )}
    </div>
  );
};

// Research Form Dialog Component
interface ResearchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  research?: Research | null;
  onSuccess: () => void;
}

const ResearchFormDialog = ({
  open,
  onOpenChange,
  research,
  onSuccess,
}: ResearchFormDialogProps) => {
  const [formData, setFormData] = useState<CreateResearchDto>({
    title: research?.title || "",
    slug: research?.slug || "",
    content: research?.fullContent || "",
    summary: research?.summary || "",
    category: research?.category || "",
    authors: research?.authors || [],
    tags: research?.tags || [],
    featuredImage: research?.coverImage || "",
    isPublished: research?.status === "PUBLISHED",
    isFeatured: research?.isFeatured || false,
    metaTitle: "",
    metaDescription: "",
  });

  const [authorsInput, setAuthorsInput] = useState(
    research?.authors.join(", ") || ""
  );
  const [tagsInput, setTagsInput] = useState(research?.tags.join(", ") || "");

  const createMutation = useMutation({
    mutationFn: researchApi.create,
    onSuccess: () => {
      toast.success("تم إنشاء البحث بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء البحث: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) =>
      researchApi.update(slug, data),
    onSuccess: () => {
      toast.success("تم تحديث البحث بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث البحث: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      authors: authorsInput
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (research) {
      updateMutation.mutate({ slug: research.slug, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>
            {research ? "تحرير البحث" : "إضافة بحث جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">المعرف (Slug) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                disabled={!!research}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">الملخص *</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">المحتوى *</Label>
            <ContentEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              minHeight="300px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">الفئة *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">رابط الصورة</Label>
              <Input
                id="featuredImage"
                type="url"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authors">المؤلفون (مفصولة بفواصل) *</Label>
              <Input
                id="authors"
                value={authorsInput}
                onChange={(e) => setAuthorsInput(e.target.value)}
                placeholder="أحمد علي, فاطمة محمد"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">الوسوم (مفصولة بفواصل)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="تدقيق, أخبار مزيفة"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked as boolean })
                }
              />
              <Label htmlFor="isPublished" className="cursor-pointer">
                نشر مباشرة
              </Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFeatured: checked as boolean })
                }
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                بحث مميز
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {research ? "تحديث" : "إنشاء"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResearchManagement;

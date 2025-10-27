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
import { Textarea } from "@/components/ui/textarea";
import { type CreateFaqDto, type FAQ, faqApi } from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { type Column, DataTable, renderStatusBadge } from "./DataTable";

const FAQManagement = () => {
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    faq: FAQ | null;
  }>({ open: false, faq: null });

  const [createDialog, setCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch FAQs
  const { data: faqsResponse, isLoading } = useQuery({
    queryKey: ["faqs", currentPage, pageSize],
    queryFn: () => faqApi.getAll({ page: currentPage, limit: pageSize }),
  });

  const faqs = faqsResponse?.data || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: faqApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("تم حذف السؤال بنجاح");
      setDeleteDialog({ open: false, id: null });
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف السؤال: ${error.message}`);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: faqApi.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("تم تحديث حالة النشر");
    },
  });

  const columns: Column<FAQ>[] = [
    {
      header: "السؤال",
      accessor: "question",
      sortable: true,
    },
    {
      header: "الفئة",
      accessor: "category",
      sortable: true,
    },
    {
      header: "الترتيب",
      accessor: "order",
      sortable: true,
    },
    {
      header: "الحالة",
      accessor: "isPublished",
      cell: (value) => renderStatusBadge(value ? "PUBLISHED" : "DRAFT"),
      sortable: true,
    },
    {
      header: "المشاهدات",
      accessor: "views",
      sortable: true,
      cell: (value) => (value || 0).toLocaleString("en-EN"),
    },
    {
      header: "تاريخ الإنشاء",
      accessor: "createdAt",
      sortable: true,
      cell: (value) => new Date(value).toLocaleDateString("en-EN"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الأسئلة الشائعة</h2>
          <p className="text-muted-foreground">
            إدارة الأسئلة والأجوبة الشائعة
          </p>
        </div>
        <Button
          onClick={() => setCreateDialog(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة سؤال جديد
        </Button>
      </div>

      <DataTable
        data={faqs}
        columns={columns}
        actions={[
          {
            label: "تحرير",
            onClick: (row) => setEditDialog({ open: true, faq: row }),
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: "نشر/إلغاء",
            onClick: (row) => togglePublishMutation.mutate(row.id),
          },
          {
            label: "حذف",
            onClick: (row) => setDeleteDialog({ open: true, id: row.id }),
            variant: "destructive",
            icon: <Trash2 className="w-4 h-4" />,
          },
        ]}
        searchable
        searchPlaceholder="البحث في الأسئلة..."
        isLoading={isLoading}
        emptyMessage="لا توجد أسئلة"
        pagination={{
          currentPage,
          pageSize,
          totalItems: faqsResponse?.meta?.total || faqs.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: deleteDialog.id })}
        title="حذف السؤال"
        description="هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.id) {
            deleteMutation.mutate(deleteDialog.id);
          }
        }}
      />

      <FAQFormDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["faqs"] });
          setCreateDialog(false);
        }}
      />

      {editDialog.faq && (
        <FAQFormDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog({ open, faq: null })}
          faq={editDialog.faq}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            setEditDialog({ open: false, faq: null });
          }}
        />
      )}
    </div>
  );
};

// FAQ Form Dialog Component
interface FAQFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
  onSuccess: () => void;
}

const FAQFormDialog = ({
  open,
  onOpenChange,
  faq,
  onSuccess,
}: FAQFormDialogProps) => {
  const [formData, setFormData] = useState<CreateFaqDto>({
    question: faq?.question || "",
    answer: faq?.answer || "",
    category: faq?.category || "",
    order: faq?.order || 0,
    isPublished: faq?.isPublished ?? true,
  });

  const createMutation = useMutation({
    mutationFn: faqApi.create,
    onSuccess: () => {
      toast.success("تم إنشاء السؤال بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء السؤال: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      faqApi.update(id, data),
    onSuccess: () => {
      toast.success("تم تحديث السؤال بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث السؤال: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (faq) {
      updateMutation.mutate({ id: faq.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>{faq ? "تحرير السؤال" : "إضافة سؤال جديد"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">السؤال *</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              required
              placeholder="ما هو تدقيق الحقائق؟"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">الإجابة *</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              required
              rows={6}
              placeholder="تدقيق الحقائق هو عملية التحقق من دقة المعلومات..."
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
                placeholder="عام"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">الترتيب</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                الأرقام الأقل تظهر أولاً
              </p>
            </div>
          </div>

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
              {faq ? "تحديث" : "إنشاء"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FAQManagement;

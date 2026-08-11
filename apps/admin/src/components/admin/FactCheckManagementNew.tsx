import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import type {
  CreateFactCheckDto,
  FactCheck,
  VeracityRatingValue,
  UpdateFactCheckDto,
} from "@/lib/adminApi";
import { factChecksApi, VeracityRating } from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Loader2,
  Plus,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { type Column, DataTable } from "./DataTable";

const FactCheckManagementNew = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    factCheck: FactCheck | null;
  }>({ open: false, factCheck: null });
  const [selectedFactCheck, setSelectedFactCheck] = useState<FactCheck | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState<CreateFactCheckDto>({
    title: "",
    slug: "",
    claim: "",
    verdict: "UNVERIFIABLE",
    explanation: "",
    sources: [],
    featured: false,
  });

  // Fetch fact checks with pagination
  const { data: factChecksResponse, isLoading } = useQuery({
    queryKey: ["factChecks", currentPage, pageSize],
    queryFn: () => factChecksApi.getAll({ page: currentPage, limit: pageSize }),
  });

  const factChecks = factChecksResponse?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (slug: string) => factChecksApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factChecks"] });
      toast.success("تم حذف التحقق بنجاح");
      setDeleteDialog({ open: false, factCheck: null });
    },
    onError: () => {
      toast.error("فشل حذف التحقق");
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFactCheckDto) => factChecksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factChecks"] });
      toast.success("تم إنشاء التحقق بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("فشل إنشاء التحقق");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateFactCheckDto }) =>
      factChecksApi.update(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factChecks"] });
      toast.success("تم تحديث التحقق بنجاح");
      setIsDialogOpen(false);
      setSelectedFactCheck(null);
      resetForm();
    },
    onError: () => {
      toast.error("فشل تحديث التحقق");
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: (slug: string) => factChecksApi.toggleFeatured(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factChecks"] });
      toast.success("تم تحديث حالة التمييز");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      claim: "",
      verdict: "UNVERIFIABLE",
      explanation: "",
      sources: [],
      featured: false,
    });
  };

  const handleEdit = (factCheck: FactCheck) => {
    setSelectedFactCheck(factCheck);
    setFormData({
      title: factCheck.title,
      slug: factCheck.slug,
      claim: factCheck.factCheck.claim.text,
      verdict: factCheck.factCheck.verdict.code as VeracityRatingValue,
      // Body and evidence are not in the list projection — the Phase 4 editor
      // will load the full article before editing.
      explanation: "",
      sources: [],
      featured: factCheck.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFactCheck) {
      updateMutation.mutate({ slug: selectedFactCheck.slug, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");
    setFormData({ ...formData, slug });
  };

  const columns: Column<FactCheck>[] = [
    {
      header: "العنوان",
      accessor: "title",
      sortable: true,
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {row.factCheck.claim.text}
            </div>
          </div>
          {row.isFeatured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      header: "الحكم",
      accessor: "factCheck",
      sortable: true,
      cell: (value) => {
        const verdictConfig: Record<
          string,
          { label: string; icon: React.ReactNode; color: string }
        > = {
          TRUE: {
            label: "صحيح",
            icon: <CheckCircle className="w-4 h-4" />,
            color: "bg-green-100 text-green-800",
          },
          MOSTLY_TRUE: {
            label: "صحيح غالباً",
            icon: <CheckCircle className="w-4 h-4" />,
            color: "bg-green-50 text-green-700",
          },
          HALF_TRUE: {
            label: "نصف صحيح",
            icon: <AlertCircle className="w-4 h-4" />,
            color: "bg-yellow-100 text-yellow-800",
          },
          MOSTLY_FALSE: {
            label: "خاطئ غالباً",
            icon: <XCircle className="w-4 h-4" />,
            color: "bg-orange-100 text-orange-800",
          },
          FALSE: {
            label: "خاطئ",
            icon: <XCircle className="w-4 h-4" />,
            color: "bg-red-100 text-red-800",
          },
          UNVERIFIABLE: {
            label: "لا يمكن التحقق",
            icon: <AlertCircle className="w-4 h-4" />,
            color: "bg-gray-100 text-gray-800",
          },
          SATIRE: {
            label: "سخرية",
            icon: <AlertCircle className="w-4 h-4" />,
            color: "bg-purple-100 text-purple-800",
          },
          MISLEADING: {
            label: "مضلل",
            icon: <AlertCircle className="w-4 h-4" />,
            color: "bg-orange-100 text-orange-800",
          },
        };

        const config = verdictConfig[value] || verdictConfig.UNVERIFIABLE;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
          >
            <span className="ml-1">{config.icon}</span>
            {config.label}
          </span>
        );
      },
    },
    {
      header: "المشاهدات",
      accessor: "views",
      sortable: true,
      cell: (value) => (value || 0).toLocaleString("en-EN"),
    },
    {
      header: "تاريخ النشر",
      accessor: "publishedAt",
      sortable: true,
      cell: (value) =>
        value ? new Date(value).toLocaleDateString("en-EN") : "غير منشور",
    },
  ];

  const getVerdictLabel = (verdict: string) => {
    const labels: Record<string, string> = {
      TRUE: "صحيح",
      MOSTLY_TRUE: "صحيح غالباً",
      HALF_TRUE: "نصف صحيح",
      MOSTLY_FALSE: "خاطئ غالباً",
      FALSE: "خاطئ",
      UNVERIFIABLE: "لا يمكن التحقق",
      SATIRE: "سخرية",
      MISLEADING: "مضلل",
    };
    return labels[verdict] || verdict;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة التحقق من الأخبار</h2>
          <p className="text-muted-foreground">
            إدارة حالات التحقق من الأخبار والمعلومات المضللة
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedFactCheck(null);
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 ml-2" />
          تحقق جديد
        </Button>
      </div>

      <DataTable
        data={factChecks}
        columns={columns}
        actions={[
          {
            label: "تحرير",
            onClick: handleEdit,
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: toggleFeaturedMutation.isPending ? "جاري..." : "تمييز/إلغاء",
            onClick: (factCheck) =>
              toggleFeaturedMutation.mutate(factCheck.slug),
            icon: <Star className="w-4 h-4" />,
          },
          {
            label: "حذف",
            onClick: (factCheck) => setDeleteDialog({ open: true, factCheck }),
            variant: "destructive",
            icon: <Trash2 className="w-4 h-4" />,
          },
        ]}
        searchable
        searchPlaceholder="البحث في التحققات..."
        isLoading={isLoading}
        emptyMessage="لا توجد تحققات"
        pagination={{
          currentPage,
          pageSize,
          totalItems: factChecksResponse?.meta?.total || 0,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle>
              {selectedFactCheck ? "تعديل التحقق" : "إنشاء تحقق جديد"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="عنوان التحقق"
              />
            </div>

            <div>
              <Label htmlFor="slug">المعرف (Slug) *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="fact-check-slug"
                  dir="ltr"
                  className="text-left"
                />
                <Button
                  type="button"
                  onClick={handleGenerateSlug}
                  variant="outline"
                >
                  توليد
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="claim">الادعاء *</Label>
              <Textarea
                id="claim"
                value={formData.claim}
                onChange={(e) =>
                  setFormData({ ...formData, claim: e.target.value })
                }
                required
                rows={3}
                placeholder="الادعاء المراد التحقق منه"
              />
            </div>

            <div>
              <Label htmlFor="verdict">الحكم *</Label>
              <Select
                value={formData.verdict}
                onValueChange={(value) =>
                  setFormData({ ...formData, verdict: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VeracityRating.TRUE}>
                    {getVerdictLabel(VeracityRating.TRUE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.MOSTLY_TRUE}>
                    {getVerdictLabel(VeracityRating.MOSTLY_TRUE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.HALF_TRUE}>
                    {getVerdictLabel(VeracityRating.HALF_TRUE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.MOSTLY_FALSE}>
                    {getVerdictLabel(VeracityRating.MOSTLY_FALSE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.FALSE}>
                    {getVerdictLabel(VeracityRating.FALSE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.UNVERIFIABLE}>
                    {getVerdictLabel(VeracityRating.UNVERIFIABLE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.SATIRE}>
                    {getVerdictLabel(VeracityRating.SATIRE)}
                  </SelectItem>
                  <SelectItem value={VeracityRating.MISLEADING}>
                    {getVerdictLabel(VeracityRating.MISLEADING)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="explanation">التوضيح *</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) =>
                  setFormData({ ...formData, explanation: e.target.value })
                }
                required
                rows={6}
                placeholder="التوضيح والتحليل التفصيلي"
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked as boolean })
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                تمييز هذا التحقق
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedFactCheck(null);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                )}
                {selectedFactCheck ? "تحديث" : "إنشاء"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, factCheck: deleteDialog.factCheck })
        }
        onConfirm={() => {
          if (deleteDialog.factCheck) {
            deleteMutation.mutate(deleteDialog.factCheck.slug);
          }
        }}
        title="حذف التحقق"
        description={`هل أنت متأكد من حذف التحقق "${deleteDialog.factCheck?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default FactCheckManagementNew;

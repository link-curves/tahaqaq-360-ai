import { Button } from "@/components/ui/button";
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
import type { CreateEventDto, Event, UpdateEventDto } from "@/lib/adminApi";
import { eventsApi } from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { type Column, DataTable } from "./DataTable";

const EventManagementNew = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    event: Event | null;
  }>({ open: false, event: null });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState<CreateEventDto>({
    title: "",
    slug: "",
    description: "",
    type: "WORKSHOP",
    startDate: "",
    endDate: "",
    location: "",
    onlineLink: "",
    capacity: 50,
  });

  // Fetch events with pagination
  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ["events", currentPage, pageSize],
    queryFn: () => eventsApi.getAll({ page: currentPage, limit: pageSize }),
  });

  const events = eventsResponse?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (slug: string) => eventsApi.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("تم حذف الحدث بنجاح");
      setDeleteDialog({ open: false, event: null });
    },
    onError: () => {
      toast.error("فشل حذف الحدث");
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateEventDto) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("تم إنشاء الحدث بنجاح");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error("فشل إنشاء الحدث");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateEventDto }) =>
      eventsApi.update(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("تم تحديث الحدث بنجاح");
      setIsDialogOpen(false);
      setSelectedEvent(null);
      resetForm();
    },
    onError: () => {
      toast.error("فشل تحديث الحدث");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      type: "WORKSHOP",
      startDate: "",
      endDate: "",
      location: "",
      onlineLink: "",
      capacity: 50,
    });
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      type: event.type,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      location: event.location,
      onlineLink: event.onlineLink || "",
      capacity: event.capacity,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEvent) {
      updateMutation.mutate({ slug: selectedEvent.slug, data: formData });
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

  const columns: Column<Event>[] = [
    {
      header: "العنوان",
      accessor: "title",
      sortable: true,
      cell: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">
            {getEventTypeLabel(row.type)}
          </div>
        </div>
      ),
    },
    {
      header: "التاريخ",
      accessor: "startDate",
      sortable: true,
      cell: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="ml-2 h-4 w-4" />
          {new Date(value).toLocaleDateString("ar-SA")}
        </div>
      ),
    },
    {
      header: "المكان",
      accessor: "location",
      cell: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="ml-2 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      header: "المسجلين / السعة",
      accessor: "capacity",
      cell: (value, row) => (
        <div className="flex items-center text-sm text-gray-600">
          <Users className="ml-2 h-4 w-4" />
          {row.registeredCount} / {value}
        </div>
      ),
    },
    {
      header: "الحالة",
      accessor: "status",
      sortable: true,
      cell: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "PUBLISHED"
              ? "bg-green-100 text-green-800"
              : value === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {getStatusLabel(value)}
        </span>
      ),
    },
  ];

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      WORKSHOP: "ورشة عمل",
      WEBINAR: "ندوة عبر الإنترنت",
      EXHIBITION: "معرض",
      CONFERENCE: "مؤتمر",
      TRAINING: "تدريب",
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: "مسودة",
      PUBLISHED: "منشور",
      CANCELLED: "ملغى",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الأحداث</h2>
          <p className="text-muted-foreground">
            تنظيم وإدارة الفعاليات والورش التدريبية
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvent(null);
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 ml-2" />
          حدث جديد
        </Button>
      </div>

      <DataTable
        data={events}
        columns={columns}
        actions={[
          {
            label: "تحرير",
            onClick: handleEdit,
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: "حذف",
            onClick: (event) => setDeleteDialog({ open: true, event }),
            variant: "destructive",
            icon: <Trash2 className="w-4 h-4" />,
          },
        ]}
        searchable
        searchPlaceholder="البحث في الأحداث..."
        isLoading={isLoading}
        emptyMessage="لا توجد أحداث"
        pagination={{
          currentPage,
          pageSize,
          totalItems: eventsResponse?.meta?.total || 0,
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
              {selectedEvent ? "تعديل الحدث" : "إنشاء حدث جديد"}
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
                placeholder="اسم الحدث"
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
                  placeholder="event-slug"
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
              <Label htmlFor="type">نوع الحدث *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORKSHOP">ورشة عمل</SelectItem>
                  <SelectItem value="WEBINAR">ندوة عبر الإنترنت</SelectItem>
                  <SelectItem value="EXHIBITION">معرض</SelectItem>
                  <SelectItem value="CONFERENCE">مؤتمر</SelectItem>
                  <SelectItem value="TRAINING">تدريب</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">تاريخ البداية *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">تاريخ النهاية *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">الموقع *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                placeholder="مكان انعقاد الحدث"
              />
            </div>

            <div>
              <Label htmlFor="onlineLink">
                رابط الحضور عبر الإنترنت (اختياري)
              </Label>
              <Input
                id="onlineLink"
                type="url"
                value={formData.onlineLink}
                onChange={(e) =>
                  setFormData({ ...formData, onlineLink: e.target.value })
                }
                placeholder="https://..."
                dir="ltr"
                className="text-left"
              />
            </div>

            <div>
              <Label htmlFor="capacity">السعة القصوى *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={6}
                placeholder="وصف تفصيلي للحدث"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedEvent(null);
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
                {selectedEvent ? "تحديث" : "إنشاء"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, event: deleteDialog.event })
        }
        onConfirm={() => {
          if (deleteDialog.event) {
            deleteMutation.mutate(deleteDialog.event.slug);
          }
        }}
        title="حذف الحدث"
        description={`هل أنت متأكد من حذف الحدث "${deleteDialog.event?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default EventManagementNew;

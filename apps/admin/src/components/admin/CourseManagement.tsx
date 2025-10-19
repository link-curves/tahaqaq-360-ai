import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type Course,
  coursesApi,
  type CreateCourseDto,
  type CreateLessonDto,
  type Lesson,
} from "@/lib/adminApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Edit, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { ContentEditor } from "./ContentEditor";
import { type Column, DataTable, renderStatusBadge } from "./DataTable";

const CourseManagement = () => {
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    slug: string | null;
  }>({ open: false, slug: null });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    course: Course | null;
  }>({ open: false, course: null });

  const [createDialog, setCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Fetch courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/media-literacy/courses`
      );
      const result = await response.json();
      return result.data || [];
    },
  });

  const courses = coursesData || [];

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("تم حذف الدورة بنجاح");
      setDeleteDialog({ open: false, slug: null });
    },
    onError: (error: Error) => {
      toast.error(`فشل في حذف الدورة: ${error.message}`);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: coursesApi.togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("تم تحديث حالة النشر");
    },
  });

  const columns: Column<Course>[] = [
    {
      header: "العنوان",
      accessor: "title",
      sortable: true,
    },
    {
      header: "المستوى",
      accessor: "difficulty",
      sortable: true,
      cell: (value) => {
        const difficultyMap: Record<string, string> = {
          Beginner: "مبتدئ",
          Intermediate: "متوسط",
          Advanced: "متقدم",
        };
        return difficultyMap[value] || value;
      },
    },
    {
      header: "المدة (دقيقة)",
      accessor: "duration",
      sortable: true,
      cell: (value) => value.toLocaleString("ar-SA"),
    },
    {
      header: "الحالة",
      accessor: "isPublished",
      cell: (value) => renderStatusBadge(value ? "PUBLISHED" : "DRAFT"),
      sortable: true,
    },
    {
      header: "الدروس",
      accessor: (row) => row._count?.lessons || 0,
      cell: (value) => value.toLocaleString("ar-SA"),
    },
    {
      header: "المشتركون",
      accessor: (row) => row._count?.enrollments || 0,
      cell: (value) => value.toLocaleString("ar-SA"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الدورات</h2>
          <p className="text-muted-foreground">
            إدارة دورات محو الأمية الإعلامية
          </p>
        </div>
        <Button onClick={() => setCreateDialog(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة دورة جديدة
        </Button>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        actions={[
          {
            label: "إدارة الدروس",
            onClick: (row) => setSelectedCourse(row),
            icon: <BookOpen className="w-4 h-4" />,
          },
          {
            label: "تحرير",
            onClick: (row) => setEditDialog({ open: true, course: row }),
            icon: <Edit className="w-4 h-4" />,
          },
          {
            label: "نشر/إلغاء",
            onClick: (row) => togglePublishMutation.mutate(row.slug),
          },
          {
            label: "حذف",
            onClick: (row) => setDeleteDialog({ open: true, slug: row.slug }),
            variant: "destructive",
            icon: <Trash2 className="w-4 h-4" />,
          },
        ]}
        searchable
        searchPlaceholder="البحث في الدورات..."
        isLoading={isLoading}
        emptyMessage="لا توجد دورات"
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, slug: deleteDialog.slug })
        }
        title="حذف الدورة"
        description="هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع الدروس المرتبطة بها. لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        onConfirm={() => {
          if (deleteDialog.slug) {
            deleteMutation.mutate(deleteDialog.slug);
          }
        }}
      />

      <CourseFormDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          setCreateDialog(false);
        }}
      />

      {editDialog.course && (
        <CourseFormDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog({ open, course: null })}
          course={editDialog.course}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            setEditDialog({ open: false, course: null });
          }}
        />
      )}

      {selectedCourse && (
        <LessonsManagementDialog
          open={!!selectedCourse}
          onOpenChange={(open) => !open && setSelectedCourse(null)}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

// Course Form Dialog
interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSuccess: () => void;
}

const CourseFormDialog = ({
  open,
  onOpenChange,
  course,
  onSuccess,
}: CourseFormDialogProps) => {
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: course?.title || "",
    slug: course?.slug || "",
    description: course?.description || "",
    difficulty: (course?.difficulty as any) || "Beginner",
    duration: course?.duration || 60,
    order: course?.order || 0,
    learningObjectives: course?.learningObjectives || [],
    prerequisites: course?.prerequisites || [],
    coverImage: course?.coverImage || "",
    isPublished: course?.isPublished || false,
  });

  const [objectivesInput, setObjectivesInput] = useState(
    course?.learningObjectives.join(", ") || ""
  );
  const [prerequisitesInput, setPrerequisitesInput] = useState(
    course?.prerequisites.join(", ") || ""
  );

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      toast.success("تم إنشاء الدورة بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء الدورة: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) =>
      coursesApi.update(slug, data),
    onSuccess: () => {
      toast.success("تم تحديث الدورة بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في تحديث الدورة: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      learningObjectives: objectivesInput
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
      prerequisites: prerequisitesInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    if (course) {
      updateMutation.mutate({ slug: course.slug, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>
            {course ? "تحرير الدورة" : "إضافة دورة جديدة"}
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
                disabled={!!course}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">المستوى *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">مبتدئ</SelectItem>
                  <SelectItem value="Intermediate">متوسط</SelectItem>
                  <SelectItem value="Advanced">متقدم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">المدة (دقيقة) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                required
                min="1"
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">أهداف التعلم (مفصولة بفواصل)</Label>
            <Textarea
              id="objectives"
              value={objectivesInput}
              onChange={(e) => setObjectivesInput(e.target.value)}
              placeholder="فهم التحيز الإعلامي, تحديد المعلومات المضللة"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">المتطلبات (مفصولة بفواصل)</Label>
            <Textarea
              id="prerequisites"
              value={prerequisitesInput}
              onChange={(e) => setPrerequisitesInput(e.target.value)}
              placeholder="مهارات القراءة الأساسية, الوصول للإنترنت"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">رابط الصورة</Label>
            <Input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
            />
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
              {course ? "تحديث" : "إنشاء"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Lessons Management Dialog
interface LessonsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

const LessonsManagementDialog = ({
  open,
  onOpenChange,
  course,
}: LessonsManagementDialogProps) => {
  const queryClient = useQueryClient();
  const [createLessonDialog, setCreateLessonDialog] = useState(false);

  // Fetch course with lessons
  const { data: courseData } = useQuery({
    queryKey: ["course", course.slug],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/media-literacy/courses/${course.slug}`
      );
      return response.json();
    },
    enabled: open,
  });

  const lessons = courseData?.lessons || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              إدارة دروس: {course.title}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              إجمالي الدروس: {lessons.length}
            </p>
            <Button size="sm" onClick={() => setCreateLessonDialog(true)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة درس
            </Button>
          </div>

          {lessons.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                لا توجد دروس في هذه الدورة
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson: Lesson) => (
                <Card key={lesson.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {lesson.order}. {lesson.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {lesson.duration} دقيقة
                          {lesson.videoUrl && " • يحتوي على فيديو"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {createLessonDialog && (
          <LessonFormDialog
            open={createLessonDialog}
            onOpenChange={setCreateLessonDialog}
            courseSlug={course.slug}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ["course", course.slug],
              });
              setCreateLessonDialog(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Lesson Form Dialog (simplified)
interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSlug: string;
  onSuccess: () => void;
}

const LessonFormDialog = ({
  open,
  onOpenChange,
  courseSlug,
  onSuccess,
}: LessonFormDialogProps) => {
  const [formData, setFormData] = useState<CreateLessonDto>({
    title: "",
    content: "",
    duration: 15,
    order: 1,
    videoUrl: "",
    resources: [],
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLessonDto) =>
      coursesApi.createLesson(courseSlug, data),
    onSuccess: () => {
      toast.success("تم إنشاء الدرس بنجاح");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`فشل في إنشاء الدرس: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle>إضافة درس جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="title">عنوان الدرس *</Label>
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
              <Label htmlFor="order">الترتيب *</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">المحتوى *</Label>
            <ContentEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              minHeight="250px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (دقيقة) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">رابط الفيديو (اختياري)</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />
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
            <Button type="submit" disabled={createMutation.isPending}>
              إنشاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseManagement;

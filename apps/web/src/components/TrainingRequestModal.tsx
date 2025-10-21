import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Loader2, Users } from "lucide-react";
import { useState } from "react";

interface TrainingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingRequestModal = ({
  isOpen,
  onClose,
}: TrainingRequestModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    trainingTopic: "",
    description: "",
    preferredDate: "",
    alternativeDate: "",
    expectedAttendees: "",
    location: "",
    targetAudience: "",
    specificNeeds: "",
  });

  const { mutate: submitRequest, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiClient.submitTrainingRequest({
        ...data,
        expectedAttendees: parseInt(data.expectedAttendees) || 0,
      });
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سنتواصل معك قريباً لترتيب التدريب",
      });
      onClose();
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        trainingTopic: "",
        description: "",
        preferredDate: "",
        alternativeDate: "",
        expectedAttendees: "",
        location: "",
        targetAudience: "",
        specificNeeds: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "فشل إرسال الطلب",
        description: error?.message || "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRequest(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] bg-white overflow-hidden flex flex-col"
        dir="rtl"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-right font-['Cairo']">
            طلب تدريب مخصص
          </DialogTitle>
          <DialogDescription className="text-right font-['Cairo']">
            املأ النموذج أدناه وسنتواصل معك لترتيب برنامج تدريبي يناسب احتياجاتك
          </DialogDescription>
        </DialogHeader>

        <div
          className="overflow-y-auto flex-1 px-1"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4 pb-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Cairo']">
                المعلومات الشخصية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="name" className="text-right font-['Cairo']">
                      الاسم الكامل <span className="text-red-600">*</span>
                    </Label>
                  </div>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="text-right font-['Cairo'] bg-white"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-right font-['Cairo']"
                    >
                      البريد الإلكتروني <span className="text-red-600">*</span>
                    </Label>
                  </div>

                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="font-['Cairo'] bg-white"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-right font-['Cairo']"
                    >
                      رقم الهاتف
                    </Label>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="font-['Cairo'] bg-white"
                    placeholder="+971 50 123 4567"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="position"
                      className="text-right font-['Cairo']"
                    >
                      المنصب/الدور
                    </Label>
                  </div>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="text-right font-['Cairo'] bg-white"
                    placeholder="مدير، معلم، إلخ"
                  />
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Cairo']">
                معلومات المؤسسة
              </h3>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="organization"
                    className="text-right font-['Cairo']"
                  >
                    اسم المؤسسة/المدرسة/الشركة{" "}
                    <span className="text-red-600">*</span>
                  </Label>
                </div>

                <Input
                  id="organization"
                  required
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className="text-right font-['Cairo'] bg-white"
                  placeholder="أدخل اسم المؤسسة"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="location"
                    className="text-right font-['Cairo']"
                  >
                    الموقع/المدينة <span className="text-red-600">*</span>
                  </Label>
                </div>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="text-right font-['Cairo'] bg-white"
                  placeholder="دبي، أبوظبي، إلخ"
                />
              </div>
            </div>

            {/* Training Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 font-['Cairo']">
                تفاصيل التدريب
              </h3>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="trainingTopic"
                    className="text-right font-['Cairo']"
                  >
                    موضوع التدريب <span className="text-red-600">*</span>
                  </Label>
                </div>

                <Input
                  id="trainingTopic"
                  required
                  value={formData.trainingTopic}
                  onChange={(e) =>
                    setFormData({ ...formData, trainingTopic: e.target.value })
                  }
                  className="text-right font-['Cairo'] bg-white"
                  placeholder="مثال: محو الأمية الإعلامية، فحص الحقائق"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="description"
                    className="text-right font-['Cairo']"
                  >
                    وصف الاحتياجات التدريبية{" "}
                    <span className="text-red-600">*</span>
                  </Label>
                </div>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="text-right font-['Cairo'] bg-white"
                  placeholder="صف بالتفصيل ما تحتاجه من البرنامج التدريبي..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="targetAudience"
                      className="text-right font-['Cairo']"
                    >
                      الفئة المستهدفة
                    </Label>
                  </div>

                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value,
                      })
                    }
                    className="text-right font-['Cairo'] bg-white"
                    placeholder="طلاب، معلمون، صحفيون، إلخ"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="expectedAttendees"
                      className="text-right font-['Cairo']"
                    >
                      عدد المشاركين المتوقع{" "}
                      <span className="text-red-600">*</span>
                    </Label>
                  </div>

                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="expectedAttendees"
                      type="number"
                      required
                      min="1"
                      value={formData.expectedAttendees}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedAttendees: e.target.value,
                        })
                      }
                      className="pr-10 font-['Cairo'] bg-white"
                      placeholder="20"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="preferredDate"
                      className="text-right font-['Cairo']"
                    >
                      التاريخ المفضل
                    </Label>
                  </div>

                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredDate: e.target.value,
                        })
                      }
                      className="pr-10 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="alternativeDate"
                      className="text-right font-['Cairo']"
                    >
                      تاريخ بديل
                    </Label>
                  </div>

                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="alternativeDate"
                      type="date"
                      value={formData.alternativeDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternativeDate: e.target.value,
                        })
                      }
                      className="pr-10 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="specificNeeds"
                    className="text-right font-['Cairo']"
                  >
                    احتياجات أو متطلبات خاصة
                  </Label>
                </div>

                <Textarea
                  id="specificNeeds"
                  rows={3}
                  value={formData.specificNeeds}
                  onChange={(e) =>
                    setFormData({ ...formData, specificNeeds: e.target.value })
                  }
                  className="text-right font-['Cairo'] bg-white"
                  placeholder="أي متطلبات تقنية، ترتيبات خاصة، إلخ..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="font-['Cairo']"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 font-['Cairo'] text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال الطلب"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

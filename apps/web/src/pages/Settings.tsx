import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Email change state
  const [emailForm, setEmailForm] = useState({
    email: "",
    currentPassword: "",
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: (data: typeof emailForm) => apiClient.updateEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "تم تحديث البريد الإلكتروني",
        description: "يرجى التحقق من بريدك الإلكتروني الجديد",
      });
      setEmailForm({ email: "", currentPassword: "" });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث البريد الإلكتروني",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.updatePassword(data),
    onSuccess: () => {
      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تحديث كلمة المرور بنجاح",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => apiClient.deleteAccount(password),
    onSuccess: () => {
      toast({
        title: "تم حذف الحساب",
        description: "تم حذف حسابك بنجاح",
      });
      // Clear all cached data and logout
      queryClient.clear();
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الحساب",
        variant: "destructive",
      });
    },
  });

  const handleEmailUpdate = () => {
    if (!emailForm.email || !emailForm.currentPassword) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    updateEmailMutation.mutate(emailForm);
  };

  const handlePasswordUpdate = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "خطأ",
        description: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كلمة المرور",
        variant: "destructive",
      });
      return;
    }

    deleteAccountMutation.mutate(deletePassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-18" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="mb-4 font-['Cairo'] outline-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
          >
            ← العودة للملف الشخصي
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Cairo']">
            الإعدادات
          </h1>
          <p className="text-gray-600 font-['Cairo']">
            إدارة إعدادات حسابك وأمانه
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-['Cairo'] flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-600" />
                تغيير البريد الإلكتروني
              </CardTitle>
              <CardDescription className="font-['Cairo']">
                تحديث عنوان بريدك الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2">
                  <Label htmlFor="newEmail" className="font-['Cairo']">
                    البريد الإلكتروني الجديد
                  </Label>
                </div>

                <Input
                  id="newEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, email: e.target.value })
                  }
                  className="font-['Cairo']"
                />
              </div>
              <div>
                <div className="mb-2">
                  <Label htmlFor="emailPassword" className="font-['Cairo']">
                    كلمة المرور الحالية
                  </Label>
                </div>
                <Input
                  id="emailPassword"
                  type="password"
                  placeholder="••••••••"
                  value={emailForm.currentPassword}
                  onChange={(e) =>
                    setEmailForm({
                      ...emailForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="font-['Cairo']"
                />
              </div>
              <Button
                onClick={handleEmailUpdate}
                disabled={updateEmailMutation.isPending}
                className="font-['Cairo'] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                <Mail className="h-4 w-4 ml-2" />
                تحديث البريد الإلكتروني
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-['Cairo'] flex items-center gap-2">
                <Key className="h-5 w-5 text-red-600" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription className="font-['Cairo']">
                تحديث كلمة مرور حسابك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2">
                  <Label htmlFor="currentPassword" className="font-['Cairo']">
                    كلمة المرور الحالية
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="font-['Cairo'] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <Label htmlFor="newPassword" className="font-['Cairo']">
                    كلمة المرور الجديدة
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="font-['Cairo'] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <Label htmlFor="confirmPassword" className="font-['Cairo']">
                    تأكيد كلمة المرور الجديدة
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="font-['Cairo'] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={handlePasswordUpdate}
                disabled={updatePasswordMutation.isPending}
                className="font-['Cairo'] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                <Lock className="h-4 w-4 ml-2" />
                تحديث كلمة المرور
              </Button>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-['Cairo'] flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                الأمان والخصوصية
              </CardTitle>
              <CardDescription className="font-['Cairo']">
                نصائح لحماية حسابك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-gray-700">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <p className="font-['Cairo']">
                    استخدم كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام
                    ورموز
                  </p>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <p className="font-['Cairo']">
                    لا تشارك كلمة المرور مع أي شخص
                  </p>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <p className="font-['Cairo']">
                    قم بتغيير كلمة المرور بانتظام
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="font-['Cairo'] flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                منطقة الخطر
              </CardTitle>
              <CardDescription className="font-['Cairo']">
                إجراءات لا يمكن التراجع عنها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-red-600 mb-2 font-['Cairo']">
                    حذف الحساب
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-['Cairo']">
                    بمجرد حذف حسابك، لا يمكن التراجع عن هذا الإجراء. سيتم حذف
                    جميع بياناتك بشكل دائم.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="font-['Cairo'] outline-red-500 bg-red-500 hover:bg-amber-600 text-white hover:text-white cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف الحساب نهائياً
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-['Cairo'] text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              تأكيد حذف الحساب
            </DialogTitle>
            <DialogDescription className="font-['Cairo']">
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك بشكل دائم.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="deletePassword" className="font-['Cairo']">
                أدخل كلمة المرور للتأكيد
              </Label>
              <div className="relative">
                <Input
                  id="deletePassword"
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="font-['Cairo'] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletePassword("");
              }}
              className="font-['Cairo'] cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              className="font-['Cairo']"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف الحساب نهائياً
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;

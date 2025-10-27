import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient, User, UserStats } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  Mail,
  MessageSquare,
  Save,
  Shield,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
  });

  // Fetch user profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: () => apiClient.getUserProfile(),
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 401
  });

  // Fetch user stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<UserStats>({
    queryKey: ["userStats"],
    queryFn: () => apiClient.getUserStats(),
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 401
  });

  // Show error message if authentication fails
  useEffect(() => {
    if (profileError || statsError) {
      const errorMessage = (profileError || statsError) as Error;
      if (errorMessage.message.includes("Session expired")) {
        toast({
          title: "انتهت الجلسة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
      }
    }
  }, [profileError, statsError, toast]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث معلومات الملف الشخصي",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء التحديث",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  if (profileLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 mt-18" dir="rtl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-18" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Cairo']">
            الملف الشخصي
          </h1>
          <p className="text-gray-600 font-['Cairo']">
            إدارة معلوماتك الشخصية وإحصائياتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4 ring-4 ring-red-100">
                    <AvatarImage src={profile.avatar} alt={profile.firstName} />
                    <AvatarFallback className="bg-red-600 text-white text-2xl font-bold">
                      {getUserInitials(profile.firstName, profile.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 font-['Cairo']">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  {profile.username && (
                    <p className="text-gray-600 mb-2 font-['Cairo']">
                      @{profile.username}
                    </p>
                  )}
                  <Badge
                    className="mb-4 font-['Cairo']"
                    variant={profile.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {profile.role === "ADMIN"
                      ? "مدير"
                      : profile.role === "MODERATOR"
                        ? "مشرف"
                        : "مستخدم"}
                  </Badge>

                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="font-['Cairo']">{profile.email}</span>
                    </div>
                    {profile.isEmailVerified && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-['Cairo']">البريد موثق</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-['Cairo']">
                        انضم في {formatDate(profile.createdAt!)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/settings")}
                    variant="outline"
                    className="w-full mt-6 font-['Cairo'] cursor-pointer hover:bg-gray-100 hover:outline-red-500"
                  >
                    الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="font-['Cairo'] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  المستوى والنقاط
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">المستوى</span>
                  <Badge className="font-['Cairo'] bg-red-600 text-white px-4 py-2">
                    المستوى {stats.level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">النقاط</span>
                  <span className="font-bold text-red-600 font-['Cairo']">
                    {stats.totalPoints.toLocaleString("en-EN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-['Cairo']">السمعة</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold font-['Cairo']">
                      {stats.reputation.toLocaleString("en-EN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio and Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-['Cairo'] py-2">
                    المعلومات الشخصية
                  </CardTitle>
                  <CardDescription className="font-['Cairo']">
                    معلوماتك الأساسية والسيرة الذاتية
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="font-['Cairo'] cursor-pointer hover:bg-gray-100"
                  >
                    <Edit2 className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="font-['Cairo'] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="h-4 w-4 ml-2" />
                      حفظ
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="font-['Cairo']"
                      disabled={updateProfileMutation.isPending}
                    >
                      <X className="h-4 w-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2">
                      <Label htmlFor="firstName" className="font-['Cairo']">
                        الاسم الأول
                      </Label>
                    </div>

                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                      className="font-['Cairo']"
                    />
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="lastName" className="font-['Cairo'] mb-2">
                        الاسم الأخير
                      </Label>
                    </div>

                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                      className="font-['Cairo']"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <Label htmlFor="username" className="font-['Cairo']">
                      اسم المستخدم
                    </Label>
                  </div>

                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    className="font-['Cairo']"
                  />
                </div>
                <div>
                  <div className="mb-2">
                    <Label htmlFor="bio" className="font-['Cairo']">
                      السيرة الذاتية
                    </Label>
                  </div>

                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={4}
                    className="font-['Cairo']"
                    placeholder="أخبرنا عن نفسك..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="font-['Cairo']">الإحصائيات</CardTitle>
                <CardDescription className="font-['Cairo']">
                  نشاطك وإنجازاتك على المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600 font-['Cairo']">
                      {stats.totalSubmissions}
                    </div>
                    <div className="text-sm text-gray-600 font-['Cairo']">
                      طلبات
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 font-['Cairo']">
                      {stats.totalFactChecks}
                    </div>
                    <div className="text-sm text-gray-600 font-['Cairo']">
                      تحققات
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 font-['Cairo']">
                      {stats.completedCourses}
                    </div>
                    <div className="text-sm text-gray-600 font-['Cairo']">
                      دورات مكتملة
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 font-['Cairo']">
                      {stats.totalComments}
                    </div>
                    <div className="text-sm text-gray-600 font-['Cairo']">
                      تعليقات
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-['Cairo'] flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-['Cairo']">
                    لديك {stats.totalAchievements} إنجاز
                  </p>
                  {stats.totalAchievements === 0 && (
                    <p className="text-sm text-gray-400 mt-2 font-['Cairo']">
                      ابدأ بالمشاركة لكسب الإنجازات!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

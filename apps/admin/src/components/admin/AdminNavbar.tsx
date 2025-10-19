import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TahqaqLogo } from "@/components/ui/TahaqaqLogo";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminNavbar = ({ sidebarOpen, setSidebarOpen }: AdminNavbarProps) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const getInitials = () => {
    if (!admin) return "A";
    return `${admin.firstName[0]}${admin.lastName[0]}`.toUpperCase();
  };

  const getRoleBadge = () => {
    if (!admin) return "";
    return admin.role === "ADMIN" ? "مدير" : "مشرف";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <TahqaqLogo width={32} height={32} />
            <h1 className="text-xl font-bold text-gray-900">
              لوحة تحكم تحقق 360
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto py-1.5 px-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={admin?.avatar} />
                  <AvatarFallback className="bg-red-600 text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {admin?.firstName} {admin?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleBadge()}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {admin?.firstName} {admin?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {admin?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="ml-2 h-4 w-4" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import type { ReactNode } from "react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminLayout = ({
  children,
  activeSection,
  setActiveSection,
}: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" dir="rtl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex pt-[3.75rem]">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
        />
        <main
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-3.75rem)] ${
            sidebarOpen ? "mr-64" : "mr-16"
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

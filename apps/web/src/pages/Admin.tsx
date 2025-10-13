
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useState } from "react";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-16'}`}>
          <div className="p-6">
            <AdminDashboard activeSection={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;

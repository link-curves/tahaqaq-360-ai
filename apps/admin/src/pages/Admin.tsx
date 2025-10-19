import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <AdminLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      <AdminDashboard activeSection={activeSection} />
    </AdminLayout>
  );
};

export default Admin;

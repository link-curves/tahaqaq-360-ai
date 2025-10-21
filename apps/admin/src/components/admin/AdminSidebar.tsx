import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
}

const AdminSidebar = ({
  activeSection,
  setActiveSection,
  isOpen,
}: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "blogs", label: "المقالات", icon: FileText },
    { id: "events", label: "الأحداث", icon: Calendar },
    { id: "factchecks", label: "التحقق من الأخبار", icon: CheckCircle },
    { id: "education", label: "المحتوى التعليمي", icon: BookOpen },
    { id: "research", label: "الأبحاث", icon: FlaskConical },
    { id: "courses", label: "الدورات", icon: GraduationCap },
    { id: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
    { id: "analytics", label: "الإحصائيات", icon: BarChart3 },
    // { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside
      className={`fixed right-0 top-[3.75rem] h-[calc(100vh-3.75rem)] bg-white border-l border-gray-200 shadow-sm transition-all duration-300 z-20 pt-5 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-right ${
                  activeSection === item.id
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                } ${!isOpen && "px-2"}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className={`h-5 w-5 ${isOpen ? "ml-3" : ""}`} />
                {isOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;

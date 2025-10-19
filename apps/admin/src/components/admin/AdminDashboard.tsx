import AnalyticsView from "./AnalyticsView";
import BlogManagement from "./BlogManagement";
import CourseManagement from "./CourseManagement";
import DashboardOverviewNew from "./DashboardOverviewNew";
import EducationManagementNew from "./EducationManagementNew";
import EventManagementNew from "./EventManagementNew";
import FactCheckManagementNew from "./FactCheckManagementNew";
import FAQManagement from "./FAQManagement";
import ResearchManagement from "./ResearchManagement";
import SettingsView from "./SettingsView";

interface AdminDashboardProps {
  activeSection: string;
}

const AdminDashboard = ({ activeSection }: AdminDashboardProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverviewNew />;
      case "blogs":
        return <BlogManagement />;
      case "events":
        return <EventManagementNew />;
      case "factchecks":
        return <FactCheckManagementNew />;
      case "education":
        return <EducationManagementNew />;
      case "research":
        return <ResearchManagement />;
      case "courses":
        return <CourseManagement />;
      case "faqs":
        return <FAQManagement />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardOverviewNew />;
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default AdminDashboard;

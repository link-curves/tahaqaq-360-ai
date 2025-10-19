import AnalyticsView from "./AnalyticsView";
import BlogManagement from "./BlogManagement";
import CourseManagement from "./CourseManagement";
import DashboardOverviewNew from "./DashboardOverviewNew";
import EducationManagement from "./EducationManagement";
import EventManagement from "./EventManagement";
import FactCheckManagement from "./FactCheckManagement";
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
        return <EventManagement />;
      case "factchecks":
        return <FactCheckManagement />;
      case "education":
        return <EducationManagement />;
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

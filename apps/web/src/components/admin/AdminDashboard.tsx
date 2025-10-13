
import DashboardOverview from "./DashboardOverview";
import BlogManagement from "./BlogManagement";
import EventManagement from "./EventManagement";
import FactCheckManagement from "./FactCheckManagement";
import EducationManagement from "./EducationManagement";
import AnalyticsView from "./AnalyticsView";
import SettingsView from "./SettingsView";

interface AdminDashboardProps {
  activeSection: string;
}

const AdminDashboard = ({ activeSection }: AdminDashboardProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "blogs":
        return <BlogManagement />;
      case "events":
        return <EventManagement />;
      case "factchecks":
        return <FactCheckManagement />;
      case "education":
        return <EducationManagement />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default AdminDashboard;

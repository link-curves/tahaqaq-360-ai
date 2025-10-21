import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import AuthSuccessPage from "./pages/AuthSuccess";
import ContactUs from "./pages/ContactUs";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import FactCheckDetail from "./pages/FactCheckDetail";
import FactChecks from "./pages/FactChecks";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MyCourses from "./pages/MyCourses";
import MySubmissions from "./pages/MySubmissions";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import Research from "./pages/Research";
import ResearchDetail from "./pages/ResearchDetail";
import SubmitContent from "./pages/SubmitContent";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Auth routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All other routes with Layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/success" element={<AuthSuccessPage />} />
                    <Route path="/fact-checks" element={<FactChecks />} />
                    <Route
                      path="/fact-checks/:slug"
                      element={<FactCheckDetail />}
                    />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:slug" element={<EventDetail />} />
                    <Route path="/research" element={<Research />} />
                    <Route
                      path="/research/:slug"
                      element={<ResearchDetail />}
                    />
                    <Route path="/learning" element={<Courses />} />
                    <Route path="/learning/:slug" element={<CourseDetail />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:slug" element={<CourseDetail />} />

                    {/* Public Support Pages */}
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route
                      path="/accessibility"
                      element={<AccessibilityStatement />}
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/my-courses"
                      element={
                        <ProtectedRoute fallback={<Login />}>
                          <MyCourses />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/submit"
                      element={
                        <ProtectedRoute fallback={<Login />}>
                          <SubmitContent />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-submissions"
                      element={
                        <ProtectedRoute fallback={<Login />}>
                          <MySubmissions />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

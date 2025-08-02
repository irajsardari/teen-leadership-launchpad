import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FounderPage from "./pages/FounderPage";
import CurriculumPage from "./pages/CurriculumPage";
import ContactPage from "./pages/ContactPage";
import ApplyPage from "./pages/ApplyPage";
import AuthPage from "./pages/AuthPage";
import TeachersPage from "./pages/TeachersPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ChallengerPage from "./pages/ChallengerPage";
import PortalPage from "./pages/PortalPage";
import PortalLoginPage from "./pages/PortalLoginPage";
import PortalDashboardPage from "./pages/PortalDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import CourseStructurePage from "./pages/CourseStructurePage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/curriculum" element={<CurriculumPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/insights" element={<BlogPage />} />
                <Route path="/insights/:slug" element={<BlogPostPage />} />
                <Route path="/challenger" element={<ChallengerPage />} />
                <Route path="/portal-info" element={<PortalPage />} />
                <Route path="/portal" element={<PortalLoginPage />} />
                <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
                <Route path="/portal/teacher" element={<TeacherDashboardPage />} />
                <Route path="/portal/course/:courseId" element={<CourseStructurePage />} />
                <Route path="/portal/course/:courseId/session/:sessionId" element={<CourseStructurePage />} />
                <Route path="/auth" element={<AuthPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

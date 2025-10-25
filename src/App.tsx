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
import FAQPage from "./pages/FAQPage";
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
import TeacherPortalPage from "./pages/TeacherPortalPage";
import CourseStructurePage from "./pages/CourseStructurePage";
import LearningPortalPage from "./pages/LearningPortalPage";
import NotFound from "./pages/NotFound";
import TeachWithTMAPage from "./pages/TeachWithTMAPage";
import { AuthProvider } from "./hooks/useAuth";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import AdminApplicationsPage from "./pages/AdminApplicationsPage";
import AdminSecurityPage from "./pages/AdminSecurityPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DictionaryPage from "./pages/DictionaryPage";
import PublicLexiconPage from "./pages/PublicLexiconPage";
import LexiconNotFound from "./pages/LexiconNotFound";
import AdminDictionaryPage from "./pages/AdminDictionaryPage";
import TMAPlusPage from "./pages/TMAPlusPage";
import ScrollManager from "./components/ScrollManager";
import { SessionTimeoutProvider } from "./components/SessionTimeoutProvider";
import EchoesPage from "./pages/EchoesPage";
import PeterDruckerPage from "./pages/PeterDruckerPage";
import AbrahamMaslowPage from "./pages/AbrahamMaslowPage";
import EchoesSlugRouter from "./pages/EchoesSlugRouter";
import VoicesPage from "./pages/VoicesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionTimeoutProvider>
        <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollManager />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/founder" element={<FounderPage />} />
                <Route path="/curriculum" element={<CurriculumPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/apply" element={<ApplyPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/teach-with-tma" element={<TeachWithTMAPage />} />
                <Route path="/tma-plus" element={<TMAPlusPage />} />
                <Route path="/insights" element={<BlogPage />} />
                <Route path="/insights/:slug" element={<BlogPostPage />} />
                <Route path="/voices" element={<VoicesPage />} />
                <Route path="/voices/echoes" element={<EchoesPage />} />
                <Route path="/voices/echoes/:slug" element={<EchoesSlugRouter />} />
                <Route path="/voices/:slug" element={<BlogPostPage />} />
                <Route path="/challenger" element={<ChallengerPage />} />
<Route path="/learning-portal" element={<LearningPortalPage />} />
<Route path="/portal-info" element={<PortalPage />} />
<Route path="/portal" element={<PortalPage />} />
<Route path="/portal-login" element={<TeacherPortalPage />} />
<Route path="/portal/dashboard" element={<PortalDashboardPage />} />
<Route path="/portal/teacher" element={<TeacherDashboardPage />} />
                <Route path="/portal/course/:courseId" element={<CourseStructurePage />} />
                <Route path="/portal/course/:courseId/session/:sessionId" element={<CourseStructurePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/applications" element={<AdminApplicationsPage />} />
                <Route path="/admin/security" element={<AdminSecurityPage />} />
                <Route path="/admin/dictionary" element={<AdminDictionaryPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </BrowserRouter>
        </TooltipProvider>
        </HelmetProvider>
      </SessionTimeoutProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

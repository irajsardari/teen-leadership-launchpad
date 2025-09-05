import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Users, FileText, Shield, BookOpen, Settings, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthGuard } from "@/components/AuthGuard";

interface DashboardMetrics {
  totalUsers: number;
  adminUsers: number;
  teacherApplications: number;
  pendingApplications: number;
  safeguardingReports: number;
}

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    adminUsers: 0,
    teacherApplications: 0,
    pendingApplications: 0,
    safeguardingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [
          { count: totalUsers },
          { count: adminUsers },
          { count: teacherApplications },
          { count: pendingApplications },
          { count: safeguardingReports }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
          supabase.from('teacher_applications').select('*', { count: 'exact', head: true }),
          supabase.from('teacher_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('safeguarding_reports').select('*', { count: 'exact', head: true })
        ]);

        setMetrics({
          totalUsers: totalUsers || 0,
          adminUsers: adminUsers || 0,
          teacherApplications: teacherApplications || 0,
          pendingApplications: pendingApplications || 0,
          safeguardingReports: safeguardingReports || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const adminSections = [
    {
      title: "Applications Management",
      description: "Review and manage teacher applications",
      icon: FileText,
      path: "/admin/applications",
      metric: metrics.teacherApplications,
      badge: metrics.pendingApplications > 0 ? `${metrics.pendingApplications} pending` : null,
      badgeVariant: "destructive" as const
    },
    {
      title: "Security Dashboard", 
      description: "Monitor security status and user access",
      icon: Shield,
      path: "/admin/security",
      metric: metrics.totalUsers,
      badge: metrics.adminUsers > 0 ? `${metrics.adminUsers} admins` : null,
      badgeVariant: "secondary" as const
    },
    {
      title: "Dictionary Management",
      description: "Manage lexicon terms and translations",
      icon: BookOpen,
      path: "/admin/dictionary",
      metric: 0,
      badge: null,
      badgeVariant: "secondary" as const
    }
  ];

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <Helmet>
        <title>Admin Dashboard - TMA Academy</title>
        <meta name="description" content="Administrative dashboard for TMA Academy management" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}. Manage your TMA Academy platform from here.
          </p>
        </div>

        {metrics.safeguardingReports > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {metrics.safeguardingReports} safeguarding report{metrics.safeguardingReports > 1 ? 's' : ''} that require attention.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Including {metrics.adminUsers} admin{metrics.adminUsers !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.teacherApplications}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.pendingApplications} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safeguarding Reports</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.safeguardingReports}</div>
              <p className="text-xs text-muted-foreground">
                Safety reports submitted
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Card key={section.path} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <section.icon className="h-8 w-8 text-primary" />
                  {section.badge && (
                    <Badge variant={section.badgeVariant}>
                      {section.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
                {section.metric > 0 && (
                  <div className="text-2xl font-bold text-primary">
                    {section.metric}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full"
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact technical support or check the documentation.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboardPage;
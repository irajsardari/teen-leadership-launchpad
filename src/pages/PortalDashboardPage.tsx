import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Play, 
  Download, 
  Clock, 
  Trophy,
  FileText,
  Video,
  CheckCircle,
  LogOut,
  User,
  GraduationCap,
  Settings
} from "lucide-react";

interface Enrollment {
  id: string;
  progress_percentage: number;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
    description: string;
    term_number: number;
    term_name: string;
    duration_weeks: number;
    thumbnail_url: string;
  };
}

interface SessionProgress {
  session_id: string;
  completed: boolean;
  time_spent_minutes: number;
  last_accessed: string;
  session: {
    id: string;
    title: string;
    session_number: number;
    duration_minutes: number;
    description: string;
    course: {
      title: string;
      term_name: string;
    };
  };
}

interface RecentMaterial {
  id: string;
  title: string;
  material_type: string;
  file_url: string;
  video_url: string;
  session: {
    title: string;
    course: {
      title: string;
    };
  };
}

export default function PortalDashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recentProgress, setRecentProgress] = useState<SessionProgress[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<RecentMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Portal Dashboard useEffect - user:", user?.email, "isLoading:", isLoading);
    if (!user) {
      console.log("Portal Dashboard: No user, navigating to /portal?target=dashboard");
      setIsLoading(false);
      navigate("/portal?target=dashboard", { replace: true });
      return;
    }
    if (user) {
      (async () => {
        const { data: prof, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (!error) {
          const role = (prof?.role as string) || null;
          setProfileRole(role);
          const hasAccess = role === "student" || role === "challenger" || role === "admin";
          if (!hasAccess) {
            toast({ title: "Access denied", description: "Portal access is restricted.", variant: "destructive" });
            setIsLoading(false);
            navigate("/portal", { replace: true });
            return;
          }
          await fetchDashboardData();
        }
      })();
    }
  }, [user, isLoading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch enrollments with course details
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress_percentage,
          enrolled_at,
          course:courses (
            id,
            title,
            description,
            term_number,
            term_name,
            duration_weeks,
            thumbnail_url
          )
        `)
        .eq('student_id', user.id)
        .eq('is_active', true)
        .order('enrolled_at', { ascending: false });

      if (enrollmentsError) throw enrollmentsError;

      // Fetch recent session progress
      const { data: progressData, error: progressError } = await supabase
        .from('session_progress')
        .select(`
          session_id,
          completed,
          time_spent_minutes,
          last_accessed,
          session:course_sessions (
            id,
            title,
            session_number,
            duration_minutes,
            description,
            course:courses (
              title,
              term_name
            )
          )
        `)
        .eq('student_id', user.id)
        .order('last_accessed', { ascending: false })
        .limit(5);

      if (progressError) throw progressError;

      // Fetch recent materials from enrolled courses
      const enrolledCourseIds = enrollmentsData?.map(e => e.course?.id).filter(Boolean) || [];
      
      if (enrolledCourseIds.length > 0) {
        const { data: materialsData, error: materialsError } = await supabase
          .from('materials')
          .select(`
            id,
            title,
            material_type,
            file_url,
            video_url,
            session:course_sessions (
              title,
              course:courses (
                title
              )
            )
          `)
          .in('session_id', 
            await supabase
              .from('course_sessions')
              .select('id')
              .in('course_id', enrolledCourseIds)
              .then(res => res.data?.map(s => s.id) || [])
          )
          .order('created_at', { ascending: false })
          .limit(6);

        if (materialsError) throw materialsError;
        setRecentMaterials(materialsData || []);
      }

      setEnrollments(enrollmentsData || []);
      setRecentProgress(progressData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    console.log("Portal Dashboard handleSignOut called");
    try {
      await signOut();
      console.log("SignOut completed, navigating to /portal");
      navigate("/portal", { replace: true });
    } catch (error) {
      console.error("Portal Dashboard signOut error:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf':
      case 'document': return FileText;
      default: return Download;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - TMA Learning Portal</title>
        <meta name="description" content="Your learning dashboard" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">TMA Learning Portal</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Learning Dashboard</h2>
            <p className="text-muted-foreground">Track your progress, access materials, and continue your growth journey.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{enrollments.length}</p>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{recentProgress.filter(p => p.completed).length}</p>
                    <p className="text-sm text-muted-foreground">Completed Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(recentProgress.reduce((acc, p) => acc + p.time_spent_minutes, 0) / 60)}h
                    </p>
                    <p className="text-sm text-muted-foreground">Study Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length || 0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Courses */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Your Courses</h3>
              
              {enrollments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No courses enrolled yet.</p>
                    <Button className="mt-4" onClick={() => navigate("/portal/courses")}>
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{enrollment.course?.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {enrollment.course?.term_name} • {enrollment.course?.duration_weeks} weeks
                            </p>
                          </div>
                          <Badge variant="secondary">
                            Term {enrollment.course?.term_number}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {enrollment.course?.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-muted-foreground">
                            Enrolled {formatTimeAgo(enrollment.enrolled_at)}
                          </span>
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity & Materials */}
            <div className="space-y-6">
              {/* Recent Progress */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <Card>
                  <CardContent className="p-6">
                    {recentProgress.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No recent activity</p>
                    ) : (
                      <div className="space-y-4">
                        {recentProgress.slice(0, 3).map((progress) => (
                          <div key={progress.session_id} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${progress.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {progress.session?.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {progress.session?.course?.title} • {formatTimeAgo(progress.last_accessed)}
                              </p>
                            </div>
                            {progress.completed && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Materials */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Recent Materials</h3>
                <Card>
                  <CardContent className="p-6">
                    {recentMaterials.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No materials available</p>
                    ) : (
                      <div className="space-y-3">
                        {recentMaterials.slice(0, 4).map((material) => {
                          const IconComponent = getMaterialIcon(material.material_type);
                          return (
                            <div key={material.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                              <IconComponent className="h-4 w-4 text-primary" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{material.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {material.session?.course?.title}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {material.material_type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
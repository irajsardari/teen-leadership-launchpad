import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import TeacherResourcesTab from "@/components/TeacherResourcesTab";
import TeacherAttendanceTab from "@/components/TeacherAttendanceTab";
import TeacherProgressNotesTab from "@/components/TeacherProgressNotesTab";
import TeacherAnalyticsTab from "@/components/TeacherAnalyticsTab";
import { 
  BookOpen, 
  Users, 
  FileText, 
  Plus, 
  Upload, 
  Eye, 
  Settings,
  Calendar,
  CheckCircle,
  Clock,
  Download
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  term_name: string;
  term_number: number;
  difficulty_level: string;
  duration_weeks: number;
  is_active: boolean;
  enrollment_count?: number;
}

interface Session {
  id: string;
  title: string;
  session_number: number;
  course_id: string;
  is_published: boolean;
  materials_count?: number;
  assignments_count?: number;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  enrolled_at: string;
  progress_percentage: number;
  last_activity: string;
}

const TeacherDashboardPage = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  
  // New course form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    term_name: "",
    term_number: 1,
    difficulty_level: "beginner",
    duration_weeks: 4,
    description: ""
  });

  // New session form state
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    learning_objectives: ""
  });

  useEffect(() => {
    console.log("Teacher Dashboard useEffect - user:", user?.email, "isLoading:", isLoading);
    if (!isLoading && !user) {
      console.log("Teacher Dashboard: No user, navigating to /portal");
      navigate("/portal", { replace: true });
      return;
    }

    if (user) {
      (async () => {
        try {
          const { data: prof, error: profError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          if (profError) throw profError;
          const role = (prof?.role as string) || null;
          setProfileRole(role);
          if (role !== "teacher" && role !== "admin") {
            toast({ title: "Access denied", description: "Teacher role required", variant: "destructive" });
            navigate("/portal", { replace: true });
            return;
          }
          await fetchTeacherData();
        } catch (e) {
          console.error("Error checking profile role", e);
          navigate("/portal", { replace: true });
        }
      })();
    }
  }, [user, isLoading, navigate]);

  const fetchTeacherData = async () => {
    try {
      // Fetch teacher's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(`
          *,
          enrollments(count)
        `)
        .eq("teacher_id", user?.id);

      if (coursesError) throw coursesError;

      const coursesWithCounts = coursesData?.map(course => ({
        ...course,
        enrollment_count: course.enrollments?.length || 0
      })) || [];

      setCourses(coursesWithCounts);

      // If there are courses, fetch sessions for the first course by default
      if (coursesWithCounts.length > 0) {
        const firstCourseId = coursesWithCounts[0].id;
        setSelectedCourse(firstCourseId);
        await fetchSessions(firstCourseId);
        await fetchStudents(firstCourseId);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_sessions")
        .select(`
          *,
          materials(count),
          assignments(count)
        `)
        .eq("course_id", courseId)
        .order("session_number");

      if (error) throw error;

      const sessionsWithCounts = data?.map(session => ({
        ...session,
        materials_count: session.materials?.length || 0,
        assignments_count: session.assignments?.length || 0
      })) || [];

      setSessions(sessionsWithCounts);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchStudents = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          profiles!inner(full_name),
          session_progress(last_accessed)
        `)
        .eq("course_id", courseId)
        .eq("is_active", true);

      if (error) throw error;

      const studentsData = data?.map(enrollment => ({
        id: enrollment.student_id,
        full_name: enrollment.profiles?.full_name || "Unknown",
        email: "", // Would need to join with auth.users for email
        enrolled_at: enrollment.enrolled_at,
        progress_percentage: enrollment.progress_percentage || 0,
        last_activity: Array.isArray(enrollment.session_progress) && enrollment.session_progress.length > 0 
          ? enrollment.session_progress[0].last_accessed 
          : enrollment.enrolled_at
      })) || [];

      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const createCourse = async () => {
    try {
      const { error } = await supabase
        .from("courses")
        .insert([{
          ...newCourse,
          teacher_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      setNewCourse({
        title: "",
        term_name: "",
        term_number: 1,
        difficulty_level: "beginner",
        duration_weeks: 4,
        description: ""
      });

      fetchTeacherData();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const createSession = async () => {
    if (!selectedCourse) return;

    try {
      const nextSessionNumber = sessions.length + 1;
      const objectives = newSession.learning_objectives
        .split('\n')
        .filter(obj => obj.trim().length > 0);

      const { error } = await supabase
        .from("course_sessions")
        .insert([{
          ...newSession,
          course_id: selectedCourse,
          session_number: nextSessionNumber,
          learning_objectives: objectives
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully",
      });

      setNewSession({
        title: "",
        description: "",
        duration_minutes: 60,
        learning_objectives: ""
      });

      fetchSessions(selectedCourse);
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    console.log("Teacher Dashboard handleSignOut called");
    try {
      await signOut();
      console.log("SignOut completed, navigating to /portal");
      navigate("/portal", { replace: true });
    } catch (error) {
      console.error("Teacher Dashboard signOut error:", error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Teacher Portal | TMA</title>
        <meta name="description" content="Teacher Portal to manage courses, students, and resources." />
        <link rel="canonical" href="/portal/teacher" />
      </Helmet>
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((total, course) => total + (course.enrollment_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions.filter(s => s.is_published).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions.reduce((total, session) => total + (session.materials_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
<TabsList>
  <TabsTrigger value="courses">My Courses</TabsTrigger>
  <TabsTrigger value="students">Students</TabsTrigger>
  <TabsTrigger value="attendance">Attendance</TabsTrigger>
  <TabsTrigger value="notes">Progress Notes</TabsTrigger>
  <TabsTrigger value="analytics">Analytics</TabsTrigger>
  <TabsTrigger value="resources">Resources</TabsTrigger>
  <TabsTrigger value="create">Create Content</TabsTrigger>
</TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Your Courses</h3>
                </div>
                
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedCourse === course.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedCourse(course.id);
                      fetchSessions(course.id);
                      fetchStudents(course.id);
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <CardDescription>
                            {course.term_name} • {course.duration_weeks} weeks
                          </CardDescription>
                        </div>
                        <Badge variant={course.is_active ? "default" : "secondary"}>
                          {course.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{course.enrollment_count} students</span>
                        <span>{course.difficulty_level}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sessions for Selected Course */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedCourse ? `Sessions - ${courses.find(c => c.id === selectedCourse)?.title}` : 'Select a course'}
                </h3>
                
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            Session {session.session_number}: {session.title}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={session.is_published ? "default" : "secondary"}>
                            {session.is_published ? "Published" : "Draft"}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/portal/course/${selectedCourse}/session/${session.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{session.materials_count} materials</span>
                        <span>{session.assignments_count} assignments</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Students Progress</CardTitle>
                <CardDescription>
                  Monitor student activity and progress for selected course
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCourse ? (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{student.progress_percentage}%</p>
                            <Progress value={student.progress_percentage} className="w-20" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last active: {new Date(student.last_activity).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {students.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No students enrolled in this course yet.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Select a course to view student progress.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

<TabsContent value="attendance" className="space-y-6">
  <TeacherAttendanceTab />
</TabsContent>

<TabsContent value="notes" className="space-y-6">
  <TeacherProgressNotesTab />
</TabsContent>

<TabsContent value="analytics" className="space-y-6">
  <TeacherAnalyticsTab />
</TabsContent>

<TabsContent value="resources" className="space-y-6">
  <TeacherResourcesTab />
</TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Course */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Course</CardTitle>
                  <CardDescription>Add a new course to your curriculum</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="course-title">Course Title</Label>
                    <Input
                      id="course-title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      placeholder="e.g., Digital Awareness & Self-Management"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="term-name">Term Name</Label>
                    <Input
                      id="term-name"
                      value={newCourse.term_name}
                      onChange={(e) => setNewCourse({...newCourse, term_name: e.target.value})}
                      placeholder="e.g., Foundation Term"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="term-number">Term Number</Label>
                      <Input
                        id="term-number"
                        type="number"
                        value={newCourse.term_number}
                        onChange={(e) => setNewCourse({...newCourse, term_number: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duration (weeks)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newCourse.duration_weeks}
                        onChange={(e) => setNewCourse({...newCourse, duration_weeks: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={newCourse.difficulty_level} 
                      onValueChange={(value) => setNewCourse({...newCourse, difficulty_level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      placeholder="Course description..."
                    />
                  </div>
                  
                  <Button onClick={createCourse} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </CardContent>
              </Card>

              {/* Create Session */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Session</CardTitle>
                  <CardDescription>Add a session to the selected course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCourse ? (
                    <>
                      <div>
                        <Label htmlFor="session-title">Session Title</Label>
                        <Input
                          id="session-title"
                          value={newSession.title}
                          onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                          placeholder="e.g., Introduction to Digital Awareness"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="session-description">Description</Label>
                        <Textarea
                          id="session-description"
                          value={newSession.description}
                          onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                          placeholder="Session description..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="duration-minutes">Duration (minutes)</Label>
                        <Input
                          id="duration-minutes"
                          type="number"
                          value={newSession.duration_minutes}
                          onChange={(e) => setNewSession({...newSession, duration_minutes: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
                        <Textarea
                          id="objectives"
                          value={newSession.learning_objectives}
                          onChange={(e) => setNewSession({...newSession, learning_objectives: e.target.value})}
                          placeholder="Understand digital awareness concepts&#10;Learn self-management techniques&#10;Apply mindfulness practices"
                        />
                      </div>
                      
                      <Button onClick={createSession} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Session
                      </Button>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select a course first to create sessions.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  BookOpen, 
  FileText, 
  Video,
  Download,
  CheckCircle,
  Clock,
  Play,
  ClipboardList
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  term_name: string;
  term_number: number;
  description: string;
  difficulty_level: string;
  duration_weeks: number;
}

interface Session {
  id: string;
  title: string;
  description: string;
  session_number: number;
  duration_minutes: number;
  learning_objectives: string[];
  is_published: boolean;
}

interface Material {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_url?: string;
  video_url?: string;
  content_text?: string;
  is_downloadable: boolean;
  display_order: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  assignment_type: string;
  instructions: string;
  max_points: number;
  due_date?: string;
  is_required: boolean;
}

interface SessionProgress {
  completed: boolean;
  time_spent_minutes: number;
  last_accessed: string;
}

const CourseStructurePage = () => {
  const { courseId, sessionId } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/portal");
      return;
    }
    
    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, isLoading, courseId, navigate]);

  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setSelectedSession(session);
        fetchSessionContent(sessionId);
      }
    }
  }, [sessionId, sessions]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch course sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("course_sessions")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .order("session_number");

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // If no specific session is selected, select the first one
      if (!sessionId && sessionsData && sessionsData.length > 0) {
        setSelectedSession(sessionsData[0]);
        fetchSessionContent(sessionsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionContent = async (sessionId: string) => {
    try {
      // Fetch materials
      const { data: materialsData, error: materialsError } = await supabase
        .from("materials")
        .select("*")
        .eq("session_id", sessionId)
        .order("display_order");

      if (materialsError) throw materialsError;
      setMaterials(materialsData || []);

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("*")
        .eq("session_id", sessionId);

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

      // Fetch session progress
      const { data: progressData, error: progressError } = await supabase
        .from("session_progress")
        .select("*")
        .eq("session_id", sessionId)
        .eq("student_id", user?.id)
        .maybeSingle();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }
      setSessionProgress(progressData);

      // Update last accessed time
      if (progressData) {
        await supabase
          .from("session_progress")
          .update({ last_accessed: new Date().toISOString() })
          .eq("id", progressData.id);
      } else {
        // Create new progress record
        await supabase
          .from("session_progress")
          .insert([{
            session_id: sessionId,
            student_id: user?.id,
            last_accessed: new Date().toISOString()
          }]);
      }
    } catch (error) {
      console.error("Error fetching session content:", error);
    }
  };

  const markSessionComplete = async () => {
    if (!selectedSession || !user) return;

    try {
      if (sessionProgress) {
        const { data: progressData } = await supabase
          .from("session_progress")
          .select("id")
          .eq("session_id", selectedSession.id)
          .eq("student_id", user.id)
          .single();
          
        if (progressData) {
          await supabase
            .from("session_progress")
            .update({ 
              completed: true,
              completion_date: new Date().toISOString()
            })
            .eq("id", progressData.id);
        }
      } else {
        await supabase
          .from("session_progress")
          .insert([{
            session_id: selectedSession.id,
            student_id: user.id,
            completed: true,
            completion_date: new Date().toISOString(),
            last_accessed: new Date().toISOString()
          }]);
      }

      toast({
        title: "Session Completed",
        description: "Great job! Session marked as complete.",
      });

      fetchSessionContent(selectedSession.id);
    } catch (error) {
      console.error("Error marking session complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark session as complete",
        variant: "destructive",
      });
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
      case 'document':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const downloadMaterial = async (material: Material) => {
    if (!material.file_url) return;

    try {
      const response = await fetch(material.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading material:", error);
      toast({
        title: "Error",
        description: "Failed to download material",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Course not found</h2>
          <Button onClick={() => navigate("/portal/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/portal/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">
              {course.term_name} • {course.difficulty_level} • {course.duration_weeks} weeks
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sessions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessions.map((session) => (
                  <Button
                    key={session.id}
                    variant={selectedSession?.id === session.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => {
                      setSelectedSession(session);
                      fetchSessionContent(session.id);
                      // Update URL without navigation to maintain accordion behavior
                      window.history.replaceState(null, '', `/portal/course/${courseId}/session/${session.id}`);
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">
                        Session {session.session_number}
                      </div>
                      <div className="text-sm opacity-70 truncate">
                        {session.title}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedSession && (
              <>
                {/* Session Header */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          Session {selectedSession.session_number}: {selectedSession.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {selectedSession.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={sessionProgress?.completed ? "default" : "secondary"}>
                          {sessionProgress?.completed ? "Completed" : "In Progress"}
                        </Badge>
                        {!sessionProgress?.completed && (
                          <Button onClick={markSessionComplete} size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedSession.duration_minutes} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{materials.length} materials</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        <span>{assignments.length} assignments</span>
                      </div>
                    </div>
                    
                    {selectedSession.learning_objectives && selectedSession.learning_objectives.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Learning Objectives:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {selectedSession.learning_objectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {materials.length > 0 ? (
                      <div className="space-y-4">
                        {materials.map((material) => (
                          <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getMaterialIcon(material.material_type)}
                              <div>
                                <h4 className="font-medium">{material.title}</h4>
                                {material.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {material.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{material.material_type}</Badge>
                              {material.video_url && (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                                    <Play className="h-4 w-4 mr-2" />
                                    Watch
                                  </a>
                                </Button>
                              )}
                              {material.file_url && material.is_downloadable && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => downloadMaterial(material)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No materials available for this session yet.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Assignments */}
                {assignments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignments & Reflections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assignments.map((assignment) => (
                          <div key={assignment.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{assignment.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={assignment.is_required ? "default" : "secondary"}>
                                  {assignment.is_required ? "Required" : "Optional"}
                                </Badge>
                                <Badge variant="outline">{assignment.assignment_type}</Badge>
                              </div>
                            </div>
                            
                            {assignment.instructions && (
                              <div className="mb-3">
                                <h5 className="font-medium text-sm mb-1">Instructions:</h5>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.instructions}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center text-sm">
                              <span>
                                Points: {assignment.max_points}
                              </span>
                              {assignment.due_date && (
                                <span className="text-muted-foreground">
                                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseStructurePage;
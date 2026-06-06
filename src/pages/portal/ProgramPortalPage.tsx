import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, ClipboardList } from "lucide-react";

interface Program { id: string; name: string; slug: string; description: string | null; }
interface Course { id: string; title: string; description: string | null; }
interface Session { id: string; title: string; session_number: number; description: string | null; }
interface Quiz { id: string; title: string; session_id: string | null; course_id: string | null; pass_score: number; }

const ProgramPortalPage = () => {
  const { slug } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data: prog } = await supabase.from("programs").select("*").eq("slug", slug).maybeSingle();
      if (!prog) { setLoading(false); return; }
      setProgram(prog as Program);

      const { data: courses } = await supabase.from("courses").select("*").eq("program_id", prog.id).eq("is_active", true).limit(1);
      const c = courses?.[0] as Course | undefined;
      if (c) {
        setCourse(c);
        const { data: enr } = await supabase.from("enrollments").select("id").eq("course_id", c.id).eq("student_id", user.id).eq("is_active", true).maybeSingle();
        setEnrolled(!!enr);
        const { data: ses } = await supabase.from("course_sessions").select("*").eq("course_id", c.id).eq("is_published", true).order("session_number");
        setSessions((ses || []) as Session[]);
        const { data: qz } = await supabase.from("quizzes").select("*").eq("is_published", true).or(`course_id.eq.${c.id},session_id.in.(${(ses || []).map(s => s.id).join(",") || "00000000-0000-0000-0000-000000000000"})`);
        setQuizzes((qz || []) as Quiz[]);
      }
      setLoading(false);
    })();
  }, [slug, user, isLoading, navigate]);

  if (isLoading || loading) {
    return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (!program) return <div className="container mx-auto py-20 text-center">Program not found.</div>;

  if (!enrolled) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-3">{program.name}</h1>
        <p className="text-muted-foreground mb-6">
          You are not yet enrolled in this program. If you have submitted a registration, our team will email you once your application is approved.
        </p>
        <Button asChild variant="outline"><Link to={`/${program.slug === "trade-finance-academy" ? "trade-finance" : ""}`}>Back to program page</Link></Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{program.name} · Portal</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Badge variant="secondary">Program portal</Badge>
          <h1 className="text-3xl font-bold mt-2">{program.name}</h1>
          {course?.description && <p className="text-muted-foreground mt-2">{course.description}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Modules</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {sessions.length === 0 && <p className="text-sm text-muted-foreground">No modules yet.</p>}
              {sessions.map(s => (
                <Link key={s.id} to={`/portal/course/${course!.id}/session/${s.id}`}
                  className="block p-3 rounded border hover:bg-accent">
                  <div className="font-medium">Module {s.session_number}: {s.title}</div>
                  {s.description && <div className="text-xs text-muted-foreground mt-1">{s.description}</div>}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Quizzes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quizzes.length === 0 && <p className="text-sm text-muted-foreground">No quizzes available yet.</p>}
              {quizzes.map(q => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <div className="font-medium">{q.title}</div>
                    <div className="text-xs text-muted-foreground">Pass: {q.pass_score}%</div>
                  </div>
                  <Button size="sm" asChild><Link to={`/portal/quiz/${q.id}`}>Start</Link></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Resources</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Module-level materials (PDFs, slides, videos, links) are available inside each module above.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProgramPortalPage;
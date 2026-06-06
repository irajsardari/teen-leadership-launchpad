import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Course { id: string; title: string; }
interface Session { id: string; title: string; session_number: number; course_id: string; }
interface Option { id: string; option_text: string; is_correct: boolean; display_order: number; }
interface Question { id: string; question_text: string; question_type: string; points: number; display_order: number; options: Option[]; }
interface Quiz { id: string; title: string; description: string | null; session_id: string | null; course_id: string | null; pass_score: number; is_published: boolean; }

const QuizBuilderPage = () => {
  const { slug } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // new quiz form
  const [nq, setNq] = useState({ title: "", description: "", session_id: "", pass_score: 60 });

  const loadQuizzes = async (courseIds: string[], sessionIds: string[]) => {
    let q = supabase.from("quizzes").select("*");
    if (courseIds.length || sessionIds.length) {
      const ors: string[] = [];
      if (courseIds.length) ors.push(`course_id.in.(${courseIds.join(",")})`);
      if (sessionIds.length) ors.push(`session_id.in.(${sessionIds.join(",")})`);
      q = q.or(ors.join(","));
    }
    const { data } = await q.order("created_at", { ascending: false });
    setQuizzes((data || []) as Quiz[]);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data: prog } = await supabase.from("programs").select("id").eq("slug", slug).maybeSingle();
      if (!prog) return;
      const { data: cs } = await supabase.from("courses").select("id,title").eq("program_id", prog.id);
      setCourses((cs || []) as Course[]);
      const courseIds = (cs || []).map(c => c.id);
      let allSessions: Session[] = [];
      if (courseIds.length) {
        const { data: ss } = await supabase.from("course_sessions").select("id,title,session_number,course_id").in("course_id", courseIds).order("session_number");
        allSessions = (ss || []) as Session[];
        setSessions(allSessions);
      }
      await loadQuizzes(courseIds, allSessions.map(s => s.id));
    })();
  }, [slug, user, isLoading, navigate]);

  const loadQuestions = async (quizId: string) => {
    const { data: qs } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("display_order");
    const qList = (qs || []) as Omit<Question, "options">[];
    const ids = qList.map(q => q.id);
    let opts: Option[] = [];
    if (ids.length) {
      const { data: os } = await supabase.from("quiz_options").select("*").in("question_id", ids).order("display_order");
      opts = (os || []) as (Option & { question_id: string })[];
    }
    setQuestions(qList.map(q => ({
      ...q,
      options: (opts as (Option & { question_id: string })[]).filter(o => o.question_id === q.id),
    })));
  };

  const selectQuiz = async (q: Quiz) => { setSelectedQuiz(q); await loadQuestions(q.id); };

  const createQuiz = async () => {
    if (!nq.title || !nq.session_id) { toast({ title: "Title and module required", variant: "destructive" }); return; }
    const { data, error } = await supabase.from("quizzes").insert([{
      title: nq.title, description: nq.description, session_id: nq.session_id,
      pass_score: nq.pass_score, is_published: false,
    }]).select().single();
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    toast({ title: "Quiz created" });
    setNq({ title: "", description: "", session_id: "", pass_score: 60 });
    setQuizzes(prev => [data as Quiz, ...prev]);
  };

  const togglePublish = async (q: Quiz) => {
    const { error } = await supabase.from("quizzes").update({ is_published: !q.is_published }).eq("id", q.id);
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    setQuizzes(prev => prev.map(x => x.id === q.id ? { ...x, is_published: !q.is_published } : x));
    if (selectedQuiz?.id === q.id) setSelectedQuiz({ ...q, is_published: !q.is_published });
  };

  const addQuestion = async () => {
    if (!selectedQuiz) return;
    const { data, error } = await supabase.from("quiz_questions").insert([{
      quiz_id: selectedQuiz.id, question_text: "New question",
      question_type: "mcq_single", points: 1, display_order: questions.length,
    }]).select().single();
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    setQuestions(prev => [...prev, { ...(data as Omit<Question, "options">), options: [] }]);
  };

  const updateQuestion = async (q: Question, patch: Partial<Question>) => {
    const { error } = await supabase.from("quiz_questions").update(patch).eq("id", q.id);
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, ...patch } : x));
  };

  const deleteQuestion = async (q: Question) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from("quiz_questions").delete().eq("id", q.id);
    setQuestions(prev => prev.filter(x => x.id !== q.id));
  };

  const addOption = async (q: Question) => {
    const { data, error } = await supabase.from("quiz_options").insert([{
      question_id: q.id, option_text: "New option", is_correct: false, display_order: q.options.length,
    }]).select().single();
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, options: [...x.options, data as Option] } : x));
  };

  const updateOption = async (q: Question, o: Option, patch: Partial<Option>) => {
    const { error } = await supabase.from("quiz_options").update(patch).eq("id", o.id);
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    setQuestions(prev => prev.map(x => x.id === q.id ? {
      ...x, options: x.options.map(opt => opt.id === o.id ? { ...opt, ...patch } : opt),
    } : x));
  };

  const deleteOption = async (q: Question, o: Option) => {
    await supabase.from("quiz_options").delete().eq("id", o.id);
    setQuestions(prev => prev.map(x => x.id === q.id ? { ...x, options: x.options.filter(opt => opt.id !== o.id) } : x));
  };

  return (
    <>
      <Helmet><title>Quiz builder</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Quiz Builder</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Create a quiz</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Title</Label><Input value={nq.title} onChange={e => setNq({ ...nq, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={2} value={nq.description} onChange={e => setNq({ ...nq, description: e.target.value })} /></div>
              <div>
                <Label>Module (session)</Label>
                <Select value={nq.session_id} onValueChange={v => setNq({ ...nq, session_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose a module" /></SelectTrigger>
                  <SelectContent>
                    {sessions.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {courses.find(c => c.id === s.course_id)?.title} · M{s.session_number}: {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Pass score (%)</Label><Input type="number" value={nq.pass_score} onChange={e => setNq({ ...nq, pass_score: parseInt(e.target.value || "0") })} /></div>
              <Button onClick={createQuiz}><Plus className="h-4 w-4 mr-2" /> Create quiz</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quizzes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quizzes.length === 0 && <p className="text-sm text-muted-foreground">No quizzes yet.</p>}
              {quizzes.map(q => (
                <div key={q.id} className={`p-3 border rounded flex justify-between items-center cursor-pointer ${selectedQuiz?.id === q.id ? "bg-accent" : ""}`} onClick={() => selectQuiz(q)}>
                  <div>
                    <div className="font-medium text-sm">{q.title}</div>
                    <div className="text-xs text-muted-foreground">Pass: {q.pass_score}% · {q.is_published ? "Published" : "Draft"}</div>
                  </div>
                  <Switch checked={q.is_published} onCheckedChange={() => togglePublish(q)} onClick={e => e.stopPropagation()} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedQuiz && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Questions — {selectedQuiz.title}</CardTitle>
                <Button size="sm" onClick={addQuestion}><Plus className="h-4 w-4 mr-2" /> Add question</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length === 0 && <p className="text-sm text-muted-foreground">No questions yet.</p>}
              {questions.map((q, i) => (
                <div key={q.id} className="border rounded p-4 space-y-3">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <Label>Question {i + 1}</Label>
                      <Textarea rows={2} defaultValue={q.question_text} onBlur={e => updateQuestion(q, { question_text: e.target.value })} />
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Type</Label>
                          <Select value={q.question_type} onValueChange={v => updateQuestion(q, { question_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mcq_single">Single choice</SelectItem>
                              <SelectItem value="mcq_multi">Multiple choice</SelectItem>
                              <SelectItem value="true_false">True / False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Label className="text-xs">Points</Label>
                          <Input type="number" defaultValue={q.points} onBlur={e => updateQuestion(q, { points: parseInt(e.target.value || "1") })} />
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteQuestion(q)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2 pl-2">
                    <Label className="text-xs">Options (check correct)</Label>
                    {q.options.map(o => (
                      <div key={o.id} className="flex items-center gap-2">
                        <Switch checked={o.is_correct} onCheckedChange={(v) => updateOption(q, o, { is_correct: v })} />
                        <Input defaultValue={o.option_text} onBlur={e => updateOption(q, o, { option_text: e.target.value })} />
                        <Button size="icon" variant="ghost" onClick={() => deleteOption(q, o)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addOption(q)}><Plus className="h-4 w-4 mr-2" /> Add option</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default QuizBuilderPage;
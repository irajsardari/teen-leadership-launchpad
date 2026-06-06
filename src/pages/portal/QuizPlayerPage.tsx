import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Option { id: string; option_text: string; display_order: number; }
interface Question { id: string; question_text: string; question_type: string; points: number; options: Option[]; }
interface QuizData { quiz: { id: string; title: string; description: string | null; time_limit_minutes: number | null; pass_score: number }; questions: Question[]; }

const QuizPlayerPage = () => {
  const { quizId } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<QuizData | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data: qd, error } = await supabase.rpc("get_quiz_for_student", { _quiz_id: quizId });
      if (error || !qd) {
        toast({ title: "Cannot load quiz", description: error?.message || "Not enrolled", variant: "destructive" });
        navigate(-1); return;
      }
      setData(qd as unknown as QuizData);
      const { data: att, error: attErr } = await supabase.from("quiz_attempts")
        .insert([{ quiz_id: quizId, student_id: user.id }])
        .select("id").single();
      if (attErr) { toast({ title: "Could not start attempt", description: attErr.message, variant: "destructive" }); return; }
      setAttemptId(att.id);
      setLoading(false);
    })();
  }, [quizId, user, isLoading, navigate, toast]);

  const toggleOption = (q: Question, optionId: string) => {
    setAnswers(prev => {
      const cur = prev[q.id] || [];
      if (q.question_type === "mcq_multi") {
        return { ...prev, [q.id]: cur.includes(optionId) ? cur.filter(o => o !== optionId) : [...cur, optionId] };
      }
      return { ...prev, [q.id]: [optionId] };
    });
  };

  const submit = async () => {
    if (!attemptId || !data) return;
    setSubmitting(true);
    const payload = data.questions.map(q => ({ question_id: q.id, selected_option_ids: answers[q.id] || [] }));
    const { data: res, error } = await supabase.rpc("submit_quiz_attempt", { _attempt_id: attemptId, _answers: payload });
    setSubmitting(false);
    if (error) { toast({ title: "Submission failed", description: error.message, variant: "destructive" }); return; }
    navigate(`/portal/quiz/${quizId}/results/${attemptId}`, { state: res });
  };

  if (loading || !data) return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <>
      <Helmet><title>{data.quiz.title} · Quiz</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">{data.quiz.title}</h1>
        {data.quiz.description && <p className="text-muted-foreground mb-6">{data.quiz.description}</p>}
        <div className="space-y-6">
          {data.questions.map((q, i) => (
            <Card key={q.id}>
              <CardHeader><CardTitle className="text-base">Q{i + 1}. {q.question_text}</CardTitle></CardHeader>
              <CardContent>
                {q.question_type === "mcq_multi" ? (
                  <div className="space-y-2">
                    {q.options.map(o => (
                      <label key={o.id} className="flex items-start gap-2 p-2 rounded hover:bg-accent cursor-pointer">
                        <Checkbox checked={(answers[q.id] || []).includes(o.id)} onCheckedChange={() => toggleOption(q, o.id)} />
                        <span>{o.option_text}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <RadioGroup value={(answers[q.id] || [])[0] || ""} onValueChange={(v) => toggleOption(q, v)}>
                    {q.options.map(o => (
                      <div key={o.id} className="flex items-start gap-2 p-2 rounded hover:bg-accent">
                        <RadioGroupItem value={o.id} id={o.id} />
                        <Label htmlFor={o.id} className="font-normal cursor-pointer">{o.option_text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={submit} disabled={submitting} className="w-full mt-6" size="lg">
          {submitting ? "Submitting…" : "Submit quiz"}
        </Button>
      </div>
    </>
  );
};

export default QuizPlayerPage;
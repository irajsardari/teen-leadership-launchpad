import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const QuizResultsPage = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const initial = (location.state as { score?: number; max_score?: number; percentage?: number; passed?: boolean } | null) || null;
  const [result, setResult] = useState(initial);

  useEffect(() => {
    if (result) return;
    supabase.from("quiz_attempts").select("score,max_score,percentage,passed").eq("id", attemptId).maybeSingle()
      .then(({ data }) => data && setResult(data));
  }, [attemptId, result]);

  if (!result) return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;
  const passed = result.passed;

  return (
    <>
      <Helmet><title>Quiz results</title></Helmet>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            {passed
              ? <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              : <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />}
            <h1 className="text-2xl font-bold mb-2">{passed ? "Passed!" : "Not passed"}</h1>
            <p className="text-4xl font-bold mb-2">{result.percentage}%</p>
            <p className="text-muted-foreground mb-6">{result.score} / {result.max_score} points</p>
            <Button asChild variant="outline" className="w-full"><Link to="/portal/dashboard">Back to portal</Link></Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QuizResultsPage;
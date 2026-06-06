import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Mail, User } from "lucide-react";

interface Program {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  learning_outcomes: string[] | null;
  instructor_name: string | null;
  instructor_title: string | null;
  instructor_bio: string | null;
  instructor_photo_url: string | null;
  duration_text: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  registration_open: boolean;
}

const TradeFinanceLandingPage = () => {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("programs")
        .select("*")
        .eq("slug", "trade-finance-academy")
        .maybeSingle();
      setProgram(data as Program | null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (!program) {
    return <div className="container mx-auto py-20 text-center">Program not found.</div>;
  }

  return (
    <>
      <Helmet>
        <title>{program.name} | Trade Finance Academy</title>
        <meta name="description" content={program.tagline || program.name} />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <Badge variant="secondary" className="mb-4">Executive Program · Pilot Cohort</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{program.name}</h1>
          {program.tagline && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl">{program.tagline}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {program.registration_open ? (
              <Button asChild size="lg">
                <Link to="/trade-finance/register">Register for the program</Link>
              </Button>
            ) : (
              <Button size="lg" disabled>Registration closed</Button>
            )}
            {program.contact_email && (
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${program.contact_email}`}>Contact us</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-5xl grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-3">Program description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{program.description}</p>
          </div>

          {program.learning_outcomes && program.learning_outcomes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Learning outcomes</h2>
              <ul className="space-y-3">
                {program.learning_outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">Instructor</h2>
            <Card>
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{program.instructor_name || "TBD"}</p>
                  {program.instructor_title && (
                    <p className="text-sm text-muted-foreground">{program.instructor_title}</p>
                  )}
                  {program.instructor_bio && (
                    <p className="text-sm mt-2 text-muted-foreground">{program.instructor_bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{program.duration_text || "TBD"}</p>
                </div>
              </div>
              {program.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <a href={`mailto:${program.contact_email}`} className="font-medium text-primary hover:underline">
                      {program.contact_email}
                    </a>
                  </div>
                </div>
              )}
              {program.registration_open && (
                <Button asChild className="w-full">
                  <Link to="/trade-finance/register">Register now</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
};

export default TradeFinanceLandingPage;
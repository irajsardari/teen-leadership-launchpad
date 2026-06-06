import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Program { id: string; slug: string; name: string; audience: string; is_published: boolean; registration_open: boolean; }

const ProgramsAdminPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data } = await supabase.from("programs").select("*").order("created_at", { ascending: false });
      setPrograms((data || []) as Program[]);
      setLoading(false);
    })();
  }, [user, isLoading, navigate]);

  return (
    <>
      <Helmet><title>Programs · Admin</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">LMS Programs</h1>
        {loading ? <p>Loading…</p> : (
          <div className="grid gap-4">
            {programs.map(p => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>{p.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">/{p.slug} · {p.audience}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={p.is_published ? "default" : "secondary"}>{p.is_published ? "Published" : "Draft"}</Badge>
                      <Badge variant={p.registration_open ? "default" : "outline"}>{p.registration_open ? "Open" : "Closed"}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild><Link to={`/admin/programs/${p.slug}/registrations`}>Registrations</Link></Button>
                  <Button size="sm" variant="outline" asChild><Link to={`/admin/programs/${p.slug}/quizzes`}>Quizzes</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProgramsAdminPage;
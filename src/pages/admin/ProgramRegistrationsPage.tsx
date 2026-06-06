import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string; full_name: string; email: string; mobile: string | null;
  country: string | null; occupation: string | null; organization: string | null;
  educational_background: string | null; motivation: string | null;
  status: string; created_at: string; admin_notes: string | null;
}

const ProgramRegistrationsPage = () => {
  const { slug } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programId, setProgramId] = useState<string | null>(null);
  const [programName, setProgramName] = useState("");
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (pid: string) => {
    const { data } = await supabase.from("program_registrations").select("*").eq("program_id", pid).order("created_at", { ascending: false });
    setRegs((data || []) as Registration[]);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/auth"); return; }
    (async () => {
      const { data: prog } = await supabase.from("programs").select("id,name").eq("slug", slug).maybeSingle();
      if (!prog) { setLoading(false); return; }
      setProgramId(prog.id); setProgramName(prog.name);
      await load(prog.id);
      setLoading(false);
    })();
  }, [slug, user, isLoading, navigate]);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("program_registrations")
      .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Registration ${status}` });
    if (programId) await load(programId);
  };

  const filter = (s: string) => regs.filter(r => r.status === s);

  const renderList = (list: Registration[]) => (
    <div className="space-y-3">
      {list.length === 0 && <p className="text-sm text-muted-foreground">None.</p>}
      {list.map(r => (
        <Card key={r.id}>
          <CardHeader>
            <div className="flex justify-between items-start gap-3">
              <div>
                <CardTitle className="text-base">{r.full_name}</CardTitle>
                <p className="text-xs text-muted-foreground">{r.email} · {r.mobile} · {r.country}</p>
              </div>
              <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Occupation:</strong> {r.occupation} @ {r.organization}</p>
            <p><strong>Education:</strong> {r.educational_background}</p>
            {r.motivation && <p><strong>Motivation:</strong> {r.motivation}</p>}
            <p className="text-xs text-muted-foreground">Submitted {new Date(r.created_at).toLocaleString()}</p>
            {r.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => setStatus(r.id, "approved")}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <Helmet><title>Registrations · {programName}</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Registrations</h1>
        <p className="text-muted-foreground mb-6">{programName}</p>
        {loading ? <p>Loading…</p> : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({filter("pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({filter("approved").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({filter("rejected").length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">{renderList(filter("pending"))}</TabsContent>
            <TabsContent value="approved" className="mt-4">{renderList(filter("approved"))}</TabsContent>
            <TabsContent value="rejected" className="mt-4">{renderList(filter("rejected"))}</TabsContent>
          </Tabs>
        )}
        <p className="mt-6 text-xs text-muted-foreground">
          Note: Approving marks the application as approved. To complete enrollment, invite the user from Supabase Auth and create their enrollment record. Auto-invitation flow will be added in a follow-up.
        </p>
      </div>
    </>
  );
};

export default ProgramRegistrationsPage;
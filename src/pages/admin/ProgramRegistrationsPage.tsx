import React, { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
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
  status: string; created_at: string; admin_notes: string | null; user_id: string | null;
}

type ActivationMap = Record<string, { activated: boolean; last_sign_in_at: string | null }>;

const ProgramRegistrationsPage = () => {
  const { slug } = useParams();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programId, setProgramId] = useState<string | null>(null);
  const [programName, setProgramName] = useState("");
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activation, setActivation] = useState<ActivationMap>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (pid: string) => {
    const { data } = await supabase.from("program_registrations").select("*").eq("program_id", pid).order("created_at", { ascending: false });
    const list = (data || []) as Registration[];
    setRegs(list);
    const approvedIds = list.filter((r) => r.status === "approved").map((r) => r.id);
    if (approvedIds.length) {
      const { data: res } = await supabase.functions.invoke("approve-program-registration", {
        body: { action: "statuses", registration_ids: approvedIds },
      });
      if (res && (res as any).statuses) setActivation((res as any).statuses as ActivationMap);
    } else {
      setActivation({});
    }
  };

  useEffect(() => {
    if (isLoading || !user) return;
    (async () => {
      const { data: prog } = await supabase.from("programs").select("id,name").eq("slug", slug).maybeSingle();
      if (!prog) { setLoading(false); return; }
      setProgramId(prog.id); setProgramName(prog.name);
      await load(prog.id);
      setLoading(false);
    })();
  }, [slug, user, isLoading, navigate]);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    setBusyId(id);
    const action = status === "approved" ? "approve" : "reject";
    const { data, error } = await supabase.functions.invoke("approve-program-registration", {
      body: { registration_id: id, action },
    });
    setBusyId(null);
    if (error || (data && (data as any).error)) {
      const msg = (data as any)?.error || error?.message || "Failed";
      toast({ title: "Failed", description: msg, variant: "destructive" });
      return;
    }
    toast({
      title: `Registration ${status}`,
      description: status === "approved"
        ? "Invitation email sent and enrollment created."
        : undefined,
    });
    if (programId) await load(programId);
  };

  const resend = async (id: string) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke("approve-program-registration", {
      body: { registration_id: id, action: "resend" },
    });
    setBusyId(null);
    if (error || (data && (data as any).error)) {
      const msg = (data as any)?.error || error?.message || "Failed";
      toast({ title: "Resend failed", description: msg, variant: "destructive" });
      return;
    }
    toast({ title: "Invite resent", description: "Password setup email sent again." });
  };

  const statusBadge = (r: Registration) => {
    if (r.status === "pending") return <Badge variant="secondary">Pending approval</Badge>;
    if (r.status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
    const act = activation[r.id];
    if (act?.activated) return <Badge>Approved · Account activated</Badge>;
    return <Badge variant="outline">Approved · Invite sent</Badge>;
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
              {statusBadge(r)}
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Occupation:</strong> {r.occupation} @ {r.organization}</p>
            <p><strong>Education:</strong> {r.educational_background}</p>
            {r.motivation && <p><strong>Motivation:</strong> {r.motivation}</p>}
            <p className="text-xs text-muted-foreground">Submitted {new Date(r.created_at).toLocaleString()}</p>
            {r.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" disabled={busyId === r.id} onClick={() => setStatus(r.id, "approved")}>Approve</Button>
                <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
              </div>
            )}
            {r.status === "approved" && !activation[r.id]?.activated && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => resend(r.id)}>
                  {busyId === r.id ? "Sending…" : "Resend invite"}
                </Button>
              </div>
            )}
            {r.status === "approved" && activation[r.id]?.last_sign_in_at && (
              <p className="text-xs text-muted-foreground">
                Last sign-in: {new Date(activation[r.id].last_sign_in_at!).toLocaleString()}
              </p>
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
          Approving will invite the applicant by email, create their student profile with the
          executive_student role, and enroll them in this program's course automatically.
        </p>
      </div>
    </>
  );
};

export default ProgramRegistrationsPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  full_name: z.string().trim().min(2, "Required").max(120),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().min(5).max(40),
  country: z.string().trim().min(2).max(80),
  occupation: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(180),
  educational_background: z.string().trim().min(2).max(500),
  motivation: z.string().trim().max(1000).optional(),
});

const TradeFinanceRegistrationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programId, setProgramId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", mobile: "", country: "",
    occupation: "", organization: "", educational_background: "", motivation: "",
  });

  useEffect(() => {
    supabase.from("programs").select("id").eq("slug", "trade-finance-academy").maybeSingle()
      .then(({ data }) => setProgramId(data?.id ?? null));
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Please check the form", description: first.message, variant: "destructive" });
      return;
    }
    if (!programId) {
      toast({ title: "Program unavailable", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const d = parsed.data;
    const { error } = await supabase.from("program_registrations").insert([{
      program_id: programId,
      status: "pending",
      full_name: d.full_name,
      email: d.email,
      mobile: d.mobile,
      country: d.country,
      occupation: d.occupation,
      organization: d.organization,
      educational_background: d.educational_background,
      motivation: d.motivation ?? null,
    }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/trade-finance/thank-you");
  };

  return (
    <>
      <Helmet>
        <title>Register · Trade Finance Academy</title>
        <meta name="description" content="Apply for the International Banking & Trade Finance Executive Program." />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Program registration</h1>
        <p className="text-muted-foreground mb-8">
          Submit your details to apply for the Trade Finance Academy pilot. Our team will review your application and contact you.
        </p>
        <Card>
          <CardHeader><CardTitle>Your details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Field label="Full name *"><Input value={form.full_name} onChange={set("full_name")} required maxLength={120} /></Field>
              <Field label="Email *"><Input type="email" value={form.email} onChange={set("email")} required maxLength={255} /></Field>
              <Field label="Mobile number *"><Input value={form.mobile} onChange={set("mobile")} required maxLength={40} /></Field>
              <Field label="Country *"><Input value={form.country} onChange={set("country")} required maxLength={80} /></Field>
              <Field label="Occupation *"><Input value={form.occupation} onChange={set("occupation")} required maxLength={120} /></Field>
              <Field label="Organization / University *"><Input value={form.organization} onChange={set("organization")} required maxLength={180} /></Field>
              <Field label="Educational background *">
                <Textarea value={form.educational_background} onChange={set("educational_background")} required maxLength={500} rows={3} />
              </Field>
              <Field label="Motivation (optional)">
                <Textarea value={form.motivation} onChange={set("motivation")} maxLength={1000} rows={3} placeholder="Why are you interested in this program?" />
              </Field>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
  </div>
);

export default TradeFinanceRegistrationPage;
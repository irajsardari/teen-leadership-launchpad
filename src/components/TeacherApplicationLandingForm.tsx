import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AREAS = [
  "Leadership",
  "Management",
  "Psychology",
  "Finance",
  "Digital Citizenship",
  "Parent Programs",
  "Other",
] as const;

const AVAILABILITY = ["Weekdays", "Weekends", "Evenings"] as const;

const landingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  experienceDetails: z.string().min(1, "Please share your teaching experience"),
  qualifications: z.string().optional(),
  areasOfInterest: z.array(z.enum(AREAS)).min(1, "Select at least one area"),
  availability: z.array(z.enum(AVAILABILITY)).min(1, "Select your availability"),
  timezone: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required" }),
  cv: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "CV/Resume is required")
    .refine((files) => (files?.[0]?.size ?? 0) <= 10 * 1024 * 1024, "Max file size is 10MB"),
  hp: z.string().optional().refine((v) => !v, ""),
});

export type LandingForm = z.infer<typeof landingSchema>;

const TeacherApplicationLandingForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // basic analytics hook
    try { console.info("teach_page_view"); } catch {}
  }, []);

  const form = useForm<LandingForm>({
    resolver: zodResolver(landingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      country: "",
      experienceDetails: "",
      qualifications: "",
      areasOfInterest: [],
      availability: [],
      timezone: "",
      consent: false,
      hp: "",
    },
    mode: "onBlur",
  });

  const uploadCV = async (file: File): Promise<string | null> => {
    // Keep existing security posture: require auth for uploads to private bucket
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload your CV securely.",
        variant: "destructive",
      });
      return null;
    }
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("teacher-documents").upload(path, file);
    if (error) {
      console.error("CV upload error", error);
      toast({ title: "Upload error", description: error.message, variant: "destructive" });
      return null;
    }
    return path;
  };

  const handleAuthExpiry = async () => {
    try { await supabase.auth.signOut(); } catch {}
    try {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-gedgcagidpheugikoyim-auth-token');
    } catch {}
    const nextUrl = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.href = `/portal?reason=expired&next=${nextUrl}`;
  };

  const onSubmit = async (values: LandingForm) => {
    if (values.hp) return; // honeypot
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in before submitting this form.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      console.info("teach_form_start");

      let cvPath: string | null = null;
      if (values.cv && values.cv.length > 0) {
        cvPath = await uploadCV(values.cv[0]);
        if (!cvPath) return; // toast already shown
      }

      // Persist to existing table (map fields accordingly)
      const confidentialPayload = {
        country: values.country,
        experienceDetails: values.experienceDetails,
        qualifications: values.qualifications,
        availability: values.availability,
        timezone: values.timezone,
        consent: values.consent,
      };

      const { error } = await supabase.from("teacher_applications").insert({
        user_id: user?.id ?? null,
        full_name: values.fullName,
        email: values.email,
        phone_number: values.phoneNumber ?? null,
        specialization: values.areasOfInterest.join(", "),
        cv_url: cvPath,
        confidential_info: JSON.stringify(confidentialPayload),
      });
      if (error) {
        const msg = (error?.message || "").toLowerCase();
        if (error?.code === "401" || error?.code === "403" || msg.includes("jwt") || msg.includes("unauthorized") || msg.includes("permission")) {
          await handleAuthExpiry();
          return;
        }
        console.error("Submission error", error);
        console.info("teach_form_submit_error", { code: error.code });
        toast({ title: "Submission failed", description: "Please try again.", variant: "destructive" });
        return;
      }

      // Send email via Resend
      const { error: emailError } = await supabase.functions.invoke('send-application-emails', {
        body: {
          type: 'mentor',
          to: values.email,
          applicantName: values.fullName,
        },
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't throw error - application was successful
      }

      console.info("teach_form_submit_success");
      setShowSuccess({ email: values.email });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <section aria-live="polite" className="mt-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Application received — thank you!</CardTitle>
            <CardDescription>
              We’ve emailed a confirmation to {showSuccess.email}. Our team will review your application and get back to you within 7–10 business days.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section id="apply" aria-labelledby="apply-heading" className="mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span aria-hidden>🔒</span>
          <span>Secure application • Encrypted</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle id="apply-heading" className="text-3xl font-bold">Apply to Teach with TMA</CardTitle>
            <CardDescription>Tell us a bit about you — we review every application.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="fullName" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phoneNumber" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl><Input placeholder="+968 91234567" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="country" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="Country" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Background */}
                <FormField name="experienceDetails" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching experience</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Briefly describe your experience" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="qualifications" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications / certifications</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Optional" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="areasOfInterest" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Areas of interest</FormLabel>
                      <div className="grid grid-cols-1 gap-2 border rounded-md p-4 max-h-56 overflow-auto">
                        {AREAS.map((opt) => (
                          <label key={opt} className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value?.includes(opt)}
                              onCheckedChange={(c) => {
                                const v = c ? [...(field.value ?? []), opt] : (field.value ?? []).filter((x: string) => x !== opt);
                                field.onChange(v);
                              }}
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="availability" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <div className="grid grid-cols-1 gap-2 border rounded-md p-4">
                        {AVAILABILITY.map((opt) => (
                          <label key={opt} className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value?.includes(opt)}
                              onCheckedChange={(c) => {
                                const v = c ? [...(field.value ?? []), opt] : (field.value ?? []).filter((x: string) => x !== opt);
                                field.onChange(v);
                              }}
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField name="timezone" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time zone / preferred hours</FormLabel>
                    <FormControl><Input placeholder="e.g. GMT+4, evenings" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Documents */}
                <FormField name="cv" control={form.control} render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Upload CV (PDF/DOC, max 10MB)</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Consent */}
                <FormField name="consent" control={form.control} render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel className="font-normal">I consent to TMA storing my details for recruitment purposes.</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Honeypot */}
                <input type="text" aria-hidden className="hidden" tabIndex={-1} {...form.register("hp")} />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !user}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">We review and reply within 5–7 business days.</p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TeacherApplicationLandingForm;

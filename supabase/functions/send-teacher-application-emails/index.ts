import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const baseCorsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  areasOfInterest: string[];
  availability: string[];
  cvPath: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin") ?? "";
  const allowedOrigins = [
    "https://teenmanagement.com",
    "https://portal.teenmanagement.com",
  ];
  const isPreview = origin.endsWith(".lovable.app");
  const allowOrigin = (!origin || allowedOrigins.includes(origin) || isPreview) ? origin : "";
  const corsHeaders = { ...baseCorsHeaders, ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}) };

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (origin && !allowOrigin) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }

  try {
    // Require authenticated Supabase user (protects against external abuse)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const resend = new Resend(resendApiKey);

    const fromEmail = Deno.env.get("EMAIL_FROM") ?? "no-reply@teenmanagement.com";
    const fromName = Deno.env.get("EMAIL_FROM_NAME") ?? "Teenagers Management Academy (TMA)";
    const fromHeader = `${fromName} <${fromEmail}>`;

    const {
      fullName,
      email,
      phoneNumber,
      country,
      areasOfInterest,
      availability,
      cvPath,
    }: EmailPayload = await req.json();

    // Basic input normalization
    const areas = Array.isArray(areasOfInterest) ? areasOfInterest : [];
    const avail = Array.isArray(availability) ? availability : [];

    // Applicant confirmation
    await resend.emails.send({
      from: fromHeader,
      to: [email],
      subject: "Your TMA Teacher Application Has Been Received",
      html: `<p>Thank you for applying to teach at TMA. Our team will review your application and contact you within 7–10 business days.</p>`,
    });

    // Admin notification
    const adminBody = `New Teacher Application\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phoneNumber}\nCountry: ${country}\nAreas: ${areas.join(", ")}\nAvailability: ${avail.join(", ")}\nCV Path: ${cvPath ?? "(none)"}`;
    await resend.emails.send({
      from: fromHeader,
      to: ["info@teenmanagement.com"],
      subject: `New Teacher Application — ${fullName}`,
      text: adminBody,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-teacher-application-emails error", error);
    return new Response(JSON.stringify({ error: error.message ?? "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...baseCorsHeaders, "Access-Control-Allow-Origin": req.headers.get("Origin") ?? "*" },
    });
  }
};

serve(handler);


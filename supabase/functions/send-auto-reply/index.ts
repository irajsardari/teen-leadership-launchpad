import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

interface AutoReplyPayload {
  type: "teacher" | "challenger";
  to: string;
  fullName?: string;
  firstName?: string;
}

const baseCorsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin") ?? "";
  const allowedOrigins = [
    "https://teenmanagement.com",
    "https://portal.teenmanagement.com",
  ];
  const isPreview = origin.endsWith(".lovable.app");
  const allowOrigin = (!origin || allowedOrigins.includes(origin) || isPreview) ? origin : "";
  const corsHeaders = { ...baseCorsHeaders, ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}) };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Enforce allowed origins
  if (origin && !allowOrigin) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }

  let payload: AutoReplyPayload | null = null;
  try {
    payload = await req.json();
  } catch (_) {
    // ignore invalid JSON to keep non-blocking behavior
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("EMAIL_FROM") ?? "no-reply@teenmanagement.com";
  const fromName = Deno.env.get("EMAIL_FROM_NAME") ?? "Teenagers Management Academy (TMA)";
  const adminTo = Deno.env.get("ADMIN_NOTIFICATIONS_TO") ?? "applications@teenmanagement.com";
  const fromHeader = `${fromName} <${fromEmail}>`;

  const safeTo = payload?.to?.trim();
  const isTeacher = payload?.type === "teacher";
  const isChallenger = payload?.type === "challenger";

  const teacherHtml = (fullName?: string) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
    <p>Hello ${fullName ? fullName : "Applicant"},</p>
    <p>Thank you for your interest in joining the <strong>Teenagers Management Academy (TMA)</strong> as an educator.</p>
    <p>We’ve received your application. If your profile matches our current needs, we’ll reach out within <strong>5 business days</strong> with next steps.</p>
    <p>Questions? Reply to <a href="mailto:info@teenmanagement.com">info@teenmanagement.com</a>.</p>
    <p>Warm regards,<br/>Admissions & Recruitment Team<br/>Teenagers Management Academy<br/>🌍 Future Ready Leaders in Training</p>
  </div>`;

  const challengerHtml = (firstName?: string) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
    <p>Hey ${firstName ? firstName : "Challenger"}! 🚀</p>
    <p>Welcome to your <strong>TMA Challenger Journey</strong> — we’ve got your registration! We’ll email you very soon with next steps.</p>
    <ul>
      <li>💡 Think like a leader</li>
      <li>💪 Build real-world skills</li>
      <li>🌍 Make a difference in your community</li>
    </ul>
    <p>Questions? Reply to <a href="mailto:info@teenmanagement.com">info@teenmanagement.com</a>.</p>
    <p>See you soon,<br/>The TMA Team<br/>🌍 Future Ready Leaders in Training</p>
  </div>`;

  const adminSubject = isTeacher
    ? `New Teacher Application — ${payload?.fullName ?? payload?.to ?? "Unknown"}`
    : isChallenger
      ? `New Challenger Registration — ${payload?.firstName ?? payload?.to ?? "Unknown"}`
      : `New Submission — ${payload?.to ?? "Unknown"}`;

  const adminBody = isTeacher
    ? `Teacher application received.\nName: ${payload?.fullName ?? "(n/a)"}\nEmail: ${payload?.to ?? "(n/a)"}`
    : isChallenger
      ? `Challenger registration received.\nName: ${payload?.firstName ?? payload?.fullName ?? "(n/a)"}\nEmail: ${payload?.to ?? "(n/a)"}`
      : `Submission received.\nType: ${payload?.type ?? "(n/a)"}\nEmail: ${payload?.to ?? "(n/a)"}`;

  // If we don't have a valid API key or payload, still return success to avoid blocking
  if (!resendApiKey || !safeTo || !(isTeacher || isChallenger)) {
    console.warn("send-auto-reply: missing config or invalid payload", { hasKey: !!resendApiKey, payload });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const resend = new Resend(resendApiKey);

  // Background task to avoid blocking client
  const task = (async () => {
    try {
      const userEmailPromise = isTeacher
        ? resend.emails.send({
            from: fromHeader,
            to: [safeTo],
            subject: "We received your application — TMA",
            html: teacherHtml(payload?.fullName),
          })
        : resend.emails.send({
            from: fromHeader,
            to: [safeTo],
            subject: "Welcome to TMA — Challenger Registration Confirmed",
            html: challengerHtml(payload?.firstName),
          });

      const adminEmailPromise = resend.emails.send({
        from: fromHeader,
        to: [adminTo],
        subject: adminSubject,
        text: adminBody,
      });

      const results = await Promise.allSettled([userEmailPromise, adminEmailPromise]);
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error("send-auto-reply: email send failed", { which: i === 0 ? "user" : "admin", error: r.reason });
        }
      });
    } catch (err) {
      console.error("send-auto-reply: unexpected error", err);
    }
  })();

  // @ts-ignore - EdgeRuntime is available in Supabase Deno runtime
  // Start background task without blocking the response
  // deno-lint-ignore no-undef
  EdgeRuntime.waitUntil(task);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};

serve(handler);

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

  // Email templates (HTML + text)
  const teacherHtml = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank you for applying to be a Mentor at TMA 🌟</h2>
      <p>Dear Mentor Applicant,</p>
      <p>Thank you for submitting your application to become a Mentor at Teenagers Management Academy (TMA).
      We have received your details successfully.</p>
      <p>Our team will review your profile, and we will be in touch if you are shortlisted.</p>
      <p style="margin-top: 20px;">With appreciation,<br><strong>Teenagers Management Academy (TMA)</strong></p>
      <hr>
      <small>This is an automated email from no-reply@teenmanagement.com. For any questions, please contact info@teenmanagement.com</small>
    </body>
  </html>`;

  const teacherText = `Dear Mentor Applicant,

Thank you for submitting your application to become a Mentor at Teenagers Management Academy (TMA).
We have received your details successfully.

Our team will review your profile, and we will be in touch if you are shortlisted.

With appreciation,
Teenagers Management Academy (TMA)

---
This is an automated email from no-reply@teenmanagement.com. For any questions, please contact info@teenmanagement.com`;

  const challengerHtml = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to TMA – Your Journey Begins 🚀</h2>
      <p>Dear Challenger,</p>
      <p>Thank you for registering with Teenagers Management Academy (TMA).
      Your application has been received successfully.</p>
      <p>We will review your information and contact you soon with next steps.</p>
      <p>Meanwhile, feel free to explore our website: www.teenmanagement.com</p>
      <p style="margin-top: 20px;">Best regards,<br><strong>Teenagers Management Academy (TMA)</strong></p>
      <hr>
      <small>This is an automated email from no-reply@teenmanagement.com. For any questions, please contact info@teenmanagement.com</small>
    </body>
  </html>`;

  const challengerText = `Dear Challenger,

Thank you for registering with Teenagers Management Academy (TMA).
Your application has been received successfully.

We will review your information and contact you soon with next steps.

Meanwhile, feel free to explore our website: www.teenmanagement.com

Best regards,
Teenagers Management Academy (TMA)

---
This is an automated email from no-reply@teenmanagement.com. For any questions, please contact info@teenmanagement.com`;

  const adminSubject = isTeacher
    ? `New Mentor Application — ${payload?.fullName ?? payload?.to ?? "Unknown"}`
    : isChallenger
      ? `New Challenger Registration — ${payload?.firstName ?? payload?.to ?? "Unknown"}`
      : `New Submission — ${payload?.to ?? "Unknown"}`;

  const adminBody = isTeacher
    ? `Mentor application received.\nName: ${payload?.fullName ?? "(n/a)"}\nEmail: ${payload?.to ?? "(n/a)"}`
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
            replyTo: "info@teenmanagement.com",
            subject: "Thank you for applying to be a Mentor at TMA 🌟",
            html: teacherHtml,
            text: teacherText,
          })
        : resend.emails.send({
            from: fromHeader,
            to: [safeTo],
            replyTo: "info@teenmanagement.com",
            subject: "Welcome to TMA – Your Journey Begins 🚀",
            html: challengerHtml,
            text: challengerText,
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
        } else {
          console.log("send-auto-reply: email sent successfully", { which: i === 0 ? "user" : "admin", to: i === 0 ? safeTo : adminTo });
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

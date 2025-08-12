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
      <h2>Thank You for Your Application</h2>
      <p>Dear Educator,</p>
      <p>We have successfully received your application to <strong>Teach with TMA – Teenagers Management Academy</strong>.</p>
      <p>Our team will carefully review your profile and will be in touch if your experience aligns with our current opportunities.</p>
      <p>TMA is the first academy of its kind in the world, empowering teenagers through leadership, management, finance, psychology, and cultural awareness.</p>
      <p>Thank you for your interest in shaping the next generation of leaders.</p>
      <p style="margin-top: 20px;">Best regards,<br><strong>The TMA Recruitment Team</strong></p>
      <hr>
      <small>This is an automated email from Teenagers Management Academy. Please do not reply directly to this message.</small>
    </body>
  </html>`;

  const teacherText = `Dear Educator,

Thank you for applying to Teach with TMA – Teenagers Management Academy.
We have successfully received your application.

Our team will review your profile and be in touch if it matches our current opportunities.

Thank you for your interest in shaping the next generation of leaders.

The TMA Recruitment Team
(This is an automated email – please do not reply)`;

  const challengerHtml = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to Teenagers Management Academy!</h2>
      <p>Hi Challenger,</p>
      <p>We’re so excited to have received your application to join <strong>TMA – Teenagers Management Academy</strong>!</p>
      <p>Your journey to becoming a confident, capable, and future-ready leader starts here.</p>
      <p>Our team will review your details and get back to you soon with the next steps. Keep an eye on your inbox!</p>
      <p>At TMA, you’ll explore leadership, life skills, creativity, and personal growth like never before.</p>
      <p style="margin-top: 20px;">See you soon,<br><strong>The TMA Team</strong></p>
      <hr>
      <small>This is an automated email from Teenagers Management Academy. Please do not reply directly to this message.</small>
    </body>
  </html>`;

  const challengerText = `Hi Challenger,

We’re so excited to have received your application to join TMA – Teenagers Management Academy!

Your journey to becoming a confident, capable, and future-ready leader starts here.

We’ll review your details and contact you soon with the next steps.

The TMA Team
(This is an automated email – please do not reply)`;

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
            subject: "Thank You for Applying to Teach with TMA",
            html: teacherHtml,
            text: teacherText,
          })
        : resend.emails.send({
            from: fromHeader,
            to: [safeTo],
            subject: "Welcome to Your TMA Journey!",
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

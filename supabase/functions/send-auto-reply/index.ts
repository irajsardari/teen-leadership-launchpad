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

  // Unified email template (HTML + text)
  const firstName = payload?.firstName || payload?.fullName?.split(' ')[0] || "Applicant";
  
  const unifiedHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TMA Registration Confirmation</title>
      <style>
        body { font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #006D6C, #0F766E); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
        .badge { display: inline-block; background: #E9F6F2; color: #0F766E; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 16px 0; }
        .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #006D6C; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">TMA — Teenagers Management Academy</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">${isChallenger ? 'Registration' : 'Application'} Confirmation</p>
        </div>
        <div class="content">
          <h2 style="color: #006D6C;">Hello ${firstName}!</h2>
          
          ${isChallenger ? `
            <p>Thank you for registering for TMA. Our programs run by term (10 sessions).</p>
            
            <div class="badge">Per Term • 10 Sessions</div>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #006D6C;">Session Duration:</h3>
              <p style="margin-bottom: 0;">
                <strong>Level 1:</strong> 45–50 minutes<br>
                <strong>Levels 2–4:</strong> 70 minutes
              </p>
            </div>
            
            <p>We will confirm your cohort (online/offline, schedule) and share the exact fee for your term within 1–2 business days.</p>
            
            <p>If you have any questions now, simply reply to this email.</p>
            
            <p style="margin-top: 30px;">
              Warmly,<br>
              <strong>TMA Admissions</strong>
            </p>
          ` : `
            <p>Thank you for your interest in teaching with TMA. We've received your application and are reviewing it carefully.</p>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #006D6C;">Next Steps:</h3>
              <ul style="margin-bottom: 0;">
                <li>Our team will review your application within 3-5 business days</li>
                <li>If selected for interview, we'll contact you to schedule a meeting</li>
                <li>Training and certification information will be provided upon acceptance</li>
              </ul>
            </div>
            
            <p>We're building a global community of educators dedicated to teenage leadership development. Thank you for wanting to be part of this mission.</p>
            
            <p>If you have any questions, please reply to this email.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>TMA Teacher Relations Team</strong>
            </p>
          `}
        </div>
        <div class="footer">
          <p>© 2024 TMA — Teenagers Management Academy. All rights reserved.</p>
          <p>Building future-ready leaders since 2024.</p>
        </div>
      </div>
    </body>
  </html>`;

  const unifiedText = `Dear ${firstName},

${isChallenger ? `
Thank you for registering for TMA. Our programs run by term (10 sessions).

Session Duration:
- Level 1: 45–50 minutes
- Levels 2–4: 70 minutes

We will confirm your cohort (online/offline, schedule) and share the exact fee for your term within 1–2 business days.

If you have any questions now, simply reply to this email.

Warmly,
TMA Admissions
` : `
Thank you for your interest in teaching with TMA. We've received your application and are reviewing it carefully.

Next Steps:
- Our team will review your application within 3-5 business days
- If selected for interview, we'll contact you to schedule a meeting
- Training and certification information will be provided upon acceptance

We're building a global community of educators dedicated to teenage leadership development. Thank you for wanting to be part of this mission.

If you have any questions, please reply to this email.

Best regards,
TMA Teacher Relations Team
`}

© 2024 TMA — Teenagers Management Academy. All rights reserved.
Building future-ready leaders since 2024.

---
This is an automated email. For questions, please contact info@teenmanagement.com`;

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
      const userEmailPromise = resend.emails.send({
        from: fromHeader,
        to: [safeTo],
        replyTo: "info@teenmanagement.com",
        subject: isChallenger ? "Your TMA Registration — Next Steps" : "Your TMA Teacher Application — Next Steps",
        html: unifiedHtml,
        text: unifiedText,
      });

      const adminEmailPromise = resend.emails.send({
        from: fromHeader,
        to: ["info@teenmanagement.com"],
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

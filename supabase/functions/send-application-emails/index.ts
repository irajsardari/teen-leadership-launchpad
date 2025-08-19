import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

interface EmailPayload {
  type: "mentor" | "challenger" | "test";
  to: string;
  applicantName: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);
    const fromEmail = "TMA Notifications <no-reply@mail.teenmanagement.com>";
    const replyToEmail = "info@teenmanagement.com";
    const bccEmail = "info@teenmanagement.com";

    let subject: string;
    let htmlContent: string;
    let textContent: string;

    if (payload.type === "test") {
      subject = "TMA Test Connection OK";
      htmlContent = `
        <h2>TMA Test Connection OK</h2>
        <p>This is a test email to confirm Resend integration is working properly.</p>
        <p>Best regards,<br>TMA Team</p>
      `;
      textContent = "TMA Test Connection OK\n\nThis is a test email to confirm Resend integration is working properly.\n\nBest regards,\nTMA Team";
    } else if (payload.type === "mentor") {
      subject = "Thank you for applying as a Mentor with TMA";
      htmlContent = `
        <h2>Thank you for applying as a Mentor with TMA</h2>
        <p>Dear ${payload.applicantName},</p>
        <p>Thank you for submitting your application to join the Teenagers Management Academy (TMA) as a Mentor.</p>
        <p>Our team will carefully review your application and get back to you within 7–10 business days.</p>
        <p>We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.</p>
        <p>Warm regards,<br><strong>TMA Team</strong><br>Teenagers Management Academy</p>
      `;
      textContent = `Dear ${payload.applicantName},

Thank you for submitting your application to join the Teenagers Management Academy (TMA) as a Mentor.
Our team will carefully review your application and get back to you within 7–10 business days.

We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.

Warm regards,
TMA Team
Teenagers Management Academy`;
    } else if (payload.type === "challenger") {
      subject = "Welcome to TMA – Your Journey Begins!";
      htmlContent = `
        <h2>Welcome to TMA – Your Journey Begins!</h2>
        <p>Dear ${payload.applicantName},</p>
        <p>Thank you for registering as a Challenger with the Teenagers Management Academy (TMA).</p>
        <p>This is the first step of your leadership journey with us. Our team will review your registration and contact you soon with the next steps.</p>
        <p>We are excited to have you join the world's first dedicated academy for teenagers in management and leadership.</p>
        <p>Warm regards,<br><strong>TMA Team</strong><br>Teenagers Management Academy</p>
      `;
      textContent = `Dear ${payload.applicantName},

Thank you for registering as a Challenger with the Teenagers Management Academy (TMA).
This is the first step of your leadership journey with us. Our team will review your registration and contact you soon with the next steps.

We are excited to have you join the world's first dedicated academy for teenagers in management and leadership.

Warm regards,
TMA Team
Teenagers Management Academy`;
    } else {
      throw new Error("Invalid email type");
    }

    const emailData = {
      from: fromEmail,
      to: [payload.to],
      bcc: payload.type !== "test" ? [bccEmail] : undefined,
      replyTo: replyToEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
    };

    console.log("Sending email via Resend:", { type: payload.type, to: payload.to, subject });

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error("Resend error:", result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }

    console.log("Email sent successfully:", result.data);

    return new Response(
      JSON.stringify({ success: true, messageId: result.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-application-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
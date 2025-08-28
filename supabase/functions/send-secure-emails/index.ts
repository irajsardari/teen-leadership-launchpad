import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

interface EmailPayload {
  type: "mentor" | "challenger" | "test" | "admin_notification";
  to: string;
  applicantName: string;
  adminDetails?: any;
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
    
    // PHASE 5: Enhanced email security and deliverability headers
    const fromEmail = "TMA Notifications <no-reply@mail.teenmanagement.com>";
    const replyToEmail = "info@teenmanagement.com";
    const bccEmail = "info@teenmanagement.com";

    let subject: string;
    let htmlContent: string;
    let textContent: string;

    if (payload.type === "test") {
      subject = "TMA Test Connection OK";
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">TMA Security Test</h2>
          <p>This is a secure test email to confirm Resend integration is working properly.</p>
          <p>All security measures are active.</p>
          <p>Best regards,<br><strong>TMA Team</strong></p>
        </div>
      `;
      textContent = "This is a secure test email to confirm Resend integration is working properly.\n\nBest regards,\nTMA Team";
    } else if (payload.type === "mentor") {
      subject = "Thank you for applying as a Mentor with TMA";
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">TMA - Teenagers Management Academy</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p>Dear ${payload.applicantName},</p>
            <p>Thank you for submitting your application to join the <strong>Teenagers Management Academy (TMA)</strong> as a Mentor.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #2563eb; margin-top: 0;">📋 Next Steps</h3>
              <ul style="margin: 10px 0;">
                <li>Our team will carefully review your application</li>
                <li>We'll get back to you within <strong>7–10 business days</strong></li>
                <li>Shortlisted candidates will be contacted for an interview</li>
              </ul>
            </div>
            <p>We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.</p>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="margin: 0;">Warm regards,<br><strong>TMA Team</strong><br>Teenagers Management Academy</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                💬 Questions? Contact us at <a href="mailto:info@teenmanagement.com" style="color: #2563eb;">info@teenmanagement.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
      textContent = `Dear ${payload.applicantName},

Thank you for submitting your application to join the Teenagers Management Academy (TMA) as a Mentor.

Next Steps:
• Our team will carefully review your application
• We'll get back to you within 7–10 business days  
• Shortlisted candidates will be contacted for an interview

We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.

Warm regards,
TMA Team
Teenagers Management Academy

Questions? Contact us at info@teenmanagement.com`;
    } else if (payload.type === "challenger") {
      subject = "Welcome to TMA – Your Leadership Journey Begins!";
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎯 Welcome to TMA!</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p>Dear ${payload.applicantName},</p>
            <p>Congratulations! You've taken the first step in your leadership journey with the <strong>Teenagers Management Academy (TMA)</strong>.</p>
            <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">🚀 What Happens Next</h3>
              <ul style="margin: 10px 0;">
                <li>Our team will review your registration</li>
                <li>You'll receive course details and cohort information</li>
                <li>We'll contact you with payment and enrollment details</li>
              </ul>
            </div>
            <p>We are excited to have you join the world's first dedicated academy for teenagers in management and leadership development.</p>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>🔐 Data Protection:</strong> Your personal information is securely stored and protected according to international privacy standards.
              </p>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="margin: 0;">Warm regards,<br><strong>TMA Team</strong><br>Teenagers Management Academy</p>
              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                💬 Questions? Contact us at <a href="mailto:info@teenmanagement.com" style="color: #2563eb;">info@teenmanagement.com</a>
              </p>
            </div>
          </div>
        </div>
      `;
      textContent = `Dear ${payload.applicantName},

Congratulations! You've taken the first step in your leadership journey with the Teenagers Management Academy (TMA).

What Happens Next:
• Our team will review your registration
• You'll receive course details and cohort information  
• We'll contact you with payment and enrollment details

We are excited to have you join the world's first dedicated academy for teenagers in management and leadership development.

Data Protection: Your personal information is securely stored and protected according to international privacy standards.

Warm regards,
TMA Team
Teenagers Management Academy

Questions? Contact us at info@teenmanagement.com`;
    } else {
      throw new Error("Invalid email type");
    }

    // PHASE 5: Enhanced email headers for security and deliverability
    const emailData = {
      from: fromEmail,
      to: [payload.to],
      bcc: payload.type !== "test" ? [bccEmail] : undefined,
      replyTo: replyToEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'Auto-Submitted': 'auto-generated',
        'X-TMA-App': `${payload.type}_application`,
        'List-Unsubscribe': '<mailto:no-reply@mail.teenmanagement.com?subject=unsubscribe>',
        'X-Priority': '3',
        'X-Mailer': 'TMA-Security-System',
      },
    };

    console.log("Sending secure email via Resend:", { 
      type: payload.type, 
      to: payload.to, 
      subject,
      timestamp: new Date().toISOString()
    });

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error("Resend error:", result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }

    console.log("Secure email sent successfully:", {
      messageId: result.data?.id,
      type: payload.type,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.data?.id,
        sentAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders,
          "X-Security-Level": "enhanced"
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-secure-emails function:", {
      error: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: "Email sending failed",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
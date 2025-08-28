import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// PHASE 5: Email Hardening - Secure email function with rate limiting and validation

interface EmailPayload {
  type: "mentor" | "challenger" | "admin_notification" | "security_alert";
  to: string;
  applicantName?: string;
  adminMessage?: string;
  securityDetails?: object;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Enhanced deliverability headers for professional email sending
const getDeliverabilityHeaders = () => ({
  'Auto-Submitted': 'auto-generated',
  'X-TMA-App': 'secure-application-system',
  'List-Unsubscribe': '<mailto:no-reply@mail.teenmanagement.com?subject=unsubscribe>',
  'List-Id': 'TMA Application System <applications.teenmanagement.com>',
  'Precedence': 'bulk',
  'X-Priority': '3',
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for security checks
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Validate authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authentication required')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    const identifier = `${user.id}_${clientIP}`
    
    const { data: rateLimitResult } = await supabase.rpc('check_enhanced_rate_limit', {
      p_identifier: identifier,
      p_action: 'email_sending',
      p_max_attempts: 10,
      p_window_minutes: 60,
      p_block_minutes: 120
    })

    if (rateLimitResult && !rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for user ${user.id}:`, rateLimitResult)
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const payload: EmailPayload = await req.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Input validation and sanitization
    const { data: validationResult } = await supabase.rpc('validate_and_sanitize_input', {
      p_input: payload.to,
      p_type: 'email',
      p_max_length: 254
    })

    if (validationResult && !validationResult.valid) {
      throw new Error(`Invalid email: ${validationResult.errors.join(', ')}`);
    }

    const sanitizedEmail = validationResult?.sanitized || payload.to;
    const resend = new Resend(resendApiKey);
    
    // Professional from address with proper domain
    const fromEmail = "TMA Notifications <no-reply@mail.teenmanagement.com>";
    const replyToEmail = "info@teenmanagement.com";
    const bccEmail = "info@teenmanagement.com";

    let subject: string;
    let htmlContent: string;
    let textContent: string;

    // Generate secure, professional email content
    switch (payload.type) {
      case "mentor":
        if (!payload.applicantName) throw new Error("Applicant name required for mentor emails");
        
        const sanitizedName = (await supabase.rpc('validate_and_sanitize_input', {
          p_input: payload.applicantName,
          p_type: 'name',
          p_max_length: 100
        })).data?.sanitized || payload.applicantName;

        subject = "Thank you for applying as a Mentor with TMA";
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TMA Application Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Teenagers Management Academy</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Shaping Future Leaders</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${sanitizedName},</p>
              <p>Thank you for submitting your application to join the <strong>Teenagers Management Academy (TMA)</strong> as a Mentor.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="margin: 0;"><strong>What happens next?</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Our team will carefully review your application</li>
                  <li>We'll get back to you within 7–10 business days</li>
                  <li>Shortlisted candidates will be contacted for an interview</li>
                </ul>
              </div>
              <p>We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.</p>
              <div style="border-top: 1px solid #e1e5e9; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
                <p style="margin: 0;"><strong>Need help?</strong> Contact us at <a href="mailto:info@teenmanagement.com" style="color: #667eea;">info@teenmanagement.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `;
        textContent = `Dear ${sanitizedName},

Thank you for submitting your application to join the Teenagers Management Academy (TMA) as a Mentor.

What happens next?
• Our team will carefully review your application
• We'll get back to you within 7–10 business days  
• Shortlisted candidates will be contacted for an interview

We appreciate your interest in shaping the next generation of leaders and look forward to the possibility of working together.

Need help? Contact us at info@teenmanagement.com

Warm regards,
TMA Team
Teenagers Management Academy`;
        break;

      case "challenger":
        if (!payload.applicantName) throw new Error("Applicant name required for challenger emails");
        
        const sanitizedChallengerName = (await supabase.rpc('validate_and_sanitize_input', {
          p_input: payload.applicantName,
          p_type: 'name',
          p_max_length: 100
        })).data?.sanitized || payload.applicantName;

        subject = "Welcome to TMA – Your Leadership Journey Begins!";
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to TMA</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to TMA!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Leadership Journey Starts Here</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Dear ${sanitizedChallengerName},</p>
              <p>🌟 <strong>Congratulations!</strong> You've successfully registered as a Challenger with the Teenagers Management Academy (TMA).</p>
              <div style="background: #e8f4fd; padding: 20px; border-radius: 6px; border-left: 4px solid #1e90ff; margin: 20px 0;">
                <p style="margin: 0;"><strong>What's Next?</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Our team will review your registration details</li>
                  <li>You'll receive cohort information and term fees within 2-3 business days</li>
                  <li>We'll match you with the perfect program level and schedule</li>
                </ul>
              </div>
              <p>You're now part of the world's first dedicated academy for teenagers in management and leadership. Get ready to discover your potential, build lasting friendships, and develop skills that will serve you for life!</p>
              <div style="border-top: 1px solid #e1e5e9; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
                <p style="margin: 0;"><strong>Questions?</strong> We're here to help at <a href="mailto:info@teenmanagement.com" style="color: #667eea;">info@teenmanagement.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `;
        textContent = `Dear ${sanitizedChallengerName},

🌟 Congratulations! You've successfully registered as a Challenger with the Teenagers Management Academy (TMA).

What's Next?
• Our team will review your registration details
• You'll receive cohort information and term fees within 2-3 business days
• We'll match you with the perfect program level and schedule

You're now part of the world's first dedicated academy for teenagers in management and leadership. Get ready to discover your potential, build lasting friendships, and develop skills that will serve you for life!

Questions? We're here to help at info@teenmanagement.com

Welcome to the TMA family!
TMA Team
Teenagers Management Academy`;
        break;

      case "security_alert":
        // Admin-only security alerts
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userProfile?.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required for security alerts')
        }

        subject = "🚨 TMA Security Alert";
        htmlContent = `
          <p><strong>SECURITY ALERT</strong></p>
          <p>Details: ${JSON.stringify(payload.securityDetails)}</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Triggered by: ${user.email}</p>
        `;
        textContent = `SECURITY ALERT\n\nDetails: ${JSON.stringify(payload.securityDetails)}\nTimestamp: ${new Date().toISOString()}\nTriggered by: ${user.email}`;
        break;

      default:
        throw new Error("Invalid email type");
    }

    // Send email with enhanced deliverability headers
    const emailData = {
      from: fromEmail,
      to: [sanitizedEmail],
      bcc: (payload.type === "security_alert") ? undefined : [bccEmail],
      replyTo: replyToEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
      headers: getDeliverabilityHeaders(),
    };

    console.log("Sending secure email:", { 
      type: payload.type, 
      to: sanitizedEmail, 
      subject,
      userId: user.id 
    });

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error("Resend error:", result.error);
      
      // Log failed email attempt for security monitoring
      await supabase.from('security_audit_logs').insert({
        user_id: user.id,
        action: 'email_send_failed',
        resource_type: 'email_system',
        resource_id: payload.type,
      });

      throw new Error(`Email delivery failed: ${result.error.message}`);
    }

    // Log successful email for audit trail
    await supabase.from('security_audit_logs').insert({
      user_id: user.id,
      action: 'email_sent_successfully',
      resource_type: 'email_system', 
      resource_id: result.data?.id || 'unknown',
    });

    console.log("Secure email sent successfully:", result.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.data?.id,
        rateLimitInfo: rateLimitResult 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-secure-emails function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: error.message.includes('Rate limit') ? 429 : 
               error.message.includes('Authentication') || error.message.includes('Unauthorized') ? 401 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
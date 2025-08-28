import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  type: 'challenger_registration' | 'teacher_application' | 'safeguarding_alert' | 'parental_consent_confirmation';
  to?: string;
  name?: string;
  reportId?: string;
  reportType?: string;
  description?: string;
  reporterId?: string;
  childName?: string;
}

// Rate limiting for email sending
const rateLimitMap = new Map<string, { attempts: number; windowStart: number }>();

const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 60 * 1000): boolean => {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);
  
  if (!existing || now - existing.windowStart > windowMs) {
    rateLimitMap.set(identifier, { attempts: 1, windowStart: now });
    return true;
  }
  
  if (existing.attempts >= maxAttempts) {
    return false;
  }
  
  existing.attempts++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    // Initialize Supabase for logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const emailRequest: EmailRequest = await req.json();
    
    // Rate limiting based on email type
    const rateLimitKey = `${emailRequest.type}_${emailRequest.to || 'system'}`;
    if (!checkRateLimit(rateLimitKey, 3, 60 * 1000)) { // 3 emails per minute per type/recipient
      return new Response(JSON.stringify({ error: 'Email rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let emailContent;
    let subject;
    let recipients: string[] = [];

    switch (emailRequest.type) {
      case 'challenger_registration':
        subject = '🎉 Welcome to TMA Academy - Registration Received!';
        recipients = [emailRequest.to!];
        emailContent = generateChallengerRegistrationEmail(emailRequest.name!);
        break;

      case 'teacher_application':
        subject = '📚 TMA Teacher Application - Thank You!';
        recipients = [emailRequest.to!];
        emailContent = generateTeacherApplicationEmail(emailRequest.name!);
        break;

      case 'safeguarding_alert':
        subject = '🚨 URGENT: Safeguarding Report Submitted';
        recipients = ['safeguarding@teenmanagement.com', 'admin@teenmanagement.com'];
        emailContent = generateSafeguardingAlertEmail(emailRequest);
        break;

      case 'parental_consent_confirmation':
        subject = '✅ Parental Consent Confirmation - TMA Academy';
        recipients = [emailRequest.to!];
        emailContent = generateParentalConsentEmail(emailRequest.name!, emailRequest.childName!);
        break;

      default:
        throw new Error('Invalid email type');
    }

    // Send emails
    const emailPromises = recipients.map(async (recipient) => {
      const { data, error } = await resend.emails.send({
        from: 'TMA Academy <noreply@teenmanagement.com>',
        to: [recipient],
        subject,
        html: emailContent,
        headers: {
          'X-Entity-Ref-ID': `${emailRequest.type}-${Date.now()}`,
        },
      });

      if (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        throw error;
      }

      return data;
    });

    const results = await Promise.allSettled(emailPromises);
    
    // Log email sending attempt
    await supabase.rpc('log_sensitive_operation', {
      p_action: `email_sent_${emailRequest.type}`,
      p_resource_type: 'email_system',
      p_resource_id: emailRequest.reportId || emailRequest.to || 'system'
    });

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - successful;

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successful,
      failed,
      recipients: recipients.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to send email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const generateChallengerRegistrationEmail = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">🎉 Welcome to TMA Academy!</h1>
        <p style="color: #666; font-size: 16px;">Your challenger registration has been received</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Dear ${name},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for registering as a challenger with TMA Academy! We're excited to have you join our community of young leaders.
        </p>
        <p style="color: #374151; line-height: 1.6;">
          Your registration is currently being reviewed by our team. We'll share the exact term fee and available cohorts in your confirmation email within 2-3 business days.
        </p>
      </div>
      
      <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1d4ed8; margin-top: 0;">What's Next?</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px;">
          <li>Our admissions team will review your application</li>
          <li>You'll receive cohort options and payment details</li>
          <li>Complete enrollment to secure your spot</li>
          <li>Start your leadership journey!</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0;">
          Questions? Contact us at <a href="mailto:info@teenmanagement.com" style="color: #2563eb;">info@teenmanagement.com</a>
        </p>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
          TMA Academy - Empowering Young Leaders 🌟
        </p>
      </div>
    </div>
  `;
};

const generateTeacherApplicationEmail = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #059669; margin-bottom: 10px;">📚 Thank You for Your Application!</h1>
        <p style="color: #666; font-size: 16px;">TMA Academy Teaching Team Application</p>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Dear ${name},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for your interest in joining our teaching team at TMA Academy! We're impressed by educators who share our passion for developing young leaders.
        </p>
        <p style="color: #374151; line-height: 1.6;">
          We review each submission carefully and will contact shortlisted instructors within 7–10 business days.
        </p>
      </div>
      
      <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #047857; margin-top: 0;">Our Review Process</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px;">
          <li>Initial application review (current stage)</li>
          <li>Video interview with our team</li>
          <li>Teaching demonstration or sample lesson</li>
          <li>Background verification and onboarding</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0;">
          Questions? Contact us at <a href="mailto:teachers@teenmanagement.com" style="color: #059669;">teachers@teenmanagement.com</a>
        </p>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
          TMA Academy - Building Tomorrow's Leaders 🌟
        </p>
      </div>
    </div>
  `;
};

const generateSafeguardingAlertEmail = (data: EmailRequest): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #fef2f2; border: 2px solid #f87171; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #dc2626; margin-top: 0;">🚨 URGENT: Safeguarding Report</h1>
        <p style="color: #991b1b; font-weight: bold;">A new safeguarding concern has been reported and requires immediate attention.</p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; margin-top: 0;">Report Details:</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px;">
          <li><strong>Report ID:</strong> ${data.reportId}</li>
          <li><strong>Type:</strong> ${data.reportType}</li>
          <li><strong>Submitted By:</strong> ${data.reporterId}</li>
          <li><strong>Time:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>
      
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #ea580c; margin-top: 0;">Description:</h3>
        <p style="color: #374151; line-height: 1.6;">${data.description}</p>
      </div>
      
      <div style="background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center;">
        <p style="color: #dc2626; margin: 0; font-weight: bold;">
          ⚠️ REQUIRED ACTION: This report must be reviewed within 24 hours as per safeguarding protocols.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          Access the admin dashboard immediately to review and respond to this report.
        </p>
      </div>
    </div>
  `;
};

const generateParentalConsentEmail = (parentName: string, childName: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin-bottom: 10px;">✅ Parental Consent Confirmed</h1>
        <p style="color: #666; font-size: 16px;">TMA Academy Enrollment Authorization</p>
      </div>
      
      <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin-top: 0;">Dear ${parentName},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for providing parental consent for ${childName}'s enrollment in TMA Academy. 
          We have successfully recorded your authorization.
        </p>
        <p style="color: #374151; line-height: 1.6;">
          Your consent allows ${childName} to fully participate in our leadership development program 
          with all the protections and safeguards we have in place.
        </p>
      </div>
      
      <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #6d28d9; margin-top: 0;">What's Covered by Your Consent:</h3>
        <ul style="color: #374151; margin: 0; padding-left: 20px;">
          <li>Participation in educational activities and assessments</li>
          <li>Secure storage of educational records and progress data</li>
          <li>Communication regarding ${childName}'s development</li>
          <li>Emergency contact protocols if needed</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0;">
          Questions about consent or your child's program? Contact us at 
          <a href="mailto:parents@teenmanagement.com" style="color: #7c3aed;">parents@teenmanagement.com</a>
        </p>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
          TMA Academy - Partnering with Parents 👨‍👩‍👧‍👦
        </p>
      </div>
    </div>
  `;
};

serve(handler);
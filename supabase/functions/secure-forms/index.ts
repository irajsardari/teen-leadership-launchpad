import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface FormSubmissionRequest {
  formType: 'challenger' | 'teacher' | 'safeguarding' | 'parental_consent';
  formData: any;
  csrfToken?: string;
}

// Rate limiting storage
const rateLimitMap = new Map<string, { attempts: number; windowStart: number }>();

const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const key = identifier;
  const existing = rateLimitMap.get(key);
  
  if (!existing || now - existing.windowStart > windowMs) {
    rateLimitMap.set(key, { attempts: 1, windowStart: now });
    return true;
  }
  
  if (existing.attempts >= maxAttempts) {
    return false;
  }
  
  existing.attempts++;
  return true;
};

const validateAndSanitizeInput = (input: any, type: string): any => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS
  let sanitized = input.replace(/[<>"\\'&]/g, '');
  
  // Type-specific validation
  if (type === 'email') {
    sanitized = sanitized.toLowerCase().trim();
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(sanitized)) {
      throw new Error(`Invalid ${type} format`);
    }
  } else if (type === 'phone') {
    sanitized = sanitized.replace(/[^\d+\-\(\)\s]/g, '');
    if (sanitized.replace(/[^\d]/g, '').length < 10) {
      throw new Error('Invalid phone number');
    }
  } else if (type === 'name') {
    if (sanitized.length < 2) {
      throw new Error('Name too short');
    }
  }
  
  return sanitized;
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get and verify user session
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request
    const { formType, formData, csrfToken }: FormSubmissionRequest = await req.json();
    
    // Rate limiting
    const clientId = `${user.id}_${formType}`;
    if (!checkRateLimit(clientId, 3, 60 * 60 * 1000)) { // 3 attempts per hour
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;
    
    switch (formType) {
      case 'challenger':
        result = await handleChallengerSubmission(supabase, user, formData);
        break;
      case 'teacher':
        result = await handleTeacherSubmission(supabase, user, formData);
        break;
      case 'safeguarding':
        result = await handleSafeguardingSubmission(supabase, user, formData);
        break;
      case 'parental_consent':
        result = await handleParentalConsentSubmission(supabase, user, formData);
        break;
      default:
        throw new Error('Invalid form type');
    }

    // Log successful submission
    await supabase.rpc('log_sensitive_operation', {
      p_action: `secure_${formType}_submission`,
      p_resource_type: 'form_security',
      p_resource_id: user.id
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Form submission error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleChallengerSubmission = async (supabase: any, user: any, formData: any) => {
  // Validate and sanitize inputs
  const sanitized = {
    full_name: validateAndSanitizeInput(formData.full_name, 'name'),
    age: parseInt(formData.age),
    email: validateAndSanitizeInput(formData.email, 'email'),
    phone_number: validateAndSanitizeInput(formData.phone_number, 'phone'),
    level: validateAndSanitizeInput(formData.level, 'text'),
    confidential_info: formData.confidential_info ? validateAndSanitizeInput(formData.confidential_info, 'text') : null,
  };

  // Validate age range
  if (sanitized.age < 10 || sanitized.age > 18) {
    throw new Error('Age must be between 10 and 18');
  }

  // Insert into database
  const { data, error } = await supabase
    .from('challengers')
    .insert([{
      user_id: user.id,
      ...sanitized
    }])
    .select()
    .single();

  if (error) throw error;

  // Send notification email
  await supabase.functions.invoke('secure-email', {
    body: {
      type: 'challenger_registration',
      to: sanitized.email,
      name: sanitized.full_name,
    }
  });

  return data;
};

const handleTeacherSubmission = async (supabase: any, user: any, formData: any) => {
  // Validate and sanitize inputs
  const sanitized = {
    full_name: validateAndSanitizeInput(formData.full_name, 'name'),
    email: validateAndSanitizeInput(formData.email, 'email'),
    phone_number: validateAndSanitizeInput(formData.phone_number, 'phone'),
    specialization: Array.isArray(formData.specialization) 
      ? formData.specialization.map((s: string) => validateAndSanitizeInput(s, 'text')).join(', ')
      : validateAndSanitizeInput(formData.specialization, 'text'),
    education: validateAndSanitizeInput(formData.education, 'text'),
    experience_years: parseInt(formData.experience_years) || 0,
    cover_letter: formData.cover_letter ? validateAndSanitizeInput(formData.cover_letter, 'text') : null,
    cv_url: formData.cv_url ? validateAndSanitizeInput(formData.cv_url, 'text') : null,
  };

  // Insert into database
  const { data, error } = await supabase
    .from('teacher_applications')
    .insert([{
      user_id: user.id,
      ...sanitized
    }])
    .select()
    .single();

  if (error) throw error;

  // Send notification email
  await supabase.functions.invoke('secure-email', {
    body: {
      type: 'teacher_application',
      to: sanitized.email,
      name: sanitized.full_name,
    }
  });

  return data;
};

const handleSafeguardingSubmission = async (supabase: any, user: any, formData: any) => {
  // Validate and sanitize inputs
  const sanitized = {
    report_type: validateAndSanitizeInput(formData.report_type, 'text'),
    description: validateAndSanitizeInput(formData.description, 'text'),
    contact_info: formData.contact_info ? validateAndSanitizeInput(formData.contact_info, 'text') : null,
  };

  // Use secure RPC function for submission
  const { data, error } = await supabase.rpc('submit_safeguarding_report', {
    p_report_type: sanitized.report_type,
    p_description: sanitized.description,
    p_contact_info: sanitized.contact_info
  });

  if (error) throw error;

  // Send alert email
  await supabase.functions.invoke('secure-email', {
    body: {
      type: 'safeguarding_alert',
      reportId: data,
      reportType: sanitized.report_type,
      description: sanitized.description,
      reporterId: user.id,
    }
  });

  return { reportId: data };
};

const handleParentalConsentSubmission = async (supabase: any, user: any, formData: any) => {
  // Validate and sanitize inputs
  const sanitized = {
    child_user_id: formData.child_user_id,
    parent_guardian_name: validateAndSanitizeInput(formData.parent_guardian_name, 'name'),
    parent_guardian_email: validateAndSanitizeInput(formData.parent_guardian_email, 'email'),
    relationship: validateAndSanitizeInput(formData.relationship, 'text'),
    digital_signature: validateAndSanitizeInput(formData.digital_signature, 'text'),
    permissions: formData.permissions || [],
  };

  // Use secure RPC function for submission
  const { data, error } = await supabase.rpc('submit_parental_consent', {
    p_child_user_id: sanitized.child_user_id,
    p_parent_guardian_name: sanitized.parent_guardian_name,
    p_parent_guardian_email: sanitized.parent_guardian_email,
    p_relationship: sanitized.relationship,
    p_digital_signature: sanitized.digital_signature,
    p_permissions: sanitized.permissions
  });

  if (error) throw error;

  // Send confirmation email
  await supabase.functions.invoke('secure-email', {
    body: {
      type: 'parental_consent_confirmation',
      to: sanitized.parent_guardian_email,
      name: sanitized.parent_guardian_name,
      childName: formData.child_name,
    }
  });

  return { consentId: data };
};

serve(handler);
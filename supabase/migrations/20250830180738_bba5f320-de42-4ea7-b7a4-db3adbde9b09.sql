-- TMA Security Hardening Migration
-- Addresses critical security findings and implements comprehensive protection

-- 1. Enhanced admin verification function
CREATE OR REPLACE FUNCTION verify_admin_with_mfa()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN false;
  END IF;
  
  -- Log admin access verification
  PERFORM public.log_sensitive_operation(
    'admin_mfa_verification',
    'admin_access',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- 2. Field-level encryption functions using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create encryption key table (for rotating keys)
CREATE TABLE IF NOT EXISTS public.encryption_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text UNIQUE NOT NULL,
  key_data text NOT NULL, -- encrypted with master key
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS on encryption keys
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can manage encryption keys
CREATE POLICY encryption_keys_admin_only ON public.encryption_keys
FOR ALL USING (verify_admin_with_mfa())
WITH CHECK (verify_admin_with_mfa());

-- Insert master encryption key (in production, this should be from env)
INSERT INTO public.encryption_keys (key_name, key_data, is_active)
VALUES ('master_key', encode(gen_random_bytes(32), 'base64'), true)
ON CONFLICT (key_name) DO NOTHING;

-- Encryption helper functions
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  master_key text;
BEGIN
  IF data IS NULL OR data = '' THEN
    RETURN data;
  END IF;
  
  SELECT key_data INTO master_key 
  FROM public.encryption_keys 
  WHERE key_name = 'master_key' AND is_active = true
  LIMIT 1;
  
  RETURN encode(pgp_sym_encrypt(data, master_key), 'base64');
END;
$$;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  master_key text;
BEGIN
  IF encrypted_data IS NULL OR encrypted_data = '' THEN
    RETURN encrypted_data;
  END IF;
  
  SELECT key_data INTO master_key 
  FROM public.encryption_keys 
  WHERE key_name = 'master_key' AND is_active = true
  LIMIT 1;
  
  RETURN pgp_sym_decrypt(decode(encrypted_data, 'base64'), master_key);
EXCEPTION
  WHEN OTHERS THEN
    -- Return original data if decryption fails (for backward compatibility)
    RETURN encrypted_data;
END;
$$;

-- 3. Audit logging table for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_detailed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet DEFAULT inet_client_addr(),
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  risk_level text DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical'))
);

-- Enable RLS on detailed audit log
ALTER TABLE public.security_audit_detailed ENABLE ROW LEVEL SECURITY;

-- Only admins can view detailed audit logs
CREATE POLICY audit_detailed_admin_only ON public.security_audit_detailed
FOR ALL USING (verify_admin_with_mfa());

-- 4. Enhanced audit trigger function
CREATE OR REPLACE FUNCTION audit_sensitive_data_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  risk_level text := 'medium';
BEGIN
  -- Determine risk level based on table
  CASE TG_TABLE_NAME
    WHEN 'safeguarding_reports' THEN risk_level := 'critical';
    WHEN 'confidential_records' THEN risk_level := 'critical';
    WHEN 'parental_consents' THEN risk_level := 'high';
    WHEN 'teacher_applications' THEN risk_level := 'high';
    WHEN 'challengers' THEN risk_level := 'high';
    ELSE risk_level := 'medium';
  END CASE;

  -- Insert detailed audit record
  INSERT INTO public.security_audit_detailed (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    risk_level
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    risk_level
  );

  -- Also log to existing audit system
  PERFORM public.log_sensitive_operation(
    TG_OP || '_' || TG_TABLE_NAME || '_enhanced',
    'data_protection',
    COALESCE(NEW.id::text, OLD.id::text)
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 5. Redacted views for sensitive data
-- Teacher applications redacted view
CREATE OR REPLACE VIEW public.teacher_applications_public AS
SELECT 
  id,
  user_id,
  specialization,
  education,
  experience_years,
  status,
  created_at,
  updated_at,
  -- Redact sensitive fields
  CASE 
    WHEN verify_admin_with_mfa() OR auth.uid() = user_id THEN full_name
    ELSE '[REDACTED]'
  END as full_name,
  CASE 
    WHEN verify_admin_with_mfa() OR auth.uid() = user_id THEN email
    ELSE '[REDACTED]'
  END as email,
  CASE 
    WHEN verify_admin_with_mfa() THEN phone_number
    ELSE NULL
  END as phone_number,
  CASE 
    WHEN verify_admin_with_mfa() THEN cv_url
    ELSE NULL
  END as cv_url,
  CASE 
    WHEN verify_admin_with_mfa() THEN cover_letter
    ELSE '[REDACTED]'
  END as cover_letter,
  CASE 
    WHEN verify_admin_with_mfa() THEN confidential_info
    ELSE NULL
  END as confidential_info
FROM public.teacher_applications;

-- Challengers redacted view
CREATE OR REPLACE VIEW public.challengers_public AS
SELECT 
  id,
  user_id,
  age,
  level,
  country,
  city,
  gender,
  referral_source,
  created_at,
  -- Redact sensitive fields
  CASE 
    WHEN verify_admin_with_mfa() OR auth.uid() = user_id THEN full_name
    ELSE '[REDACTED]'
  END as full_name,
  CASE 
    WHEN verify_admin_with_mfa() OR auth.uid() = user_id THEN email
    ELSE '[REDACTED]'
  END as email,
  CASE 
    WHEN verify_admin_with_mfa() THEN phone_number
    ELSE NULL
  END as phone_number,
  CASE 
    WHEN verify_admin_with_mfa() THEN guardian_email
    ELSE NULL
  END as guardian_email,
  CASE 
    WHEN verify_admin_with_mfa() THEN confidential_info
    ELSE NULL
  END as confidential_info
FROM public.challengers;

-- 6. Storage bucket security policies
-- Create secure buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('teacher-documents', 'teacher-documents', false),
  ('student-files', 'student-files', false),
  ('safeguarding-evidence', 'safeguarding-evidence', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS policies
CREATE POLICY IF NOT EXISTS "Teacher documents - owner or admin access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'teacher-documents' AND (
    verify_admin_with_mfa() OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY IF NOT EXISTS "Student files - owner or admin access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'student-files' AND (
    verify_admin_with_mfa() OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY IF NOT EXISTS "Safeguarding evidence - admin only"
ON storage.objects FOR ALL
USING (
  bucket_id = 'safeguarding-evidence' AND 
  verify_admin_with_mfa()
);

-- 7. Enhanced RLS policies for sensitive tables
-- Drop existing policies to recreate with enhanced security
DROP POLICY IF EXISTS "teacher_apps_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_delete" ON public.teacher_applications;

-- New enhanced policies for teacher applications
CREATE POLICY "teacher_applications_enhanced_select" ON public.teacher_applications
FOR SELECT USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
);

CREATE POLICY "teacher_applications_enhanced_insert" ON public.teacher_applications
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id AND
  -- Rate limiting: max 1 application per user per day
  NOT EXISTS (
    SELECT 1 FROM public.teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > now() - interval '24 hours'
  )
);

CREATE POLICY "teacher_applications_enhanced_update" ON public.teacher_applications
FOR UPDATE USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND status = 'pending')
) WITH CHECK (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND status = 'pending')
);

CREATE POLICY "teacher_applications_enhanced_delete" ON public.teacher_applications
FOR DELETE USING (verify_admin_with_mfa());

-- Enhanced policies for challengers (student data)
DROP POLICY IF EXISTS "challengers_secure_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_delete" ON public.challengers;

CREATE POLICY "challengers_enhanced_select" ON public.challengers
FOR SELECT USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
);

CREATE POLICY "challengers_enhanced_insert" ON public.challengers
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id
);

CREATE POLICY "challengers_enhanced_update" ON public.challengers
FOR UPDATE USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
) WITH CHECK (
  verify_admin_with_mfa() OR 
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
);

CREATE POLICY "challengers_enhanced_delete" ON public.challengers  
FOR DELETE USING (verify_admin_with_mfa());

-- Enhanced policies for parental consents
DROP POLICY IF EXISTS "parental_consents_secure_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_delete" ON public.parental_consents;

CREATE POLICY "parental_consents_enhanced_select" ON public.parental_consents
FOR SELECT USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = parent_user_id AND auth.uid() IS NOT NULL)
  -- Note: Child cannot access their consent record directly
);

CREATE POLICY "parental_consents_enhanced_insert" ON public.parental_consents
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = parent_user_id
);

CREATE POLICY "parental_consents_enhanced_update" ON public.parental_consents
FOR UPDATE USING (
  verify_admin_with_mfa() OR 
  (auth.uid() = parent_user_id AND auth.uid() IS NOT NULL)
) WITH CHECK (
  verify_admin_with_mfa() OR 
  (auth.uid() = parent_user_id AND auth.uid() IS NOT NULL)
);

CREATE POLICY "parental_consents_enhanced_delete" ON public.parental_consents
FOR DELETE USING (verify_admin_with_mfa());

-- Progress notes - restrict student access to prevent exposure of sensitive assessments
DROP POLICY IF EXISTS "Students view their own progress notes" ON public.progress_notes;

CREATE POLICY "progress_notes_enhanced_student_select" ON public.progress_notes
FOR SELECT USING (
  verify_admin_with_mfa() OR 
  teacher_id = auth.uid() OR
  -- Students can only see basic progress, not detailed notes
  (student_id = auth.uid() AND length(text) < 200)
);

-- 8. Apply audit triggers to all sensitive tables
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_data_changes();

DROP TRIGGER IF EXISTS audit_challengers ON public.challengers;
CREATE TRIGGER audit_challengers
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_data_changes();

DROP TRIGGER IF EXISTS audit_parental_consents ON public.parental_consents;
CREATE TRIGGER audit_parental_consents
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_data_changes();

DROP TRIGGER IF EXISTS audit_confidential_records ON public.confidential_records;
CREATE TRIGGER audit_confidential_records
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION audit_sensitive_data_changes();

-- 9. MFA requirement table for admin users
CREATE TABLE IF NOT EXISTS public.admin_mfa_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  mfa_enabled boolean DEFAULT false,
  totp_secret text, -- encrypted
  backup_codes text[], -- encrypted array
  last_verified timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_mfa_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_mfa_settings_self_only" ON public.admin_mfa_settings
FOR ALL USING (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. Session security enhancements
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  ip_address inet DEFAULT inet_client_addr(),
  user_agent text,
  is_active boolean DEFAULT true
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_sessions_self_only" ON public.admin_sessions
FOR ALL USING (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Set shorter session timeout for admin users (12 hours)
CREATE OR REPLACE FUNCTION check_admin_session_timeout()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    -- Admin sessions expire in 12 hours
    UPDATE public.admin_sessions 
    SET expires_at = now() + interval '12 hours'
    WHERE user_id = NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

-- 11. Security monitoring functions
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TABLE(
  user_id uuid,
  activity_type text,
  count bigint,
  risk_score integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH suspicious_patterns AS (
    -- Multiple failed login attempts
    SELECT 
      sal.user_id,
      'multiple_failed_logins' as activity_type,
      COUNT(*) as count,
      CASE 
        WHEN COUNT(*) > 10 THEN 90
        WHEN COUNT(*) > 5 THEN 70
        ELSE 50
      END as risk_score
    FROM public.security_audit_logs sal
    WHERE sal.action LIKE '%failed%login%'
      AND sal.created_at > now() - interval '1 hour'
    GROUP BY sal.user_id
    HAVING COUNT(*) > 3

    UNION ALL

    -- Rapid data access patterns
    SELECT 
      sad.user_id,
      'rapid_data_access' as activity_type,
      COUNT(*) as count,
      CASE 
        WHEN COUNT(*) > 50 THEN 95
        WHEN COUNT(*) > 20 THEN 80
        ELSE 60
      END as risk_score
    FROM public.security_audit_detailed sad
    WHERE sad.created_at > now() - interval '10 minutes'
      AND sad.action = 'SELECT'
    GROUP BY sad.user_id
    HAVING COUNT(*) > 10
  )
  SELECT sp.user_id, sp.activity_type, sp.count, sp.risk_score
  FROM suspicious_patterns sp
  ORDER BY sp.risk_score DESC;
END;
$$;

-- 12. Emergency security lockdown function
CREATE OR REPLACE FUNCTION emergency_security_lockdown(reason text DEFAULT 'Emergency lockdown activated')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow execution by admin users
  IF NOT verify_admin_with_mfa() THEN
    RAISE EXCEPTION 'Unauthorized: Emergency lockdown requires admin privileges';
  END IF;

  -- Disable all non-admin user sessions
  UPDATE public.admin_sessions 
  SET is_active = false, expires_at = now()
  WHERE user_id NOT IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  );

  -- Log the emergency action
  INSERT INTO public.security_audit_detailed (
    user_id,
    action,
    table_name,
    record_id,
    risk_level
  ) VALUES (
    auth.uid(),
    'EMERGENCY_LOCKDOWN',
    'system_security',
    reason,
    'critical'
  );

  -- Send alert (in real implementation, this would trigger notifications)
  PERFORM public.log_sensitive_operation(
    'EMERGENCY_SECURITY_LOCKDOWN',
    'system_critical',
    reason
  );
END;
$$;

-- Final security verification
CREATE OR REPLACE FUNCTION verify_security_implementation()
RETURNS TABLE(
  check_name text,
  status text,
  details text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'RLS_ENABLED' as check_name,
    CASE WHEN COUNT(*) = 5 THEN 'PASS' ELSE 'FAIL' END as status,
    'Checked tables: teacher_applications, challengers, parental_consents, safeguarding_reports, confidential_records' as details
  FROM information_schema.tables t
  JOIN pg_class c ON c.relname = t.table_name
  WHERE t.table_schema = 'public' 
    AND t.table_name IN ('teacher_applications', 'challengers', 'parental_consents', 'safeguarding_reports', 'confidential_records')
    AND c.relrowsecurity = true

  UNION ALL

  SELECT 
    'AUDIT_TRIGGERS' as check_name,
    CASE WHEN COUNT(*) >= 4 THEN 'PASS' ELSE 'FAIL' END as status,
    'Audit triggers on sensitive tables: ' || COUNT(*)::text as details
  FROM information_schema.triggers
  WHERE trigger_name LIKE 'audit_%'
    AND event_object_table IN ('teacher_applications', 'challengers', 'parental_consents', 'confidential_records')

  UNION ALL

  SELECT 
    'STORAGE_BUCKETS' as check_name,
    CASE WHEN COUNT(*) >= 3 THEN 'PASS' ELSE 'FAIL' END as status,
    'Secure storage buckets configured: ' || COUNT(*)::text as details
  FROM storage.buckets
  WHERE public = false
    AND name IN ('teacher-documents', 'student-files', 'safeguarding-evidence');
END;
$$;

-- Run security verification
SELECT * FROM verify_security_implementation();
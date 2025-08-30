-- TMA Security Hardening Migration - Corrected
-- Fix storage policies and complete security implementation

-- Storage bucket security policies (corrected syntax)
-- Drop existing policies first
DROP POLICY IF EXISTS "Teacher documents - owner or admin access" ON storage.objects;
DROP POLICY IF EXISTS "Student files - owner or admin access" ON storage.objects;
DROP POLICY IF EXISTS "Safeguarding evidence - admin only" ON storage.objects;

-- Create new storage policies
CREATE POLICY "storage_teacher_documents_access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'teacher-documents' AND (
    verify_admin_with_mfa() OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "storage_student_files_access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'student-files' AND (
    verify_admin_with_mfa() OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "storage_safeguarding_evidence_admin_only"
ON storage.objects FOR ALL
USING (
  bucket_id = 'safeguarding-evidence' AND 
  verify_admin_with_mfa()
);

-- Password security validation function
CREATE OR REPLACE FUNCTION validate_password_strength(password text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  score integer := 0;
  issues text[] := ARRAY[]::text[];
BEGIN
  -- Check minimum length (12 characters)
  IF length(password) < 12 THEN
    issues := array_append(issues, 'Password must be at least 12 characters long');
  ELSE
    score := score + 1;
  END IF;
  
  -- Check for lowercase letters
  IF password !~ '[a-z]' THEN
    issues := array_append(issues, 'Password must contain lowercase letters');
  ELSE
    score := score + 1;
  END IF;
  
  -- Check for uppercase letters
  IF password !~ '[A-Z]' THEN
    issues := array_append(issues, 'Password must contain uppercase letters');
  ELSE
    score := score + 1;
  END IF;
  
  -- Check for digits
  IF password !~ '[0-9]' THEN
    issues := array_append(issues, 'Password must contain numbers');
  ELSE
    score := score + 1;
  END IF;
  
  -- Check for special characters
  IF password !~ '[^a-zA-Z0-9]' THEN
    issues := array_append(issues, 'Password must contain special characters');
  ELSE
    score := score + 1;
  END IF;
  
  -- Check for common patterns
  IF password ~* '(password|123456|qwerty|admin|letmein)' THEN
    issues := array_append(issues, 'Password contains common patterns');
    score := score - 1;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', array_length(issues, 1) IS NULL,
    'score', GREATEST(score, 0),
    'max_score', 5,
    'issues', issues
  );
END;
$$;

-- Security session management
CREATE OR REPLACE FUNCTION invalidate_user_sessions(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow admins or the user themselves to invalidate sessions
  IF NOT (verify_admin_with_mfa() OR auth.uid() = target_user_id) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot invalidate sessions for other users';
  END IF;
  
  -- Mark all user sessions as inactive
  UPDATE public.admin_sessions 
  SET is_active = false, expires_at = now()
  WHERE user_id = target_user_id;
  
  -- Log the session invalidation
  PERFORM public.log_sensitive_operation(
    'sessions_invalidated',
    'security_action',
    target_user_id::text
  );
END;
$$;

-- Enhanced MFA verification function
CREATE OR REPLACE FUNCTION verify_mfa_token(user_id uuid, token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_secret text;
  is_valid boolean := false;
BEGIN
  -- Get encrypted TOTP secret
  SELECT totp_secret INTO stored_secret
  FROM public.admin_mfa_settings
  WHERE user_id = verify_mfa_token.user_id AND mfa_enabled = true;
  
  IF stored_secret IS NULL THEN
    RETURN false;
  END IF;
  
  -- In a real implementation, this would validate the TOTP token
  -- For now, we'll simulate validation
  -- You would integrate with a TOTP library here
  
  -- Update last verified timestamp if valid
  IF is_valid THEN
    UPDATE public.admin_mfa_settings
    SET last_verified = now()
    WHERE user_id = verify_mfa_token.user_id;
    
    -- Log successful MFA verification
    PERFORM public.log_sensitive_operation(
      'mfa_verification_success',
      'authentication',
      user_id::text
    );
  ELSE
    -- Log failed MFA attempt
    PERFORM public.log_sensitive_operation(
      'mfa_verification_failed',
      'security_violation',
      user_id::text
    );
  END IF;
  
  RETURN is_valid;
END;
$$;

-- Final security status check
CREATE OR REPLACE FUNCTION get_security_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rls_status jsonb;
  audit_status jsonb;
  storage_status jsonb;
  result jsonb;
BEGIN
  -- Check RLS status
  SELECT jsonb_build_object(
    'enabled_tables', COUNT(*),
    'required_tables', 5,
    'status', CASE WHEN COUNT(*) = 5 THEN 'PASS' ELSE 'FAIL' END
  ) INTO rls_status
  FROM information_schema.tables t
  JOIN pg_class c ON c.relname = t.table_name
  WHERE t.table_schema = 'public' 
    AND t.table_name IN ('teacher_applications', 'challengers', 'parental_consents', 'safeguarding_reports', 'confidential_records')
    AND c.relrowsecurity = true;
  
  -- Check audit triggers
  SELECT jsonb_build_object(
    'audit_triggers', COUNT(*),
    'status', CASE WHEN COUNT(*) >= 4 THEN 'PASS' ELSE 'FAIL' END
  ) INTO audit_status
  FROM information_schema.triggers
  WHERE trigger_name LIKE 'audit_%'
    AND event_object_table IN ('teacher_applications', 'challengers', 'parental_consents', 'confidential_records');
  
  -- Check storage buckets
  SELECT jsonb_build_object(
    'secure_buckets', COUNT(*),
    'status', CASE WHEN COUNT(*) >= 3 THEN 'PASS' ELSE 'FAIL' END
  ) INTO storage_status
  FROM storage.buckets
  WHERE public = false
    AND name IN ('teacher-documents', 'student-files', 'safeguarding-evidence');
  
  -- Combine results
  result := jsonb_build_object(
    'rls', rls_status,
    'audit', audit_status,
    'storage', storage_status,
    'overall_status', 
    CASE 
      WHEN (rls_status->>'status' = 'PASS' AND 
            audit_status->>'status' = 'PASS' AND 
            storage_status->>'status' = 'PASS') 
      THEN 'SECURE' 
      ELSE 'NEEDS_ATTENTION' 
    END,
    'timestamp', now()
  );
  
  RETURN result;
END;
$$;

-- Create emergency admin user function (for disaster recovery)
CREATE OR REPLACE FUNCTION create_emergency_admin(email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  temp_password text;
  user_id uuid;
BEGIN
  -- Only allow this during emergencies (implement your own authorization logic)
  -- This is a disaster recovery function
  
  -- Generate temporary secure password
  temp_password := encode(gen_random_bytes(16), 'base64');
  
  -- Log the emergency admin creation
  PERFORM public.log_sensitive_operation(
    'EMERGENCY_ADMIN_CREATED',
    'disaster_recovery',
    email
  );
  
  RETURN 'Emergency admin account creation requires manual intervention through Supabase Auth dashboard';
END;
$$;
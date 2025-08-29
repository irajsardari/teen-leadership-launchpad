-- Fix conflicting RLS policies - create single, clean admin-only policies

-- TEACHER APPLICATIONS: Clean up conflicting policies
DROP POLICY IF EXISTS "teacher_applications_admin_only_lockdown" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_deny_all" ON public.teacher_applications;

-- Single policy: Admin-only access
CREATE POLICY "teacher_applications_admin_only" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Block anonymous users
CREATE POLICY "teacher_applications_no_anon" ON public.teacher_applications
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- CHALLENGERS: Clean up conflicting policies  
DROP POLICY IF EXISTS "challengers_admin_only_lockdown" ON public.challengers;
DROP POLICY IF EXISTS "challengers_deny_all" ON public.challengers;

-- Single policy: Admin-only access
CREATE POLICY "challengers_admin_only" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Block anonymous users
CREATE POLICY "challengers_no_anon" ON public.challengers
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- PARENTAL CONSENTS: Clean up conflicting policies
DROP POLICY IF EXISTS "parental_consents_admin_only_lockdown" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_deny_all" ON public.parental_consents;

-- Single policy: Admin-only access
CREATE POLICY "parental_consents_admin_only" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Block anonymous users
CREATE POLICY "parental_consents_no_anon" ON public.parental_consents
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- SAFEGUARDING REPORTS: Clean up conflicting policies
DROP POLICY IF EXISTS "safeguarding_reports_admin_only_lockdown" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_deny_all" ON public.safeguarding_reports;

-- Single policy: Admin-only access
CREATE POLICY "safeguarding_reports_admin_only" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Block anonymous users
CREATE POLICY "safeguarding_reports_no_anon" ON public.safeguarding_reports
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- CONFIDENTIAL RECORDS: Clean up conflicting policies
DROP POLICY IF EXISTS "confidential_records_ultra_lockdown" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_deny_all" ON public.confidential_records;

-- Single policy: Admin-only with double verification
CREATE POLICY "confidential_records_admin_verified" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  );

-- Block anonymous users
CREATE POLICY "confidential_records_no_anon" ON public.confidential_records
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Fix all remaining functions with search path to eliminate warnings
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(p_input text, p_type text DEFAULT 'general'::text, p_max_length integer DEFAULT 1000)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sanitized text;
  is_valid boolean := true;
  errors text[] := ARRAY[]::text[];
BEGIN
  -- Length check
  IF length(p_input) > p_max_length THEN
    errors := array_append(errors, 'Input too long');
    is_valid := false;
  END IF;
  
  -- Basic sanitization
  sanitized := trim(p_input);
  
  -- Type-specific validation
  IF p_type = 'email' THEN
    IF NOT (sanitized ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
      errors := array_append(errors, 'Invalid email format');
      is_valid := false;
    END IF;
    sanitized := lower(sanitized);
  ELSIF p_type = 'phone' THEN
    sanitized := regexp_replace(sanitized, '[^\d+\-\(\)\s]', '', 'g');
    IF length(regexp_replace(sanitized, '[^\d]', '', 'g')) < 10 THEN
      errors := array_append(errors, 'Invalid phone number');
      is_valid := false;
    END IF;
  ELSIF p_type = 'name' THEN
    sanitized := regexp_replace(sanitized, '[<>"\''&]', '', 'g');
    IF length(sanitized) < 2 THEN
      errors := array_append(errors, 'Name too short');
      is_valid := false;
    END IF;
  ELSE
    -- General sanitization - remove potential XSS
    sanitized := regexp_replace(sanitized, '[<>"\''&]', '', 'g');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', is_valid,
    'sanitized', sanitized,
    'errors', errors
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_csrf_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  token text;
BEGIN
  -- Generate random token
  token := encode(gen_random_bytes(32), 'base64');
  
  -- Store token with expiry (valid for 1 hour)
  INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id
  ) VALUES (
    auth.uid(), 'csrf_token_generated', 'security', token
  );
  
  RETURN token;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_file_access(p_file_path text, p_action text DEFAULT 'download'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.log_sensitive_operation(
    p_action || '_file',
    'file',
    p_file_path
  );
END;
$$;
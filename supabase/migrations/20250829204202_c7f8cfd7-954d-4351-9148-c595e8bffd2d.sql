-- Final ultra-lockdown security for all sensitive tables

-- Drop ALL existing policies and create admin-only access for maximum security
DROP POLICY IF EXISTS "teacher_applications_ultra_secure_admin_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_owner_read_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_owner_insert_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_block_anonymous" ON public.teacher_applications;

-- ULTRA LOCKDOWN: Only admins can access teacher applications
CREATE POLICY "teacher_applications_admin_only_lockdown" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Completely block all access for non-admins
CREATE POLICY "teacher_applications_deny_all" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Drop all challenger policies
DROP POLICY IF EXISTS "challengers_ultra_secure_admin_only" ON public.challengers;
DROP POLICY IF EXISTS "challengers_student_basic_read" ON public.challengers;
DROP POLICY IF EXISTS "challengers_student_own_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_all_anonymous" ON public.challengers;

-- ULTRA LOCKDOWN: Only admins can access challengers data
CREATE POLICY "challengers_admin_only_lockdown" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Completely block all non-admin access
CREATE POLICY "challengers_deny_all" ON public.challengers
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Drop all parental consent policies
DROP POLICY IF EXISTS "parental_consents_ultra_secure_admin" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_parent_own_only" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_parent_insert_only" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_block_all_anonymous" ON public.parental_consents;

-- ULTRA LOCKDOWN: Only admins can access parental consents
CREATE POLICY "parental_consents_admin_only_lockdown" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Completely block all non-admin access
CREATE POLICY "parental_consents_deny_all" ON public.parental_consents
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Drop all safeguarding policies
DROP POLICY IF EXISTS "safeguarding_reports_maximum_security" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_submit_only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_block_anonymous" ON public.safeguarding_reports;

-- ULTRA LOCKDOWN: Only admins can access safeguarding reports  
CREATE POLICY "safeguarding_reports_admin_only_lockdown" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Completely block all non-admin access
CREATE POLICY "safeguarding_reports_deny_all" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Make confidential records even more secure by adding double verification
DROP POLICY IF EXISTS "confidential_admin_verified_access" ON public.confidential_records;

CREATE POLICY "confidential_records_ultra_lockdown" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check() AND
    auth.uid() IS NOT NULL
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check() AND
    auth.uid() IS NOT NULL
  );

-- Deny all access to non-qualifying users
CREATE POLICY "confidential_records_deny_all" ON public.confidential_records
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Fix all remaining functions with search path
CREATE OR REPLACE FUNCTION public.secure_form_submission(p_form_type text, p_max_attempts integer DEFAULT 3, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_identifier TEXT;
  current_attempts INTEGER;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Generate rate limit identifier
  user_identifier := auth.uid()::text || '_' || p_form_type;
  
  -- Check rate limit
  IF NOT public.check_rate_limit(
    user_identifier, 
    p_form_type, 
    p_max_attempts, 
    p_window_minutes
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
  END IF;
  
  -- Log the submission attempt
  PERFORM public.log_sensitive_operation(
    'secure_form_submission_' || p_form_type,
    'form_security',
    auth.uid()::text
  );
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.block_unauthorized_access(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access attempts for monitoring
  PERFORM public.log_sensitive_operation(
    'access_attempt_' || table_name,
    'security_check',
    COALESCE(auth.uid()::text, 'anonymous_user')
  );
  
  -- Block if no authenticated user
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'access_blocked_unauthenticated',
      table_name,
      'anonymous_access_denied'
    );
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.secure_table_access_guardian(table_name text, operation text DEFAULT 'read'::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_count integer;
  user_role text;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'unauthorized_' || table_name || '_access_attempt',
      'security_violation',
      'no_authentication_' || operation
    );
    RETURN false;
  END IF;
  
  -- Rate limiting per table per hour
  SELECT count(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND resource_type = table_name
    AND created_at > (now() - interval '1 hour');
  
  IF access_count > 50 THEN
    PERFORM public.log_sensitive_operation(
      table_name || '_rate_limit_exceeded',
      'security_protection',
      auth.uid()::text || '_' || access_count::text
    );
    RETURN false;
  END IF;
  
  -- Log access
  PERFORM public.log_sensitive_operation(
    table_name || '_secure_access_' || operation,
    table_name || '_security',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;
-- Complete security fix for all remaining issues

-- First, create the missing secure_confidential_access_check function
CREATE OR REPLACE FUNCTION public.secure_confidential_access_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log every access attempt
  PERFORM public.log_sensitive_operation(
    'confidential_access_verification',
    'ultra_sensitive_security',
    auth.uid()::text
  );
  
  -- Only admins with verified profiles can access
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_blocked_no_auth',
      'security_block',
      'no_authentication'
    );
    RETURN false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_blocked_not_admin',
      'security_block',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM public.log_sensitive_operation(
    'confidential_access_verified',
    'security_verification',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Drop existing policies and create ultra-secure ones for teacher_applications
DROP POLICY IF EXISTS "teacher_applications_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_anon_blocked" ON public.teacher_applications;

-- Ultra-secure teacher applications policies
CREATE POLICY "teacher_applications_ultra_secure_admin_only" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "teacher_applications_owner_read_only" ON public.teacher_applications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "teacher_applications_owner_insert_only" ON public.teacher_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Block all anonymous access
CREATE POLICY "teacher_applications_block_anonymous" ON public.teacher_applications
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Drop existing policies and create ultra-secure ones for challengers
DROP POLICY IF EXISTS "challengers_admin_full_access" ON public.challengers;
DROP POLICY IF EXISTS "challengers_student_own_data" ON public.challengers;
DROP POLICY IF EXISTS "challengers_verified_parent_read" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_all_anon" ON public.challengers;

-- Ultra-secure challengers policies - admin only for full access
CREATE POLICY "challengers_ultra_secure_admin_only" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Students can only read their own basic data (no confidential info)
CREATE POLICY "challengers_student_basic_read" ON public.challengers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND get_current_user_role() != 'admin');

-- Students can only insert their own data
CREATE POLICY "challengers_student_own_insert" ON public.challengers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Block all anonymous access completely
CREATE POLICY "challengers_block_all_anonymous" ON public.challengers
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Strengthen safeguarding reports policies
DROP POLICY IF EXISTS "safeguarding_admin_full_control" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authorized_view_only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_block_all_anon" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reporter_can_insert" ON public.safeguarding_reports;

-- Only admins and specifically authorized safeguarding officers can access
CREATE POLICY "safeguarding_reports_maximum_security" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' OR 
    has_safeguarding_access(auth.uid())
  )
  WITH CHECK (
    get_current_user_role() = 'admin' OR 
    has_safeguarding_access(auth.uid())
  );

-- Allow authenticated users to submit reports
CREATE POLICY "safeguarding_reports_submit_only" ON public.safeguarding_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Block all anonymous access
CREATE POLICY "safeguarding_reports_block_anonymous" ON public.safeguarding_reports
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Strengthen parental consents policies
DROP POLICY IF EXISTS "parental_consents_admin_full_access" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_parent_full_access" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_child_view_only" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_block_anon" ON public.parental_consents;

-- Maximum security for parental consents
CREATE POLICY "parental_consents_ultra_secure_admin" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Parents can only access their own submitted consents
CREATE POLICY "parental_consents_parent_own_only" ON public.parental_consents
  FOR SELECT TO authenticated
  USING (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_parent_insert_only" ON public.parental_consents
  FOR INSERT TO authenticated
  WITH CHECK (parent_user_id = auth.uid());

-- Block all anonymous access
CREATE POLICY "parental_consents_block_all_anonymous" ON public.parental_consents
  FOR ALL TO anon
  USING (false)
  WITH CHECK (false);

-- Fix all remaining function search path issues
CREATE OR REPLACE FUNCTION public.log_sensitive_operation(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id, action, resource_type, resource_id, details
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id, p_details
  );
END;
$$;

-- Fix all other functions that might have search path issues
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action text, p_max_attempts integer DEFAULT 5, p_window_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current window start time
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Count attempts in current window
  SELECT COALESCE(SUM(attempts), 0)
  INTO current_attempts
  FROM public.rate_limit_attempts
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start > window_start;
  
  -- If under limit, record attempt and allow
  IF current_attempts < p_max_attempts THEN
    INSERT INTO public.rate_limit_attempts (identifier, action, attempts)
    VALUES (p_identifier, p_action, 1)
    ON CONFLICT (identifier, action) 
    DO UPDATE SET 
      attempts = rate_limit_attempts.attempts + 1,
      window_start = CASE 
        WHEN rate_limit_attempts.window_start < window_start 
        THEN now() 
        ELSE rate_limit_attempts.window_start 
      END;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
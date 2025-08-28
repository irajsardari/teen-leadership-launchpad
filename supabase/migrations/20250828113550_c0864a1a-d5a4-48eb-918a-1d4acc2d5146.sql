-- Fix any remaining function search_path issues
-- Let's update ALL remaining functions that might be missing search_path

-- Check and fix all our security and utility functions
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

CREATE OR REPLACE FUNCTION public.validate_user_data_access(table_name text, record_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow access if user is authenticated and accessing their own data, or is admin
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'unauthorized_access_attempt',
      table_name,
      record_user_id::text
    );
    RETURN FALSE;
  END IF;
  
  IF auth.uid() = record_user_id OR public.get_current_user_role() = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  PERFORM public.log_sensitive_operation(
    'unauthorized_access_denied',
    table_name,
    record_user_id::text
  );
  
  RETURN FALSE;
END;
$$;
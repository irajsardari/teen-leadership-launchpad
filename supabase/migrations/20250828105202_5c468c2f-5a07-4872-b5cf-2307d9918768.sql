-- Fix security linter warnings for functions

-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.get_authenticated_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT p.role 
  FROM public.profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.secure_form_submission(
  p_form_type TEXT,
  p_max_attempts INTEGER DEFAULT 3,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Also fix existing functions that might have search path issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(role::text, 'challenger') 
  FROM public.profiles 
  WHERE id = auth.uid();
$$;

-- Log the security fix
SELECT public.log_sensitive_operation(
  'function_search_path_security_fixed',
  'security_hardening',
  'search_path_vulnerabilities_resolved'
);
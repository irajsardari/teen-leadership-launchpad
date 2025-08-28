-- Final comprehensive fix for remaining function search_path issues
-- Let's update the remaining security and validation functions

CREATE OR REPLACE FUNCTION public.verify_confidential_access(record_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role TEXT;
  access_granted BOOLEAN := false;
BEGIN
  -- Only check if user is authenticated first
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get current user role
  user_role := public.get_current_user_role();
  
  -- Only admins can access confidential records
  access_granted := (user_role = 'admin');
  
  -- Log access verification attempt (only for actual attempts)
  IF record_id IS NOT NULL THEN
    PERFORM public.log_sensitive_operation(
      CASE WHEN access_granted THEN 'confidential_access_granted' 
           ELSE 'confidential_access_denied' END,
      'confidential_verification',
      record_id::text
    );
  END IF;
  
  RETURN access_granted;
END;
$$;

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

CREATE OR REPLACE FUNCTION public.flag_parental_consent_required()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Flag profiles that might need parental consent (age < 18)
  UPDATE public.profiles 
  SET parental_consent_required = true
  WHERE age IS NOT NULL 
    AND age < 18 
    AND parental_consent_required = false;
    
  -- Log the update
  PERFORM public.log_sensitive_operation(
    'parental_consent_flags_updated',
    'profiles',
    'batch_update'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.confidential_access_control()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role text;
  is_admin boolean := false;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_blocked_unauthenticated',
      'security_block',
      'no_user_id'
    );
    RETURN false;
  END IF;
  
  -- Get and verify user role
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Check if user is admin
  is_admin := (current_user_role = 'admin');
  
  -- Log access control result
  PERFORM public.log_sensitive_operation(
    CASE WHEN is_admin THEN 'confidential_access_granted' 
         ELSE 'confidential_access_denied' END,
    'access_control',
    auth.uid()::text
  );
  
  -- Return access decision
  RETURN is_admin;
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
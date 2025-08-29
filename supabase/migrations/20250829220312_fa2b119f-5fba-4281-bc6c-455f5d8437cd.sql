-- Fix Security Linter Warnings
-- Address function search path and other security issues

-- Fix search_path for security functions created earlier
CREATE OR REPLACE FUNCTION public.verify_student_data_access_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_count INTEGER;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check student data access attempts in last hour
  SELECT COUNT(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND (action LIKE '%challenger%' OR action LIKE '%STUDENT%')
    AND created_at > now() - interval '1 hour';
  
  -- Limit to 10 student data accesses per hour
  IF access_count >= 10 THEN
    PERFORM public.log_sensitive_operation(
      'STUDENT_DATA_RATE_LIMIT_EXCEEDED',
      'security',
      auth.uid()::text
    );
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Fix search_path for other security functions
CREATE OR REPLACE FUNCTION public.get_challengers_secure()
RETURNS TABLE(
  id BIGINT,
  user_id UUID,
  age BIGINT,
  level TEXT,
  country TEXT,
  city TEXT,
  gender TEXT,
  referral_source TEXT,
  created_at TIMESTAMPTZ,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  guardian_email TEXT,
  confidential_info TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Must be admin
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'SECURITY: Only administrators can access student data';
  END IF;
  
  -- Rate limiting
  IF NOT public.verify_student_data_access_rate_limit() THEN
    RAISE EXCEPTION 'RATE_LIMIT: Too many student data access attempts';
  END IF;
  
  -- Enhanced verification
  IF NOT public.verify_confidential_access_enhanced(NULL, 'student_data_bulk_access') THEN
    RAISE EXCEPTION 'SECURITY: Enhanced verification failed';
  END IF;
  
  -- Log the access
  PERFORM public.log_sensitive_operation(
    'SECURE_STUDENT_DATA_BULK_ACCESS',
    'challengers',
    'bulk_access'
  );
  
  -- Return data
  RETURN QUERY
  SELECT 
    c.id, c.user_id, c.age, c.level, c.country, c.city, c.gender, 
    c.referral_source, c.created_at, c.full_name, c.email,
    c.phone_number, c.guardian_email, c.confidential_info
  FROM public.challengers c;
  
  -- Log successful access
  PERFORM public.log_admin_action(
    'student_data_bulk_retrieved',
    'challengers',
    'secure_function_access',
    jsonb_build_object('timestamp', now(), 'method', 'secure_function')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_challenger_secure(p_challenger_id BIGINT)
RETURNS TABLE(
  id BIGINT,
  user_id UUID,
  age BIGINT,
  level TEXT,
  country TEXT,
  city TEXT,
  gender TEXT,
  referral_source TEXT,
  created_at TIMESTAMPTZ,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  guardian_email TEXT,
  confidential_info TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Security checks
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'SECURITY: Admin access required';
  END IF;
  
  IF NOT public.verify_student_data_access_rate_limit() THEN
    RAISE EXCEPTION 'RATE_LIMIT: Access limit exceeded';
  END IF;
  
  -- Log access
  PERFORM public.log_sensitive_operation(
    'SECURE_SINGLE_STUDENT_ACCESS',
    'challengers',
    p_challenger_id::text
  );
  
  RETURN QUERY
  SELECT 
    c.id, c.user_id, c.age, c.level, c.country, c.city, c.gender,
    c.referral_source, c.created_at, c.full_name, c.email,
    c.phone_number, c.guardian_email, c.confidential_info
  FROM public.challengers c
  WHERE c.id = p_challenger_id;
END;
$$;
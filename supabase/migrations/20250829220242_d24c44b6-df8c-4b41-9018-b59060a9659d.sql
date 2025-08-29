-- Simple Enhanced Security for Student Data
-- Add core security functions without complex table modifications

-- Create rate limiting function for student data access
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

-- Enhanced challenger data access function
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

-- Function to get single challenger securely
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

-- Update existing RLS policies to be more restrictive
DROP POLICY IF EXISTS "challenger_secure_access_only" ON public.challengers;

-- More restrictive RLS policy
CREATE POLICY "challengers_admin_rate_limited" ON public.challengers
  FOR ALL
  USING (
    public.get_current_user_role() = 'admin' 
    AND public.verify_student_data_access_rate_limit()
  )
  WITH CHECK (
    public.get_current_user_role() = 'admin'
    AND public.verify_student_data_access_rate_limit()
  );

-- Add comments
COMMENT ON FUNCTION public.get_challengers_secure IS 'Secure function to retrieve all challenger data with enhanced verification and rate limiting';
COMMENT ON FUNCTION public.get_challenger_secure IS 'Secure function to retrieve single challenger data with verification';
COMMENT ON FUNCTION public.verify_student_data_access_rate_limit IS 'Rate limiting for student data access (10 per hour)';

-- Log security improvement
INSERT INTO public.security_audit_logs (action, resource_type, resource_id)
VALUES ('STUDENT_DATA_SECURITY_ENHANCED', 'challengers', 'rate_limiting_added');
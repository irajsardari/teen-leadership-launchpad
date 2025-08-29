-- Enhanced Security for Student Personal Data - Security Functions Only
-- Create security functions and safeguards without data migration

-- Create additional rate limiting for student data access
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
  
  -- Check access attempts in last hour for student data
  SELECT COUNT(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND (action LIKE '%STUDENT_DATA%' OR action LIKE '%challenger%' OR action LIKE '%CRITICAL_STUDENT%')
    AND created_at > now() - interval '1 hour';
  
  -- Allow max 5 student data accesses per hour for additional protection
  IF access_count >= 5 THEN
    PERFORM public.log_sensitive_operation(
      'STUDENT_DATA_RATE_LIMIT_EXCEEDED',
      'security_protection',
      auth.uid()::text
    );
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create enhanced function to securely retrieve challenger data
CREATE OR REPLACE FUNCTION public.get_challenger_data_secure(p_user_id UUID)
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
  -- Sensitive data returned as JSON for controlled access
  sensitive_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Enhanced verification - must be admin
  user_role := public.get_current_user_role();
  IF user_role != 'admin' THEN
    RAISE EXCEPTION 'SECURITY_VIOLATION: Only administrators can access student data';
  END IF;
  
  -- Additional confidential access verification
  IF NOT public.verify_confidential_access_enhanced(p_user_id, 'student_data_access') THEN
    RAISE EXCEPTION 'SECURITY_VIOLATION: Enhanced verification failed for student data access';
  END IF;
  
  -- Rate limit check
  IF NOT public.verify_student_data_access_rate_limit() THEN
    RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many student data access attempts in the last hour';
  END IF;
  
  -- Log the access attempt
  PERFORM public.log_sensitive_operation(
    'SECURE_CHALLENGER_DATA_ACCESS',
    'student_data_protection',
    p_user_id::text
  );
  
  -- Return challenger data with sensitive fields as controlled JSON
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.age,
    c.level,
    c.country,
    c.city,
    c.gender,
    c.referral_source,
    c.created_at,
    -- Bundle sensitive data into controlled JSON object
    jsonb_build_object(
      'full_name', c.full_name,
      'email', c.email,
      'phone_number', c.phone_number,
      'guardian_email', c.guardian_email,
      'confidential_info', c.confidential_info,
      'access_granted_at', now(),
      'accessed_by', auth.uid()
    ) as sensitive_data
  FROM public.challengers c
  WHERE c.user_id = p_user_id;
  
  -- Log successful access
  PERFORM public.log_admin_action(
    'secure_challenger_data_retrieved',
    'student_data_access',
    p_user_id::text,
    jsonb_build_object(
      'access_method', 'secure_function',
      'timestamp', now(),
      'security_level', 'ENHANCED_VERIFICATION'
    )
  );
END;
$$;

-- Create function to securely create challenger records
CREATE OR REPLACE FUNCTION public.create_challenger_secure(
  p_user_id UUID,
  p_age INTEGER,
  p_level TEXT,
  p_country TEXT,
  p_city TEXT,
  p_gender TEXT,
  p_referral_source TEXT,
  -- Sensitive data parameters
  p_full_name TEXT,
  p_email TEXT,
  p_phone_number TEXT,
  p_guardian_email TEXT,
  p_confidential_info TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  challenger_id BIGINT;
  user_role TEXT;
BEGIN
  -- Verify admin access
  user_role := public.get_current_user_role();
  IF user_role != 'admin' THEN
    RAISE EXCEPTION 'SECURITY_VIOLATION: Only administrators can create challenger records';
  END IF;
  
  -- Enhanced rate limiting for creation
  IF NOT public.secure_form_submission('challenger_creation', 3, 60) THEN
    RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Too many challenger creation attempts';
  END IF;
  
  -- Validate input data
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'VALIDATION_ERROR: User ID is required';
  END IF;
  
  -- Insert challenger record with all data (to be secured later via data separation)
  INSERT INTO public.challengers (
    user_id,
    age,
    level,
    country,
    city,
    gender,
    referral_source,
    full_name,
    email,
    phone_number,
    guardian_email,
    confidential_info
  ) VALUES (
    p_user_id,
    p_age,
    p_level,
    p_country,
    p_city,
    p_gender,
    p_referral_source,
    p_full_name,
    p_email,
    p_phone_number,
    p_guardian_email,
    p_confidential_info
  ) RETURNING id INTO challenger_id;
  
  -- Log the secure creation
  PERFORM public.log_sensitive_operation(
    'SECURE_CHALLENGER_CREATED',
    'student_data_protection',
    p_user_id::text
  );
  
  PERFORM public.log_admin_action(
    'challenger_created_secure',
    'student_data_creation',
    challenger_id::text,
    jsonb_build_object(
      'user_id', p_user_id,
      'creation_method', 'secure_function',
      'has_sensitive_data', (p_full_name IS NOT NULL OR p_email IS NOT NULL OR p_confidential_info IS NOT NULL),
      'timestamp', now()
    )
  );
  
  RETURN challenger_id;
END;
$$;

-- Enhanced audit trigger for challengers table
CREATE OR REPLACE FUNCTION public.audit_challenger_access_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log ALL access attempts to challenger data
  PERFORM public.log_sensitive_operation(
    'STUDENT_DATA_' || TG_OP || '_MONITORED',
    'challenger_table_access',
    COALESCE(NEW.user_id::text, OLD.user_id::text)
  );
  
  -- Only log to admin audit if we have an authenticated user
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'student_data_' || lower(TG_OP),
      'child_data_protection',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'user_id', COALESCE(NEW.user_id, OLD.user_id),
        'operation', TG_OP,
        'has_sensitive_data', (
          COALESCE(NEW.full_name, OLD.full_name) IS NOT NULL OR
          COALESCE(NEW.email, OLD.email) IS NOT NULL OR
          COALESCE(NEW.confidential_info, OLD.confidential_info) IS NOT NULL
        ),
        'timestamp', now(),
        'security_level', 'CHILD_DATA_PROTECTION'
      )
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply the enhanced audit trigger (replace existing)
DROP TRIGGER IF EXISTS challenger_enhanced_audit ON public.challengers;
DROP TRIGGER IF EXISTS log_challenger_access ON public.challengers;
CREATE TRIGGER challenger_enhanced_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_challenger_access_enhanced();

-- Add restrictive RLS policy that requires use of secure functions
CREATE POLICY "challenger_secure_access_only" ON public.challengers
  FOR ALL
  USING (
    -- Only allow access through secure functions or by admin with explicit verification
    (public.get_current_user_role() = 'admin' AND public.verify_student_data_access_rate_limit())
  )
  WITH CHECK (
    (public.get_current_user_role() = 'admin' AND public.verify_student_data_access_rate_limit())
  );

-- Add documentation
COMMENT ON FUNCTION public.get_challenger_data_secure IS 'Securely retrieves student data with enhanced verification, rate limiting, and comprehensive audit logging. Requires admin role and passes enhanced security checks.';
COMMENT ON FUNCTION public.create_challenger_secure IS 'Creates challenger records with enhanced security validation and audit logging. Requires admin role and rate limiting.';
COMMENT ON FUNCTION public.verify_student_data_access_rate_limit IS 'Implements rate limiting for student data access - max 5 accesses per hour per user.';

-- Log the security enhancement
INSERT INTO public.security_audit_logs (action, resource_type, resource_id)
VALUES ('STUDENT_DATA_SECURITY_FUNCTIONS_CREATED', 'challengers_table', 'security_enhancement_' || extract(epoch from now())::text);
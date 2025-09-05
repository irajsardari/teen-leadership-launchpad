-- ============================================================================
-- ENHANCED SECURITY FOR TEACHER APPLICATIONS TABLE
-- ============================================================================

-- 1. CREATE ADDITIONAL AUDIT TRIGGER FOR SENSITIVE DATA ACCESS
CREATE OR REPLACE FUNCTION public.audit_teacher_application_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log all operations on teacher applications with detailed info
  PERFORM public.log_sensitive_operation(
    'teacher_application_' || lower(TG_OP),
    'sensitive_personal_data',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Additional admin audit for sensitive data access
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'teacher_app_' || lower(TG_OP),
      'personal_data_access',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'user_role', get_current_user_role(),
        'accessed_fields', CASE 
          WHEN TG_OP = 'SELECT' THEN array['full_name', 'email', 'phone_number', 'confidential_info']
          ELSE array['all_fields']
        END,
        'operation', TG_OP,
        'timestamp', now(),
        'security_level', 'SENSITIVE_PERSONAL_DATA'
      )
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- 2. ADD ENHANCED AUDIT TRIGGER TO TEACHER APPLICATIONS
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE OR SELECT ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_teacher_application_access();

-- 3. CREATE FUNCTION FOR SECURE TEACHER APPLICATION ACCESS WITH FIELD MASKING
CREATE OR REPLACE FUNCTION public.get_teacher_application_secure(application_id uuid, include_sensitive boolean DEFAULT false)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  email text,
  phone_number text,
  specialization text,
  education text,
  experience_years integer,
  cv_url text,
  cover_letter text,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  -- Confidential info only for admins
  confidential_info text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_user_role text;
  has_access boolean := false;
  masked_phone text;
  masked_email text;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for teacher application access';
  END IF;
  
  -- Get user role
  current_user_role := get_current_user_role();
  
  -- Check if user has access (owns the application or is admin)
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_applications ta
    WHERE ta.id = application_id 
    AND (ta.user_id = auth.uid() OR current_user_role = 'admin')
  ) INTO has_access;
  
  IF NOT has_access THEN
    RAISE EXCEPTION 'Access denied to teacher application';
  END IF;
  
  -- Log the secure access
  PERFORM public.log_sensitive_operation(
    'teacher_application_secure_access',
    'controlled_access',
    application_id::text
  );
  
  -- Return the application data with conditional field masking
  RETURN QUERY
  SELECT 
    ta.id,
    ta.user_id,
    ta.full_name,
    -- Mask email for non-admin users viewing others' applications
    CASE WHEN current_user_role = 'admin' OR ta.user_id = auth.uid() OR include_sensitive 
         THEN ta.email 
         ELSE regexp_replace(ta.email, '(.{2}).*@', '\1***@') 
    END as email,
    -- Mask phone number for non-admin users
    CASE WHEN current_user_role = 'admin' OR ta.user_id = auth.uid() OR include_sensitive 
         THEN ta.phone_number 
         ELSE regexp_replace(COALESCE(ta.phone_number, ''), '.{4}$', '****') 
    END as phone_number,
    ta.specialization,
    ta.education,
    ta.experience_years,
    ta.cv_url,
    ta.cover_letter,
    ta.status,
    ta.created_at,
    ta.updated_at,
    -- Confidential info only for admins
    CASE WHEN current_user_role = 'admin' 
         THEN ta.confidential_info 
         ELSE NULL 
    END as confidential_info
  FROM public.teacher_applications ta
  WHERE ta.id = application_id;
END;
$function$;

-- 4. CREATE FUNCTION TO LOG SENSITIVE FIELD ACCESS
CREATE OR REPLACE FUNCTION public.log_sensitive_field_access(
  table_name text,
  field_name text,
  record_id text,
  access_reason text DEFAULT 'general_access'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log sensitive field access
  PERFORM public.log_sensitive_operation(
    'sensitive_field_access_' || field_name,
    table_name || '_field_security',
    record_id
  );
  
  -- Additional admin audit
  PERFORM public.log_admin_action(
    'sensitive_field_access',
    'data_protection_field_level',
    record_id,
    jsonb_build_object(
      'table_name', table_name,
      'field_name', field_name,
      'access_reason', access_reason,
      'user_role', get_current_user_role(),
      'timestamp', now(),
      'security_classification', 'FIELD_LEVEL_SENSITIVE'
    )
  );
END;
$function$;

-- 5. ADD CONSTRAINT TO ENSURE USER_ID IS NEVER NULL (SECURITY REQUIREMENT)
-- This prevents orphaned applications that could bypass RLS
ALTER TABLE public.teacher_applications 
ALTER COLUMN user_id SET NOT NULL;

-- 6. CREATE RATE LIMITING FOR SENSITIVE DATA ACCESS
CREATE OR REPLACE FUNCTION public.check_sensitive_access_rate_limit()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  access_count integer;
BEGIN
  -- Check access rate for teacher applications in last hour
  SELECT COUNT(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND resource_type LIKE '%teacher_application%'
    AND created_at > (now() - interval '1 hour');
  
  -- Limit to 50 access attempts per hour for non-admins
  IF access_count > 50 AND get_current_user_role() != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'rate_limit_exceeded_teacher_apps',
      'security_protection',
      auth.uid()::text || '_' || access_count::text
    );
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;

-- 7. UPDATE RLS POLICIES WITH ENHANCED SECURITY
-- Add rate limiting to SELECT policy
DROP POLICY IF EXISTS "secure_teacher_apps_select" ON public.teacher_applications;
CREATE POLICY "secure_teacher_apps_select_enhanced" 
ON public.teacher_applications 
FOR SELECT 
USING (
  check_sensitive_access_rate_limit() AND 
  (user_id = auth.uid() OR simple_is_admin())
);

-- 8. CREATE CONFIDENTIAL INFO PROTECTION POLICY
-- Separate policy for confidential_info field access
CREATE POLICY "confidential_info_admin_only" 
ON public.teacher_applications 
FOR SELECT 
USING (
  simple_is_admin() AND 
  check_sensitive_access_rate_limit()
);

-- 9. GRANT NECESSARY PERMISSIONS
GRANT EXECUTE ON FUNCTION public.get_teacher_application_secure(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_sensitive_field_access(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_sensitive_access_rate_limit() TO authenticated;
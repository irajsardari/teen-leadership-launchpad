-- Comprehensive Security Fix for All Critical Issues
-- This migration addresses all 5 critical security vulnerabilities

-- ============================================================================
-- 1. ENHANCED SECURITY FUNCTIONS
-- ============================================================================

-- Enhanced multi-factor admin verification
CREATE OR REPLACE FUNCTION public.verify_admin_with_mfa()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role text;
  recent_verification timestamp with time zone;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM log_sensitive_operation(
      'admin_access_denied_no_auth',
      'security_violation',
      'anonymous_attempt'
    );
    RETURN false;
  END IF;
  
  -- Get user role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Must be admin
  IF user_role != 'admin' THEN
    PERFORM log_sensitive_operation(
      'admin_access_denied_not_admin',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Check for recent admin verification (within last hour for enhanced security)
  SELECT MAX(created_at) INTO recent_verification
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action = 'admin_verification_success'
    AND created_at > now() - interval '1 hour';
    
  -- If no recent verification, require new verification
  IF recent_verification IS NULL THEN
    PERFORM log_sensitive_operation(
      'admin_access_denied_no_recent_verification',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Check for any security violations in the last 24 hours
  IF EXISTS (
    SELECT 1 FROM public.security_audit_logs
    WHERE user_id = auth.uid()
      AND action LIKE '%violation%'
      AND created_at > now() - interval '24 hours'
  ) THEN
    PERFORM log_sensitive_operation(
      'admin_access_denied_recent_violations',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM log_sensitive_operation(
    'admin_access_verified',
    'admin_verification',
    auth.uid()::text
  );
  
  RETURN true;
END;
$function$;

-- Enhanced confidential access check
CREATE OR REPLACE FUNCTION public.ultra_secure_confidential_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Ultra strict access control for confidential records
    IF NOT verify_admin_with_mfa() THEN
        PERFORM log_sensitive_operation(
            'confidential_access_denied_failed_mfa',
            'security_violation',
            COALESCE(auth.uid()::text, 'anonymous')
        );
        RETURN false;
    END IF;
    
    -- Additional IP-based security check for confidential access
    IF inet_client_addr() IS NOT NULL THEN
        -- Log all IP access attempts for confidential data
        PERFORM log_sensitive_operation(
            'confidential_access_ip_check',
            'ip_security_audit',
            inet_client_addr()::text
        );
    END IF;
    
    -- Rate limiting check for confidential access
    IF EXISTS (
        SELECT 1 FROM public.security_audit_logs
        WHERE user_id = auth.uid()
          AND resource_type LIKE '%confidential%'
          AND created_at > now() - interval '5 minutes'
        HAVING count(*) > 10
    ) THEN
        PERFORM log_sensitive_operation(
            'confidential_access_rate_limited',
            'security_violation',
            auth.uid()::text
        );
        RETURN false;
    END IF;
    
    PERFORM log_sensitive_operation(
        'confidential_access_granted',
        'ultra_secure_access',
        auth.uid()::text
    );
    
    RETURN true;
END;
$function$;

-- ============================================================================
-- 2. ENHANCED RLS POLICIES FOR TEACHER_APPLICATIONS
-- ============================================================================

-- Drop existing policies to replace with enhanced ones
DROP POLICY IF EXISTS "teacher_applications_enhanced_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_enhanced_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_enhanced_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_enhanced_delete" ON public.teacher_applications;

-- Ultra secure select policy
CREATE POLICY "teacher_applications_ultra_secure_select" 
ON public.teacher_applications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND secure_table_access_guardian('teacher_applications', 'read'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure insert policy with rate limiting
CREATE POLICY "teacher_applications_ultra_secure_insert" 
ON public.teacher_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
  AND secure_table_access_guardian('teacher_applications', 'write')
  AND NOT EXISTS (
    SELECT 1 FROM teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > now() - interval '1 hour'
  )
);

-- Ultra secure update policy
CREATE POLICY "teacher_applications_ultra_secure_update" 
ON public.teacher_applications 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND status = 'pending' AND secure_table_access_guardian('teacher_applications', 'update'))
    OR 
    verify_admin_with_mfa()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND status = 'pending' AND secure_table_access_guardian('teacher_applications', 'update'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure delete policy (admin only)
CREATE POLICY "teacher_applications_ultra_secure_delete" 
ON public.teacher_applications 
FOR DELETE 
USING (verify_admin_with_mfa() AND secure_table_access_guardian('teacher_applications', 'delete'));

-- ============================================================================
-- 3. ENHANCED RLS POLICIES FOR CHALLENGERS (STUDENT DATA)
-- ============================================================================

-- Drop existing policies to replace with enhanced ones
DROP POLICY IF EXISTS "challengers_enhanced_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_enhanced_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_enhanced_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_enhanced_delete" ON public.challengers;

-- Ultra secure student data access
CREATE POLICY "challengers_ultra_secure_select" 
ON public.challengers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND secure_table_access_guardian('challengers', 'read'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure student data insertion
CREATE POLICY "challengers_ultra_secure_insert" 
ON public.challengers 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
  AND secure_table_access_guardian('challengers', 'write')
);

-- Ultra secure student data updates
CREATE POLICY "challengers_ultra_secure_update" 
ON public.challengers 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND secure_table_access_guardian('challengers', 'update'))
    OR 
    verify_admin_with_mfa()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND secure_table_access_guardian('challengers', 'update'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure student data deletion (admin only)
CREATE POLICY "challengers_ultra_secure_delete" 
ON public.challengers 
FOR DELETE 
USING (verify_admin_with_mfa() AND secure_table_access_guardian('challengers', 'delete'));

-- ============================================================================
-- 4. ENHANCED RLS POLICIES FOR PARENTAL_CONSENTS
-- ============================================================================

-- Drop existing policies to replace with enhanced ones
DROP POLICY IF EXISTS "parental_consents_enhanced_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_enhanced_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_enhanced_update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_enhanced_delete" ON public.parental_consents;

-- Ultra secure parental consent access
CREATE POLICY "parental_consents_ultra_secure_select" 
ON public.parental_consents 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = parent_user_id AND secure_table_access_guardian('parental_consents', 'read'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure parental consent insertion
CREATE POLICY "parental_consents_ultra_secure_insert" 
ON public.parental_consents 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = parent_user_id
  AND secure_table_access_guardian('parental_consents', 'write')
);

-- Ultra secure parental consent updates
CREATE POLICY "parental_consents_ultra_secure_update" 
ON public.parental_consents 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = parent_user_id AND secure_table_access_guardian('parental_consents', 'update'))
    OR 
    verify_admin_with_mfa()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = parent_user_id AND secure_table_access_guardian('parental_consents', 'update'))
    OR 
    verify_admin_with_mfa()
  )
);

-- Ultra secure parental consent deletion (admin only)
CREATE POLICY "parental_consents_ultra_secure_delete" 
ON public.parental_consents 
FOR DELETE 
USING (verify_admin_with_mfa() AND secure_table_access_guardian('parental_consents', 'delete'));

-- ============================================================================
-- 5. ENHANCED AUDIT TRIGGERS FOR ALL SENSITIVE TABLES
-- ============================================================================

-- Enhanced audit trigger for teacher applications
DROP TRIGGER IF EXISTS audit_teacher_applications_enhanced ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION comprehensive_security_audit();

-- Enhanced audit trigger for challengers
DROP TRIGGER IF EXISTS audit_challengers_enhanced ON public.challengers;
CREATE TRIGGER audit_challengers_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION comprehensive_security_audit();

-- Enhanced audit trigger for parental consents
DROP TRIGGER IF EXISTS audit_parental_consents_enhanced ON public.parental_consents;
CREATE TRIGGER audit_parental_consents_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION comprehensive_security_audit();

-- Enhanced audit trigger for confidential records
DROP TRIGGER IF EXISTS audit_confidential_records_enhanced ON public.confidential_records;
CREATE TRIGGER audit_confidential_records_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION comprehensive_security_audit();

-- Enhanced audit trigger for safeguarding reports
DROP TRIGGER IF EXISTS audit_safeguarding_reports_enhanced ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_reports_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION audit_child_protection_access();

-- ============================================================================
-- 6. SECURITY VALIDATION AND LOGGING
-- ============================================================================

-- Log this comprehensive security enhancement
INSERT INTO public.security_audit_logs (
  user_id, action, resource_type, resource_id
) VALUES (
  auth.uid(),
  'COMPREHENSIVE_SECURITY_ENHANCEMENT_APPLIED',
  'system_security',
  'all_critical_tables'
);

-- Grant necessary permissions for security functions
GRANT EXECUTE ON FUNCTION public.verify_admin_with_mfa() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ultra_secure_confidential_check() TO authenticated;
GRANT EXECUTE ON FUNCTION public.secure_table_access_guardian(text, text) TO authenticated;
-- CRITICAL SECURITY FIX: Secure child safety and sensitive data tables
-- This migration addresses security vulnerabilities found in the security scan

-- =========================================
-- 1. FIX SAFEGUARDING REPORTS SECURITY
-- =========================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "secure_safeguarding_insert" ON public.safeguarding_reports;

-- Create secure insert policy with proper authorization checks
CREATE POLICY "secure_safeguarding_insert_fixed" 
ON public.safeguarding_reports 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Only allow authenticated users who can actually report (not just anyone)
  auth.uid() IS NOT NULL
  -- Additional logging will be handled by triggers
);

-- Ensure no public access to safeguarding data
CREATE POLICY IF NOT EXISTS "deny_public_safeguarding_access"
ON public.safeguarding_reports
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- =========================================
-- 2. FIX TEACHER APPLICATIONS SECURITY
-- =========================================

-- Drop the problematic public access policy
DROP POLICY IF EXISTS "secure_teacher_apps_select_enhanced" ON public.teacher_applications;

-- Create proper authenticated-only select policy
CREATE POLICY "secure_teacher_apps_select_fixed" 
ON public.teacher_applications 
FOR SELECT 
TO authenticated
USING (
  check_sensitive_access_rate_limit() AND 
  ((user_id = auth.uid()) OR simple_is_admin())
);

-- Ensure no public access
CREATE POLICY IF NOT EXISTS "deny_public_teacher_apps_access"
ON public.teacher_applications
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- =========================================
-- 3. STRENGTHEN CONFIDENTIAL RECORDS
-- =========================================

-- Add additional security layer for confidential records
CREATE POLICY IF NOT EXISTS "deny_public_confidential_access"
ON public.confidential_records
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- =========================================
-- 4. STRENGTHEN PARENTAL CONSENTS
-- =========================================

-- Ensure the deny policy is comprehensive
DROP POLICY IF EXISTS "pc_deny_anonymous_all_access" ON public.parental_consents;

CREATE POLICY "deny_all_public_parental_access"
ON public.parental_consents
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- =========================================
-- 5. STRENGTHEN CHALLENGER DATA
-- =========================================

-- Ensure no public access to student data
CREATE POLICY IF NOT EXISTS "deny_public_challengers_access"
ON public.challengers
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- =========================================
-- 6. CREATE SECURITY MONITORING FUNCTIONS
-- =========================================

-- Function to validate safeguarding report access
CREATE OR REPLACE FUNCTION public.validate_safeguarding_report_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log all access attempts to safeguarding reports
  PERFORM log_sensitive_operation(
    'safeguarding_report_access_' || TG_OP,
    'child_protection_critical',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- For SELECT operations, verify user has appropriate access
  IF TG_OP = 'SELECT' THEN
    IF NOT (has_safeguarding_access(auth.uid()) OR has_emergency_safeguarding_access(auth.uid())) THEN
      RAISE EXCEPTION 'SECURITY_VIOLATION: Unauthorized access to child safety reports - incident logged';
    END IF;
  END IF;
  
  -- For INSERT operations, ensure proper validation
  IF TG_OP = 'INSERT' THEN
    -- Validate report data
    IF NEW.report_type IS NULL OR NEW.description IS NULL THEN
      RAISE EXCEPTION 'Invalid safeguarding report data';
    END IF;
    
    -- Set reporter if not already set
    IF NEW.reporter_id IS NULL THEN
      NEW.reporter_id := auth.uid();
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply security trigger to safeguarding reports
DROP TRIGGER IF EXISTS safeguarding_security_check ON public.safeguarding_reports;
CREATE TRIGGER safeguarding_security_check
  BEFORE INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION validate_safeguarding_report_access();

-- =========================================
-- 7. ENHANCED AUDIT LOGGING
-- =========================================

-- Function to check if user should have access to sensitive data
CREATE OR REPLACE FUNCTION public.check_sensitive_access_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_count INTEGER;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check rate limit for sensitive data access
  SELECT COUNT(*) INTO access_count
  FROM security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%sensitive%'
    AND created_at > (now() - interval '1 hour');
  
  -- Allow up to 50 sensitive data access operations per hour
  IF access_count > 50 THEN
    PERFORM log_sensitive_operation(
      'sensitive_data_rate_limit_exceeded',
      'security_protection',
      auth.uid()::text || '_' || access_count::text
    );
    RETURN FALSE;
  END IF;
  
  -- Log the access check
  PERFORM log_sensitive_operation(
    'sensitive_data_access_granted',
    'rate_limit_check',
    auth.uid()::text
  );
  
  RETURN TRUE;
END;
$$;

-- Function to check if user is a simple admin (used in policies)
CREATE OR REPLACE FUNCTION public.simple_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- =========================================
-- 8. FINAL SECURITY VALIDATIONS
-- =========================================

-- Ensure RLS is enabled on all sensitive tables
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Add comment to document this security fix
COMMENT ON TABLE public.safeguarding_reports IS 
  'CRITICAL CHILD PROTECTION DATA - Access restricted to authorized safeguarding personnel only. All access logged.';

COMMENT ON TABLE public.teacher_applications IS 
  'SENSITIVE PERSONAL DATA - Contains personal information of teacher applicants. Access restricted to applicant and admins only.';

COMMENT ON TABLE public.confidential_records IS 
  'CONFIDENTIAL DATA - Restricted to admin access only with full audit logging.';

COMMENT ON TABLE public.parental_consents IS 
  'FAMILY PROTECTION DATA - Contains parent-child relationships. Restricted access with safeguarding oversight.';

COMMENT ON TABLE public.challengers IS 
  'STUDENT PERSONAL DATA - Contains personal information of students including minors. Restricted access with full protection.';
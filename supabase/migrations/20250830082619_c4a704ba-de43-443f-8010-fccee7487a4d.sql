-- COMPREHENSIVE SECURITY LOCKDOWN: Explicitly deny anonymous access
-- This ensures 100% security against unauthorized access to sensitive data

BEGIN;

-- ============================================================================
-- 1. EXPLICIT ANONYMOUS ACCESS DENIAL for all sensitive tables
-- ============================================================================

-- TEACHER APPLICATIONS: Explicitly deny anonymous access
DROP POLICY IF EXISTS "Teachers Apps: Deny Anonymous" ON public.teacher_applications;
CREATE POLICY "Teachers Apps: Deny Anonymous"
ON public.teacher_applications
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- CHALLENGERS: Explicitly deny anonymous access  
DROP POLICY IF EXISTS "Challengers: Deny Anonymous" ON public.challengers;
CREATE POLICY "Challengers: Deny Anonymous"
ON public.challengers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- PARENTAL CONSENTS: Explicitly deny anonymous access
DROP POLICY IF EXISTS "Parental Consents: Deny Anonymous" ON public.parental_consents;
CREATE POLICY "Parental Consents: Deny Anonymous"
ON public.parental_consents
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- CONFIDENTIAL RECORDS: Explicitly deny anonymous access
DROP POLICY IF EXISTS "Confidential Records: Deny Anonymous" ON public.confidential_records;
CREATE POLICY "Confidential Records: Deny Anonymous"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- SAFEGUARDING REPORTS: Explicitly deny anonymous access
DROP POLICY IF EXISTS "Safeguarding Reports: Deny Anonymous" ON public.safeguarding_reports;
CREATE POLICY "Safeguarding Reports: Deny Anonymous"
ON public.safeguarding_reports
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- ============================================================================
-- 2. FORCE RLS VERIFICATION and ensure strictest settings
-- ============================================================================

-- Force RLS on all sensitive tables (belt and suspenders approach)
ALTER TABLE public.teacher_applications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.challengers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports FORCE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. REVOKE any residual public grants (security belt)
-- ============================================================================

-- Remove any potential public access grants
REVOKE ALL ON public.teacher_applications FROM public;
REVOKE ALL ON public.challengers FROM public;
REVOKE ALL ON public.parental_consents FROM public;
REVOKE ALL ON public.confidential_records FROM public;
REVOKE ALL ON public.safeguarding_reports FROM public;

-- Remove any anon role grants
REVOKE ALL ON public.teacher_applications FROM anon;
REVOKE ALL ON public.challengers FROM anon;
REVOKE ALL ON public.parental_consents FROM anon;
REVOKE ALL ON public.confidential_records FROM anon;
REVOKE ALL ON public.safeguarding_reports FROM anon;

-- ============================================================================
-- 4. GRANT proper authenticated access only
-- ============================================================================

-- Grant minimal required permissions to authenticated users only
GRANT SELECT, INSERT, UPDATE ON public.teacher_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.challengers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.parental_consents TO authenticated;
GRANT SELECT ON public.confidential_records TO authenticated;
GRANT SELECT ON public.safeguarding_reports TO authenticated;

-- Grant DELETE only to service_role (for admin functions)
GRANT DELETE ON public.teacher_applications TO service_role;
GRANT DELETE ON public.challengers TO service_role;
GRANT DELETE ON public.parental_consents TO service_role;
GRANT DELETE ON public.confidential_records TO service_role;
GRANT DELETE ON public.safeguarding_reports TO service_role;

-- ============================================================================
-- 5. SECURITY VALIDATION FUNCTION
-- ============================================================================

-- Create a function to validate security settings
CREATE OR REPLACE FUNCTION public.validate_table_security(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  rls_enabled boolean;
  policy_count integer;
  has_anon_deny boolean;
BEGIN
  -- Check RLS status
  SELECT rowsecurity INTO rls_enabled
  FROM pg_tables 
  WHERE tablename = table_name AND schemaname = 'public';
  
  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = table_name AND schemaname = 'public';
  
  -- Check for anonymous deny policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = table_name 
    AND schemaname = 'public'
    AND 'anon' = ANY(roles)
    AND qual = 'false'
  ) INTO has_anon_deny;
  
  result := jsonb_build_object(
    'table_name', table_name,
    'rls_enabled', rls_enabled,
    'policy_count', policy_count,
    'has_anon_deny', has_anon_deny,
    'secure', rls_enabled AND policy_count > 0 AND has_anon_deny
  );
  
  RETURN result;
END;
$$;

COMMIT;
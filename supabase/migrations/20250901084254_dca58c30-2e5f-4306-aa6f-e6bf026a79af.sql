-- SIMPLIFIED AND BULLETPROOF SECURITY FOR ALL SENSITIVE TABLES
-- This replaces complex security functions with simple, robust RLS policies

-- ============================================================================
-- 1. DROP ALL COMPLEX POLICIES TO START FRESH
-- ============================================================================

-- Drop all existing complex policies for challengers (student data)
DROP POLICY IF EXISTS "challengers_maximum_security_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_delete" ON public.challengers;
DROP POLICY IF EXISTS "challengers_supplementary_protection" ON public.challengers;

-- Drop all existing complex policies for teacher_applications
DROP POLICY IF EXISTS "teacher_applications_maximum_security_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_maximum_security_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_maximum_security_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_maximum_security_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_supplementary_protection" ON public.teacher_applications;

-- Drop all existing complex policies for parental_consents
DROP POLICY IF EXISTS "parental_consents_maximum_security_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_maximum_security_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_maximum_security_update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_maximum_security_delete" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_supplementary_protection" ON public.parental_consents;

-- Drop all existing complex policies for confidential_records
DROP POLICY IF EXISTS "confidential_records_maximum_security_access" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_supplementary_protection" ON public.confidential_records;

-- Drop all existing complex policies for safeguarding_reports
DROP POLICY IF EXISTS "safeguarding_reports_maximum_security_access" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_supplementary_protection" ON public.safeguarding_reports;

-- ============================================================================
-- 2. CREATE SIMPLE, BULLETPROOF SECURITY FUNCTION
-- ============================================================================

-- Simple admin check function - no complex dependencies
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  );
$function$;

-- ============================================================================
-- 3. BULLETPROOF RLS POLICIES - SIMPLE AND SECURE
-- ============================================================================

-- CHALLENGERS TABLE - Student Data Protection
-- These policies are simple, direct, and cannot be bypassed
CREATE POLICY "challengers_bulletproof_select" 
ON public.challengers FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR 
    is_admin_user()
  )
);

CREATE POLICY "challengers_bulletproof_insert" 
ON public.challengers FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "challengers_bulletproof_update" 
ON public.challengers FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR 
    is_admin_user()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR 
    is_admin_user()
  )
);

CREATE POLICY "challengers_bulletproof_delete" 
ON public.challengers FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

-- TEACHER APPLICATIONS TABLE - Applicant Data Protection
CREATE POLICY "teacher_applications_bulletproof_select" 
ON public.teacher_applications FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR 
    is_admin_user()
  )
);

CREATE POLICY "teacher_applications_bulletproof_insert" 
ON public.teacher_applications FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
  -- Rate limiting: no more than 1 application per 24 hours
  AND NOT EXISTS (
    SELECT 1 FROM teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > now() - interval '24 hours'
  )
);

CREATE POLICY "teacher_applications_bulletproof_update" 
ON public.teacher_applications FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND status = 'pending') 
    OR 
    is_admin_user()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    (auth.uid() = user_id AND status = 'pending') 
    OR 
    is_admin_user()
  )
);

CREATE POLICY "teacher_applications_bulletproof_delete" 
ON public.teacher_applications FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

-- PARENTAL CONSENTS TABLE - Family Data Protection
CREATE POLICY "parental_consents_bulletproof_select" 
ON public.parental_consents FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = parent_user_id 
    OR 
    auth.uid() = child_user_id
    OR 
    is_admin_user()
  )
);

CREATE POLICY "parental_consents_bulletproof_insert" 
ON public.parental_consents FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = parent_user_id
);

CREATE POLICY "parental_consents_bulletproof_update" 
ON public.parental_consents FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = parent_user_id 
    OR 
    is_admin_user()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = parent_user_id 
    OR 
    is_admin_user()
  )
);

CREATE POLICY "parental_consents_bulletproof_delete" 
ON public.parental_consents FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

-- CONFIDENTIAL RECORDS TABLE - Maximum Security
CREATE POLICY "confidential_records_bulletproof_select" 
ON public.confidential_records FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

CREATE POLICY "confidential_records_bulletproof_insert" 
ON public.confidential_records FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

CREATE POLICY "confidential_records_bulletproof_update" 
ON public.confidential_records FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

CREATE POLICY "confidential_records_bulletproof_delete" 
ON public.confidential_records FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
);

-- SAFEGUARDING REPORTS TABLE - Child Protection
-- Requires admin role AND safeguarding access
CREATE POLICY "safeguarding_reports_bulletproof_select" 
ON public.safeguarding_reports FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
  AND has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_reports_bulletproof_insert" 
ON public.safeguarding_reports FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
  AND has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_reports_bulletproof_update" 
ON public.safeguarding_reports FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
  AND has_safeguarding_access(auth.uid())
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
  AND has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_reports_bulletproof_delete" 
ON public.safeguarding_reports FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND is_admin_user()
  AND has_safeguarding_access(auth.uid())
);

-- ============================================================================
-- 4. ABSOLUTE ANONYMOUS DENIAL - NO EXCEPTIONS
-- ============================================================================

-- Ensure complete blocking of anonymous access
CREATE POLICY "challengers_block_anonymous_absolutely" 
ON public.challengers FOR ALL TO anon 
USING (false);

CREATE POLICY "teacher_applications_block_anonymous_absolutely" 
ON public.teacher_applications FOR ALL TO anon 
USING (false);

CREATE POLICY "parental_consents_block_anonymous_absolutely" 
ON public.parental_consents FOR ALL TO anon 
USING (false);

CREATE POLICY "confidential_records_block_anonymous_absolutely" 
ON public.confidential_records FOR ALL TO anon 
USING (false);

CREATE POLICY "safeguarding_reports_block_anonymous_absolutely" 
ON public.safeguarding_reports FOR ALL TO anon 
USING (false);

-- ============================================================================
-- 5. GRANT PERMISSIONS AND LOG SECURITY ENHANCEMENT
-- ============================================================================

-- Grant execute permission for the simple admin function
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- Log this bulletproof security implementation
INSERT INTO public.security_audit_logs (
  user_id, action, resource_type, resource_id
) VALUES (
  auth.uid(),
  'BULLETPROOF_SECURITY_IMPLEMENTED',
  'simplified_robust_protection',
  'all_sensitive_tables_secured_simply'
);
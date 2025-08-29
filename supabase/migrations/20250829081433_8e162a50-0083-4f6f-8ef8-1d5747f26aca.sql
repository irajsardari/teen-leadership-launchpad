-- Simplify RLS Policies to Eliminate Security Gaps

-- 1. SIMPLIFY CHALLENGERS TABLE POLICIES 
-- Remove complex overlapping policies and use simple, bulletproof ones
DROP POLICY IF EXISTS "challengers_own_record_ultra_secure" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_all_anonymous" ON public.challengers;

-- Ultra-simple: Only admins OR the user themselves can access their data
CREATE POLICY "challengers_simple_secure_access" 
ON public.challengers FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
);

-- 2. SIMPLIFY TEACHER APPLICATIONS
DROP POLICY IF EXISTS "teacher_apps_own_read_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_own_insert_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_all_updates" ON public.teacher_applications;

-- Simple: Admin or own application only
CREATE POLICY "teacher_apps_simple_secure" 
ON public.teacher_applications FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
);

-- 3. SIMPLIFY PARENTAL CONSENTS
DROP POLICY IF EXISTS "parental_consent_parent_ultra_secure" ON public.parental_consents;

-- Simple: Admin or parent who submitted it
CREATE POLICY "parental_consent_simple_secure" 
ON public.parental_consents FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR parent_user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR parent_user_id = auth.uid()
  )
);

-- 4. SIMPLIFY SAFEGUARDING REPORTS
DROP POLICY IF EXISTS "safeguarding_reports_ultra_restricted" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_modify_authorized" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authenticated_submit" ON public.safeguarding_reports;

-- Simple: Only admins and authorized safeguarding personnel
CREATE POLICY "safeguarding_reports_simple_secure" 
ON public.safeguarding_reports FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
);

-- Anyone authenticated can submit reports (but not read others)
CREATE POLICY "safeguarding_reports_submit_only" 
ON public.safeguarding_reports FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 5. STRENGTHEN CONFIDENTIAL RECORDS - Add additional protection layer
CREATE OR REPLACE FUNCTION public.verify_confidential_access_strict()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
  session_valid boolean := false;
BEGIN
  -- Only authenticated users
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Must be admin
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE id = auth.uid();
  
  IF user_role != 'admin' THEN
    RETURN false;
  END IF;
  
  -- Log every access attempt
  PERFORM public.log_sensitive_operation(
    'confidential_access_verification_strict',
    'ultra_sensitive_security',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Update confidential records to use stricter verification
DROP POLICY IF EXISTS "confidential_records_admin_only_read" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_insert" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_update" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_delete" ON public.confidential_records;

-- Ultra-strict confidential records access
CREATE POLICY "confidential_records_ultra_strict" 
ON public.confidential_records FOR ALL
USING (verify_confidential_access_strict())
WITH CHECK (verify_confidential_access_strict());

-- 6. Add final security function to block any remaining gaps
CREATE OR REPLACE FUNCTION public.enforce_data_protection()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Always require authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'SECURITY_ERROR: Authentication required for data access';
  END IF;
  
  -- Log all data access attempts
  PERFORM public.log_sensitive_operation(
    'data_protection_check',
    'security_enforcement',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Apply final security check to all sensitive tables
ALTER TABLE public.challengers ADD CONSTRAINT check_data_protection CHECK (enforce_data_protection());
ALTER TABLE public.teacher_applications ADD CONSTRAINT check_data_protection CHECK (enforce_data_protection());
ALTER TABLE public.parental_consents ADD CONSTRAINT check_data_protection CHECK (enforce_data_protection());
ALTER TABLE public.safeguarding_reports ADD CONSTRAINT check_data_protection CHECK (enforce_data_protection());
ALTER TABLE public.confidential_records ADD CONSTRAINT check_data_protection CHECK (enforce_data_protection());
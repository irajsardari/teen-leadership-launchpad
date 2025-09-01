-- COMPLETE SECURITY OVERHAUL - BULLETPROOF SIMPLE POLICIES
-- This removes ALL existing policies and creates simple, robust ones

-- ============================================================================
-- 1. COMPLETELY REMOVE ALL EXISTING POLICIES
-- ============================================================================

-- Remove ALL policies from challengers table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'challengers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.challengers', pol.policyname);
    END LOOP;
END $$;

-- Remove ALL policies from teacher_applications table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'teacher_applications' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.teacher_applications', pol.policyname);
    END LOOP;
END $$;

-- Remove ALL policies from parental_consents table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'parental_consents' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.parental_consents', pol.policyname);
    END LOOP;
END $$;

-- Remove ALL policies from confidential_records table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'confidential_records' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.confidential_records', pol.policyname);
    END LOOP;
END $$;

-- Remove ALL policies from safeguarding_reports table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'safeguarding_reports' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.safeguarding_reports', pol.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- 2. SIMPLE ADMIN CHECK FUNCTION (NO COMPLEX DEPENDENCIES)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.simple_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$function$;

-- ============================================================================
-- 3. BULLETPROOF SECURITY POLICIES - CLEAN AND SIMPLE
-- ============================================================================

-- CHALLENGERS (STUDENT DATA) - BULLETPROOF PROTECTION
CREATE POLICY "secure_challengers_select" 
ON public.challengers FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR simple_is_admin());

CREATE POLICY "secure_challengers_insert" 
ON public.challengers FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "secure_challengers_update" 
ON public.challengers FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() OR simple_is_admin())
WITH CHECK (user_id = auth.uid() OR simple_is_admin());

CREATE POLICY "secure_challengers_delete" 
ON public.challengers FOR DELETE 
TO authenticated
USING (simple_is_admin());

-- Block ALL anonymous access to challengers
CREATE POLICY "block_anon_challengers" 
ON public.challengers FOR ALL 
TO anon 
USING (false);

-- TEACHER APPLICATIONS - BULLETPROOF PROTECTION
CREATE POLICY "secure_teacher_apps_select" 
ON public.teacher_applications FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR simple_is_admin());

CREATE POLICY "secure_teacher_apps_insert" 
ON public.teacher_applications FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND NOT EXISTS (
    SELECT 1 FROM teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > now() - interval '24 hours'
  )
);

CREATE POLICY "secure_teacher_apps_update" 
ON public.teacher_applications FOR UPDATE 
TO authenticated
USING (
  (user_id = auth.uid() AND status = 'pending') 
  OR simple_is_admin()
)
WITH CHECK (
  (user_id = auth.uid() AND status = 'pending') 
  OR simple_is_admin()
);

CREATE POLICY "secure_teacher_apps_delete" 
ON public.teacher_applications FOR DELETE 
TO authenticated
USING (simple_is_admin());

-- Block ALL anonymous access to teacher applications
CREATE POLICY "block_anon_teacher_apps" 
ON public.teacher_applications FOR ALL 
TO anon 
USING (false);

-- PARENTAL CONSENTS - BULLETPROOF PROTECTION
CREATE POLICY "secure_parental_consents_select" 
ON public.parental_consents FOR SELECT 
TO authenticated
USING (
  parent_user_id = auth.uid() 
  OR child_user_id = auth.uid() 
  OR simple_is_admin()
);

CREATE POLICY "secure_parental_consents_insert" 
ON public.parental_consents FOR INSERT 
TO authenticated
WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "secure_parental_consents_update" 
ON public.parental_consents FOR UPDATE 
TO authenticated
USING (parent_user_id = auth.uid() OR simple_is_admin())
WITH CHECK (parent_user_id = auth.uid() OR simple_is_admin());

CREATE POLICY "secure_parental_consents_delete" 
ON public.parental_consents FOR DELETE 
TO authenticated
USING (simple_is_admin());

-- Block ALL anonymous access to parental consents
CREATE POLICY "block_anon_parental_consents" 
ON public.parental_consents FOR ALL 
TO anon 
USING (false);

-- CONFIDENTIAL RECORDS - ADMIN ONLY
CREATE POLICY "secure_confidential_select" 
ON public.confidential_records FOR SELECT 
TO authenticated
USING (simple_is_admin());

CREATE POLICY "secure_confidential_insert" 
ON public.confidential_records FOR INSERT 
TO authenticated
WITH CHECK (simple_is_admin());

CREATE POLICY "secure_confidential_update" 
ON public.confidential_records FOR UPDATE 
TO authenticated
USING (simple_is_admin())
WITH CHECK (simple_is_admin());

CREATE POLICY "secure_confidential_delete" 
ON public.confidential_records FOR DELETE 
TO authenticated
USING (simple_is_admin());

-- Block ALL anonymous access to confidential records
CREATE POLICY "block_anon_confidential" 
ON public.confidential_records FOR ALL 
TO anon 
USING (false);

-- SAFEGUARDING REPORTS - ADMIN WITH SAFEGUARDING ACCESS
CREATE POLICY "secure_safeguarding_select" 
ON public.safeguarding_reports FOR SELECT 
TO authenticated
USING (simple_is_admin() AND has_safeguarding_access(auth.uid()));

CREATE POLICY "secure_safeguarding_insert" 
ON public.safeguarding_reports FOR INSERT 
TO authenticated
WITH CHECK (simple_is_admin() AND has_safeguarding_access(auth.uid()));

CREATE POLICY "secure_safeguarding_update" 
ON public.safeguarding_reports FOR UPDATE 
TO authenticated
USING (simple_is_admin() AND has_safeguarding_access(auth.uid()))
WITH CHECK (simple_is_admin() AND has_safeguarding_access(auth.uid()));

CREATE POLICY "secure_safeguarding_delete" 
ON public.safeguarding_reports FOR DELETE 
TO authenticated
USING (simple_is_admin() AND has_safeguarding_access(auth.uid()));

-- Block ALL anonymous access to safeguarding reports
CREATE POLICY "block_anon_safeguarding" 
ON public.safeguarding_reports FOR ALL 
TO anon 
USING (false);

-- ============================================================================
-- 4. GRANT PERMISSIONS AND LOG SUCCESS
-- ============================================================================

-- Grant execute permission for the simple admin function
GRANT EXECUTE ON FUNCTION public.simple_is_admin() TO authenticated;

-- Log successful security overhaul
INSERT INTO public.security_audit_logs (
  user_id, action, resource_type, resource_id
) VALUES (
  auth.uid(),
  'SECURITY_OVERHAUL_COMPLETE_BULLETPROOF',
  'simplified_security_policies',
  'all_sensitive_tables_now_bulletproof'
);
-- URGENT SECURITY PATCH: Comprehensive RLS Implementation
-- Fix Teacher Application Data, Student Personal Information, Confidential Records, 
-- Parental Consent Information, and Child Safety Reports security vulnerabilities

BEGIN;

-- 1) Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) TEACHER APPLICATIONS - Secure teacher application data
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS ta_admin_all ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_select ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_insert ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_update ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_delete ON public.teacher_applications;

-- Admin full access
CREATE POLICY ta_admin_all
ON public.teacher_applications
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Applicants: only their own record
CREATE POLICY ta_owner_select
ON public.teacher_applications
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY ta_owner_insert
ON public.teacher_applications
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY ta_owner_update
ON public.teacher_applications
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Delete restricted to admins only
CREATE POLICY ta_owner_delete
ON public.teacher_applications
FOR DELETE
USING (public.is_admin());

-- 3) CHALLENGERS - Secure student personal data  
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS ch_admin_all ON public.challengers;
DROP POLICY IF EXISTS ch_owner_select ON public.challengers;
DROP POLICY IF EXISTS ch_owner_insert ON public.challengers;
DROP POLICY IF EXISTS ch_owner_update ON public.challengers;
DROP POLICY IF EXISTS ch_owner_delete ON public.challengers;

-- Admin full access
CREATE POLICY ch_admin_all
ON public.challengers
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Students: only their own record
CREATE POLICY ch_owner_select
ON public.challengers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY ch_owner_insert
ON public.challengers
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY ch_owner_update
ON public.challengers
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Delete: admins only
CREATE POLICY ch_owner_delete
ON public.challengers
FOR DELETE
USING (public.is_admin());

-- 4) CONFIDENTIAL RECORDS - Admin-only access (already secure but ensuring consistency)
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS cr_admin_only ON public.confidential_records;

-- Admins only - extremely sensitive data
CREATE POLICY cr_admin_only
ON public.confidential_records
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5) PARENTAL CONSENTS - Secure family consent data
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS pc_admin_all ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_select ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_insert ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_update ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_delete ON public.parental_consents;

-- Admin full access
CREATE POLICY pc_admin_all
ON public.parental_consents
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Parents: read & write their own consent (using parent_user_id column)
CREATE POLICY pc_parent_select
ON public.parental_consents
FOR SELECT
USING (parent_user_id = auth.uid());

CREATE POLICY pc_parent_insert
ON public.parental_consents
FOR INSERT
WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY pc_parent_update
ON public.parental_consents
FOR UPDATE
USING (parent_user_id = auth.uid())
WITH CHECK (parent_user_id = auth.uid());

-- Delete: admins only
CREATE POLICY pc_parent_delete
ON public.parental_consents
FOR DELETE
USING (public.is_admin());

-- 6) SAFEGUARDING REPORTS - Admin-only access (extremely sensitive child safety data)
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS sr_admin_only ON public.safeguarding_reports;

-- Admins only - child safety reports are extremely sensitive
CREATE POLICY sr_admin_only
ON public.safeguarding_reports
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7) Additional security for audit logs and sensitive tables
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Ensure security audit logs are admin-only
DROP POLICY IF EXISTS sal_admin_only ON public.security_audit_logs;
CREATE POLICY sal_admin_only
ON public.security_audit_logs
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Ensure admin audit logs are admin-only
DROP POLICY IF EXISTS aal_admin_only ON public.admin_audit_log;
CREATE POLICY aal_admin_only
ON public.admin_audit_log  
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

COMMIT;
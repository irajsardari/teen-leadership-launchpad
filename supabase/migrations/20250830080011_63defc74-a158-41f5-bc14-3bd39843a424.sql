-- Fix Pack v1 - Security Hardening: RLS & Policies

-- 1.1 Enable RLS on all sensitive tables
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- 1.2 Helper functions for admin & safeguarding claims
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE sql 
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.is_safeguarding()
RETURNS boolean 
LANGUAGE sql 
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT role = 'safeguarding' FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- 1.3 Policies for teacher_applications
DROP POLICY IF EXISTS ta_insert ON public.teacher_applications;
CREATE POLICY ta_insert ON public.teacher_applications
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS ta_select_owner ON public.teacher_applications;
CREATE POLICY ta_select_owner ON public.teacher_applications
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ta_admin_read ON public.teacher_applications;
CREATE POLICY ta_admin_read ON public.teacher_applications
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS ta_admin_write ON public.teacher_applications;
CREATE POLICY ta_admin_write ON public.teacher_applications
FOR UPDATE, DELETE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Remove old permissive policies
DROP POLICY IF EXISTS users_manage_own_teacher_applications ON public.teacher_applications;

-- Policies for challengers (student PII)
DROP POLICY IF EXISTS ch_insert ON public.challengers;
CREATE POLICY ch_insert ON public.challengers
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS ch_owner_read ON public.challengers;
CREATE POLICY ch_owner_read ON public.challengers
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ch_owner_update ON public.challengers;
CREATE POLICY ch_owner_update ON public.challengers
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS ch_admin_read ON public.challengers;
CREATE POLICY ch_admin_read ON public.challengers
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS ch_admin_write ON public.challengers;
CREATE POLICY ch_admin_write ON public.challengers
FOR UPDATE, DELETE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Remove old permissive policies
DROP POLICY IF EXISTS users_manage_own_challenger_data ON public.challengers;

-- Policies for confidential_records (staff-only)
DROP POLICY IF EXISTS cr_admin_read ON public.confidential_records;
CREATE POLICY cr_admin_read ON public.confidential_records
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS cr_admin_write ON public.confidential_records;
CREATE POLICY cr_admin_write ON public.confidential_records
FOR INSERT, UPDATE, DELETE TO authenticated
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Remove old permissive policies
DROP POLICY IF EXISTS verified_admin_confidential_access ON public.confidential_records;

-- Policies for parental_consents (admin only for now)
DROP POLICY IF EXISTS pc_admin_read ON public.parental_consents;
CREATE POLICY pc_admin_read ON public.parental_consents
FOR SELECT TO authenticated 
USING (public.is_admin());

DROP POLICY IF EXISTS pc_admin_write ON public.parental_consents;
CREATE POLICY pc_admin_write ON public.parental_consents
FOR INSERT, UPDATE, DELETE TO authenticated
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- Remove old permissive policies
DROP POLICY IF EXISTS parental_consent_management ON public.parental_consents;

-- Policies for safeguarding_reports (safeguarding officer + admin)
DROP POLICY IF EXISTS sg_admin_read ON public.safeguarding_reports;
CREATE POLICY sg_admin_read ON public.safeguarding_reports
FOR SELECT TO authenticated 
USING (public.is_admin() OR public.is_safeguarding());

DROP POLICY IF EXISTS sg_admin_write ON public.safeguarding_reports;
CREATE POLICY sg_admin_write ON public.safeguarding_reports
FOR INSERT, UPDATE, DELETE TO authenticated
USING (public.is_admin() OR public.is_safeguarding())
WITH CHECK (public.is_admin() OR public.is_safeguarding());

-- Remove old permissive policies
DROP POLICY IF EXISTS verified_safeguarding_access ON public.safeguarding_reports;

-- Clean up any anonymous access policies that might exist
DROP POLICY IF EXISTS anon_read_teacher_applications ON public.teacher_applications;
DROP POLICY IF EXISTS anon_read_challengers ON public.challengers;
DROP POLICY IF EXISTS anon_read_confidential_records ON public.confidential_records;
DROP POLICY IF EXISTS anon_read_parental_consents ON public.parental_consents;
DROP POLICY IF EXISTS anon_read_safeguarding_reports ON public.safeguarding_reports;
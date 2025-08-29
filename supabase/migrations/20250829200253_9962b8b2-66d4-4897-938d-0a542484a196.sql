-- FINAL SECURITY FIX: Clean up all conflicting policies and create minimal secure policies

-- Step 1: Drop ALL existing policies on sensitive tables
DROP POLICY IF EXISTS "Teacher applications: owners and admins can view" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher applications: authenticated users can insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher applications: owners and admins can update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_admin_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_admin_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_admin_read" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_admin_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_block_anonymous" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_block_unauthorized_modifications" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_block_unauthorized_users" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_owner_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_owner_read" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_owner_update" ON public.teacher_applications;

-- Clean up challenger policies
DROP POLICY IF EXISTS "Challengers: students can view own records" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: students can insert own records" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: students and admins can update records" ON public.challengers;
DROP POLICY IF EXISTS "challengers_admin_secure" ON public.challengers;
DROP POLICY IF EXISTS "challengers_anonymous_deny" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_access" ON public.challengers;
DROP POLICY IF EXISTS "challengers_self_access_authenticated" ON public.challengers;

-- Clean up safeguarding policies
DROP POLICY IF EXISTS "Safeguarding reports: authorized staff only can view" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding reports: authorized staff can insert" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding reports: authorized staff can update" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_admin_delete_only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_allow_report_submission" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authorized_read" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authorized_update" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_block_all_anonymous" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_block_unauthorized_modifications" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_block_unauthorized_users" ON public.safeguarding_reports;

-- Clean up parental consent policies
DROP POLICY IF EXISTS "Parental consents: parents and children can view" ON public.parental_consents;
DROP POLICY IF EXISTS "Parental consents: parents can insert" ON public.parental_consents;
DROP POLICY IF EXISTS "Parental consents: parents and admins can update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_admin_secure" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_anonymous_deny" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_parent" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_access" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_student" ON public.parental_consents;

-- Step 2: Create MINIMAL, SECURE policies only

-- TEACHER APPLICATIONS: Only owner and admins can access
CREATE POLICY "teacher_apps_secure_select" ON public.teacher_applications 
FOR SELECT TO authenticated 
USING (user_id = auth.uid() OR get_current_user_role() = 'admin');

CREATE POLICY "teacher_apps_secure_insert" ON public.teacher_applications 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "teacher_apps_secure_update" ON public.teacher_applications 
FOR UPDATE TO authenticated 
USING (user_id = auth.uid() OR get_current_user_role() = 'admin')
WITH CHECK (user_id = auth.uid() OR get_current_user_role() = 'admin');

CREATE POLICY "teacher_apps_secure_delete" ON public.teacher_applications 
FOR DELETE TO authenticated 
USING (get_current_user_role() = 'admin');

-- CHALLENGERS: Only student, their parents, and admins
CREATE POLICY "challengers_secure_select" ON public.challengers 
FOR SELECT TO authenticated 
USING (
  user_id = auth.uid() OR 
  get_current_user_role() = 'admin' OR
  EXISTS (SELECT 1 FROM public.parental_consents pc WHERE pc.child_user_id = user_id AND pc.parent_user_id = auth.uid())
);

CREATE POLICY "challengers_secure_insert" ON public.challengers 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "challengers_secure_update" ON public.challengers 
FOR UPDATE TO authenticated 
USING (user_id = auth.uid() OR get_current_user_role() = 'admin')
WITH CHECK (user_id = auth.uid() OR get_current_user_role() = 'admin');

-- SAFEGUARDING REPORTS: Only authorized staff and admins
CREATE POLICY "safeguarding_secure_select" ON public.safeguarding_reports 
FOR SELECT TO authenticated 
USING (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid()));

CREATE POLICY "safeguarding_secure_insert" ON public.safeguarding_reports 
FOR INSERT TO authenticated 
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "safeguarding_secure_update" ON public.safeguarding_reports 
FOR UPDATE TO authenticated 
USING (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid()))
WITH CHECK (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid()));

-- PARENTAL CONSENTS: Only family members and admins
CREATE POLICY "parental_consents_secure_select" ON public.parental_consents 
FOR SELECT TO authenticated 
USING (
  parent_user_id = auth.uid() OR 
  child_user_id = auth.uid() OR 
  get_current_user_role() = 'admin'
);

CREATE POLICY "parental_consents_secure_insert" ON public.parental_consents 
FOR INSERT TO authenticated 
WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_secure_update" ON public.parental_consents 
FOR UPDATE TO authenticated 
USING (parent_user_id = auth.uid() OR get_current_user_role() = 'admin')
WITH CHECK (parent_user_id = auth.uid() OR get_current_user_role() = 'admin');
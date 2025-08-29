-- Final security fix - change all public role policies to authenticated only
-- This prevents ANY anonymous access through existing policies

-- Fix challengers table policies
DROP POLICY IF EXISTS "challengers_admin_access" ON public.challengers;
CREATE POLICY "challengers_admin_access"
ON public.challengers
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "challengers_self_access" ON public.challengers;
CREATE POLICY "challengers_self_access"
ON public.challengers
FOR SELECT
TO authenticated
USING (
  (user_id = auth.uid()) 
  OR (EXISTS ( 
    SELECT 1 FROM parent_student_links psl
    WHERE psl.student_user_id = challengers.user_id 
    AND psl.parent_user_id = auth.uid()
  ))
);

-- Fix parental_consents table policies  
DROP POLICY IF EXISTS "parental_consents_admin" ON public.parental_consents;
CREATE POLICY "parental_consents_admin"
ON public.parental_consents
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "parental_consents_parent" ON public.parental_consents;
CREATE POLICY "parental_consents_parent"
ON public.parental_consents
FOR ALL
TO authenticated
USING (parent_user_id = auth.uid())
WITH CHECK (parent_user_id = auth.uid());

DROP POLICY IF EXISTS "parental_consents_student" ON public.parental_consents;
CREATE POLICY "parental_consents_student"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (child_user_id = auth.uid());

-- Fix teacher_applications table policies
DROP POLICY IF EXISTS "teacher_applications_admin" ON public.teacher_applications;
CREATE POLICY "teacher_applications_admin"
ON public.teacher_applications
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "teacher_applications_insert" ON public.teacher_applications;
CREATE POLICY "teacher_applications_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "teacher_applications_own" ON public.teacher_applications;
CREATE POLICY "teacher_applications_own"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Log this final security hardening
SELECT public.log_sensitive_operation(
    'final_security_hardening_complete',
    'system_security', 
    'all_policies_authenticated_only'
);
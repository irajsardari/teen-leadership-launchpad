-- SECURITY FIX: Enhanced Teacher Applications Data Protection
-- Add restrictive policies to ensure no unauthorized access to teacher application data

-- Drop existing permissive policies to replace with restrictive ones
DROP POLICY IF EXISTS "teacher_applications_admin_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_anonymous_deny" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_insert_own" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_select_own" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_update_own" ON public.teacher_applications;

-- Create restrictive policies that explicitly deny unauthorized access

-- Anonymous users cannot access any teacher applications
CREATE POLICY "teacher_applications_deny_anonymous"
ON public.teacher_applications
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Non-admin users cannot access applications they don't own
CREATE POLICY "teacher_applications_restrict_unauthorized"
ON public.teacher_applications  
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
    user_id = auth.uid() OR 
    get_current_user_role() = 'admin'
);

-- Permissive policies for authorized access

-- Admins can access all applications
CREATE POLICY "teacher_applications_admin_access"
ON public.teacher_applications
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Users can insert their own applications
CREATE POLICY "teacher_applications_user_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can view their own applications
CREATE POLICY "teacher_applications_user_select"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own applications
CREATE POLICY "teacher_applications_user_update"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add constraint to ensure user_id is always set for new applications
ALTER TABLE public.teacher_applications 
ADD CONSTRAINT teacher_applications_user_id_required 
CHECK (user_id IS NOT NULL);
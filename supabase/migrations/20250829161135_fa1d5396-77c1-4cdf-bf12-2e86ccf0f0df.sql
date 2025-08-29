-- SECURITY FIX: Complete Teacher Applications Protection
-- Add missing DELETE policy and strengthen security

-- Add missing DELETE policy for users (their own applications)
CREATE POLICY "teacher_applications_user_delete"
ON public.teacher_applications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Add DELETE policy for admins  
CREATE POLICY "teacher_applications_admin_delete"
ON public.teacher_applications
FOR DELETE
TO authenticated
USING (get_current_user_role() = 'admin');

-- Strengthen the restrictive policy to be more explicit
DROP POLICY IF EXISTS "teacher_applications_restrict_unauthorized" ON public.teacher_applications;

CREATE POLICY "teacher_applications_block_cross_user_access"
ON public.teacher_applications
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
    -- Only allow access if user owns the record OR is an admin
    user_id = auth.uid() OR 
    get_current_user_role() = 'admin'
)
WITH CHECK (
    -- For INSERT/UPDATE operations, ensure user_id matches authenticated user or is admin
    user_id = auth.uid() OR 
    get_current_user_role() = 'admin'
);
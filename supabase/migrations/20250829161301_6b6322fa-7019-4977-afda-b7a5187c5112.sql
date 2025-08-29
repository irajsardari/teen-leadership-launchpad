-- SECURITY FIX: Maximum Teacher Applications Data Protection (Fixed Syntax)
-- Create ultra-restrictive policies to eliminate any potential unauthorized access

-- Drop existing policies to rebuild with maximum security
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'teacher_applications'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.teacher_applications', policy_name);
    END LOOP;
END $$;

-- RESTRICTIVE POLICIES (These must ALL be satisfied for access)

-- Block ALL anonymous access completely
CREATE POLICY "teacher_applications_block_anonymous"
ON public.teacher_applications
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block non-admin users from accessing applications they don't own
CREATE POLICY "teacher_applications_block_unauthorized_users"
ON public.teacher_applications
AS RESTRICTIVE  
FOR ALL
TO authenticated
USING (
    -- Only allow if user is admin OR owns this specific application
    (get_current_user_role() = 'admin'::text) OR 
    (user_id = auth.uid())
);

-- Block any non-admin from modifying applications they don't own
CREATE POLICY "teacher_applications_block_unauthorized_modifications"
ON public.teacher_applications
AS RESTRICTIVE
FOR ALL
TO authenticated  
WITH CHECK (
    -- Only allow modifications if user is admin OR owns this specific application
    (get_current_user_role() = 'admin'::text) OR 
    (user_id = auth.uid())
);

-- PERMISSIVE POLICIES (These grant specific access)

-- Admins can read all applications
CREATE POLICY "teacher_applications_admin_read"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (get_current_user_role() = 'admin'::text);

-- Admins can insert applications
CREATE POLICY "teacher_applications_admin_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (get_current_user_role() = 'admin'::text);

-- Admins can update applications  
CREATE POLICY "teacher_applications_admin_update"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (get_current_user_role() = 'admin'::text)
WITH CHECK (get_current_user_role() = 'admin'::text);

-- Admins can delete applications
CREATE POLICY "teacher_applications_admin_delete"
ON public.teacher_applications
FOR DELETE
TO authenticated
USING (get_current_user_role() = 'admin'::text);

-- Users can read ONLY their own applications
CREATE POLICY "teacher_applications_owner_read"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert applications for themselves only
CREATE POLICY "teacher_applications_owner_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update ONLY their own applications
CREATE POLICY "teacher_applications_owner_update"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
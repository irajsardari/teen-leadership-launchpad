-- SECURITY FIX: Enhanced Teacher Applications Data Protection (Fixed)
-- Add restrictive policies to ensure no unauthorized access to teacher application data

-- Drop ALL existing policies with proper error handling
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

-- Ensure user_id constraint exists (ignore if already exists)
DO $$
BEGIN
    ALTER TABLE public.teacher_applications 
    ADD CONSTRAINT teacher_applications_user_id_required 
    CHECK (user_id IS NOT NULL);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
-- SECURITY FIX: Teacher Applications Data Protection
-- Fix overlapping policies that could allow unauthorized access to teacher application data

-- Step 1: Remove all existing policies on teacher_applications table
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

-- Step 2: Create secure, non-overlapping policies

-- Explicit denial for anonymous users
CREATE POLICY "teacher_applications_anonymous_deny"
ON public.teacher_applications
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Admin access to all teacher applications
CREATE POLICY "teacher_applications_admin_secure"
ON public.teacher_applications
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Users can only insert their own applications
CREATE POLICY "teacher_applications_insert_own"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can only view their own applications
CREATE POLICY "teacher_applications_select_own"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can only update their own applications (if needed)
CREATE POLICY "teacher_applications_update_own"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Log this security fix
PERFORM public.log_sensitive_operation(
    'teacher_applications_security_hardened',
    'security_fix',
    'policy_cleanup_and_protection'
);
-- Fix critical security vulnerability in teacher_applications RLS policies
-- Change from PERMISSIVE to RESTRICTIVE policies to prevent unauthorized access

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Teacher Apps: Admin access only" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Strict own access only" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Strict own updates only" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Strict user submission only" ON public.teacher_applications;

-- Create RESTRICTIVE policies that properly enforce access control
-- Only authenticated users can access, and only their own records or admins can access all

-- Admin full access policy (restrictive)
CREATE POLICY "Teacher Apps: Admin full access"
  ON public.teacher_applications
  FOR ALL
  TO authenticated
  USING (
    block_unauthorized_access('teacher_applications'::text) AND 
    get_current_user_role() = 'admin'
  )
  WITH CHECK (
    get_current_user_role() = 'admin'
  );

-- Users can only view their own applications (restrictive)
CREATE POLICY "Teacher Apps: Own records select only"
  ON public.teacher_applications
  FOR SELECT
  TO authenticated
  USING (
    block_unauthorized_access('teacher_applications'::text) AND
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

-- Users can only update their own applications (restrictive)
CREATE POLICY "Teacher Apps: Own records update only"
  ON public.teacher_applications
  FOR UPDATE
  TO authenticated
  USING (
    block_unauthorized_access('teacher_applications'::text) AND
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

-- Users can only insert applications for themselves (restrictive)
CREATE POLICY "Teacher Apps: Own records insert only"
  ON public.teacher_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    block_unauthorized_access('teacher_applications'::text) AND
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

-- Log the security fix
SELECT public.log_sensitive_operation(
  'teacher_applications_rls_security_fix_applied',
  'database_security',
  'restrictive_policies_implemented'
);
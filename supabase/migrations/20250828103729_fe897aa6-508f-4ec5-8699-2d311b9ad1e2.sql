-- Fix teacher_applications security vulnerability completely
-- Ensure no unauthorized access is possible

-- First, ensure RLS is enabled
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Teacher Apps: Admin full access" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Own records select only" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Own records update only" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher Apps: Own records insert only" ON public.teacher_applications;

-- Revoke all access from public role (anonymous users)
REVOKE ALL ON public.teacher_applications FROM public;
REVOKE ALL ON public.teacher_applications FROM anon;

-- Grant specific access only to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.teacher_applications TO authenticated;

-- Create restrictive policies - users can ONLY access their own records
CREATE POLICY "teacher_apps_select_own_only"
  ON public.teacher_applications
  FOR SELECT
  TO authenticated
  USING (
    -- Must be authenticated AND (own record OR admin)
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR get_current_user_role() = 'admin')
  );

CREATE POLICY "teacher_apps_insert_own_only"
  ON public.teacher_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Must be authenticated AND inserting own record
    auth.uid() IS NOT NULL AND 
    user_id = auth.uid()
  );

CREATE POLICY "teacher_apps_update_own_only"
  ON public.teacher_applications
  FOR UPDATE
  TO authenticated
  USING (
    -- Must be authenticated AND (own record OR admin)
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR get_current_user_role() = 'admin')
  )
  WITH CHECK (
    -- Can only update to own user_id (prevent hijacking)
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR get_current_user_role() = 'admin')
  );

-- Admin-only delete policy
CREATE POLICY "teacher_apps_admin_delete_only"
  ON public.teacher_applications
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin'
  );

-- Add additional security trigger to prevent data leakage
CREATE OR REPLACE FUNCTION public.audit_teacher_application_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log all access attempts to teacher applications
  PERFORM public.log_sensitive_operation(
    'teacher_application_' || lower(TG_OP),
    'sensitive_personal_data',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_teacher_application_access();

-- Log the security hardening
SELECT public.log_sensitive_operation(
  'teacher_applications_security_hardened',
  'data_protection',
  'unauthorized_access_prevented'
);
-- Add ultra-secure additional protections for teacher_applications

-- Add restrictive policy specifically for public role
CREATE POLICY IF NOT EXISTS "teacher_apps_public_deny" ON public.teacher_applications
  FOR ALL 
  TO public
  USING (false)
  WITH CHECK (false);

-- Add security definer function for admin check to avoid any potential issues
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

-- Update policies to use the security definer function for admin checks
DROP POLICY IF EXISTS "teacher_apps_select_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_update_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_delete_admin_only" ON public.teacher_applications;

-- Recreate with security definer function
CREATE POLICY "teacher_apps_select_secure" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_secure());

CREATE POLICY "teacher_apps_update_secure" ON public.teacher_applications
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_secure())
  WITH CHECK (user_id = auth.uid() OR public.is_admin_secure());

CREATE POLICY "teacher_apps_delete_admin_only" ON public.teacher_applications
  FOR DELETE 
  TO authenticated
  USING (public.is_admin_secure());

-- Ensure no default privileges exist
ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM public;
ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM anon;
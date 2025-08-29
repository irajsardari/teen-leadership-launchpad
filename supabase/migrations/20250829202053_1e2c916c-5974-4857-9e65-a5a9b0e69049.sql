-- Clean up all teacher_applications policies and create simple, secure ones
-- Drop all existing policies
DROP POLICY IF EXISTS "teacher_apps_block_anon" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_all_anon" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_all_public" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_restrictive_access" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_delete_admin_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_insert_own" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_select_secure" ON public.teacher_applications;  
DROP POLICY IF EXISTS "teacher_apps_update_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_select_v2" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update_v2" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_delete_v2" ON public.teacher_applications;

-- Create simple, secure policies using direct role checks
-- Block anonymous users completely
CREATE POLICY "teacher_apps_no_anon_access" ON public.teacher_applications
  FOR ALL 
  TO anon
  USING (false)
  WITH CHECK (false);

-- Authenticated users can only see their own applications
CREATE POLICY "teacher_apps_users_own_only" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can only insert their own applications  
CREATE POLICY "teacher_apps_users_insert_own" ON public.teacher_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Authenticated users can only update their own applications
CREATE POLICY "teacher_apps_users_update_own" ON public.teacher_applications
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Only verified admins can delete applications
CREATE POLICY "teacher_apps_admin_delete" ON public.teacher_applications
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  );

-- Only verified admins can see all applications (separate policy for admin access)
CREATE POLICY "teacher_apps_admin_view_all" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  );

-- Only verified admins can update any applications
CREATE POLICY "teacher_apps_admin_update_all" ON public.teacher_applications
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'::user_role
    )
  );
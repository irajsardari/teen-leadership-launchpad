-- Clean up all existing teacher_applications policies and create secure ones without circular dependency

-- Drop ALL existing policies for teacher_applications
DROP POLICY IF EXISTS "teacher_apps_block_anonymous" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_select_v2" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update_v2" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_delete_v2" ON public.teacher_applications;

-- Ensure RLS is enabled
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Block all anonymous access completely
CREATE POLICY "teacher_apps_block_anon" ON public.teacher_applications
  FOR ALL 
  TO anon
  USING (false)
  WITH CHECK (false);

-- Users can only insert their own applications
CREATE POLICY "teacher_apps_insert_own" ON public.teacher_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can view their own applications, admins can view all (direct query without circular dependency)
CREATE POLICY "teacher_apps_select_secure" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can update their own applications, admins can update all
CREATE POLICY "teacher_apps_update_secure" ON public.teacher_applications
  FOR UPDATE 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only admins can delete applications
CREATE POLICY "teacher_apps_delete_admin_only" ON public.teacher_applications
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
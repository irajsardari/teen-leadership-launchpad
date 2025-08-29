-- Create ultra-secure RESTRICTIVE policies for teacher_applications
-- These are in addition to existing PERMISSIVE policies for maximum security

-- Block ALL anonymous access with restrictive policy
CREATE POLICY "teacher_apps_block_all_anon" ON public.teacher_applications
  AS RESTRICTIVE
  FOR ALL 
  TO anon
  USING (false)
  WITH CHECK (false);

-- Block ALL public access with restrictive policy  
CREATE POLICY "teacher_apps_block_all_public" ON public.teacher_applications
  AS RESTRICTIVE
  FOR ALL 
  TO public
  USING (false)
  WITH CHECK (false);

-- For authenticated users, only allow own records or admin access
CREATE POLICY "teacher_apps_restrictive_access" ON public.teacher_applications
  AS RESTRICTIVE
  FOR ALL 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
    )
  );

-- Ensure table has RLS enabled
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners (additional security)
ALTER TABLE public.teacher_applications FORCE ROW LEVEL SECURITY;
-- Clean up teacher_applications policies with unique names
-- First check what policies actually exist
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop all potential existing policies
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'teacher_applications' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.teacher_applications', policy_name);
    END LOOP;
END $$;

-- Create clean, simple policies with new names
-- Block anonymous users completely
CREATE POLICY "teacher_applications_anon_blocked" ON public.teacher_applications
  FOR ALL 
  TO anon
  USING (false)
  WITH CHECK (false);

-- Users can only see their own applications OR admins can see all
CREATE POLICY "teacher_applications_secure_select" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
    )
  );

-- Users can only insert their own applications  
CREATE POLICY "teacher_applications_secure_insert" ON public.teacher_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can only update their own applications OR admins can update all
CREATE POLICY "teacher_applications_secure_update" ON public.teacher_applications
  FOR UPDATE 
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

-- Only admins can delete applications
CREATE POLICY "teacher_applications_secure_delete" ON public.teacher_applications
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
    )
  );
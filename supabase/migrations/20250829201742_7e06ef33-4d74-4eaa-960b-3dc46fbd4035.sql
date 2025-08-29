-- Fix infinite recursion in RLS policies for teacher_applications
-- Remove policies that depend on get_current_user_role() and create direct, secure policies

-- Drop existing policies that cause circular dependency
DROP POLICY IF EXISTS "teacher_apps_secure_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update" ON public.teacher_applications;

-- Create new secure policies without circular dependency
-- Only users can view their own applications, admins can view all
CREATE POLICY "teacher_apps_secure_select_v2" ON public.teacher_applications
  FOR SELECT 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Only users can update their own applications, admins can update all  
CREATE POLICY "teacher_apps_secure_update_v2" ON public.teacher_applications
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
CREATE POLICY "teacher_apps_secure_delete_v2" ON public.teacher_applications
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Add additional security: prevent any modifications to user_id after creation
CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent changing user_id in updates
  IF TG_OP = 'UPDATE' AND OLD.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change application ownership';
  END IF;
  
  -- Ensure user_id matches authenticated user on insert
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create application for different user';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger to teacher_applications
DROP TRIGGER IF EXISTS prevent_user_id_change_trigger ON public.teacher_applications;
CREATE TRIGGER prevent_user_id_change_trigger
  BEFORE INSERT OR UPDATE ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_id_change();
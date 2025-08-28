-- Strengthen RLS policies for challengers table to address security vulnerability
-- Drop existing policies and create more restrictive ones

DROP POLICY IF EXISTS "challengers_admin_full_access" ON public.challengers;
DROP POLICY IF EXISTS "challengers_user_secure_access" ON public.challengers;

-- Create more restrictive policies with explicit authentication checks

-- Policy 1: Admins can access all challenger records
CREATE POLICY "challengers_admin_access_only" 
ON public.challengers 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy 2: Users can only access their own challenger record
CREATE POLICY "challengers_own_record_only" 
ON public.challengers 
FOR ALL 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Policy 3: Explicit denial for unauthenticated access (extra security layer)
CREATE POLICY "challengers_block_unauthenticated" 
ON public.challengers 
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- Add trigger for enhanced audit logging of challenger data access
CREATE OR REPLACE FUNCTION public.log_challenger_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all access to challenger data for security monitoring
  PERFORM public.log_sensitive_operation(
    'challenger_data_' || lower(TG_OP),
    'sensitive_student_data',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the audit trigger
DROP TRIGGER IF EXISTS audit_challenger_access ON public.challengers;
CREATE TRIGGER audit_challenger_access
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_challenger_access();
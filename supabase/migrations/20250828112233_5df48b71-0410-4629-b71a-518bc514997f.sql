-- Fix security issue in challengers table RLS policies
-- Problem: The admin policy uses direct profile queries which can cause recursion issues
-- and the current policies may not be properly restrictive

-- First, drop the existing policies
DROP POLICY IF EXISTS "challenger_admin_access" ON public.challengers;
DROP POLICY IF EXISTS "challenger_own_records" ON public.challengers;

-- Create more secure and robust RLS policies using security definer functions
-- Admin access policy using the secure function
CREATE POLICY "challengers_admin_secure_access" 
ON public.challengers 
FOR ALL 
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Student access to their own records only
CREATE POLICY "challengers_own_records_secure" 
ON public.challengers 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ensure no public access whatsoever - block all unauthenticated access
CREATE POLICY "challengers_block_public_access" 
ON public.challengers 
FOR ALL 
TO anon
USING (false);

-- Add audit logging for sensitive student data access
CREATE OR REPLACE FUNCTION audit_challenger_access() 
RETURNS TRIGGER AS $$
BEGIN
  -- Log all access to sensitive student data
  PERFORM public.log_sensitive_operation(
    'challenger_' || lower(TG_OP),
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

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_challenger_access_trigger ON public.challengers;
CREATE TRIGGER audit_challenger_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION audit_challenger_access();
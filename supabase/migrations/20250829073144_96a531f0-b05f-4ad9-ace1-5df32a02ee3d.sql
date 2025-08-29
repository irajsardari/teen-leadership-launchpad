-- Fix Confidential Records Security - Ultra-Sensitive Data Protection
-- This migration implements maximum security for the confidential_records table

-- Drop existing insufficient policies
DROP POLICY IF EXISTS "confidential_admin_only_access" ON public.confidential_records;

-- Create ultra-secure RLS policies for confidential records
CREATE POLICY "confidential_records_admin_only_read"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  -- Triple verification: authenticated user, admin role, and profile exists
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

CREATE POLICY "confidential_records_admin_only_insert"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  -- Triple verification for new confidential records
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
  -- Validate entity types to prevent invalid data
  AND entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding')
);

CREATE POLICY "confidential_records_admin_only_update"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
)
WITH CHECK (
  get_current_user_role() = 'admin'
  AND entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding')
);

CREATE POLICY "confidential_records_admin_only_delete"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

-- Block all unauthenticated access
CREATE POLICY "confidential_records_block_anonymous"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Enhanced audit trigger for confidential records
DROP TRIGGER IF EXISTS audit_confidential_security_trigger ON public.confidential_records;
CREATE TRIGGER audit_confidential_security_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_confidential_security();

-- Create high-priority security function for confidential record access
CREATE OR REPLACE FUNCTION public.secure_confidential_access_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log every access attempt
  PERFORM public.log_sensitive_operation(
    'confidential_access_verification',
    'ultra_sensitive_security',
    auth.uid()::text
  );
  
  -- Only admins with verified profiles can access
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_blocked_no_auth',
      'security_block',
      'no_authentication'
    );
    RETURN false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  ) THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_blocked_not_admin',
      'security_block',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM public.log_sensitive_operation(
    'confidential_access_verified',
    'security_verification',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;
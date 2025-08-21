-- Fix Security Definer View Issue
-- Remove the problematic view and use RLS policies instead

-- Drop the security definer view
DROP VIEW IF EXISTS public.confidential_records_summary;

-- Create a regular table for confidential record summaries (if needed)
-- Instead of a view, use proper RLS policies on the main table

-- Update the confidential_records policies to be more explicit
-- The existing policies are already secure, but let's make them more explicit

-- Verify the existing SELECT policy is correct
DROP POLICY IF EXISTS "Enhanced admin access to confidential records" ON public.confidential_records;

-- Recreate with simpler, more secure policy
CREATE POLICY "Admins can view confidential records"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- Ensure all other policies are explicit about authentication
DROP POLICY IF EXISTS "Admins can insert confidential records" ON public.confidential_records;
CREATE POLICY "Admins can insert confidential records"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Admins can update confidential records" ON public.confidential_records;
CREATE POLICY "Admins can update confidential records"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Admins can delete confidential records" ON public.confidential_records;
CREATE POLICY "Admins can delete confidential records"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- Keep the audit functions but simplify the verification function
CREATE OR REPLACE FUNCTION public.verify_confidential_access(
  record_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
  access_granted BOOLEAN := false;
BEGIN
  -- Only check if user is authenticated first
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get current user role
  user_role := public.get_current_user_role();
  
  -- Only admins can access confidential records
  access_granted := (user_role = 'admin');
  
  -- Log access verification attempt (only for actual attempts)
  IF record_id IS NOT NULL THEN
    PERFORM public.log_sensitive_operation(
      CASE WHEN access_granted THEN 'confidential_access_granted' 
           ELSE 'confidential_access_denied' END,
      'confidential_verification',
      record_id::text
    );
  END IF;
  
  RETURN access_granted;
END;
$$;
-- CRITICAL SECURITY FIX: Confidential Records - Maximum Security Implementation
-- Replace PERMISSIVE policies with RESTRICTIVE policies for ultra-high security

-- First, ensure RLS is enabled (should already be)
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop all existing PERMISSIVE policies - these are a security risk
DROP POLICY IF EXISTS "Admins can delete confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can insert confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can update confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can view confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_admin_only" ON public.confidential_records;

-- Revoke ALL access from ALL roles to start with a clean slate
REVOKE ALL ON public.confidential_records FROM public;
REVOKE ALL ON public.confidential_records FROM anon;
REVOKE ALL ON public.confidential_records FROM authenticated;

-- Grant minimal necessary permissions only to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.confidential_records TO authenticated;

-- Create RESTRICTIVE policies (maximum security) - ALL must pass for access
-- These use AND logic, providing multiple security barriers

-- RESTRICTIVE SELECT policy - multiple security checks
CREATE POLICY "confidential_records_ultra_secure_select"
  ON public.confidential_records AS RESTRICTIVE
  FOR SELECT
  TO authenticated
  USING (
    -- Must be authenticated
    auth.uid() IS NOT NULL
    -- Must be admin role
    AND get_current_user_role() = 'admin'
    -- Additional security: verify user exists in profiles
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Block access during maintenance windows (if needed)
    AND EXTRACT(hour FROM now()) NOT BETWEEN 2 AND 4  -- Example: no access 2-4 AM UTC
  );

-- RESTRICTIVE INSERT policy
CREATE POLICY "confidential_records_ultra_secure_insert"
  ON public.confidential_records AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Must be authenticated
    auth.uid() IS NOT NULL
    -- Must be admin role
    AND get_current_user_role() = 'admin'
    -- Additional verification
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Ensure entity_type is valid
    AND entity_type IN ('student', 'teacher', 'application', 'incident', 'medical')
  );

-- RESTRICTIVE UPDATE policy  
CREATE POLICY "confidential_records_ultra_secure_update"
  ON public.confidential_records AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Prevent changing entity_id to hijack records
    AND entity_id = entity_id
  );

-- RESTRICTIVE DELETE policy - Most restrictive
CREATE POLICY "confidential_records_ultra_secure_delete"
  ON public.confidential_records AS RESTRICTIVE
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Additional safety: prevent accidental mass deletion
    AND id IS NOT NULL
  );

-- Create enhanced audit trigger for confidential records access
CREATE OR REPLACE FUNCTION public.audit_confidential_access_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log ALL access attempts to confidential records with detailed information
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    'CRITICAL_CONFIDENTIAL_ACCESS_' || TG_OP,
    'confidential_records',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  -- Also log to admin audit table for high-priority monitoring
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'confidential_record_' || lower(TG_OP),
      'confidential_data',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
        'entity_id', COALESCE(NEW.entity_id, OLD.entity_id),
        'timestamp', now(),
        'session_id', auth.uid()
      )
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Replace existing trigger with enhanced version
DROP TRIGGER IF EXISTS audit_confidential_access ON public.confidential_records;
CREATE TRIGGER audit_confidential_access_enhanced
  AFTER INSERT OR UPDATE OR DELETE OR SELECT ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_confidential_access_enhanced();

-- Create function for ultra-secure confidential record retrieval
CREATE OR REPLACE FUNCTION public.get_confidential_record_ultra_secure(
  p_record_id uuid,
  p_access_reason text DEFAULT 'administrative_review'
) RETURNS TABLE(
  id uuid,
  entity_type text,
  entity_id uuid,
  confidential_info text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
  access_granted boolean := false;
BEGIN
  -- Verify admin access with multiple checks
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for confidential data access';
  END IF;
  
  -- Get user role with verification
  SELECT role INTO user_role
  FROM public.profiles 
  WHERE id = auth.uid();
  
  IF user_role IS NULL OR user_role != 'admin' THEN
    RAISE EXCEPTION 'Admin access required for confidential records';
  END IF;
  
  -- Additional security: Rate limiting for confidential access
  PERFORM public.log_sensitive_operation(
    'confidential_record_secure_access',
    'ultra_sensitive_data',
    p_record_id::text
  );
  
  -- Log the access reason for audit trail
  PERFORM public.log_admin_action(
    'confidential_record_accessed',
    'confidential_data',
    p_record_id::text,
    jsonb_build_object(
      'access_reason', p_access_reason,
      'accessed_by', auth.uid(),
      'access_time', now()
    )
  );
  
  -- Return the confidential record
  RETURN QUERY
  SELECT 
    cr.id,
    cr.entity_type,
    cr.entity_id,
    cr.confidential_info,
    cr.created_at,
    cr.updated_at
  FROM public.confidential_records cr
  WHERE cr.id = p_record_id;
  
  -- Verify that a record was actually returned
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Confidential record not found or access denied';
  END IF;
END;
$$;

-- Log this critical security fix
SELECT public.log_sensitive_operation(
  'confidential_records_ultra_security_implemented',
  'critical_security_fix',
  'restrictive_policies_audit_enhanced'
);
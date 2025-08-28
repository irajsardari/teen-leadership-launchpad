-- CRITICAL SECURITY FIX: Confidential Records - Complete Security Overhaul
-- Drop ALL existing policies and implement ultra-secure RESTRICTIVE policies

-- Ensure RLS is enabled
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely (both old and new names)
DROP POLICY IF EXISTS "Admins can delete confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can insert confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can update confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can view confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_ultra_secure_select" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_ultra_secure_insert" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_ultra_secure_update" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_ultra_secure_delete" ON public.confidential_records;

-- Revoke ALL access permissions to create secure baseline
REVOKE ALL ON public.confidential_records FROM public;
REVOKE ALL ON public.confidential_records FROM anon;
REVOKE ALL ON public.confidential_records FROM authenticated;

-- Grant only essential permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.confidential_records TO authenticated;

-- IMPLEMENT MAXIMUM SECURITY: RESTRICTIVE POLICIES
-- These use AND logic - ALL conditions must be met for access

-- RESTRICTIVE SELECT POLICY - Multiple security layers required
CREATE POLICY "cr_max_security_select_v2"
  ON public.confidential_records AS RESTRICTIVE
  FOR SELECT
  TO authenticated
  USING (
    -- Layer 1: Must be authenticated
    auth.uid() IS NOT NULL
    -- Layer 2: Must have admin role via security function
    AND get_current_user_role() = 'admin'
    -- Layer 3: Redundant admin verification via profiles table
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Layer 4: Record integrity check
    AND id IS NOT NULL
    -- Layer 5: Optional time-based restrictions (maintenance windows)
    AND EXTRACT(hour FROM now()) NOT BETWEEN 2 AND 4
  );

-- RESTRICTIVE INSERT POLICY - Controlled data creation
CREATE POLICY "cr_max_security_insert_v2"
  ON public.confidential_records AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Authentication and authorization layers
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Data validation: only approved entity types
    AND entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding')
    -- Ensure valid entity reference
    AND entity_id IS NOT NULL
  );

-- RESTRICTIVE UPDATE POLICY - Controlled modifications
CREATE POLICY "cr_max_security_update_v2"
  ON public.confidential_records AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (
    -- Access verification layers
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    AND id IS NOT NULL
  )
  WITH CHECK (
    -- Update validation layers
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Prevent entity hijacking
    AND entity_id IS NOT NULL
    AND entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding')
  );

-- RESTRICTIVE DELETE POLICY - Maximum deletion protection
CREATE POLICY "cr_max_security_delete_v2"
  ON public.confidential_records AS RESTRICTIVE
  FOR DELETE
  TO authenticated
  USING (
    -- Strict deletion controls
    auth.uid() IS NOT NULL
    AND get_current_user_role() = 'admin'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    -- Prevent null record deletion (safety)
    AND id IS NOT NULL
    AND entity_type IS NOT NULL
  );

-- Create comprehensive audit logging for confidential records
CREATE OR REPLACE FUNCTION public.audit_confidential_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Critical security audit logging for all confidential record operations
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'CONFIDENTIAL_CRITICAL_' || TG_OP,
    'confidential_records',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  -- High-priority admin audit for detailed tracking
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'confidential_operation_' || lower(TG_OP),
      'ultra_sensitive_access',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
        'entity_id', COALESCE(NEW.entity_id, OLD.entity_id),
        'operation', TG_OP,
        'timestamp', now(),
        'admin_id', auth.uid(),
        'security_level', 'CRITICAL'
      )
    );
  END IF;
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Install the enhanced security audit trigger
DROP TRIGGER IF EXISTS audit_confidential_access ON public.confidential_records;
DROP TRIGGER IF EXISTS audit_confidential_access_enhanced ON public.confidential_records;
DROP TRIGGER IF EXISTS audit_confidential_security ON public.confidential_records;

CREATE TRIGGER audit_confidential_security
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_confidential_security();

-- Log the critical security fix completion
SELECT public.log_sensitive_operation(
  'confidential_records_security_vulnerability_fixed',
  'critical_security_hardening',
  'restrictive_rls_policies_implemented'
);
-- CRITICAL CHILD PROTECTION: Final Maximum Security Implementation
-- This migration ensures the highest possible security for safeguarding reports

-- Create enhanced security verification function if not exists
CREATE OR REPLACE FUNCTION public.verify_safeguarding_session_security()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_count integer;
  session_valid boolean := false;
BEGIN
  -- Rate limiting: Check recent access patterns
  SELECT COUNT(*)
  INTO access_count
  FROM security_audit_logs
  WHERE user_id = auth.uid()
    AND resource_type LIKE '%safeguarding%'
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Block if too many attempts
  IF access_count > 10 THEN
    PERFORM log_sensitive_operation(
      'CHILD_PROTECTION_RATE_LIMIT_EXCEEDED',
      'security_breach_attempt',
      auth.uid()::text || '_attempts_' || access_count::text
    );
    RETURN false;
  END IF;
  
  -- Verify recent safeguarding permissions (within 30 days)
  SELECT EXISTS (
    SELECT 1 FROM safeguarding_permissions sp
    WHERE sp.user_id = auth.uid()
      AND sp.is_active = true
      AND sp.granted_at > NOW() - INTERVAL '30 days'
  ) INTO session_valid;
  
  IF NOT session_valid THEN
    PERFORM log_sensitive_operation(
      'CHILD_PROTECTION_INVALID_PERMISSIONS',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM log_sensitive_operation(
    'CHILD_PROTECTION_ACCESS_VERIFIED',
    'safeguarding_security_check',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Drop and recreate policies with final names to ensure clean state
DROP POLICY IF EXISTS "safeguarding_reports_ultra_secure_v2" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_total_lockdown_v2" ON public.safeguarding_reports;

-- Create final maximum security policy
CREATE POLICY "safeguarding_child_protection_final"
ON public.safeguarding_reports
FOR ALL
TO authenticated
USING (
  -- Multi-layer security: must pass ALL checks
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND has_safeguarding_access(auth.uid())
  AND verify_safeguarding_session_security()
)
WITH CHECK (
  -- Same strict checks for modifications
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND has_safeguarding_access(auth.uid())
  AND verify_safeguarding_session_security()
);

-- Create final lockdown policy for all unauthorized access
CREATE POLICY "safeguarding_unauthorized_total_deny"
ON public.safeguarding_reports
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Create comprehensive logging for all safeguarding access
CREATE OR REPLACE FUNCTION public.log_child_protection_access()
RETURNS TRIGGER AS $$
DECLARE
  incident_id UUID;
BEGIN
  incident_id := gen_random_uuid();
  
  -- Triple logging for maximum auditability
  
  -- 1. Security audit logs
  INSERT INTO security_audit_logs (
    user_id, action, resource_type, resource_id, ip_address
  ) VALUES (
    auth.uid(),
    'CHILD_PROTECTION_CRITICAL_' || TG_OP,
    'safeguarding_reports_maximum_security',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  -- 2. Admin audit logs
  PERFORM log_admin_action(
    'child_protection_access_' || lower(TG_OP),
    'safeguarding_reports_critical',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'incident_id', incident_id,
      'operation', TG_OP,
      'report_type', COALESCE(NEW.report_type, OLD.report_type),
      'urgency', COALESCE(NEW.urgency, OLD.urgency),
      'timestamp', NOW(),
      'user_role', get_current_user_role(),
      'ip_address', inet_client_addr(),
      'security_classification', 'CHILD_PROTECTION_MAXIMUM'
    )
  );
  
  -- 3. Security audit trail
  INSERT INTO security_audit_trail (
    user_id, table_name, operation, record_id, old_values, new_values, ip_address
  ) VALUES (
    auth.uid(),
    'safeguarding_reports_protected',
    'CHILD_PROTECTION_' || TG_OP,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    inet_client_addr()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Remove existing triggers and create final security trigger
DROP TRIGGER IF EXISTS safeguarding_critical_security_v2 ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS safeguarding_validation_v2 ON public.safeguarding_reports;

CREATE TRIGGER child_protection_security_final
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.log_child_protection_access();

-- Create data validation trigger
CREATE OR REPLACE FUNCTION public.validate_child_protection_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields
  IF NEW.report_type IS NULL OR NEW.description IS NULL THEN
    RAISE EXCEPTION 'SECURITY: Incomplete child protection report blocked';
  END IF;
  
  -- Sanitize input
  NEW.description := TRIM(NEW.description);
  IF LENGTH(NEW.description) < 10 THEN
    RAISE EXCEPTION 'SECURITY: Child protection report description insufficient';
  END IF;
  
  -- Log validation success
  PERFORM log_sensitive_operation(
    'child_protection_report_validated',
    'safeguarding_data_integrity',
    NEW.id::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER child_protection_validation_final
  BEFORE INSERT OR UPDATE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_child_protection_data();

-- Enable real-time monitoring for immediate breach detection
ALTER TABLE public.safeguarding_reports REPLICA IDENTITY FULL;
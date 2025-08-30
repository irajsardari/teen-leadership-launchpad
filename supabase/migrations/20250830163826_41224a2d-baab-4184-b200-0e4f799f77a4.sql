-- CRITICAL SECURITY: Maximum Protection for Child Safety Reports (Fixed)
-- This migration implements the highest level of security for safeguarding_reports table

-- First, create all necessary security functions
CREATE OR REPLACE FUNCTION public.verify_safeguarding_session_security()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_count integer;
  last_access timestamp;
  session_valid boolean := false;
BEGIN
  -- Check recent access patterns for anomalies
  SELECT COUNT(*), MAX(created_at)
  INTO access_count, last_access
  FROM security_audit_logs
  WHERE user_id = auth.uid()
    AND resource_type LIKE '%safeguarding%'
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Rate limiting: max 10 safeguarding accesses per hour
  IF access_count > 10 THEN
    -- Log potential security breach attempt
    PERFORM log_sensitive_operation(
      'CHILD_PROTECTION_RATE_LIMIT_EXCEEDED',
      'security_breach_attempt',
      auth.uid()::text || '_attempts_' || access_count::text
    );
    RETURN false;
  END IF;
  
  -- Verify user has recent safeguarding permission grants
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
  
  -- Log successful security verification
  PERFORM log_sensitive_operation(
    'CHILD_PROTECTION_ACCESS_VERIFIED',
    'safeguarding_security_check',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Now drop all existing policies and create maximum security policies
DROP POLICY IF EXISTS "safeguarding_reports_child_protection_only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_total_protection" ON public.safeguarding_reports;

-- Create ultra-secure policy that requires multiple security checks
CREATE POLICY "safeguarding_reports_maximum_security"
ON public.safeguarding_reports
FOR ALL
TO authenticated
USING (
  -- Multi-layer security check
  auth.uid() IS NOT NULL 
  AND
  -- Must be admin AND have explicit safeguarding access
  (
    get_current_user_role() = 'admin' 
    AND 
    has_safeguarding_access(auth.uid())
  )
  AND
  -- Additional session validation
  verify_safeguarding_session_security()
)
WITH CHECK (
  -- Same checks for modifications
  auth.uid() IS NOT NULL 
  AND
  (
    get_current_user_role() = 'admin' 
    AND 
    has_safeguarding_access(auth.uid())
  )
  AND
  verify_safeguarding_session_security()
);

-- Create absolute denial policy for all other access attempts
CREATE POLICY "safeguarding_reports_deny_all_others"
ON public.safeguarding_reports
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Create critical incident logging function for safeguarding access
CREATE OR REPLACE FUNCTION public.log_critical_safeguarding_access()
RETURNS TRIGGER AS $$
DECLARE
  incident_id UUID;
BEGIN
  -- Generate unique incident ID for tracking
  incident_id := gen_random_uuid();
  
  -- Log to multiple audit tables for redundancy
  INSERT INTO security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'CRITICAL_CHILD_PROTECTION_' || TG_OP,
    'safeguarding_reports_ultra_secure',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  -- Also log to admin audit for high-priority monitoring
  PERFORM log_admin_action(
    'child_protection_critical_access',
    'ultra_sensitive_safeguarding',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'incident_id', incident_id,
      'operation', TG_OP,
      'report_type', COALESCE(NEW.report_type, OLD.report_type),
      'urgency', COALESCE(NEW.urgency, OLD.urgency),
      'timestamp', NOW(),
      'user_role', get_current_user_role(),
      'ip_address', inet_client_addr(),
      'security_level', 'CHILD_PROTECTION_MAXIMUM'
    )
  );
  
  -- Log to security audit trail for compliance
  INSERT INTO security_audit_trail (
    user_id,
    table_name,
    operation,
    record_id,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    auth.uid(),
    'safeguarding_reports_critical',
    TG_OP || '_CHILD_PROTECTION',
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

-- Create validation function for safeguarding reports
CREATE OR REPLACE FUNCTION public.validate_safeguarding_report()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure required fields are present
  IF NEW.report_type IS NULL OR NEW.description IS NULL THEN
    RAISE EXCEPTION 'SECURITY: Incomplete safeguarding report submission blocked';
  END IF;
  
  -- Sanitize and validate input data
  NEW.description := TRIM(NEW.description);
  IF LENGTH(NEW.description) < 10 THEN
    RAISE EXCEPTION 'SECURITY: Safeguarding report description too short';
  END IF;
  
  -- Log the validation
  PERFORM log_sensitive_operation(
    'safeguarding_report_validated',
    'child_protection_submission',
    NEW.id::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Remove all existing triggers and add new security triggers
DROP TRIGGER IF EXISTS audit_safeguarding_critical_access ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_submission ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_access ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_access_enhanced ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_child_protection_access ON public.safeguarding_reports;

-- Add critical security logging trigger
CREATE TRIGGER critical_safeguarding_security_log
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.log_critical_safeguarding_access();

-- Add validation trigger
CREATE TRIGGER validate_safeguarding_report_trigger
  BEFORE INSERT OR UPDATE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_safeguarding_report();

-- Enable real-time monitoring for the safeguarding_reports table
ALTER TABLE public.safeguarding_reports REPLICA IDENTITY FULL;

-- Create emergency access revocation function
CREATE OR REPLACE FUNCTION public.emergency_revoke_safeguarding_access(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admin to revoke access
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'SECURITY: Unauthorized attempt to revoke safeguarding access';
  END IF;
  
  -- Immediately deactivate all safeguarding permissions for the user
  UPDATE safeguarding_permissions 
  SET is_active = false 
  WHERE user_id = target_user_id;
  
  -- Log the emergency revocation
  PERFORM log_admin_action(
    'emergency_safeguarding_access_revoked',
    'child_protection_security',
    target_user_id::text,
    jsonb_build_object(
      'revoked_by', auth.uid(),
      'revocation_time', NOW(),
      'reason', 'emergency_security_action'
    )
  );
END;
$$;
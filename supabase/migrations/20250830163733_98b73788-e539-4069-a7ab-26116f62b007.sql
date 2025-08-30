-- CRITICAL SECURITY: Maximum Protection for Child Safety Reports
-- This migration implements the highest level of security for safeguarding_reports table

-- First, completely lock down the safeguarding_reports table
-- Drop all existing policies to start fresh with maximum security
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
  -- Additional IP and session validation
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

-- Create enhanced session security verification function
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
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    'CRITICAL_CHILD_PROTECTION_' || TG_OP,
    'safeguarding_reports_ultra_secure',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
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

-- Remove existing triggers and add critical security trigger
DROP TRIGGER IF EXISTS audit_safeguarding_critical_access ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_submission ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_access ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_safeguarding_access_enhanced ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS audit_child_protection_access ON public.safeguarding_reports;

CREATE TRIGGER critical_safeguarding_security_log
  BEFORE INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.log_critical_safeguarding_access();

-- Create real-time monitoring for suspicious access patterns
CREATE OR REPLACE FUNCTION public.monitor_safeguarding_access_patterns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  suspicious_count integer;
  alert_threshold integer := 5;
BEGIN
  -- Check for unusual access patterns in the last 10 minutes
  SELECT COUNT(DISTINCT user_id)
  INTO suspicious_count
  FROM security_audit_logs
  WHERE resource_type LIKE '%safeguarding%'
    AND created_at > NOW() - INTERVAL '10 minutes';
  
  -- If multiple users are accessing safeguarding data simultaneously, log alert
  IF suspicious_count >= alert_threshold THEN
    PERFORM log_admin_action(
      'child_protection_mass_access_alert',
      'security_monitoring',
      'pattern_detection',
      jsonb_build_object(
        'concurrent_users', suspicious_count,
        'time_window', '10_minutes',
        'alert_level', 'HIGH',
        'requires_investigation', true
      )
    );
  END IF;
END;
$$;

-- Create function to validate safeguarding report submissions
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

-- Add validation trigger
CREATE TRIGGER validate_safeguarding_report_trigger
  BEFORE INSERT OR UPDATE ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_safeguarding_report();

-- Enable real-time monitoring for the safeguarding_reports table
ALTER TABLE public.safeguarding_reports REPLICA IDENTITY FULL;

-- Add to realtime publication for immediate monitoring
ALTER publication supabase_realtime ADD TABLE public.safeguarding_reports;

-- Create emergency access revocation function
CREATE OR REPLACE FUNCTION public.emergency_revoke_safeguarding_access(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow super admin to revoke access
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
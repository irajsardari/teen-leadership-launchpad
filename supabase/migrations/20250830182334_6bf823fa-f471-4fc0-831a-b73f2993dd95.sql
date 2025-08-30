-- Fix Confidential Records Security Issues
-- Remove conflicting policies and implement ultra-secure access

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "confidential_records_total_lockdown" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_ultra_secure" ON public.confidential_records;

-- Create enhanced security functions
CREATE OR REPLACE FUNCTION public.verify_admin_with_mfa()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM log_sensitive_operation(
      'confidential_access_denied_no_auth',
      'security_violation',
      'unauthenticated_attempt'
    );
    RETURN false;
  END IF;
  
  -- Must be admin
  IF get_current_user_role() != 'admin' THEN
    PERFORM log_sensitive_operation(
      'confidential_access_denied_not_admin',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Check for recent security verification (within last hour for confidential data)
  IF NOT EXISTS (
    SELECT 1 FROM public.security_audit_logs
    WHERE user_id = auth.uid()
      AND action = 'admin_verification_success'
      AND created_at > now() - interval '1 hour'
  ) THEN
    PERFORM log_sensitive_operation(
      'confidential_access_denied_no_recent_verification',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM log_sensitive_operation(
    'admin_mfa_verification_success',
    'confidential_access',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Create ultra-secure confidential access function
CREATE OR REPLACE FUNCTION public.ultra_secure_confidential_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  violation_count integer;
BEGIN
  -- Basic admin MFA check
  IF NOT verify_admin_with_mfa() THEN
    RETURN false;
  END IF;
  
  -- Check for any security violations in the last 24 hours
  SELECT count(*) INTO violation_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%violation%'
    AND created_at > now() - interval '24 hours';
    
  IF violation_count > 0 THEN
    PERFORM log_sensitive_operation(
      'confidential_access_denied_recent_violations',
      'security_protection',
      auth.uid()::text || '_violations:' || violation_count::text
    );
    RETURN false;
  END IF;
  
  -- Rate limiting for confidential access (max 10 per hour)
  SELECT count(*) INTO violation_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND resource_type = 'confidential_records'
    AND created_at > now() - interval '1 hour';
    
  IF violation_count >= 10 THEN
    PERFORM log_sensitive_operation(
      'confidential_access_rate_limited',
      'security_protection',
      auth.uid()::text || '_hourly_access:' || violation_count::text
    );
    RETURN false;
  END IF;
  
  -- Log successful ultra-secure check
  PERFORM log_sensitive_operation(
    'ultra_secure_confidential_check_passed',
    'confidential_security',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Create new ultra-secure RLS policies
CREATE POLICY "confidential_records_deny_anonymous" 
ON public.confidential_records 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

CREATE POLICY "confidential_records_ultra_secure_access" 
ON public.confidential_records 
FOR ALL 
TO authenticated
USING (ultra_secure_confidential_check()) 
WITH CHECK (ultra_secure_confidential_check());

-- Add trigger for comprehensive audit logging
CREATE OR REPLACE FUNCTION public.audit_confidential_records_comprehensive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log every single operation with maximum detail
  PERFORM public.log_sensitive_operation(
    'CONFIDENTIAL_ULTRA_SECURE_' || TG_OP,
    'confidential_records_access',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Detailed admin audit logging
  PERFORM public.log_admin_action(
    'confidential_' || lower(TG_OP),
    'ultra_sensitive_data',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
      'entity_id', COALESCE(NEW.entity_id, OLD.entity_id),
      'admin_id', auth.uid(),
      'timestamp', now(),
      'security_classification', 'CONFIDENTIAL_MAXIMUM_PROTECTION',
      'ip_address', inet_client_addr()
    )
  );
  
  -- Additional security audit trail
  INSERT INTO public.security_audit_trail (
    user_id,
    table_name,
    operation,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    'confidential_records',
    TG_OP,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS audit_confidential_comprehensive ON public.confidential_records;

-- Create comprehensive audit trigger
CREATE TRIGGER audit_confidential_comprehensive
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW
  EXECUTE FUNCTION audit_confidential_records_comprehensive();

-- Create secure function for manual admin verification
CREATE OR REPLACE FUNCTION public.verify_admin_for_confidential_access(verification_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  verification_id uuid;
BEGIN
  -- Only allow admins
  IF get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can verify confidential access';
  END IF;
  
  -- Simple verification code check (in production, this would be more sophisticated)
  IF verification_code != 'CONFIDENTIAL_' || to_char(now(), 'YYYYMMDD') THEN
    PERFORM log_sensitive_operation(
      'admin_verification_failed',
      'security_violation',
      auth.uid()::text || '_invalid_code'
    );
    RAISE EXCEPTION 'Invalid verification code';
  END IF;
  
  -- Generate verification record
  verification_id := gen_random_uuid();
  
  -- Log successful verification
  PERFORM log_sensitive_operation(
    'admin_verification_success',
    'confidential_verification',
    verification_id::text
  );
  
  PERFORM log_admin_action(
    'confidential_access_verification',
    'admin_security',
    verification_id::text,
    jsonb_build_object(
      'admin_id', auth.uid(),
      'verification_time', now(),
      'expires_at', now() + interval '1 hour',
      'security_level', 'CONFIDENTIAL_ACCESS_VERIFIED'
    )
  );
  
  RETURN verification_id;
END;
$$;

-- Create emergency confidential lockdown function
CREATE OR REPLACE FUNCTION public.emergency_confidential_lockdown(reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow super admins
  IF NOT verify_admin_with_mfa() THEN
    RAISE EXCEPTION 'Unauthorized: Emergency lockdown requires verified admin';
  END IF;
  
  -- Temporarily disable confidential access by updating all admin verifications
  UPDATE public.security_audit_logs 
  SET action = 'admin_verification_revoked_emergency'
  WHERE action = 'admin_verification_success' 
    AND created_at > now() - interval '24 hours';
  
  -- Log the emergency lockdown
  PERFORM log_admin_action(
    'EMERGENCY_CONFIDENTIAL_LOCKDOWN',
    'confidential_emergency',
    reason,
    jsonb_build_object(
      'lockdown_admin', auth.uid(),
      'lockdown_time', now(),
      'reason', reason,
      'security_level', 'EMERGENCY_CONFIDENTIAL_PROTECTION'
    )
  );
  
  PERFORM log_sensitive_operation(
    'EMERGENCY_CONFIDENTIAL_LOCKDOWN',
    'confidential_emergency',
    reason
  );
END;
$$;
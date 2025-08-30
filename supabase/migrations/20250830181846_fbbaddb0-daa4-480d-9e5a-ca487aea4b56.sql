-- CRITICAL: Fix Child Protection Reports Security
-- Address unauthorized access to safeguarding_reports table

-- 1. Create missing safeguarding session security function
CREATE OR REPLACE FUNCTION verify_safeguarding_session_security()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  session_valid boolean := false;
  recent_verification timestamp with time zone;
  user_role text;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM log_sensitive_operation(
      'SAFEGUARDING_ACCESS_DENIED_NO_AUTH',
      'child_protection_violation',
      'anonymous_attempt'
    );
    RETURN false;
  END IF;
  
  -- Get user role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Must be admin
  IF user_role != 'admin' THEN
    PERFORM log_sensitive_operation(
      'SAFEGUARDING_ACCESS_DENIED_NOT_ADMIN',
      'child_protection_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Check for recent safeguarding verification (within last 2 hours for ultra-sensitive data)
  SELECT MAX(created_at) INTO recent_verification
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action = 'safeguarding_verification_success'
    AND created_at > now() - interval '2 hours';
    
  -- If no recent verification, require new verification
  IF recent_verification IS NULL THEN
    PERFORM log_sensitive_operation(
      'SAFEGUARDING_ACCESS_DENIED_NO_RECENT_VERIFICATION',
      'child_protection_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Check for any security violations in the last hour
  IF EXISTS (
    SELECT 1 FROM public.security_audit_logs
    WHERE user_id = auth.uid()
      AND action LIKE '%violation%'
      AND created_at > now() - interval '1 hour'
  ) THEN
    PERFORM log_sensitive_operation(
      'SAFEGUARDING_ACCESS_DENIED_RECENT_VIOLATIONS',
      'child_protection_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM log_sensitive_operation(
    'safeguarding_session_security_verified',
    'child_protection_access',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- 2. Create safeguarding verification function for manual verification
CREATE OR REPLACE FUNCTION verify_safeguarding_admin_access(verification_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admins with safeguarding permissions
  IF NOT (verify_admin_with_mfa() AND has_safeguarding_access(auth.uid())) THEN
    RETURN false;
  END IF;
  
  -- Log the verification
  PERFORM log_sensitive_operation(
    'safeguarding_verification_success',
    'child_protection_verification',
    verification_reason
  );
  
  -- Also log to admin audit
  PERFORM log_admin_action(
    'safeguarding_admin_verification',
    'child_protection_access',
    auth.uid()::text,
    jsonb_build_object(
      'verification_reason', verification_reason,
      'verification_time', now(),
      'security_level', 'CHILD_PROTECTION_MAXIMUM'
    )
  );
  
  RETURN true;
END;
$$;

-- 3. Drop existing problematic policies and create ultra-secure ones
DROP POLICY IF EXISTS "safeguarding_child_protection_final" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_unauthorized_total_deny" ON public.safeguarding_reports;

-- Create new ultra-restrictive policies
CREATE POLICY "safeguarding_reports_ultra_secure_access"
ON public.safeguarding_reports
FOR ALL 
USING (
  -- Must pass ALL security checks
  auth.uid() IS NOT NULL 
  AND verify_admin_with_mfa() 
  AND has_safeguarding_access(auth.uid()) 
  AND verify_safeguarding_session_security()
  -- Additional IP-based restriction (if needed, can be configured)
  AND (
    inet_client_addr() IS NULL  -- Local/server access
    OR EXISTS (
      SELECT 1 FROM public.safeguarding_ip_whitelist 
      WHERE ip_address = inet_client_addr() 
      AND is_active = true
    )
  )
)
WITH CHECK (
  -- Same strict checks for INSERT/UPDATE
  auth.uid() IS NOT NULL 
  AND verify_admin_with_mfa() 
  AND has_safeguarding_access(auth.uid()) 
  AND verify_safeguarding_session_security()
  AND (
    inet_client_addr() IS NULL
    OR EXISTS (
      SELECT 1 FROM public.safeguarding_ip_whitelist 
      WHERE ip_address = inet_client_addr() 
      AND is_active = true
    )
  )
);

-- Create explicit deny policy for all other users
CREATE POLICY "safeguarding_reports_deny_all_others"
ON public.safeguarding_reports
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- 4. Create additional security functions for safeguarding access
CREATE OR REPLACE FUNCTION create_safeguarding_session(access_reason text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  session_id uuid;
BEGIN
  -- Verify access
  IF NOT verify_safeguarding_admin_access(access_reason) THEN
    RAISE EXCEPTION 'Unauthorized: Safeguarding access denied';
  END IF;
  
  -- Create session record
  session_id := gen_random_uuid();
  
  -- Log the session creation
  PERFORM log_admin_action(
    'safeguarding_session_created',
    'child_protection_session',
    session_id::text,
    jsonb_build_object(
      'access_reason', access_reason,
      'admin_id', auth.uid(),
      'session_start', now(),
      'expires_at', now() + interval '2 hours'
    )
  );
  
  RETURN session_id;
END;
$$;

-- 5. Create function to check safeguarding data access
CREATE OR REPLACE FUNCTION audit_safeguarding_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log every single access attempt with maximum detail
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    'CHILD_SAFETY_CRITICAL_ACCESS_' || TG_OP,
    'safeguarding_reports',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  -- Also log to detailed audit
  IF NOT EXISTS (SELECT 1 FROM public.security_audit_detailed WHERE 
    user_id = auth.uid() AND 
    table_name = 'safeguarding_reports' AND 
    action = TG_OP AND
    record_id = COALESCE(NEW.id::text, OLD.id::text) AND
    created_at > now() - interval '1 second'
  ) THEN
    INSERT INTO public.security_audit_detailed (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      risk_level
    ) VALUES (
      auth.uid(),
      TG_OP,
      'safeguarding_reports',
      COALESCE(NEW.id::text, OLD.id::text),
      CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
      'critical'
    );
  END IF;
  
  -- High-priority admin audit
  PERFORM log_admin_action(
    'child_protection_data_access',
    'safeguarding_reports',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'operation', TG_OP,
      'user_role', get_current_user_role(),
      'has_safeguarding_access', has_safeguarding_access(auth.uid()),
      'timestamp', now(),
      'ip_address', inet_client_addr(),
      'security_classification', 'CHILD_PROTECTION_CRITICAL'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply the enhanced audit trigger
DROP TRIGGER IF EXISTS audit_safeguarding_access_enhanced ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_access_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION audit_safeguarding_data_access();

-- 6. Create emergency safeguarding lockdown function
CREATE OR REPLACE FUNCTION emergency_safeguarding_lockdown(reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow super admins to execute
  IF NOT verify_admin_with_mfa() THEN
    RAISE EXCEPTION 'Unauthorized: Emergency lockdown requires admin privileges';
  END IF;
  
  -- Revoke all active safeguarding permissions temporarily
  UPDATE public.safeguarding_permissions 
  SET is_active = false
  WHERE is_active = true;
  
  -- Log the emergency lockdown
  PERFORM log_admin_action(
    'EMERGENCY_SAFEGUARDING_LOCKDOWN',
    'child_protection_emergency',
    reason,
    jsonb_build_object(
      'lockdown_admin', auth.uid(),
      'lockdown_time', now(),
      'reason', reason,
      'security_level', 'EMERGENCY_CHILD_PROTECTION'
    )
  );
  
  -- Also log to security audit
  PERFORM log_sensitive_operation(
    'EMERGENCY_SAFEGUARDING_LOCKDOWN',
    'child_protection_emergency',
    reason
  );
END;
$$;

-- 7. Test the security configuration
CREATE OR REPLACE FUNCTION test_safeguarding_security()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb;
  policy_count integer;
  function_count integer;
BEGIN
  -- Only admins can run security tests
  IF NOT verify_admin_with_mfa() THEN
    RETURN jsonb_build_object('error', 'Access denied');
  END IF;
  
  -- Count safeguarding policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'safeguarding_reports'
    AND schemaname = 'public';
  
  -- Count safeguarding functions
  SELECT COUNT(*) INTO function_count
  FROM pg_proc
  WHERE proname LIKE '%safeguarding%';
  
  result := jsonb_build_object(
    'table_name', 'safeguarding_reports',
    'rls_enabled', (
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = 'safeguarding_reports'
    ),
    'policy_count', policy_count,
    'security_functions', function_count,
    'policies', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', policyname,
          'command', cmd,
          'restrictive', NOT permissive
        )
      )
      FROM pg_policies
      WHERE tablename = 'safeguarding_reports'
    ),
    'security_status', CASE 
      WHEN policy_count >= 2 THEN 'MAXIMUM_PROTECTION'
      ELSE 'NEEDS_ATTENTION'
    END,
    'test_timestamp', now()
  );
  
  -- Log the security test
  PERFORM log_sensitive_operation(
    'safeguarding_security_test',
    'security_verification',
    result::text
  );
  
  RETURN result;
END;
$$;

-- Run security test and return results
SELECT test_safeguarding_security() as safeguarding_security_status;
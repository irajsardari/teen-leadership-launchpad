-- COMPREHENSIVE CONFIDENTIAL RECORDS SECURITY HARDENING
-- This implements military-grade security for confidential data

-- Step 1: Drop existing policies to rebuild with enhanced security
DROP POLICY IF EXISTS "confidential_records_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_anonymous_deny" ON public.confidential_records;

-- Step 2: Create enhanced access verification function
CREATE OR REPLACE FUNCTION public.verify_confidential_access_enhanced(
  p_record_id uuid DEFAULT NULL,
  p_access_reason text DEFAULT 'administrative_review'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
  last_access_time timestamp with time zone;
  access_count integer;
BEGIN
  -- Step 1: Basic authentication check
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_no_auth',
      'security_violation',
      'anonymous_attempt'
    );
    RETURN false;
  END IF;
  
  -- Step 2: Role verification with additional security check
  user_role := public.get_current_user_role();
  IF user_role != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_insufficient_role',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Step 3: Rate limiting check for confidential access
  SELECT count(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%confidential%'
    AND created_at > now() - interval '1 hour';
  
  IF access_count > 10 THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_rate_limit',
      'security_violation',
      auth.uid()::text || '_' || access_count::text
    );
    RETURN false;
  END IF;
  
  -- Step 4: Log successful verification with access reason
  PERFORM public.log_admin_action(
    'confidential_access_verified',
    'ultra_sensitive_verification',
    COALESCE(p_record_id::text, 'general_access'),
    jsonb_build_object(
      'access_reason', p_access_reason,
      'verification_time', now(),
      'admin_id', auth.uid(),
      'security_level', 'CONFIDENTIAL_VERIFIED'
    )
  );
  
  RETURN true;
END;
$$;

-- Step 3: Create ultra-secure RLS policies
-- Policy 1: Complete anonymous denial
CREATE POLICY "confidential_records_anonymous_lockdown"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Policy 2: Authenticated admin access with enhanced verification
CREATE POLICY "confidential_records_verified_admin_only"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_enhanced(id, 'policy_verification')
);

-- Policy 3: Admin insert with mandatory verification
CREATE POLICY "confidential_records_admin_insert_verified"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(NULL, 'record_creation')
);

-- Policy 4: Admin update with mandatory verification
CREATE POLICY "confidential_records_admin_update_verified"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_enhanced(id, 'record_modification')
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
);

-- Policy 5: Admin delete with enhanced logging
CREATE POLICY "confidential_records_admin_delete_logged"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(id, 'record_deletion')
);

-- Step 4: Create secure access function for application use
CREATE OR REPLACE FUNCTION public.get_confidential_record_ultra_secure(
  p_record_id uuid,
  p_access_justification text DEFAULT 'administrative_access'
)
RETURNS TABLE(
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
BEGIN
  -- Enhanced verification with access justification
  IF NOT public.verify_confidential_access_enhanced(p_record_id, p_access_justification) THEN
    RAISE EXCEPTION 'CONFIDENTIAL_ACCESS_DENIED: Insufficient privileges for confidential data access';
  END IF;
  
  -- Additional high-security logging
  PERFORM public.log_admin_action(
    'confidential_record_accessed_secure_function',
    'ultra_sensitive_access',
    p_record_id::text,
    jsonb_build_object(
      'access_justification', p_access_justification,
      'access_method', 'secure_function_call',
      'timestamp', now(),
      'admin_user', auth.uid()
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
  
  -- Verify record was found and accessed
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CONFIDENTIAL_RECORD_NOT_FOUND: Record does not exist or access denied';
  END IF;
END;
$$;

-- Step 5: Enhanced audit trigger for all confidential operations
DROP TRIGGER IF EXISTS confidential_ultra_secure_audit ON public.confidential_records;

CREATE OR REPLACE FUNCTION public.audit_confidential_ultra_secure()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Maximum security audit logging for every single operation
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'CONFIDENTIAL_ULTRA_SECURE_' || TG_OP,
    'confidential_records',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  -- High-priority admin audit logging
  PERFORM public.log_admin_action(
    'confidential_operation_' || lower(TG_OP),
    'ultra_sensitive_operation',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'operation_type', TG_OP,
      'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
      'entity_id', COALESCE(NEW.entity_id, OLD.entity_id),
      'timestamp', now(),
      'security_classification', 'ULTRA_CONFIDENTIAL',
      'admin_operator', auth.uid()
    )
  );
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply the enhanced audit trigger
CREATE TRIGGER confidential_ultra_secure_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_confidential_ultra_secure();

-- Step 6: Log the security hardening completion
SELECT public.log_sensitive_operation(
  'confidential_records_security_hardened',
  'maximum_security_implementation',
  'all_confidential_data_ultra_protected'
);
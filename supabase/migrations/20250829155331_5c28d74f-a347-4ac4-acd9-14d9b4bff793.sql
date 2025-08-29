-- COMPREHENSIVE CONFIDENTIAL RECORDS SECURITY FIX
-- Drop all existing policies first, then implement enhanced security

-- Step 1: Drop ALL existing policies on confidential_records
DROP POLICY IF EXISTS "confidential_records_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_anonymous_deny" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_anonymous_lockdown" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_verified_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_insert_verified" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_update_verified" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_delete_logged" ON public.confidential_records;

-- Step 2: Create enhanced access verification function (with IF NOT EXISTS check)
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
  access_count integer;
BEGIN
  -- Authentication check
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_no_auth',
      'security_violation',
      'anonymous_attempt'
    );
    RETURN false;
  END IF;
  
  -- Role verification
  user_role := public.get_current_user_role();
  IF user_role != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_insufficient_role', 
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Rate limiting (max 10 confidential accesses per hour)
  SELECT count(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%confidential%'
    AND created_at > now() - interval '1 hour';
  
  IF access_count > 10 THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_rate_limit',
      'security_violation', 
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Log successful access verification
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

-- Step 3: Create new ultra-secure RLS policies

-- Complete anonymous lockdown
CREATE POLICY "confidential_ultra_secure_anonymous_deny"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Admin SELECT with enhanced verification
CREATE POLICY "confidential_ultra_secure_admin_select"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_enhanced(id, 'select_operation')
);

-- Admin INSERT with verification
CREATE POLICY "confidential_ultra_secure_admin_insert"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(NULL, 'insert_operation')
);

-- Admin UPDATE with verification
CREATE POLICY "confidential_ultra_secure_admin_update"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_enhanced(id, 'update_operation')
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
);

-- Admin DELETE with verification
CREATE POLICY "confidential_ultra_secure_admin_delete"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(id, 'delete_operation')
);

-- Step 4: Enhanced audit trigger
DROP TRIGGER IF EXISTS confidential_ultra_secure_audit ON public.confidential_records;
DROP TRIGGER IF EXISTS confidential_records_audit_trigger ON public.confidential_records;

CREATE OR REPLACE FUNCTION public.audit_confidential_max_security()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Maximum security logging for every operation
  PERFORM public.log_sensitive_operation(
    'CONFIDENTIAL_MAX_SECURITY_' || TG_OP,
    'confidential_records',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Admin audit with full details
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'confidential_max_security_' || lower(TG_OP),
      'ultra_sensitive_data',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'operation_type', TG_OP,
        'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
        'timestamp', now(),
        'security_classification', 'MAX_CONFIDENTIAL',
        'admin_operator', auth.uid()
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

-- Apply the audit trigger
CREATE TRIGGER confidential_max_security_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_confidential_max_security();

-- Step 5: Log successful security hardening
SELECT public.log_sensitive_operation(
  'confidential_records_max_security_applied',
  'security_hardening_complete',
  'ultra_secure_confidential_protection'
);
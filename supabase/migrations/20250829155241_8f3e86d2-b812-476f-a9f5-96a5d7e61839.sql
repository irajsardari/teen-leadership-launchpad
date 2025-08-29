-- CONFIDENTIAL RECORDS SECURITY FIX - Complete cleanup and rebuild
-- Drop ALL existing policies and rebuild with enhanced security

-- Step 1: Drop ALL existing policies on confidential_records table
DROP POLICY IF EXISTS "confidential_records_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_anonymous_deny" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_anonymous_lockdown" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_verified_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_insert_verified" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_update_verified" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_delete_logged" ON public.confidential_records;

-- Step 2: Create the enhanced access verification function
CREATE OR REPLACE FUNCTION public.verify_confidential_access_maximum_security(
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
      auth.uid()::text || '_attempts_' || access_count::text
    );
    RETURN false;
  END IF;
  
  -- Log successful verification
  PERFORM public.log_admin_action(
    'confidential_access_verified_maximum_security',
    'ultra_sensitive_verification',
    COALESCE(p_record_id::text, 'general_access'),
    jsonb_build_object(
      'access_reason', p_access_reason,
      'verification_time', now(),
      'admin_id', auth.uid(),
      'security_level', 'MAXIMUM_CONFIDENTIAL_VERIFIED'
    )
  );
  
  RETURN true;
END;
$$;

-- Step 3: Create new enhanced security policies
CREATE POLICY "confidential_maximum_security_anonymous_deny"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "confidential_maximum_security_admin_select"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_maximum_security(id, 'secure_select_operation')
);

CREATE POLICY "confidential_maximum_security_admin_insert"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_maximum_security(NULL, 'secure_insert_operation')
);

CREATE POLICY "confidential_maximum_security_admin_update"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_maximum_security(id, 'secure_update_operation')
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
);

CREATE POLICY "confidential_maximum_security_admin_delete"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_maximum_security(id, 'secure_delete_operation')
);

-- Step 4: Log the successful security hardening
SELECT public.log_sensitive_operation(
  'confidential_records_maximum_security_implemented',
  'ultra_secure_hardening_complete',
  'confidential_data_now_maximum_protected'
);
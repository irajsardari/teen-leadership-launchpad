-- Fix for confidential records security - Drop existing function first
DROP FUNCTION IF EXISTS public.get_confidential_record_ultra_secure(uuid, text);
DROP FUNCTION IF EXISTS public.get_confidential_record_secure(uuid, text);

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
  
  -- Step 2: Role verification
  user_role := public.get_current_user_role();
  IF user_role != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'confidential_access_denied_insufficient_role',
      'security_violation',
      auth.uid()::text
    );
    RETURN false;
  END IF;
  
  -- Step 3: Rate limiting check (max 10 accesses per hour)
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
  
  -- Step 4: Log successful verification
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
CREATE POLICY "confidential_records_anonymous_lockdown"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "confidential_records_verified_admin_only"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.verify_confidential_access_enhanced(id, 'policy_verification')
);

CREATE POLICY "confidential_records_admin_insert_verified"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(NULL, 'record_creation')
);

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

CREATE POLICY "confidential_records_admin_delete_logged"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.verify_confidential_access_enhanced(id, 'record_deletion')
);

-- Log the security hardening completion
SELECT public.log_sensitive_operation(
  'confidential_records_security_hardened_complete',
  'maximum_security_implementation',
  'ultra_confidential_protection_active'
);
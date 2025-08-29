-- CONFIDENTIAL RECORDS SECURITY FIX - Clean Approach
-- Using unique policy names to avoid conflicts

-- Step 1: Drop all possible existing policies
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on confidential_records
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'confidential_records'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.confidential_records', policy_record.policyname);
    END LOOP;
END $$;

-- Step 2: Create the enhanced verification function
CREATE OR REPLACE FUNCTION public.confidential_access_guardian()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
  recent_access_count integer;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'confidential_unauthorized_access_attempt',
      'security_breach_attempt',
      'no_authentication'
    );
    RETURN false;
  END IF;
  
  -- Must be admin role
  user_role := public.get_current_user_role();
  IF user_role IS NULL OR user_role != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'confidential_insufficient_privileges',
      'security_violation',
      auth.uid()::text || '_role_' || COALESCE(user_role, 'null')
    );
    RETURN false;
  END IF;
  
  -- Rate limiting: Max 15 confidential operations per hour per admin
  SELECT count(*) INTO recent_access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%confidential%'
    AND created_at > (now() - interval '1 hour');
  
  IF recent_access_count >= 15 THEN
    PERFORM public.log_sensitive_operation(
      'confidential_rate_limit_exceeded',
      'security_protection',
      auth.uid()::text || '_count_' || recent_access_count::text
    );
    RETURN false;
  END IF;
  
  -- Log authorized access
  PERFORM public.log_admin_action(
    'confidential_access_authorized',
    'security_clearance',
    auth.uid()::text,
    jsonb_build_object(
      'clearance_time', now(),
      'recent_access_count', recent_access_count,
      'security_level', 'CONFIDENTIAL_CLEARED'
    )
  );
  
  RETURN true;
END;
$$;

-- Step 3: Create new security policies with unique names
CREATE POLICY "cr_sec_v1_anon_block"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "cr_sec_v1_admin_select"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.confidential_access_guardian()
);

CREATE POLICY "cr_sec_v1_admin_insert"
ON public.confidential_records
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.confidential_access_guardian()
);

CREATE POLICY "cr_sec_v1_admin_update"
ON public.confidential_records
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.confidential_access_guardian()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
);

CREATE POLICY "cr_sec_v1_admin_delete"
ON public.confidential_records
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
  AND public.confidential_access_guardian()
);

-- Step 4: Enhanced audit trigger
DROP TRIGGER IF EXISTS confidential_security_v1_audit ON public.confidential_records;

CREATE OR REPLACE FUNCTION public.confidential_security_audit_v1()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log every confidential operation with maximum detail
  PERFORM public.log_sensitive_operation(
    'CONFIDENTIAL_SECURE_' || TG_OP,
    'confidential_records_v1',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Detailed admin audit logging
  IF auth.uid() IS NOT NULL THEN
    PERFORM public.log_admin_action(
      'confidential_audit_v1_' || lower(TG_OP),
      'sensitive_data_governance',
      COALESCE(NEW.id::text, OLD.id::text),
      jsonb_build_object(
        'operation', TG_OP,
        'entity_type', COALESCE(NEW.entity_type, OLD.entity_type),
        'entity_id', COALESCE(NEW.entity_id, OLD.entity_id),
        'audit_timestamp', now(),
        'admin_user_id', auth.uid(),
        'security_classification', 'CONFIDENTIAL_PROTECTED'
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

CREATE TRIGGER confidential_security_v1_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.confidential_security_audit_v1();

-- Step 5: Log completion
SELECT public.log_sensitive_operation(
  'confidential_records_secured_v1',
  'security_implementation',
  'enhanced_protection_active'
);
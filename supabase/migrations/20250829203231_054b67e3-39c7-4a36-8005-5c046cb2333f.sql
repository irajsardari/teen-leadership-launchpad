-- Complete the confidential records policies and fix remaining security issues

-- Maximum security for confidential records  
CREATE POLICY "confidential_admin_verified_access" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  );

-- Add comprehensive security logging for all sensitive operations
CREATE OR REPLACE FUNCTION public.comprehensive_security_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all operations on sensitive tables
  PERFORM public.log_sensitive_operation(
    'ULTRA_SECURE_' || TG_OP || '_' || TG_TABLE_NAME,
    'maximum_security_table',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- High-priority admin logging
  PERFORM public.log_admin_action(
    'ultra_secure_' || lower(TG_OP),
    'critical_data_protection',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'operation_type', TG_OP,
      'user_role', get_current_user_role(),
      'user_id', auth.uid(),
      'security_classification', 'ULTRA_SENSITIVE',
      'access_timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply comprehensive security audit to all ultra-sensitive tables
DROP TRIGGER IF EXISTS comprehensive_security_challengers ON public.challengers;
CREATE TRIGGER comprehensive_security_challengers
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.comprehensive_security_audit();

DROP TRIGGER IF EXISTS comprehensive_security_parental_consents ON public.parental_consents;
CREATE TRIGGER comprehensive_security_parental_consents
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.comprehensive_security_audit();

DROP TRIGGER IF EXISTS comprehensive_security_safeguarding ON public.safeguarding_reports;
CREATE TRIGGER comprehensive_security_safeguarding
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.comprehensive_security_audit();

DROP TRIGGER IF EXISTS comprehensive_security_confidential ON public.confidential_records;
CREATE TRIGGER comprehensive_security_confidential
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.comprehensive_security_audit();

-- Fix function search path issues by updating existing functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_safeguarding_access(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.safeguarding_permissions sp
        WHERE sp.user_id = check_user_id 
        AND sp.is_active = true
    ) OR public.get_current_user_role() = 'admin';
$$;
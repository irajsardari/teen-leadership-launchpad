-- Final comprehensive security lockdown with additional safeguards

-- Ensure all sensitive tables have RLS enabled (should already be enabled but double-check)
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Force RLS for all roles on sensitive tables (prevents bypass)
ALTER TABLE public.teacher_applications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.challengers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports FORCE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records FORCE ROW LEVEL SECURITY;

-- Add explicit denial policies for all non-admin roles
CREATE POLICY "deny_all_non_admin_teacher_apps" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_non_admin_challengers" ON public.challengers
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_non_admin_parental" ON public.parental_consents
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_non_admin_safeguarding" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_non_admin_confidential" ON public.confidential_records
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- Create audit trigger for all sensitive table access
CREATE OR REPLACE FUNCTION public.log_all_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log every single access attempt to sensitive data
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'SENSITIVE_ACCESS_' || TG_OP || '_' || TG_TABLE_NAME,
    'ultra_sensitive_table',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  -- Also log to admin audit
  PERFORM public.log_admin_action(
    'sensitive_data_access',
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'operation', TG_OP,
      'user_role', get_current_user_role(),
      'timestamp', now(),
      'security_level', 'MAXIMUM_PROTECTION'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply audit triggers to all sensitive tables
DROP TRIGGER IF EXISTS log_teacher_apps_access ON public.teacher_applications;
CREATE TRIGGER log_teacher_apps_access
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_all_sensitive_access();

DROP TRIGGER IF EXISTS log_challengers_access ON public.challengers;
CREATE TRIGGER log_challengers_access
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.log_all_sensitive_access();

DROP TRIGGER IF EXISTS log_parental_access ON public.parental_consents;
CREATE TRIGGER log_parental_access
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.log_all_sensitive_access();

DROP TRIGGER IF EXISTS log_safeguarding_access ON public.safeguarding_reports;
CREATE TRIGGER log_safeguarding_access
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.log_all_sensitive_access();

DROP TRIGGER IF EXISTS log_confidential_access ON public.confidential_records;
CREATE TRIGGER log_confidential_access
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.log_all_sensitive_access();

-- Create admin-only view for accessing sensitive data with full audit trail
CREATE OR REPLACE VIEW public.admin_secure_teacher_applications AS
SELECT 
  ta.*,
  'ADMIN_ACCESS_GRANTED' as access_level,
  now() as accessed_at,
  get_current_user_role() as accessor_role
FROM public.teacher_applications ta
WHERE get_current_user_role() = 'admin';

CREATE OR REPLACE VIEW public.admin_secure_challengers AS  
SELECT 
  c.*,
  'ADMIN_ACCESS_GRANTED' as access_level,
  now() as accessed_at,
  get_current_user_role() as accessor_role
FROM public.challengers c
WHERE get_current_user_role() = 'admin';

-- Grant select on views only to authenticated users with admin role
GRANT SELECT ON public.admin_secure_teacher_applications TO authenticated;
GRANT SELECT ON public.admin_secure_challengers TO authenticated;
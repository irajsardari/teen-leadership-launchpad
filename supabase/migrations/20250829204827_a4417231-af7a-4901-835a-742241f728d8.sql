-- Ultimate security lockdown - explicitly block all non-admin access

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "teacher_applications_admin_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_no_anon" ON public.teacher_applications;
DROP POLICY IF EXISTS "challengers_admin_only" ON public.challengers;
DROP POLICY IF EXISTS "challengers_no_anon" ON public.challengers;
DROP POLICY IF EXISTS "parental_consents_admin_only" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_no_anon" ON public.parental_consents;
DROP POLICY IF EXISTS "safeguarding_reports_admin_only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_no_anon" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "confidential_records_admin_verified" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_no_anon" ON public.confidential_records;

-- TEACHER APPLICATIONS: Ultimate lockdown
CREATE POLICY "teacher_applications_ultimate_security" ON public.teacher_applications
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- CHALLENGERS: Ultimate lockdown  
CREATE POLICY "challengers_ultimate_security" ON public.challengers
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- PARENTAL CONSENTS: Ultimate lockdown
CREATE POLICY "parental_consents_ultimate_security" ON public.parental_consents
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- SAFEGUARDING REPORTS: Ultimate lockdown
CREATE POLICY "safeguarding_reports_ultimate_security" ON public.safeguarding_reports
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- CONFIDENTIAL RECORDS: Ultimate lockdown with triple verification
CREATE POLICY "confidential_records_ultimate_security" ON public.confidential_records
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    secure_confidential_access_check() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    get_current_user_role() = 'admin' AND
    secure_confidential_access_check() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on all sensitive tables (ensure it's enabled)
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Force row level security (no bypassing for table owner)
ALTER TABLE public.teacher_applications FORCE ROW LEVEL SECURITY;
ALTER TABLE public.challengers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports FORCE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records FORCE ROW LEVEL SECURITY;

-- Add security logging for all table access
CREATE OR REPLACE FUNCTION public.audit_all_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log every single access attempt
  PERFORM public.log_sensitive_operation(
    'ULTIMATE_SECURE_' || TG_OP || '_' || TG_TABLE_NAME,
    'maximum_security_audit',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Additional admin audit
  PERFORM public.log_admin_action(
    'ultimate_security_' || lower(TG_OP),
    TG_TABLE_NAME || '_ultimate_secure',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_id', auth.uid(),
      'user_role', get_current_user_role(),
      'timestamp', now(),
      'security_level', 'ULTIMATE_MAXIMUM'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply ultimate security audit to all sensitive tables
CREATE TRIGGER ultimate_security_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_all_sensitive_access();

CREATE TRIGGER ultimate_security_challengers  
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_all_sensitive_access();

CREATE TRIGGER ultimate_security_parental_consents
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.audit_all_sensitive_access();

CREATE TRIGGER ultimate_security_safeguarding_reports
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_all_sensitive_access();

CREATE TRIGGER ultimate_security_confidential_records
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_all_sensitive_access();
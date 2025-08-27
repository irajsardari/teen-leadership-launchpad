-- Final security hardening: Ensure all sensitive tables have bulletproof RLS policies
-- Address any remaining cross-user access vulnerabilities

-- Ensure RLS is enabled on all sensitive tables (should already be, but double-check)
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Double-check that GRANT statements don't override our REVOKE statements
-- Remove any potential SELECT grants to public role that might exist
REVOKE SELECT ON public.challengers FROM public;
REVOKE SELECT ON public.teacher_applications FROM public;
REVOKE SELECT ON public.safeguarding_reports FROM public;
REVOKE SELECT ON public.confidential_records FROM public;
REVOKE SELECT ON public.parental_consents FROM public;
REVOKE SELECT ON public.profiles FROM public;

-- Ensure service_role still has access for admin functions
GRANT ALL ON public.challengers TO service_role;
GRANT ALL ON public.teacher_applications TO service_role;
GRANT ALL ON public.safeguarding_reports TO service_role;
GRANT ALL ON public.confidential_records TO service_role;
GRANT ALL ON public.parental_consents TO service_role;
GRANT ALL ON public.profiles TO service_role;

-- Add additional safeguard: Create a function to ensure proper user isolation
CREATE OR REPLACE FUNCTION public.ensure_user_isolation()
RETURNS TRIGGER AS $$
BEGIN
  -- For INSERT operations, ensure user_id matches authenticated user
  IF TG_OP = 'INSERT' AND NEW.user_id IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot insert record for different user';
  END IF;
  
  -- For UPDATE operations, ensure no user_id changes
  IF TG_OP = 'UPDATE' AND OLD.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change record ownership';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Apply the user isolation trigger to sensitive tables with user_id
DROP TRIGGER IF EXISTS ensure_challengers_isolation ON public.challengers;
CREATE TRIGGER ensure_challengers_isolation
  BEFORE INSERT OR UPDATE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_isolation();

DROP TRIGGER IF EXISTS ensure_teacher_applications_isolation ON public.teacher_applications;
CREATE TRIGGER ensure_teacher_applications_isolation
  BEFORE INSERT OR UPDATE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_isolation();

-- Log final security verification
SELECT public.log_sensitive_operation(
  'final_security_hardening_complete',
  'database_security',
  'user_isolation_triggers_applied'
);
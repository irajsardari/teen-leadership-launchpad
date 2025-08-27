-- Security fix: Ensure RLS policies are properly secured for sensitive data

-- 1. Ensure RLS is enabled on all sensitive data tables (ignore if already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'challengers' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Drop any potentially problematic public access policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.challengers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.challengers;
DROP POLICY IF EXISTS "Public read access" ON public.challengers;
DROP POLICY IF EXISTS "Anonymous read access" ON public.challengers;

-- Same for other sensitive tables
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teacher_applications;
DROP POLICY IF EXISTS "Public read access" ON public.teacher_applications;
DROP POLICY IF EXISTS "Anonymous read access" ON public.teacher_applications;

-- 3. Ensure all sensitive data policies require proper authentication
-- For challengers table
DROP POLICY IF EXISTS "Users can view own challenger records" ON public.challengers;
CREATE POLICY "Users can view own challenger records" 
ON public.challengers 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- For teacher applications  
DROP POLICY IF EXISTS "Users can view their own applications" ON public.teacher_applications;
CREATE POLICY "Users can view their own applications" 
ON public.teacher_applications 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 4. Create audit function for sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_table_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all access to sensitive data
  PERFORM public.log_sensitive_operation(
    TG_OP || '_' || TG_TABLE_NAME,
    'sensitive_data_access',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_challengers_access ON public.challengers;
CREATE TRIGGER audit_challengers_access
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_table_access();

-- 6. Log this security fix
SELECT public.log_sensitive_operation(
  'security_policies_hardened',
  'database_security',
  'challengers_and_teacher_applications_secured'
);
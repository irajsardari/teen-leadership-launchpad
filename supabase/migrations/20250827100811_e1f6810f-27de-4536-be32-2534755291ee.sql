-- Security fix: Ensure RLS is properly enabled and configured for all sensitive tables

-- 1. Ensure RLS is enabled on all sensitive data tables
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop any potentially problematic policies and recreate them properly
DROP POLICY IF EXISTS "Enable read access for all users" ON public.challengers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.challengers;
DROP POLICY IF EXISTS "Public read access" ON public.challengers;
DROP POLICY IF EXISTS "Anonymous read access" ON public.challengers;

-- 3. Ensure all challenger policies require proper authentication
DROP POLICY IF EXISTS "Users can view own challenger records" ON public.challengers;
CREATE POLICY "Users can view own challenger records" 
ON public.challengers 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own challenger records" ON public.challengers;
CREATE POLICY "Users can update own challenger records" 
ON public.challengers 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own challenger records" ON public.challengers;
CREATE POLICY "Users can delete own challenger records" 
ON public.challengers 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can register as challenger" ON public.challengers;
CREATE POLICY "Authenticated users can register as challenger" 
ON public.challengers 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 4. Ensure teacher applications are secure
DROP POLICY IF EXISTS "Users can view their own applications" ON public.teacher_applications;
CREATE POLICY "Users can view their own applications" 
ON public.teacher_applications 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own applications" ON public.teacher_applications;
CREATE POLICY "Users can update their own applications" 
ON public.teacher_applications 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can submit own teacher application" ON public.teacher_applications;
CREATE POLICY "Authenticated users can submit own teacher application" 
ON public.teacher_applications 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 5. Ensure safeguarding reports are properly secured
DROP POLICY IF EXISTS "Authenticated users can submit safeguarding reports" ON public.safeguarding_reports;
CREATE POLICY "Authenticated users can submit safeguarding reports" 
ON public.safeguarding_reports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Create a security audit function to log all access attempts to sensitive data
CREATE OR REPLACE FUNCTION public.audit_sensitive_table_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive data
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

-- 7. Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_challengers_access ON public.challengers;
CREATE TRIGGER audit_challengers_access
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_teacher_applications_access ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications_access
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_table_access();

-- 8. Add additional security constraints
-- Ensure user_id is never null for challenger records
ALTER TABLE public.challengers ADD CONSTRAINT challengers_user_id_not_null CHECK (user_id IS NOT NULL);

-- Ensure user_id is never null for teacher applications  
ALTER TABLE public.teacher_applications ADD CONSTRAINT teacher_applications_user_id_not_null CHECK (user_id IS NOT NULL);

-- 9. Create a function to validate data access patterns
CREATE OR REPLACE FUNCTION public.validate_user_data_access(table_name TEXT, record_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow access if user is authenticated and accessing their own data, or is admin
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'unauthorized_access_attempt',
      table_name,
      record_user_id::text
    );
    RETURN FALSE;
  END IF;
  
  IF auth.uid() = record_user_id OR public.get_current_user_role() = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  PERFORM public.log_sensitive_operation(
    'unauthorized_access_denied',
    table_name,
    record_user_id::text
  );
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
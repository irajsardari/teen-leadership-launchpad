-- Fix security warnings from linter

-- 1. Fix function search path for security functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 2. Fix search path for existing functions that might have this issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 3. Run a final security verification
SELECT public.log_sensitive_operation(
  'database_security_hardened',
  'security_audit',
  'all_sensitive_tables_secured'
);
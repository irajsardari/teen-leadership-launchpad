-- Fix security warnings from previous migration
-- Issue: Function search_path not set properly

-- Update the audit function to have proper search_path
CREATE OR REPLACE FUNCTION public.audit_challenger_access() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to sensitive student data
  PERFORM public.log_sensitive_operation(
    'challenger_' || lower(TG_OP),
    'sensitive_student_data',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;
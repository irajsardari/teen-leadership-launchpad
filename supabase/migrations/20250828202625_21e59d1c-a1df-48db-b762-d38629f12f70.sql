-- Fix security issue: Set proper search_path for the log_challenger_access function
-- This prevents search path injection attacks

CREATE OR REPLACE FUNCTION public.log_challenger_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to challenger data for security monitoring
  PERFORM public.log_sensitive_operation(
    'challenger_data_' || lower(TG_OP),
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
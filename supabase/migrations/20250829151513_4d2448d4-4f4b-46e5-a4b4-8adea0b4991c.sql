-- Fix security linter warnings: Function search path mutable issues

-- Fix get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

-- Fix audit_sensitive_data function
CREATE OR REPLACE FUNCTION public.audit_sensitive_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log to existing security_audit_logs for compatibility
  INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id
  ) VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    'sensitive_data',
    COALESCE(NEW.id::TEXT, OLD.id::TEXT)
  );
  
  -- Log to new audit trail
  INSERT INTO public.security_audit_trail (
    user_id, table_name, operation, record_id, old_values, new_values
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Fix cleanup_sensitive_data function
CREATE OR REPLACE FUNCTION public.cleanup_sensitive_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Delete rejected teacher applications older than 90 days
  DELETE FROM public.teacher_applications 
  WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '90 days';
    
  -- Log cleanup operation
  INSERT INTO public.security_audit_trail (
    user_id, table_name, operation, record_id
  ) VALUES (
    NULL, 'system_cleanup', 'DATA_RETENTION', 'automated_cleanup_' || NOW()::TEXT
  );
END;
$$;
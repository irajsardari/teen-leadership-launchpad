-- Fix Security Linter Warnings
-- Address function search path and leaked password protection issues

-- Fix function search path security for the functions we created
CREATE OR REPLACE FUNCTION public.secure_teacher_application_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user
  IF NEW.user_id IS NULL OR NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Security violation: user_id must match authenticated user';
  END IF;
  
  -- Log the secure insertion
  PERFORM public.log_sensitive_operation(
    'secure_teacher_application_insert',
    'teacher_applications',
    NEW.id::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.log_secure_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'SECURE_ACCESS_' || TG_OP || '_' || TG_TABLE_NAME,
    'protected_data',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also fix existing security functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.log_sensitive_operation(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id
  );
END;
$$;
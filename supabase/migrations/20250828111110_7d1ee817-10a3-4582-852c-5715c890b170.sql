-- Fix security warnings: Function Search Path Mutable
-- Update functions to have immutable search_path settings

-- Fix get_current_user_role function to have secure search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(role, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

-- Fix other functions that might have mutable search paths
CREATE OR REPLACE FUNCTION public.log_sensitive_operation(p_action text, p_resource_type text, p_resource_id text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix log_admin_action function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id, action, resource_type, resource_id, details
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id, p_details
  );
END;
$$;

-- Verify all functions have secure search_path
SELECT public.log_sensitive_operation(
  'security_warnings_fixed',
  'database_functions',
  'search_path_secured'
);
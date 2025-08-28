-- Fix function search path security warning
-- All functions must have SET search_path for security

-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.has_safeguarding_access(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.safeguarding_permissions sp
        WHERE sp.user_id = check_user_id 
        AND sp.is_active = true
    ) OR public.get_current_user_role() = 'admin';
$$;

-- Update audit function to have proper search_path
CREATE OR REPLACE FUNCTION public.audit_safeguarding_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Log all access attempts to safeguarding reports
    PERFORM public.log_sensitive_operation(
        'safeguarding_report_' || lower(TG_OP),
        'child_safety_report',
        COALESCE(NEW.id::text, OLD.id::text)
    );
    
    -- Additional high-priority logging for child safety
    INSERT INTO public.security_audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address
    ) VALUES (
        auth.uid(),
        'CRITICAL_CHILD_SAFETY_ACCESS_' || TG_OP,
        'safeguarding_reports',
        COALESCE(NEW.id::text, OLD.id::text),
        inet_client_addr()
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Update grant function to have proper search_path
CREATE OR REPLACE FUNCTION public.grant_safeguarding_access(
    target_user_id UUID,
    access_role public.safeguarding_role
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    permission_id UUID;
BEGIN
    -- Only admins can grant safeguarding access
    IF get_current_user_role() != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can grant safeguarding access';
    END IF;
    
    -- Insert or update permission
    INSERT INTO public.safeguarding_permissions (user_id, role, granted_by, is_active)
    VALUES (target_user_id, access_role, auth.uid(), true)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        is_active = true,
        granted_by = auth.uid(),
        granted_at = now()
    RETURNING id INTO permission_id;
    
    -- Log the permission grant
    PERFORM public.log_sensitive_operation(
        'safeguarding_access_granted',
        'safeguarding_permissions',
        permission_id::text
    );
    
    RETURN permission_id;
END;
$$;

-- Log security hardening completion
SELECT public.log_sensitive_operation(
    'function_search_path_security_fix_applied',
    'database_security',
    'safeguarding_protection_complete'
);
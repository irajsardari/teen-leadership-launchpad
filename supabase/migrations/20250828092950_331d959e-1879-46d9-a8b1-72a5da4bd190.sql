-- Critical Security Fix: Restrict safeguarding reports to authorized personnel only
-- This addresses the security concern about child safety reports being accessible by general admins

-- Create specialized safeguarding officer role  
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'safeguarding_role') THEN
        CREATE TYPE public.safeguarding_role AS ENUM ('safeguarding_officer', 'safeguarding_manager');
    END IF;
END $$;

-- Create safeguarding permissions table to track who can access reports
CREATE TABLE IF NOT EXISTS public.safeguarding_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.safeguarding_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role)
);

-- Enable RLS on safeguarding permissions
ALTER TABLE public.safeguarding_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check safeguarding access
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

-- Create audit function for safeguarding access
CREATE OR REPLACE FUNCTION public.audit_safeguarding_access()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies and create more restrictive ones
DROP POLICY IF EXISTS "Safeguarding: Admin access only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authenticated submission only" ON public.safeguarding_reports;

-- New restrictive policies for safeguarding reports
CREATE POLICY "Safeguarding: Authorized personnel only - SELECT"
    ON public.safeguarding_reports
    FOR SELECT
    TO authenticated
    USING (
        block_unauthorized_access('safeguarding_reports'::text) AND
        has_safeguarding_access(auth.uid())
    );

CREATE POLICY "Safeguarding: Authorized personnel only - UPDATE"
    ON public.safeguarding_reports
    FOR UPDATE
    TO authenticated
    USING (
        block_unauthorized_access('safeguarding_reports'::text) AND
        has_safeguarding_access(auth.uid())
    )
    WITH CHECK (has_safeguarding_access(auth.uid()));

CREATE POLICY "Safeguarding: Authorized personnel only - DELETE"
    ON public.safeguarding_reports
    FOR DELETE
    TO authenticated
    USING (
        block_unauthorized_access('safeguarding_reports'::text) AND
        has_safeguarding_access(auth.uid())
    );

-- Allow authenticated users to submit reports (but not view them)
CREATE POLICY "Safeguarding: Authenticated submission only"
    ON public.safeguarding_reports
    FOR INSERT
    TO authenticated
    WITH CHECK (
        block_unauthorized_access('safeguarding_reports'::text) AND
        auth.uid() IS NOT NULL
    );

-- Create policy for safeguarding permissions table
CREATE POLICY "Only admins manage safeguarding permissions"
    ON public.safeguarding_permissions
    FOR ALL
    TO authenticated
    USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

-- Apply audit trigger to safeguarding reports
DROP TRIGGER IF EXISTS audit_safeguarding_access_trigger ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_access_trigger
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
    FOR EACH ROW EXECUTE FUNCTION public.audit_safeguarding_access();

-- Create function to grant safeguarding access (admin only)
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

-- Log completion of security fix
SELECT public.log_sensitive_operation(
    'critical_safeguarding_security_fix_applied',
    'database_security',
    'child_safety_protection_enhanced'
);
-- Fix the security vulnerability in safeguarding access
-- Remove the admin fallback that bypasses safeguarding permissions
CREATE OR REPLACE FUNCTION public.has_safeguarding_access(check_user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
    -- Only allow access if user has explicit safeguarding permissions
    -- Removed the dangerous "OR admin" fallback for child protection
    SELECT EXISTS (
        SELECT 1 FROM public.safeguarding_permissions sp
        WHERE sp.user_id = check_user_id 
        AND sp.is_active = true
    );
$function$;

-- Create a separate function for super admin emergency access with logging
CREATE OR REPLACE FUNCTION public.has_emergency_safeguarding_access(check_user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Only super admin emergency access with full audit logging
    IF public.get_current_user_role() = 'admin' AND check_user_id = auth.uid() THEN
        -- Log the emergency access
        PERFORM public.log_sensitive_operation(
            'EMERGENCY_SAFEGUARDING_ACCESS',
            'child_protection_emergency',
            check_user_id::text
        );
        
        PERFORM public.log_admin_action(
            'emergency_safeguarding_access',
            'child_protection_override',
            check_user_id::text,
            jsonb_build_object(
                'admin_id', auth.uid(),
                'emergency_access', true,
                'timestamp', now(),
                'security_level', 'CHILD_PROTECTION_EMERGENCY'
            )
        );
        
        RETURN true;
    END IF;
    
    RETURN false;
END;
$function$;

-- Update RLS policies to use stricter access control
-- Only explicit safeguarding permissions OR emergency admin access
DROP POLICY IF EXISTS secure_safeguarding_select ON public.safeguarding_reports;
CREATE POLICY "secure_safeguarding_select" ON public.safeguarding_reports
FOR SELECT 
TO authenticated
USING (
    has_safeguarding_access(auth.uid()) OR 
    has_emergency_safeguarding_access(auth.uid())
);

DROP POLICY IF EXISTS secure_safeguarding_insert ON public.safeguarding_reports;
CREATE POLICY "secure_safeguarding_insert" ON public.safeguarding_reports
FOR INSERT 
TO authenticated
WITH CHECK (
    has_safeguarding_access(auth.uid()) OR 
    has_emergency_safeguarding_access(auth.uid())
);

DROP POLICY IF EXISTS secure_safeguarding_update ON public.safeguarding_reports;
CREATE POLICY "secure_safeguarding_update" ON public.safeguarding_reports
FOR UPDATE 
TO authenticated
USING (
    has_safeguarding_access(auth.uid()) OR 
    has_emergency_safeguarding_access(auth.uid())
)
WITH CHECK (
    has_safeguarding_access(auth.uid()) OR 
    has_emergency_safeguarding_access(auth.uid())
);

DROP POLICY IF EXISTS secure_safeguarding_delete ON public.safeguarding_reports;
CREATE POLICY "secure_safeguarding_delete" ON public.safeguarding_reports
FOR DELETE 
TO authenticated
USING (
    has_safeguarding_access(auth.uid()) OR 
    has_emergency_safeguarding_access(auth.uid())
);

-- Add a function to grant safeguarding permissions securely
CREATE OR REPLACE FUNCTION public.grant_safeguarding_permission(
    target_email text, 
    safeguarding_role safeguarding_role DEFAULT 'safeguarding_officer'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    target_user_id uuid;
    permission_id uuid;
BEGIN
    -- Only allow super admins to grant safeguarding access
    IF public.get_current_user_role() != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can grant safeguarding permissions';
    END IF;
    
    -- Get user ID from email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Insert safeguarding permission
    INSERT INTO public.safeguarding_permissions (
        user_id, 
        role, 
        granted_by, 
        is_active
    ) VALUES (
        target_user_id,
        safeguarding_role,
        auth.uid(),
        true
    ) 
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        is_active = true,
        granted_by = auth.uid(),
        granted_at = now()
    RETURNING id INTO permission_id;
    
    -- Log the permission grant
    PERFORM public.log_admin_action(
        'safeguarding_permission_granted',
        'child_protection_access',
        permission_id::text,
        jsonb_build_object(
            'target_user_id', target_user_id,
            'target_email', target_email,
            'safeguarding_role', safeguarding_role,
            'granted_by', auth.uid()
        )
    );
    
    RETURN permission_id;
END;
$function$;
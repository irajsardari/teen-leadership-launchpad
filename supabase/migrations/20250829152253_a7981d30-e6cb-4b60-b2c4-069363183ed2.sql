-- Fix critical child safety security issue in safeguarding_reports table
-- Remove problematic policies that allow reporters to view their own reports
-- Child safety reports should only be accessible to authorized safeguarding personnel and admins

-- Drop the problematic policy that allows reporters to view their own reports
DROP POLICY IF EXISTS "safeguarding_reporter_access" ON public.safeguarding_reports;

-- Drop duplicate insert policies to avoid conflicts
DROP POLICY IF EXISTS "safeguarding_create" ON public.safeguarding_reports;

-- Ensure only one clean insert policy exists
DROP POLICY IF EXISTS "safeguarding_reports_public_submit" ON public.safeguarding_reports;

-- Create a single, secure insert policy for report submission
CREATE POLICY "safeguarding_reports_secure_submit"
ON public.safeguarding_reports
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND reporter_id = auth.uid()
);

-- Ensure SELECT access is ONLY for authorized personnel (admins + safeguarding permissions)
-- Remove any broader access policies
DROP POLICY IF EXISTS "safeguarding_reports_authorized_access" ON public.safeguarding_reports;

-- Create strict READ access policy - ONLY admins and authorized safeguarding personnel
CREATE POLICY "safeguarding_reports_restricted_read"
ON public.safeguarding_reports
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
);

-- Ensure UPDATE access is ONLY for authorized personnel
DROP POLICY IF EXISTS "safeguarding_reports_authorized_modify" ON public.safeguarding_reports;

CREATE POLICY "safeguarding_reports_restricted_update"
ON public.safeguarding_reports
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
);

-- Keep the admin-only DELETE policy as is (already secure)
-- safeguarding_reports_admin_delete policy already exists and is properly restrictive

-- Add additional security: Log all access attempts to safeguarding reports
CREATE OR REPLACE FUNCTION public.audit_safeguarding_critical_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Log every single access attempt to child safety reports with maximum detail
    PERFORM public.log_sensitive_operation(
        'CHILD_SAFETY_CRITICAL_' || TG_OP,
        'safeguarding_reports_access',
        COALESCE(NEW.id::text, OLD.id::text)
    );
    
    -- Additional high-priority security audit for child protection
    IF auth.uid() IS NOT NULL THEN
        PERFORM public.log_admin_action(
            'child_protection_' || lower(TG_OP),
            'safeguarding_critical_access',
            COALESCE(NEW.id::text, OLD.id::text),
            jsonb_build_object(
                'user_role', get_current_user_role(),
                'has_safeguarding_access', has_safeguarding_access(auth.uid()),
                'report_type', COALESCE(NEW.report_type, OLD.report_type),
                'timestamp', now(),
                'security_level', 'CHILD_PROTECTION_MAXIMUM'
            )
        );
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- Apply the critical security audit trigger
DROP TRIGGER IF EXISTS safeguarding_critical_audit_trigger ON public.safeguarding_reports;
CREATE TRIGGER safeguarding_critical_audit_trigger
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
    FOR EACH ROW EXECUTE FUNCTION public.audit_safeguarding_critical_access();
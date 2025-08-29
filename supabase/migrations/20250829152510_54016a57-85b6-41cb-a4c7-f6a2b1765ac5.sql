-- Fix critical child safety security issue in safeguarding_reports table
-- This migration ensures ONLY authorized personnel can access child protection data

-- First, drop ALL existing policies to ensure clean state
DROP POLICY IF EXISTS "safeguarding_admin_access" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_create" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reporter_access" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_admin_delete" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authorized_access" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authorized_modify" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_public_submit" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_secure_submit" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_restricted_read" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_restricted_update" ON public.safeguarding_reports;

-- Now create secure policies from scratch
-- 1. RESTRICTED INSERT - Only authenticated users can submit, must set their own reporter_id
CREATE POLICY "safeguarding_secure_insert"
ON public.safeguarding_reports
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND reporter_id = auth.uid()
);

-- 2. ULTRA-RESTRICTED READ - Only admins and specifically authorized safeguarding personnel
CREATE POLICY "safeguarding_authorized_read_only"
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

-- 3. RESTRICTED UPDATE - Only authorized personnel can modify reports
CREATE POLICY "safeguarding_authorized_update_only"
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

-- 4. ADMIN-ONLY DELETE - Only admins can delete safeguarding reports
CREATE POLICY "safeguarding_admin_delete_only"
ON public.safeguarding_reports
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- Enhanced audit function for child protection
CREATE OR REPLACE FUNCTION public.audit_child_protection_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Maximum security logging for child protection
    PERFORM public.log_sensitive_operation(
        'CHILD_PROTECTION_' || TG_OP || '_CRITICAL',
        'safeguarding_reports',
        COALESCE(NEW.id::text, OLD.id::text)
    );
    
    -- Detailed admin audit with all relevant information
    IF auth.uid() IS NOT NULL THEN
        PERFORM public.log_admin_action(
            'child_safety_' || lower(TG_OP),
            'ultra_sensitive_child_protection',
            COALESCE(NEW.id::text, OLD.id::text),
            jsonb_build_object(
                'user_id', auth.uid(),
                'user_role', get_current_user_role(),
                'has_safeguarding_access', has_safeguarding_access(auth.uid()),
                'report_type', COALESCE(NEW.report_type, OLD.report_type),
                'urgency', COALESCE(NEW.urgency, OLD.urgency),
                'operation', TG_OP,
                'timestamp', now(),
                'security_classification', 'CHILD_PROTECTION_MAXIMUM'
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

-- Apply enhanced audit trigger
DROP TRIGGER IF EXISTS safeguarding_critical_audit_trigger ON public.safeguarding_reports;
DROP TRIGGER IF EXISTS child_protection_audit_trigger ON public.safeguarding_reports;

CREATE TRIGGER child_protection_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
    FOR EACH ROW EXECUTE FUNCTION public.audit_child_protection_access();
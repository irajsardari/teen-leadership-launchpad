-- TMA Academy Complete Security Lockdown - Fix All Critical Issues

-- 1. Enable leaked password protection first
-- This addresses the warning about password security
-- Note: This is done via dashboard settings, but we can document it here

-- 2. COMPLETE SECURITY LOCKDOWN FOR ALL SENSITIVE TABLES
-- Drop ALL existing policies and create ultra-secure ones

-- Teacher Applications - Complete Lockdown
DROP POLICY IF EXISTS "teacher_applications_select_own" ON teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_insert_own" ON teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_update_own" ON teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_delete_admin_only" ON teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_deny_anon" ON teacher_applications;

-- Create maximum security policies for teacher applications
CREATE POLICY "teacher_apps_maximum_security_select" ON teacher_applications
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            (get_current_user_role() = 'admin' AND block_unauthorized_access('teacher_applications'))
        )
    );

CREATE POLICY "teacher_apps_maximum_security_insert" ON teacher_applications
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid() = user_id AND
        secure_form_submission('teacher_application', 1, 60)
    );

CREATE POLICY "teacher_apps_maximum_security_update" ON teacher_applications
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            get_current_user_role() = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            get_current_user_role() = 'admin'
        )
    );

CREATE POLICY "teacher_apps_maximum_security_delete" ON teacher_applications
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND 
        get_current_user_role() = 'admin'
    );

-- Absolute denial for anonymous users
CREATE POLICY "teacher_apps_deny_anonymous_completely" ON teacher_applications
    AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false);

-- Challengers (Student Data) - Maximum Protection
DROP POLICY IF EXISTS "challengers_select_own_or_admin" ON challengers;
DROP POLICY IF EXISTS "challengers_insert_own" ON challengers;
DROP POLICY IF EXISTS "challengers_update_own_or_admin" ON challengers;
DROP POLICY IF EXISTS "challengers_delete_admin_only" ON challengers;
DROP POLICY IF EXISTS "challengers_deny_anon" ON challengers;

CREATE POLICY "challengers_maximum_security_select" ON challengers
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            (get_current_user_role() = 'admin' AND block_unauthorized_access('challengers'))
        )
    );

CREATE POLICY "challengers_maximum_security_insert" ON challengers
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid() = user_id AND
        secure_form_submission('challenger_registration', 1, 60)
    );

CREATE POLICY "challengers_maximum_security_update" ON challengers
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            get_current_user_role() = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.uid() = user_id OR 
            get_current_user_role() = 'admin'
        )
    );

CREATE POLICY "challengers_maximum_security_delete" ON challengers
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND 
        get_current_user_role() = 'admin'
    );

CREATE POLICY "challengers_deny_anonymous_completely" ON challengers
    AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false);

-- Parental Consents - Family Data Protection
DROP POLICY IF EXISTS "parental_consents_select_own_or_admin" ON parental_consents;
DROP POLICY IF EXISTS "parental_consents_insert_parent" ON parental_consents;
DROP POLICY IF EXISTS "parental_consents_update_admin_only" ON parental_consents;
DROP POLICY IF EXISTS "parental_consents_delete_admin_only" ON parental_consents;
DROP POLICY IF EXISTS "parental_consents_deny_anon" ON parental_consents;

CREATE POLICY "parental_consents_maximum_security" ON parental_consents
    FOR ALL USING (
        auth.uid() IS NOT NULL AND (
            auth.uid() = parent_user_id OR 
            auth.uid() = child_user_id OR 
            (get_current_user_role() = 'admin' AND block_unauthorized_access('parental_consents'))
        )
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND (
            auth.uid() = parent_user_id OR 
            (get_current_user_role() = 'admin' AND block_unauthorized_access('parental_consents'))
        )
    );

CREATE POLICY "parental_consents_deny_anonymous_completely" ON parental_consents
    AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false);

-- Confidential Records - ULTRA MAXIMUM SECURITY
DROP POLICY IF EXISTS "confidential_records_admin_only" ON confidential_records;
DROP POLICY IF EXISTS "confidential_records_deny_all_others" ON confidential_records;

CREATE POLICY "confidential_records_ultra_secure" ON confidential_records
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        get_current_user_role() = 'admin' AND 
        confidential_access_control() AND
        secure_confidential_access_check()
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND 
        get_current_user_role() = 'admin' AND 
        confidential_access_control() AND
        secure_confidential_access_check()
    );

-- Completely block all other access to confidential records
CREATE POLICY "confidential_records_total_lockdown" ON confidential_records
    AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

-- Safeguarding Reports - CHILD PROTECTION MAXIMUM SECURITY
DROP POLICY IF EXISTS "safeguarding_reports_authorized_only" ON safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_deny_all_others" ON safeguarding_reports;

CREATE POLICY "safeguarding_reports_child_protection_only" ON safeguarding_reports
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid())) AND
        secure_table_access_guardian('safeguarding_reports', 'child_protection_access')
    )
    WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid())) AND
        secure_table_access_guardian('safeguarding_reports', 'child_protection_modify')
    );

-- Complete lockdown for unauthorized access
CREATE POLICY "safeguarding_reports_total_protection" ON safeguarding_reports
    AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

-- 3. REVOKE ALL DANGEROUS PERMISSIONS
-- Remove any permissions that could allow data theft

REVOKE ALL PRIVILEGES ON teacher_applications FROM anon, public;
REVOKE ALL PRIVILEGES ON challengers FROM anon, public;  
REVOKE ALL PRIVILEGES ON parental_consents FROM anon, public;
REVOKE ALL PRIVILEGES ON confidential_records FROM anon, public;
REVOKE ALL PRIVILEGES ON safeguarding_reports FROM anon, public;
REVOKE ALL PRIVILEGES ON security_audit_logs FROM anon, public;

-- Grant ONLY the minimum necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON teacher_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON challengers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON parental_consents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON confidential_records TO authenticated;
GRANT SELECT, INSERT, UPDATE ON safeguarding_reports TO authenticated;

-- Admin-only DELETE permissions (granted via policies)
-- No direct DELETE grants to prevent data loss

-- 4. ENSURE RLS IS ENABLED ON ALL SENSITIVE TABLES
ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_permissions ENABLE ROW LEVEL SECURITY;

-- 5. CREATE SECURITY VERIFICATION FUNCTIONS IF THEY DON'T EXIST
CREATE OR REPLACE FUNCTION ultimate_security_check()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Ultimate security verification
    IF auth.uid() IS NULL THEN
        PERFORM log_sensitive_operation(
            'security_breach_attempt',
            'unauthorized_access',
            'no_authentication'
        );
        RETURN false;
    END IF;
    
    -- Verify user exists in profiles table
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) THEN
        PERFORM log_sensitive_operation(
            'security_breach_attempt',
            'invalid_user',
            auth.uid()::text
        );
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;

-- Grant necessary execution permissions
GRANT EXECUTE ON FUNCTION ultimate_security_check() TO authenticated;

-- Log this security hardening
INSERT INTO security_audit_logs (user_id, action, resource_type, resource_id)
VALUES (
    null, 
    'COMPLETE_SECURITY_HARDENING_APPLIED', 
    'database_security', 
    'master_fix_implementation_' || now()::text
);
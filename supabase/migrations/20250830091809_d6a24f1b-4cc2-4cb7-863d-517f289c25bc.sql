-- TMA Academy Security Hardening - Master Fix Implementation
-- Implementing strict RLS policies for all sensitive data tables

-- 1. TEACHER APPLICATIONS SECURITY
-- Enable RLS and create strict access policies
ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to create clean, strict ones
DROP POLICY IF EXISTS "Teachers Apps: Admin Delete Only" ON teacher_applications;
DROP POLICY IF EXISTS "Teachers Apps: Admin Full Access" ON teacher_applications;
DROP POLICY IF EXISTS "Teachers Apps: Deny Anonymous" ON teacher_applications;
DROP POLICY IF EXISTS "Teachers Apps: Owner Insert Only" ON teacher_applications;
DROP POLICY IF EXISTS "Teachers Apps: Owner Select Only" ON teacher_applications;
DROP POLICY IF EXISTS "Teachers Apps: Owner Update Only" ON teacher_applications;

-- Create new strict policies
CREATE POLICY "teacher_applications_select_own" ON teacher_applications
    FOR SELECT USING (auth.uid() = user_id OR get_current_user_role() = 'admin');

CREATE POLICY "teacher_applications_insert_own" ON teacher_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "teacher_applications_update_own" ON teacher_applications
    FOR UPDATE USING (auth.uid() = user_id OR get_current_user_role() = 'admin')
    WITH CHECK (auth.uid() = user_id OR get_current_user_role() = 'admin');

CREATE POLICY "teacher_applications_delete_admin_only" ON teacher_applications
    FOR DELETE USING (get_current_user_role() = 'admin');

CREATE POLICY "teacher_applications_deny_anon" ON teacher_applications
    AS RESTRICTIVE FOR ALL TO anon USING (false);

-- 2. CHALLENGERS (STUDENT DATA) SECURITY
ALTER TABLE challengers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Challengers: Admin Full Access" ON challengers;
DROP POLICY IF EXISTS "Challengers: Deny Anonymous" ON challengers;
DROP POLICY IF EXISTS "Challengers: Owner Access Only" ON challengers;

-- Create new strict policies
CREATE POLICY "challengers_select_own_or_admin" ON challengers
    FOR SELECT USING (auth.uid() = user_id OR get_current_user_role() = 'admin');

CREATE POLICY "challengers_insert_own" ON challengers
    FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "challengers_update_own_or_admin" ON challengers
    FOR UPDATE USING (auth.uid() = user_id OR get_current_user_role() = 'admin')
    WITH CHECK (auth.uid() = user_id OR get_current_user_role() = 'admin');

CREATE POLICY "challengers_delete_admin_only" ON challengers
    FOR DELETE USING (get_current_user_role() = 'admin');

CREATE POLICY "challengers_deny_anon" ON challengers
    AS RESTRICTIVE FOR ALL TO anon USING (false);

-- 3. PARENTAL CONSENTS SECURITY
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Parental Consents: Admin Full Access" ON parental_consents;
DROP POLICY IF EXISTS "Parental Consents: Deny Anonymous" ON parental_consents;
DROP POLICY IF EXISTS "Parental Consents: Parent Access Only" ON parental_consents;

-- Create new strict policies
CREATE POLICY "parental_consents_select_own_or_admin" ON parental_consents
    FOR SELECT USING (
        auth.uid() = parent_user_id OR 
        auth.uid() = child_user_id OR 
        get_current_user_role() = 'admin'
    );

CREATE POLICY "parental_consents_insert_parent" ON parental_consents
    FOR INSERT WITH CHECK (auth.uid() = parent_user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "parental_consents_update_admin_only" ON parental_consents
    FOR UPDATE USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "parental_consents_delete_admin_only" ON parental_consents
    FOR DELETE USING (get_current_user_role() = 'admin');

CREATE POLICY "parental_consents_deny_anon" ON parental_consents
    AS RESTRICTIVE FOR ALL TO anon USING (false);

-- 4. CONFIDENTIAL RECORDS ULTRA SECURITY
ALTER TABLE confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Confidential Records: Admin Only" ON confidential_records;
DROP POLICY IF EXISTS "Confidential Records: Deny Anonymous" ON confidential_records;

-- Create ultra-strict policies - admin only with additional verification
CREATE POLICY "confidential_records_admin_only" ON confidential_records
    FOR ALL USING (
        get_current_user_role() = 'admin' AND 
        auth.uid() IS NOT NULL AND
        secure_confidential_access_check()
    )
    WITH CHECK (
        get_current_user_role() = 'admin' AND 
        auth.uid() IS NOT NULL AND
        secure_confidential_access_check()
    );

CREATE POLICY "confidential_records_deny_all_others" ON confidential_records
    AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

-- 5. SAFEGUARDING REPORTS MAXIMUM SECURITY
ALTER TABLE safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Safeguarding Reports: Authorized Personnel Only" ON safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding Reports: Deny Anonymous" ON safeguarding_reports;

-- Create maximum security policies
CREATE POLICY "safeguarding_reports_authorized_only" ON safeguarding_reports
    FOR ALL USING (
        (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid())) AND
        auth.uid() IS NOT NULL AND
        secure_table_access_guardian('safeguarding_reports', 'access')
    )
    WITH CHECK (
        (get_current_user_role() = 'admin' OR has_safeguarding_access(auth.uid())) AND
        auth.uid() IS NOT NULL AND
        secure_table_access_guardian('safeguarding_reports', 'modify')
    );

CREATE POLICY "safeguarding_reports_deny_all_others" ON safeguarding_reports
    AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

-- 6. SECURITY AUDIT LOGS - ADMIN ONLY
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON security_audit_logs;
DROP POLICY IF EXISTS "sal_admin_only" ON security_audit_logs;
DROP POLICY IF EXISTS "security_audit_admin_read" ON security_audit_logs;
DROP POLICY IF EXISTS "security_audit_logs_anonymous_deny" ON security_audit_logs;
DROP POLICY IF EXISTS "security_audit_system_insert" ON security_audit_logs;

-- Create ultra-strict policies
CREATE POLICY "security_audit_logs_admin_select_only" ON security_audit_logs
    FOR SELECT USING (get_current_user_role() = 'admin' AND auth.uid() IS NOT NULL);

CREATE POLICY "security_audit_logs_system_insert_only" ON security_audit_logs
    FOR INSERT WITH CHECK (true); -- Allow system inserts via functions

CREATE POLICY "security_audit_logs_deny_all_others" ON security_audit_logs
    AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);

-- 7. PROFILES - SELF ACCESS ONLY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update existing policies to be more strict
DROP POLICY IF EXISTS "profiles_final_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_final_anon_deny" ON profiles;
DROP POLICY IF EXISTS "profiles_final_self" ON profiles;

CREATE POLICY "profiles_self_access_only" ON profiles
    FOR ALL USING (auth.uid() = id OR get_current_user_role() = 'admin')
    WITH CHECK (auth.uid() = id OR get_current_user_role() = 'admin');

CREATE POLICY "profiles_deny_anon" ON profiles
    AS RESTRICTIVE FOR ALL TO anon USING (false);

-- 8. CONSENT PERMISSIONS - RESTRICTED ACCESS
ALTER TABLE consent_permissions ENABLE ROW LEVEL SECURITY;

-- Update to more restrictive access
DROP POLICY IF EXISTS "consent_permissions_anonymous_deny" ON consent_permissions;
DROP POLICY IF EXISTS "cp_admin_all_access" ON consent_permissions;
DROP POLICY IF EXISTS "cp_parent_view_own" ON consent_permissions;

CREATE POLICY "consent_permissions_admin_access" ON consent_permissions
    FOR ALL USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "consent_permissions_parent_view" ON consent_permissions
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM parental_consents pc
            WHERE pc.id = consent_permissions.consent_id
            AND pc.parent_user_id = auth.uid()
        )
    );

CREATE POLICY "consent_permissions_deny_others" ON consent_permissions
    AS RESTRICTIVE FOR ALL USING (false) WITH CHECK (false);

-- Create enhanced security verification function
CREATE OR REPLACE FUNCTION secure_confidential_access_check()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow admin access with verified session
    IF auth.uid() IS NULL OR get_current_user_role() != 'admin' THEN
        PERFORM log_sensitive_operation(
            'confidential_access_denied',
            'security_violation',
            COALESCE(auth.uid()::text, 'anonymous')
        );
        RETURN false;
    END IF;
    
    -- Log successful access
    PERFORM log_sensitive_operation(
        'confidential_access_verified',
        'admin_verification',
        auth.uid()::text
    );
    
    RETURN true;
END;
$$;

-- Grant execute permission to authenticated users (for the function to work in policies)
GRANT EXECUTE ON FUNCTION secure_confidential_access_check() TO authenticated;
GRANT EXECUTE ON FUNCTION secure_table_access_guardian(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION has_safeguarding_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_role() TO authenticated;

-- Revoke any overly permissive grants
REVOKE ALL ON teacher_applications FROM anon, public;
REVOKE ALL ON challengers FROM anon, public;
REVOKE ALL ON parental_consents FROM anon, public;
REVOKE ALL ON confidential_records FROM anon, public;
REVOKE ALL ON safeguarding_reports FROM anon, public;
REVOKE ALL ON security_audit_logs FROM anon, public;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON teacher_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON challengers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON parental_consents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON confidential_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON safeguarding_reports TO authenticated;
GRANT SELECT, INSERT ON security_audit_logs TO authenticated;
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON consent_permissions TO authenticated;
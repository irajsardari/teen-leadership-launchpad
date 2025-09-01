-- Final Security Lock-Down for All Critical Issues
-- This adds additional ultra-strict security layers

-- ============================================================================
-- 1. MAXIMUM SECURITY AUTHENTICATION FUNCTION
-- ============================================================================

-- Create maximum security check function
CREATE OR REPLACE FUNCTION public.maximum_security_check()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Must be authenticated
    IF auth.uid() IS NULL THEN
        PERFORM log_sensitive_operation(
            'SECURITY_BREACH_ATTEMPT_NO_AUTH',
            'critical_security_violation', 
            'anonymous_access_blocked'
        );
        RETURN false;
    END IF;
    
    -- Must have valid profile
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) THEN
        PERFORM log_sensitive_operation(
            'SECURITY_BREACH_INVALID_USER',
            'critical_security_violation',
            auth.uid()::text
        );
        RETURN false;
    END IF;
    
    -- Rate limiting - no more than 10 sensitive operations per minute
    IF (
        SELECT count(*) FROM security_audit_logs 
        WHERE user_id = auth.uid() 
        AND created_at > now() - interval '1 minute'
    ) > 10 THEN
        PERFORM log_sensitive_operation(
            'SECURITY_RATE_LIMIT_EXCEEDED',
            'critical_security_violation',
            auth.uid()::text || '_rate_exceeded'
        );
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;

-- ============================================================================
-- 2. ULTRA SECURE POLICIES - COMPLETE REPLACEMENT
-- ============================================================================

-- TEACHER APPLICATIONS - Replace ALL policies with maximum security
DROP POLICY IF EXISTS "teacher_applications_ultra_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_ultra_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_ultra_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_ultra_secure_delete" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_applications_secure_delete" ON public.teacher_applications;

CREATE POLICY "teacher_applications_maximum_security_select" 
ON public.teacher_applications FOR SELECT 
USING (
    maximum_security_check() 
    AND (
        (auth.uid() = user_id) 
        OR 
        (get_current_user_role() = 'admin' AND verify_admin_with_mfa())
    )
);

CREATE POLICY "teacher_applications_maximum_security_insert" 
ON public.teacher_applications FOR INSERT 
WITH CHECK (
    maximum_security_check() 
    AND auth.uid() = user_id
    AND NOT EXISTS (
        SELECT 1 FROM teacher_applications 
        WHERE user_id = auth.uid() 
        AND created_at > now() - interval '24 hours'
    )
);

CREATE POLICY "teacher_applications_maximum_security_update" 
ON public.teacher_applications FOR UPDATE 
USING (
    maximum_security_check() 
    AND (
        (auth.uid() = user_id AND status = 'pending') 
        OR 
        verify_admin_with_mfa()
    )
);

CREATE POLICY "teacher_applications_maximum_security_delete" 
ON public.teacher_applications FOR DELETE 
USING (verify_admin_with_mfa() AND maximum_security_check());

-- CHALLENGERS - Replace ALL policies with maximum security
DROP POLICY IF EXISTS "challengers_ultra_secure_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_ultra_secure_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_ultra_secure_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_ultra_secure_delete" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_delete" ON public.challengers;

CREATE POLICY "challengers_maximum_security_select" 
ON public.challengers FOR SELECT 
USING (
    maximum_security_check() 
    AND (
        auth.uid() = user_id 
        OR 
        verify_admin_with_mfa()
    )
);

CREATE POLICY "challengers_maximum_security_insert" 
ON public.challengers FOR INSERT 
WITH CHECK (maximum_security_check() AND auth.uid() = user_id);

CREATE POLICY "challengers_maximum_security_update" 
ON public.challengers FOR UPDATE 
USING (
    maximum_security_check() 
    AND (
        auth.uid() = user_id 
        OR 
        verify_admin_with_mfa()
    )
);

CREATE POLICY "challengers_maximum_security_delete" 
ON public.challengers FOR DELETE 
USING (verify_admin_with_mfa() AND maximum_security_check());

-- PARENTAL CONSENTS - Replace ALL policies with maximum security
DROP POLICY IF EXISTS "parental_consents_ultra_secure_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_ultra_secure_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_ultra_secure_update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_ultra_secure_delete" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_update" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_delete" ON public.parental_consents;

CREATE POLICY "parental_consents_maximum_security_select" 
ON public.parental_consents FOR SELECT 
USING (
    maximum_security_check() 
    AND (
        auth.uid() = parent_user_id 
        OR 
        verify_admin_with_mfa()
    )
);

CREATE POLICY "parental_consents_maximum_security_insert" 
ON public.parental_consents FOR INSERT 
WITH CHECK (maximum_security_check() AND auth.uid() = parent_user_id);

CREATE POLICY "parental_consents_maximum_security_update" 
ON public.parental_consents FOR UPDATE 
USING (
    maximum_security_check() 
    AND (
        auth.uid() = parent_user_id 
        OR 
        verify_admin_with_mfa()
    )
);

CREATE POLICY "parental_consents_maximum_security_delete" 
ON public.parental_consents FOR DELETE 
USING (verify_admin_with_mfa() AND maximum_security_check());

-- CONFIDENTIAL RECORDS - Maximum security
DROP POLICY IF EXISTS "confidential_records_ultra_secure_access" ON public.confidential_records;

CREATE POLICY "confidential_records_maximum_security_access" 
ON public.confidential_records FOR ALL 
USING (
    maximum_security_check() 
    AND ultra_secure_confidential_check() 
    AND verify_admin_with_mfa()
);

-- SAFEGUARDING REPORTS - Maximum security (child protection)
DROP POLICY IF EXISTS "safeguarding_reports_ultra_secure_access" ON public.safeguarding_reports;

CREATE POLICY "safeguarding_reports_maximum_security_access" 
ON public.safeguarding_reports FOR ALL 
USING (
    maximum_security_check() 
    AND verify_admin_with_mfa() 
    AND has_safeguarding_access(auth.uid()) 
    AND verify_safeguarding_session_security()
);

-- ============================================================================
-- 3. COMPLETE ANONYMOUS DENIAL POLICIES
-- ============================================================================

-- Ensure complete anonymous denial for all sensitive tables
CREATE POLICY "teacher_applications_deny_all_anonymous" 
ON public.teacher_applications FOR ALL TO anon 
USING (false);

CREATE POLICY "challengers_deny_all_anonymous" 
ON public.challengers FOR ALL TO anon 
USING (false);

CREATE POLICY "parental_consents_deny_all_anonymous" 
ON public.parental_consents FOR ALL TO anon 
USING (false);

CREATE POLICY "confidential_records_deny_all_anonymous" 
ON public.confidential_records FOR ALL TO anon 
USING (false);

CREATE POLICY "safeguarding_reports_deny_all_anonymous" 
ON public.safeguarding_reports FOR ALL TO anon 
USING (false);

-- ============================================================================
-- 4. GRANT PERMISSIONS FOR SECURITY FUNCTIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.maximum_security_check() TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_with_mfa() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ultra_secure_confidential_check() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_safeguarding_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_safeguarding_session_security() TO authenticated;

-- ============================================================================
-- 5. FINAL SECURITY AUDIT LOG
-- ============================================================================

INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id
) VALUES (
    auth.uid(),
    'MAXIMUM_SECURITY_LOCKDOWN_COMPLETED',
    'all_sensitive_tables_secured',
    'comprehensive_protection_activated'
);
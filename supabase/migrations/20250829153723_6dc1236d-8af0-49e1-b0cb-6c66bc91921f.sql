-- Comprehensive security fix for all sensitive data tables
-- This migration ensures NO anonymous access to any sensitive personal data

-- Fix teacher_applications table - ensure no anonymous access
DROP POLICY IF EXISTS "teacher_applications_anonymous_deny" ON public.teacher_applications;
CREATE POLICY "teacher_applications_anonymous_deny"
ON public.teacher_applications
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Fix challengers table - ensure no anonymous access  
DROP POLICY IF EXISTS "challengers_anonymous_deny" ON public.challengers;
CREATE POLICY "challengers_anonymous_deny"
ON public.challengers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Fix parental_consents table - ensure no anonymous access
DROP POLICY IF EXISTS "parental_consents_anonymous_deny" ON public.parental_consents;
CREATE POLICY "parental_consents_anonymous_deny"
ON public.parental_consents
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Fix confidential_records table - ensure no anonymous access
DROP POLICY IF EXISTS "confidential_records_anonymous_deny" ON public.confidential_records;
CREATE POLICY "confidential_records_anonymous_deny"
ON public.confidential_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Fix safeguarding_reports table - ensure no anonymous access (additional protection)
DROP POLICY IF EXISTS "safeguarding_reports_anonymous_deny" ON public.safeguarding_reports;
CREATE POLICY "safeguarding_reports_anonymous_deny"
ON public.safeguarding_reports
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Ensure ALL sensitive tables have explicit anonymous denial
-- Add explicit denials for other sensitive tables
DROP POLICY IF EXISTS "consent_permissions_anonymous_deny" ON public.consent_permissions;
CREATE POLICY "consent_permissions_anonymous_deny"
ON public.consent_permissions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "security_audit_logs_anonymous_deny" ON public.security_audit_logs;  
CREATE POLICY "security_audit_logs_anonymous_deny"
ON public.security_audit_logs
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "admin_audit_log_anonymous_deny" ON public.admin_audit_log;
CREATE POLICY "admin_audit_log_anonymous_deny"
ON public.admin_audit_log
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Log this critical security fix
SELECT public.log_sensitive_operation(
    'comprehensive_security_hardening',
    'system_security',
    'all_sensitive_tables_protected'
);
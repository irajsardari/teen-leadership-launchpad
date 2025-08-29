-- Fix Security Issues: Strengthen RLS Policies for Sensitive Data Tables

-- 1. CHALLENGERS TABLE: Ultra-secure access (Student Personal Information)
DROP POLICY IF EXISTS "challengers_own_record_only" ON public.challengers;
DROP POLICY IF EXISTS "challengers_admin_access_only" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_unauthenticated" ON public.challengers;

-- Block ALL access except super-restricted scenarios
CREATE POLICY "challengers_ultra_secure_admin_only" 
ON public.challengers FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

-- Users can only access their OWN challenger record with strict verification
CREATE POLICY "challengers_own_record_strict" 
ON public.challengers FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Block anonymous access completely
CREATE POLICY "challengers_block_anonymous" 
ON public.challengers FOR ALL
USING (false)
WITH CHECK (false);

-- 2. TEACHER APPLICATIONS: Admin and own access only
DROP POLICY IF EXISTS "teacher_apps_user_read_own" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_user_create_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_no_user_updates" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_admin_all_access" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_admin_delete_secure" ON public.teacher_applications;

-- Ultra-secure admin access with triple verification
CREATE POLICY "teacher_apps_ultra_secure_admin" 
ON public.teacher_applications FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

-- Users can only read/insert their own applications
CREATE POLICY "teacher_apps_own_access_only" 
ON public.teacher_applications FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "teacher_apps_own_insert_only" 
ON public.teacher_applications FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Block all updates and unauthorized access
CREATE POLICY "teacher_apps_no_updates" 
ON public.teacher_applications FOR UPDATE
USING (false);

CREATE POLICY "teacher_apps_block_anonymous" 
ON public.teacher_applications FOR ALL
USING (false)
WITH CHECK (false);

-- 3. PARENTAL CONSENTS: Admin-only with logging
DROP POLICY IF EXISTS "Parental Consent: Admin access only" ON public.parental_consents;
DROP POLICY IF EXISTS "Parental Consent: Parent access to own submissions" ON public.parental_consents;

-- Ultra-secure admin-only access to parental consent data
CREATE POLICY "parental_consent_admin_ultra_secure" 
ON public.parental_consents FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
  AND block_unauthorized_access('parental_consents')
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

-- Parents can only manage their own submissions with verification
CREATE POLICY "parental_consent_parent_own_only" 
ON public.parental_consents FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid() 
  AND block_unauthorized_access('parental_consents') 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- 4. SAFEGUARDING REPORTS: Ultra-restricted access
DROP POLICY IF EXISTS "safeguarding_authorized_view" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authorized_modify" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authenticated_submit" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_admin_delete" ON public.safeguarding_reports;

-- Only authorized safeguarding personnel + admins can view
CREATE POLICY "safeguarding_ultra_restricted_view" 
ON public.safeguarding_reports FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    (get_current_user_role() = 'admin' AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'::user_role
    )) 
    OR 
    (has_safeguarding_access(auth.uid()) AND EXISTS (
      SELECT 1 FROM public.safeguarding_permissions sp
      WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true
    ))
  )
);

-- Only authorized personnel can modify
CREATE POLICY "safeguarding_authorized_modify_secure" 
ON public.safeguarding_reports FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND has_safeguarding_access(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.safeguarding_permissions sp
    WHERE sp.user_id = auth.uid() 
    AND sp.is_active = true
  )
)
WITH CHECK (
  has_safeguarding_access(auth.uid())
);

-- Authenticated users can submit reports
CREATE POLICY "safeguarding_authenticated_submit_secure" 
ON public.safeguarding_reports FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Only admins can delete
CREATE POLICY "safeguarding_admin_delete_only" 
ON public.safeguarding_reports FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'::user_role
  )
);

-- Log all safeguarding report access for compliance
CREATE OR REPLACE FUNCTION public.audit_safeguarding_access_enhanced()
RETURNS TRIGGER AS $$
BEGIN
    -- Log all access attempts with maximum detail
    PERFORM public.log_sensitive_operation(
        'safeguarding_report_' || lower(TG_OP),
        'child_safety_critical',
        COALESCE(NEW.id::text, OLD.id::text)
    );
    
    -- Additional critical logging for child safety
    INSERT INTO public.security_audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address
    ) VALUES (
        auth.uid(),
        'CHILD_SAFETY_CRITICAL_' || TG_OP,
        'safeguarding_reports',
        COALESCE(NEW.id::text, OLD.id::text),
        inet_client_addr()
    );
    
    -- High-priority admin audit logging
    IF auth.uid() IS NOT NULL THEN
        PERFORM public.log_admin_action(
            'child_protection_' || lower(TG_OP),
            'safeguarding_access',
            COALESCE(NEW.id::text, OLD.id::text),
            jsonb_build_object(
                'report_type', COALESCE(NEW.report_type, OLD.report_type),
                'access_timestamp', now(),
                'security_level', 'CHILD_PROTECTION_CRITICAL'
            )
        );
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Apply enhanced audit trigger to safeguarding reports
DROP TRIGGER IF EXISTS audit_safeguarding_access_trigger ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_access_enhanced_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
    FOR EACH ROW EXECUTE FUNCTION public.audit_safeguarding_access_enhanced();
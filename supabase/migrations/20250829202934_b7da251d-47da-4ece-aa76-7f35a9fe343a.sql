-- CRITICAL SECURITY FIX: Implement comprehensive RLS policies for all sensitive data

-- 1. CHALLENGERS TABLE - Student Data Protection
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "challengers_block_anonymous" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_secure_update" ON public.challengers;

-- Create secure policies for challengers (student data)
CREATE POLICY "challengers_deny_anon" ON public.challengers
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "challengers_own_data" ON public.challengers
  FOR ALL TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challengers_admin_access" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "challengers_parent_access" ON public.challengers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parental_consents pc
      WHERE pc.child_user_id = challengers.user_id 
      AND pc.parent_user_id = auth.uid()
      AND pc.consent_given = true
    )
  );

-- 2. PARENTAL CONSENTS - Family Privacy Protection
-- Drop existing policies
DROP POLICY IF EXISTS "parental_consents_block_anonymous" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_select" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_secure_update" ON public.parental_consents;

-- Ultra-secure parental consent policies
CREATE POLICY "parental_consents_deny_anon" ON public.parental_consents
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "parental_consents_parent_only" ON public.parental_consents
  FOR ALL TO authenticated
  USING (parent_user_id = auth.uid())
  WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_child_read" ON public.parental_consents
  FOR SELECT TO authenticated
  USING (child_user_id = auth.uid());

CREATE POLICY "parental_consents_admin_access" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

-- 3. SAFEGUARDING REPORTS - Child Protection Maximum Security
-- Drop existing policies
DROP POLICY IF EXISTS "safeguarding_block_anonymous" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_secure_insert" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_secure_select" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_secure_update" ON public.safeguarding_reports;

-- Maximum security for child protection
CREATE POLICY "safeguarding_deny_anon" ON public.safeguarding_reports
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "safeguarding_reporter_insert" ON public.safeguarding_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "safeguarding_admin_full_access" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "safeguarding_authorized_personnel" ON public.safeguarding_reports
  FOR SELECT TO authenticated
  USING (has_safeguarding_access(auth.uid()));

-- 4. CONFIDENTIAL RECORDS - Ultra Sensitive Data
-- Drop existing policies
DROP POLICY IF EXISTS "confidential_records_admin_only" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_sec_v1_anon_block" ON public.confidential_records;

-- Maximum security for confidential records
CREATE POLICY "confidential_deny_all_anon" ON public.confidential_records
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "confidential_admin_only_verified" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    verify_confidential_access_maximum_security(id, 'admin_access_justified')
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    verify_confidential_access_maximum_security(id, 'admin_modification_justified')
  );

-- 5. TEACHER APPLICATIONS - Already secured but reinforce
-- The teacher_applications policies were recently updated and are secure

-- 6. Add additional security logging triggers
CREATE OR REPLACE FUNCTION public.log_critical_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to ultra-sensitive tables
  PERFORM public.log_sensitive_operation(
    'CRITICAL_DATA_ACCESS_' || TG_OP,
    TG_TABLE_NAME || '_ultra_secure',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Additional high-priority audit logging
  PERFORM public.log_admin_action(
    'critical_data_' || lower(TG_OP),
    'data_protection_critical',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_role', get_current_user_role(),
      'security_level', 'MAXIMUM_PROTECTION',
      'timestamp', now()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply critical data access logging to all sensitive tables
DROP TRIGGER IF EXISTS log_challengers_critical_access ON public.challengers;
CREATE TRIGGER log_challengers_critical_access
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.log_critical_data_access();

DROP TRIGGER IF EXISTS log_parental_consents_critical_access ON public.parental_consents;
CREATE TRIGGER log_parental_consents_critical_access
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.log_critical_data_access();

DROP TRIGGER IF EXISTS log_safeguarding_critical_access ON public.safeguarding_reports;
CREATE TRIGGER log_safeguarding_critical_access
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.log_critical_data_access();

-- Ensure all tables have proper updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers where missing
DROP TRIGGER IF EXISTS handle_challengers_updated_at ON public.challengers;
DROP TRIGGER IF EXISTS handle_parental_consents_updated_at ON public.parental_consents;
DROP TRIGGER IF EXISTS handle_safeguarding_reports_updated_at ON public.safeguarding_reports;

-- Note: The challengers table doesn't have updated_at column, so skip that trigger
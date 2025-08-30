-- SECURITY FIX: Clean up conflicting RLS policies on sensitive tables
-- This removes old insecure policies that were allowing broader access

BEGIN;

-- ============================================================================
-- 1. TEACHER APPLICATIONS - Remove all old conflicting policies
-- ============================================================================

-- Drop ALL existing policies first to ensure clean state
DROP POLICY IF EXISTS ta_admin_delete ON public.teacher_applications;
DROP POLICY IF EXISTS ta_admin_read ON public.teacher_applications;
DROP POLICY IF EXISTS ta_admin_update ON public.teacher_applications;
DROP POLICY IF EXISTS ta_insert ON public.teacher_applications;
DROP POLICY IF EXISTS ta_select_owner ON public.teacher_applications;
DROP POLICY IF EXISTS ta_admin_all ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_delete ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_insert ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_select ON public.teacher_applications;
DROP POLICY IF EXISTS ta_owner_update ON public.teacher_applications;

-- Create ONLY secure policies for teacher_applications
-- Admin: full access
CREATE POLICY "Teachers Apps: Admin Full Access"
ON public.teacher_applications
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Applicants: can only see their own application
CREATE POLICY "Teachers Apps: Owner Select Only"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Applicants: can only insert their own application
CREATE POLICY "Teachers Apps: Owner Insert Only"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Applicants: can only update their own application
CREATE POLICY "Teachers Apps: Owner Update Only"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Delete: ONLY admins (prevents data loss and maintains audit trail)
CREATE POLICY "Teachers Apps: Admin Delete Only"
ON public.teacher_applications
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 2. CHALLENGERS - Clean up and secure student data
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS ch_admin_delete ON public.challengers;
DROP POLICY IF EXISTS ch_admin_read ON public.challengers;
DROP POLICY IF EXISTS ch_admin_update ON public.challengers;
DROP POLICY IF EXISTS ch_insert ON public.challengers;
DROP POLICY IF EXISTS ch_owner_read ON public.challengers;
DROP POLICY IF EXISTS ch_owner_update ON public.challengers;
DROP POLICY IF EXISTS ch_admin_all ON public.challengers;
DROP POLICY IF EXISTS ch_owner_select ON public.challengers;
DROP POLICY IF EXISTS ch_owner_insert ON public.challengers;
DROP POLICY IF EXISTS ch_owner_update ON public.challengers;
DROP POLICY IF EXISTS ch_owner_delete ON public.challengers;

-- Create secure policies for challengers
CREATE POLICY "Challengers: Admin Full Access"
ON public.challengers
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Challengers: Owner Access Only"
ON public.challengers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 3. PARENTAL CONSENTS - Clean up and secure family data
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS pc_admin_delete ON public.parental_consents;
DROP POLICY IF EXISTS pc_admin_insert ON public.parental_consents;
DROP POLICY IF EXISTS pc_admin_read ON public.parental_consents;
DROP POLICY IF EXISTS pc_admin_update ON public.parental_consents;
DROP POLICY IF EXISTS pc_admin_all ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_select ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_insert ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_update ON public.parental_consents;
DROP POLICY IF EXISTS pc_parent_delete ON public.parental_consents;

-- Create secure policies for parental consents
CREATE POLICY "Parental Consents: Admin Full Access"
ON public.parental_consents
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Parental Consents: Parent Access Only"
ON public.parental_consents
FOR ALL
TO authenticated
USING (parent_user_id = auth.uid())
WITH CHECK (parent_user_id = auth.uid());

-- ============================================================================
-- 4. CONFIDENTIAL RECORDS - Ensure admin-only access
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS cr_admin_delete ON public.confidential_records;
DROP POLICY IF EXISTS cr_admin_insert ON public.confidential_records;
DROP POLICY IF EXISTS cr_admin_read ON public.confidential_records;
DROP POLICY IF EXISTS cr_admin_update ON public.confidential_records;
DROP POLICY IF EXISTS cr_admin_only ON public.confidential_records;

-- Admin-only access for confidential records
CREATE POLICY "Confidential Records: Admin Only"
ON public.confidential_records
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================================
-- 5. SAFEGUARDING REPORTS - Ensure admin/safeguarding-only access
-- ============================================================================

-- Drop all existing policies
DROP POLICY IF EXISTS sg_admin_delete ON public.safeguarding_reports;
DROP POLICY IF EXISTS sg_admin_insert ON public.safeguarding_reports;
DROP POLICY IF EXISTS sg_admin_read ON public.safeguarding_reports;
DROP POLICY IF EXISTS sg_admin_update ON public.safeguarding_reports;
DROP POLICY IF EXISTS sr_admin_only ON public.safeguarding_reports;

-- Admin and safeguarding personnel only
CREATE POLICY "Safeguarding Reports: Authorized Personnel Only"
ON public.safeguarding_reports
FOR ALL
TO authenticated
USING (public.is_admin() OR public.has_safeguarding_access(auth.uid()))
WITH CHECK (public.is_admin() OR public.has_safeguarding_access(auth.uid()));

-- ============================================================================
-- 6. Verify RLS is enabled on all sensitive tables
-- ============================================================================
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. Add additional security logging for sensitive operations
-- ============================================================================

-- Ensure all sensitive operations are logged
CREATE OR REPLACE FUNCTION public.log_sensitive_table_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log access to sensitive tables
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    'sensitive_data_access',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply logging triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_challengers ON public.challengers;
CREATE TRIGGER audit_challengers
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_parental_consents ON public.parental_consents;
CREATE TRIGGER audit_parental_consents
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_confidential_records ON public.confidential_records;
CREATE TRIGGER audit_confidential_records
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

DROP TRIGGER IF EXISTS audit_safeguarding_reports ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_reports
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

COMMIT;
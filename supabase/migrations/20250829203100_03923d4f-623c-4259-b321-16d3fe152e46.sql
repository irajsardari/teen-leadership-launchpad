-- CRITICAL SECURITY FIX: Drop all existing policies first, then create secure ones

-- 1. CHALLENGERS TABLE - Remove all existing policies first
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'challengers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.challengers', policy_name);
    END LOOP;
END $$;

-- Create ultra-secure policies for student data
CREATE POLICY "challengers_block_all_anon" ON public.challengers
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "challengers_students_own_data" ON public.challengers
  FOR ALL TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challengers_admin_full_access" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "challengers_parent_guardian_read" ON public.challengers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parental_consents pc
      WHERE pc.child_user_id = challengers.user_id 
      AND pc.parent_user_id = auth.uid()
      AND pc.consent_given = true
    )
  );

-- 2. PARENTAL CONSENTS - Remove all existing policies first
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'parental_consents' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.parental_consents', policy_name);
    END LOOP;
END $$;

-- Ultra-secure family privacy policies
CREATE POLICY "parental_consents_block_all_anon" ON public.parental_consents
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "parental_consents_parent_full_control" ON public.parental_consents
  FOR ALL TO authenticated
  USING (parent_user_id = auth.uid())
  WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_child_view_only" ON public.parental_consents
  FOR SELECT TO authenticated
  USING (child_user_id = auth.uid());

CREATE POLICY "parental_consents_admin_oversight" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

-- 3. SAFEGUARDING REPORTS - Remove all existing policies first
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'safeguarding_reports' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.safeguarding_reports', policy_name);
    END LOOP;
END $$;

-- Maximum child protection security
CREATE POLICY "safeguarding_block_all_anon" ON public.safeguarding_reports
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "safeguarding_reporter_can_submit" ON public.safeguarding_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "safeguarding_admin_critical_access" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "safeguarding_authorized_staff_read" ON public.safeguarding_reports
  FOR SELECT TO authenticated
  USING (has_safeguarding_access(auth.uid()));

CREATE POLICY "safeguarding_authorized_staff_update" ON public.safeguarding_reports
  FOR UPDATE TO authenticated
  USING (has_safeguarding_access(auth.uid()));

-- 4. CONFIDENTIAL RECORDS - Remove all existing policies first
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'confidential_records' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.confidential_records', policy_name);
    END LOOP;
END $$;

-- Ultra-secure confidential data policies
CREATE POLICY "confidential_block_all_anon" ON public.confidential_records
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "confidential_admin_verified_only" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    verify_confidential_access_maximum_security(id, 'justified_admin_access')
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    verify_confidential_access_maximum_security(id, 'justified_admin_modification')
  );
-- CRITICAL SECURITY FIX: Clean up and implement comprehensive RLS policies
-- Handle existing policies by dropping ALL and recreating with new names

-- 1. CHALLENGERS TABLE - Complete cleanup and secure policies
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop ALL existing policies for challengers
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'challengers' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.challengers', policy_name);
    END LOOP;
END $$;

-- Create ultra-secure policies for challengers (student data)
CREATE POLICY "challengers_block_all_anon" ON public.challengers
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "challengers_student_own_data" ON public.challengers
  FOR ALL TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challengers_admin_full_access" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "challengers_verified_parent_read" ON public.challengers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parental_consents pc
      WHERE pc.child_user_id = challengers.user_id 
      AND pc.parent_user_id = auth.uid()
      AND pc.consent_given = true
    )
  );

-- 2. PARENTAL CONSENTS - Complete cleanup
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

-- Ultra-secure parental consent policies
CREATE POLICY "parental_consents_block_anon" ON public.parental_consents
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "parental_consents_parent_full_access" ON public.parental_consents
  FOR ALL TO authenticated
  USING (parent_user_id = auth.uid())
  WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_child_view_only" ON public.parental_consents
  FOR SELECT TO authenticated
  USING (child_user_id = auth.uid());

CREATE POLICY "parental_consents_admin_full_access" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

-- 3. SAFEGUARDING REPORTS - Complete cleanup
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

-- Maximum security for child protection
CREATE POLICY "safeguarding_block_all_anon" ON public.safeguarding_reports
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "safeguarding_reporter_can_insert" ON public.safeguarding_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "safeguarding_admin_full_control" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin');

CREATE POLICY "safeguarding_authorized_view_only" ON public.safeguarding_reports
  FOR SELECT TO authenticated
  USING (has_safeguarding_access(auth.uid()));

-- 4. CONFIDENTIAL RECORDS - Complete cleanup
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
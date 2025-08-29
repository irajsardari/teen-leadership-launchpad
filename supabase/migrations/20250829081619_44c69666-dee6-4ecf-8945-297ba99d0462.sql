-- Final Security Cleanup: Remove Conflicting Policies

-- 1. CHALLENGERS - Clean up all policies and create one simple secure policy
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'challengers')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.challengers';
    END LOOP;
END $$;

-- Create single, simple policy for challengers
CREATE POLICY "challengers_secure_access" 
ON public.challengers FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
);

-- 2. TEACHER APPLICATIONS - Clean up and simplify
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'teacher_applications')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.teacher_applications';
    END LOOP;
END $$;

-- Create single policy for teacher applications
CREATE POLICY "teacher_applications_secure_access" 
ON public.teacher_applications FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR user_id = auth.uid()
  )
);

-- 3. PARENTAL CONSENTS - Clean up and simplify
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'parental_consents')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.parental_consents';
    END LOOP;
END $$;

-- Create single policy for parental consents
CREATE POLICY "parental_consents_secure_access" 
ON public.parental_consents FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR parent_user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR parent_user_id = auth.uid()
  )
);

-- 4. SAFEGUARDING REPORTS - Clean up and create targeted policies
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'safeguarding_reports')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.safeguarding_reports';
    END LOOP;
END $$;

-- Authorized personnel can read/modify reports
CREATE POLICY "safeguarding_reports_authorized_access" 
ON public.safeguarding_reports FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
);

CREATE POLICY "safeguarding_reports_authorized_modify" 
ON public.safeguarding_reports FOR UPDATE
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

-- Anyone can submit reports
CREATE POLICY "safeguarding_reports_public_submit" 
ON public.safeguarding_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can delete
CREATE POLICY "safeguarding_reports_admin_delete" 
ON public.safeguarding_reports FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 5. CONFIDENTIAL RECORDS - Clean up and create single admin policy
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'confidential_records')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.confidential_records';
    END LOOP;
END $$;

-- Single admin-only policy for confidential records
CREATE POLICY "confidential_records_admin_only" 
ON public.confidential_records FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);
-- Simplify RLS Policies (Fixed Version - No CHECK Constraints)

-- 1. SIMPLIFY CHALLENGERS TABLE POLICIES 
DROP POLICY IF EXISTS "challengers_own_record_ultra_secure" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_all_anonymous" ON public.challengers;

-- Ultra-simple: Only admins OR the user themselves can access their data
CREATE POLICY "challengers_simple_secure_access" 
ON public.challengers FOR ALL
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

-- 2. SIMPLIFY TEACHER APPLICATIONS
DROP POLICY IF EXISTS "teacher_apps_own_read_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_own_insert_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_all_updates" ON public.teacher_applications;

-- Simple: Admin or own application only
CREATE POLICY "teacher_apps_simple_secure" 
ON public.teacher_applications FOR ALL
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

-- 3. SIMPLIFY PARENTAL CONSENTS
DROP POLICY IF EXISTS "parental_consent_parent_ultra_secure" ON public.parental_consents;

-- Simple: Admin or parent who submitted it
CREATE POLICY "parental_consent_simple_secure" 
ON public.parental_consents FOR ALL
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

-- 4. SIMPLIFY SAFEGUARDING REPORTS
DROP POLICY IF EXISTS "safeguarding_reports_ultra_restricted" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_modify_authorized" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authenticated_submit" ON public.safeguarding_reports;

-- Simple: Only admins and authorized safeguarding personnel can read/modify
CREATE POLICY "safeguarding_reports_authorized_access" 
ON public.safeguarding_reports FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    get_current_user_role() = 'admin' 
    OR has_safeguarding_access(auth.uid())
  )
);

CREATE POLICY "safeguarding_reports_authorized_modify" 
ON public.safeguarding_reports FOR UPDATE
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

CREATE POLICY "safeguarding_reports_admin_delete" 
ON public.safeguarding_reports FOR DELETE
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- Anyone authenticated can submit reports
CREATE POLICY "safeguarding_reports_submit_only" 
ON public.safeguarding_reports FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 5. STRENGTHEN CONFIDENTIAL RECORDS ACCESS
DROP POLICY IF EXISTS "confidential_records_admin_only_read" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_insert" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_update" ON public.confidential_records;
DROP POLICY IF EXISTS "confidential_records_admin_only_delete" ON public.confidential_records;

-- Ultra-simple admin-only access
CREATE POLICY "confidential_records_admin_only" 
ON public.confidential_records FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);
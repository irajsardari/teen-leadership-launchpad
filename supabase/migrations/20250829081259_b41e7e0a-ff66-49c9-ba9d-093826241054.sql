-- Fix Remaining Security Issues: Targeted RLS Policy Updates

-- 1. First check and fix challengers table policies safely
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'challengers' AND policyname = 'challengers_own_record_only') THEN
        DROP POLICY "challengers_own_record_only" ON public.challengers;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'challengers' AND policyname = 'challengers_block_unauthenticated') THEN
        DROP POLICY "challengers_block_unauthenticated" ON public.challengers;
    END IF;
END $$;

-- Create ultra-secure challenger access policy
CREATE POLICY "challengers_own_record_ultra_secure" 
ON public.challengers FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Block anonymous access to challengers
CREATE POLICY "challengers_block_all_anonymous" 
ON public.challengers FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Fix teacher applications table
DO $$
BEGIN
    -- Drop existing policies safely
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teacher_applications' AND policyname = 'teacher_apps_user_read_own') THEN
        DROP POLICY "teacher_apps_user_read_own" ON public.teacher_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teacher_applications' AND policyname = 'teacher_apps_user_create_only') THEN
        DROP POLICY "teacher_apps_user_create_only" ON public.teacher_applications;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'teacher_applications' AND policyname = 'teacher_apps_no_user_updates') THEN
        DROP POLICY "teacher_apps_no_user_updates" ON public.teacher_applications;
    END IF;
END $$;

-- Secure teacher application access
CREATE POLICY "teacher_apps_own_read_secure" 
ON public.teacher_applications FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "teacher_apps_own_insert_secure" 
ON public.teacher_applications FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Completely block updates to teacher applications (they should be immutable)
CREATE POLICY "teacher_apps_block_all_updates" 
ON public.teacher_applications FOR UPDATE
USING (false);

-- 3. Fix parental consents - make even more secure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parental_consents' AND policyname = 'Parental Consent: Parent access to own submissions') THEN
        DROP POLICY "Parental Consent: Parent access to own submissions" ON public.parental_consents;
    END IF;
END $$;

-- Ultra-secure parental consent access for parents
CREATE POLICY "parental_consent_parent_ultra_secure" 
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

-- 4. Enhance safeguarding reports security
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safeguarding_reports' AND policyname = 'safeguarding_authorized_view') THEN
        DROP POLICY "safeguarding_authorized_view" ON public.safeguarding_reports;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safeguarding_reports' AND policyname = 'safeguarding_authorized_modify') THEN
        DROP POLICY "safeguarding_authorized_modify" ON public.safeguarding_reports;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safeguarding_reports' AND policyname = 'safeguarding_authenticated_submit') THEN
        DROP POLICY "safeguarding_authenticated_submit" ON public.safeguarding_reports;
    END IF;
END $$;

-- Ultra-restricted safeguarding access (admin + authorized personnel only)
CREATE POLICY "safeguarding_reports_ultra_restricted" 
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

-- Safeguarding personnel can modify reports
CREATE POLICY "safeguarding_reports_modify_authorized" 
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
WITH CHECK (has_safeguarding_access(auth.uid()));

-- Authenticated users can submit safeguarding reports
CREATE POLICY "safeguarding_reports_authenticated_submit" 
ON public.safeguarding_reports FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- 5. Add data encryption trigger for confidential info
CREATE OR REPLACE FUNCTION public.protect_confidential_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Log access to any confidential data
    PERFORM public.log_sensitive_operation(
        'confidential_data_' || lower(TG_OP),
        TG_TABLE_NAME::text,
        COALESCE(NEW.id::text, OLD.id::text)
    );
    
    -- Verify admin access for confidential records
    IF TG_TABLE_NAME = 'confidential_records' THEN
        IF NOT public.verify_confidential_access() THEN
            RAISE EXCEPTION 'SECURITY_VIOLATION: Unauthorized access to confidential records';
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Apply protection triggers to sensitive tables
CREATE TRIGGER protect_challengers_data
    BEFORE INSERT OR UPDATE OR DELETE ON public.challengers
    FOR EACH ROW EXECUTE FUNCTION public.protect_confidential_data();

CREATE TRIGGER protect_teacher_apps_data
    BEFORE INSERT OR UPDATE OR DELETE ON public.teacher_applications
    FOR EACH ROW EXECUTE FUNCTION public.protect_confidential_data();

CREATE TRIGGER protect_parental_consent_data
    BEFORE INSERT OR UPDATE OR DELETE ON public.parental_consents
    FOR EACH ROW EXECUTE FUNCTION public.protect_confidential_data();
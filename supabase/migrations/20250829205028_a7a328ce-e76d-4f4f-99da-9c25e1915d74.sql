-- Complete security lockdown - drop ALL existing policies and create clean admin-only access

-- Drop ALL existing policies for teacher_applications 
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class pc ON pol.polrelid = pc.oid 
        WHERE pc.relname = 'teacher_applications'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.teacher_applications', policy_name);
    END LOOP;
END $$;

-- Drop ALL existing policies for challengers
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class pc ON pol.polrelid = pc.oid 
        WHERE pc.relname = 'challengers'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.challengers', policy_name);
    END LOOP;
END $$;

-- Drop ALL existing policies for parental_consents
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class pc ON pol.polrelid = pc.oid 
        WHERE pc.relname = 'parental_consents'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.parental_consents', policy_name);
    END LOOP;
END $$;

-- Drop ALL existing policies for safeguarding_reports
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class pc ON pol.polrelid = pc.oid 
        WHERE pc.relname = 'safeguarding_reports'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.safeguarding_reports', policy_name);
    END LOOP;
END $$;

-- Drop ALL existing policies for confidential_records
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT pol.polname 
        FROM pg_policy pol 
        JOIN pg_class pc ON pol.polrelid = pc.oid 
        WHERE pc.relname = 'confidential_records'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.confidential_records', policy_name);
    END LOOP;
END $$;

-- Now create clean, single policies for each table

-- TEACHER APPLICATIONS: Admin-only access
CREATE POLICY "admin_only_teacher_apps" ON public.teacher_applications
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- CHALLENGERS: Admin-only access  
CREATE POLICY "admin_only_challengers" ON public.challengers
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- PARENTAL CONSENTS: Admin-only access
CREATE POLICY "admin_only_parental_consents" ON public.parental_consents
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- SAFEGUARDING REPORTS: Admin-only access
CREATE POLICY "admin_only_safeguarding" ON public.safeguarding_reports
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- CONFIDENTIAL RECORDS: Admin-only with verification
CREATE POLICY "admin_verified_confidential" ON public.confidential_records
  FOR ALL TO authenticated
  USING (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  )
  WITH CHECK (
    get_current_user_role() = 'admin' AND 
    secure_confidential_access_check()
  );
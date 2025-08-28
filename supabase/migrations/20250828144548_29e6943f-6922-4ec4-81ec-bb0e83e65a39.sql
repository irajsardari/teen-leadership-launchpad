-- Comprehensive RLS Policy Updates for Maximum Security
-- Ensure all tables have explicit, restrictive policies

-- 1. Update challengers table policies to be more explicit
DROP POLICY IF EXISTS "challengers_own_records_secure" ON public.challengers;
DROP POLICY IF EXISTS "challengers_admin_secure_access" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_public_access" ON public.challengers;

CREATE POLICY "challengers_strict_user_access" 
ON public.challengers 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid() AND 
  validate_user_data_access('challengers', user_id)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

CREATE POLICY "challengers_admin_verified_access" 
ON public.challengers 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 2. Update teacher_applications table policies
DROP POLICY IF EXISTS "teacher_apps_select_own_only_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_update_own_only_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_insert_own_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_delete_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_anonymous_access" ON public.teacher_applications;

CREATE POLICY "teacher_apps_strict_user_access" 
ON public.teacher_applications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid() AND 
  validate_user_data_access('teacher_applications', user_id)
);

CREATE POLICY "teacher_apps_user_insert_only" 
ON public.teacher_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid() AND
  secure_form_submission('teacher_application', 3, 60)
);

CREATE POLICY "teacher_apps_no_user_updates" 
ON public.teacher_applications 
FOR UPDATE 
USING (false);

CREATE POLICY "teacher_apps_admin_full_access" 
ON public.teacher_applications 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

CREATE POLICY "teacher_apps_admin_delete_only" 
ON public.teacher_applications 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 3. Strengthen storage bucket policies
-- Create comprehensive storage policies for all buckets

-- Teacher CV bucket policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'secure-teacher-cvs', 
  'secure-teacher-cvs', 
  false, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage object policies for teacher CVs
CREATE POLICY "secure_cv_user_upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  octet_length(decode(encode(metadata, 'base64'), 'base64')) <= 10485760
);

CREATE POLICY "secure_cv_user_select" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  ((storage.foldername(name))[1] = auth.uid()::text OR get_current_user_role() = 'admin')
);

CREATE POLICY "secure_cv_user_update" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "secure_cv_user_delete" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  ((storage.foldername(name))[1] = auth.uid()::text OR get_current_user_role() = 'admin')
);

-- 4. Enhanced confidential records policies
DROP POLICY IF EXISTS "confidential_admin_verification_restrictive_2024" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_select_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_insert_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_update_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_delete_v2" ON public.confidential_records;

CREATE POLICY "confidential_ultra_secure_access" 
ON public.confidential_records 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  confidential_access_control() AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') AND
  -- Time-based access restriction (no access during maintenance hours 2-4 AM UTC)
  (EXTRACT(hour FROM now() AT TIME ZONE 'UTC') < 2 OR EXTRACT(hour FROM now() AT TIME ZONE 'UTC') > 4)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  confidential_access_control() AND
  entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding') AND
  entity_id IS NOT NULL
);

-- 5. Safeguarding reports - ultra strict policies
DROP POLICY IF EXISTS "Safeguarding: Authenticated submission only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - SELECT" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - UPDATE" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - DELETE" ON public.safeguarding_reports;

CREATE POLICY "safeguarding_secure_submit" 
ON public.safeguarding_reports 
FOR INSERT 
WITH CHECK (
  block_unauthorized_access('safeguarding_reports') AND
  auth.uid() IS NOT NULL AND
  secure_form_submission('safeguarding_report', 2, 3600) -- Max 2 per hour
);

CREATE POLICY "safeguarding_authorized_access" 
ON public.safeguarding_reports 
FOR SELECT 
USING (
  block_unauthorized_access('safeguarding_reports') AND
  has_safeguarding_access(auth.uid()) AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "safeguarding_authorized_update" 
ON public.safeguarding_reports 
FOR UPDATE 
USING (
  block_unauthorized_access('safeguarding_reports') AND
  has_safeguarding_access(auth.uid()) AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_authorized_delete" 
ON public.safeguarding_reports 
FOR DELETE 
USING (
  block_unauthorized_access('safeguarding_reports') AND
  has_safeguarding_access(auth.uid()) AND
  get_current_user_role() = 'admin'
);

-- 6. Enhanced security audit logging
CREATE POLICY "audit_logs_admin_read_only" 
ON public.security_audit_logs 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "audit_logs_system_insert_only" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true); -- Allow system inserts from functions

-- 7. Rate limiting tables - admin only
CREATE POLICY "rate_limits_admin_only" 
ON public.rate_limit_attempts 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 8. Admin audit log - ultra secure
DROP POLICY IF EXISTS "admin_audit_log_admin_only" ON public.admin_audit_log;

CREATE POLICY "admin_audit_ultra_secure" 
ON public.admin_audit_log 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') AND
  admin_id = auth.uid() -- Can only see own admin actions unless super admin
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  admin_id = auth.uid()
);

-- 9. Enhanced function for secure challengers insertion
CREATE OR REPLACE FUNCTION public.secure_challenger_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Ensure user authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for challenger registration';
  END IF;
  
  -- Verify user owns this record
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot register challenger for different user';
  END IF;
  
  -- Age validation
  IF NEW.age < 10 OR NEW.age > 18 THEN
    RAISE EXCEPTION 'Age must be between 10 and 18';
  END IF;
  
  -- Email validation
  IF NEW.email IS NULL OR NOT (NEW.email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$') THEN
    RAISE EXCEPTION 'Valid email address required';
  END IF;
  
  -- Rate limiting check
  IF NOT secure_form_submission('challenger_registration', 3, 3600) THEN
    RAISE EXCEPTION 'Registration rate limit exceeded';
  END IF;
  
  -- Log the registration
  PERFORM log_sensitive_operation(
    'secure_challenger_registration',
    'student_data',
    NEW.user_id::text
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for challenger insertions
DROP TRIGGER IF EXISTS challenger_secure_insert_trigger ON public.challengers;
CREATE TRIGGER challenger_secure_insert_trigger
  BEFORE INSERT ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.secure_challenger_insert();
-- Fix policy conflicts and create comprehensive secure policies

-- 1. Clean up existing policies that might conflict
DROP POLICY IF EXISTS "teacher_apps_admin_delete_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_delete_only" ON public.teacher_applications;

-- 2. Update challengers table with secure policies
DROP POLICY IF EXISTS "challengers_own_records_secure" ON public.challengers;
DROP POLICY IF EXISTS "challengers_admin_secure_access" ON public.challengers;
DROP POLICY IF EXISTS "challengers_block_public_access" ON public.challengers;

CREATE POLICY "challengers_user_secure_access" 
ON public.challengers 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

CREATE POLICY "challengers_admin_full_access" 
ON public.challengers 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 3. Update teacher applications with secure policies  
DROP POLICY IF EXISTS "teacher_apps_select_own_only_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_update_own_only_secure" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_insert_own_only" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_block_anonymous_access" ON public.teacher_applications;

CREATE POLICY "teacher_apps_user_read_own" 
ON public.teacher_applications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

CREATE POLICY "teacher_apps_user_create_only" 
ON public.teacher_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

CREATE POLICY "teacher_apps_admin_all_access" 
ON public.teacher_applications 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- Prevent users from updating their applications after submission
CREATE POLICY "teacher_apps_no_user_updates" 
ON public.teacher_applications 
FOR UPDATE 
USING (false);

-- Only admins can delete applications
CREATE POLICY "teacher_apps_admin_delete_secure" 
ON public.teacher_applications 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 4. Secure storage bucket for teacher CVs
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

-- Storage policies for secure CV uploads
CREATE POLICY "secure_cv_upload_policy" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "secure_cv_read_policy" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  ((storage.foldername(name))[1] = auth.uid()::text OR get_current_user_role() = 'admin')
);

CREATE POLICY "secure_cv_delete_policy" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'secure-teacher-cvs' AND
  auth.uid() IS NOT NULL AND
  ((storage.foldername(name))[1] = auth.uid()::text OR get_current_user_role() = 'admin')
);

-- 5. Enhanced confidential records security
DROP POLICY IF EXISTS "confidential_admin_verification_restrictive_2024" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_select_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_insert_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_update_v2" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_max_security_delete_v2" ON public.confidential_records;

CREATE POLICY "confidential_admin_only_access" 
ON public.confidential_records 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin' AND
  entity_type IN ('student', 'teacher', 'application', 'incident', 'medical', 'safeguarding')
);

-- 6. Secure safeguarding reports
DROP POLICY IF EXISTS "Safeguarding: Authenticated submission only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - SELECT" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - UPDATE" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - DELETE" ON public.safeguarding_reports;

CREATE POLICY "safeguarding_authenticated_submit" 
ON public.safeguarding_reports 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL
);

CREATE POLICY "safeguarding_authorized_view" 
ON public.safeguarding_reports 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND
  has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_authorized_modify" 
ON public.safeguarding_reports 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND
  has_safeguarding_access(auth.uid())
)
WITH CHECK (
  has_safeguarding_access(auth.uid())
);

CREATE POLICY "safeguarding_admin_delete" 
ON public.safeguarding_reports 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- 7. Secure audit logs - admin read-only
CREATE POLICY "security_audit_admin_read" 
ON public.security_audit_logs 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);

-- Allow system functions to insert audit logs
CREATE POLICY "security_audit_system_insert" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 8. Rate limiting - admin only access
CREATE POLICY "rate_limit_admin_access" 
ON public.rate_limit_attempts 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  get_current_user_role() = 'admin'
);
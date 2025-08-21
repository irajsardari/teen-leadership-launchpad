-- Security Hardening Migration for TMA Academy
-- This migration implements comprehensive security measures

-- 1. Fix Course Information Exposure
-- Restrict course viewing to authenticated users only
DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;

CREATE POLICY "Authenticated users can view active courses" 
ON public.courses 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- 2. Enhance Teacher Application Security
-- Ensure user_id is always set and not nullable
ALTER TABLE public.teacher_applications 
ALTER COLUMN user_id SET NOT NULL;

-- Add trigger to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.ensure_teacher_application_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Ensure only authenticated users can insert
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_ensure_teacher_application_user_id
  BEFORE INSERT ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_teacher_application_user_id();

-- 3. Enhance Profile Security
-- Add constraint to ensure profiles can only be created for authenticated users
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_matches_auth_uid 
CHECK (id = auth.uid() OR get_current_user_role() = 'admin');

-- 4. Create Audit Logging for Sensitive Operations
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
ON public.security_audit_logs
FOR ALL
USING (get_current_user_role() = 'admin');

-- 5. Create function to log sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id
  );
END;
$$;

-- 6. Enhanced RLS for Challenger Records
-- Ensure challengers table has proper constraints
ALTER TABLE public.challengers 
ADD CONSTRAINT challengers_user_id_not_null 
CHECK (user_id IS NOT NULL);

-- 7. Create secure file access logging
CREATE OR REPLACE FUNCTION public.log_file_access(
  p_file_path TEXT,
  p_action TEXT DEFAULT 'download'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  PERFORM public.log_sensitive_operation(
    p_action || '_file',
    'file',
    p_file_path
  );
END;
$$;

-- 8. Rate Limiting Function (for application layer)
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  action TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier_action 
ON public.rate_limit_attempts(identifier, action, window_start);

-- 9. Enhanced Storage Security
-- Create policy for teacher documents bucket
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'teacher-documents' AND 
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'teacher-documents' AND 
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'teacher-documents' AND 
  get_current_user_role() = 'admin'
);

-- 10. Create assignments bucket with proper security
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignments', 'assignments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Students can access their assignments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'assignments' AND 
  auth.uid() IS NOT NULL AND
  (
    -- Student can access if they're enrolled in the course
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.student_id = auth.uid()
        AND e.is_active = true
        AND (storage.foldername(name))[1] = c.id::text
    )
    OR 
    -- Admin can access all
    get_current_user_role() = 'admin'
    OR
    -- Teacher can access their course assignments
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.teacher_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
    )
  )
);

CREATE POLICY "Teachers can upload assignments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'assignments' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.teacher_id = auth.uid()
      AND (storage.foldername(name))[1] = c.id::text
  )
);

-- 11. Clean up any existing overly permissive policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
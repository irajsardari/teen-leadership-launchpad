-- PHASE 3: File Storage Security - Secure bucket policies

-- Create secure storage policies for sensitive file uploads
-- CVs and documents should be private with user-specific access

-- Storage policies for teacher-documents bucket (CVs, etc.)
CREATE POLICY "upload_own_teacher_docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'teacher-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "read_own_teacher_docs" 
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'teacher-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "admin_read_all_teacher_docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'teacher-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Storage policies for assignments bucket
CREATE POLICY "upload_course_assignments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'assignments'
    AND (
      -- Teachers can upload to their course folders
      EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.teacher_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
      )
      OR
      -- Students can upload to courses they're enrolled in
      EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.courses c ON c.id = e.course_id
        WHERE e.student_id = auth.uid()
        AND e.is_active = true
        AND (storage.foldername(name))[1] = c.id::text
      )
    )
  );

CREATE POLICY "read_course_assignments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'assignments'
    AND (
      -- Teachers can read their course files
      EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.teacher_id = auth.uid()
        AND (storage.foldername(name))[1] = c.id::text
      )
      OR
      -- Students can read files from enrolled courses  
      EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.courses c ON c.id = e.course_id
        WHERE e.student_id = auth.uid()
        AND e.is_active = true
        AND (storage.foldername(name))[1] = c.id::text
      )
      OR
      -- Admins can read everything
      EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );

-- PHASE 4: Enhanced Security Functions for API routes

-- Create function to validate user session and get verified role
CREATE OR REPLACE FUNCTION public.get_authenticated_user_role()
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.role 
  FROM public.profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$$;

-- Create function for secure form submissions with rate limiting
CREATE OR REPLACE FUNCTION public.secure_form_submission(
  p_form_type TEXT,
  p_max_attempts INTEGER DEFAULT 3,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_identifier TEXT;
  current_attempts INTEGER;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Generate rate limit identifier
  user_identifier := auth.uid()::text || '_' || p_form_type;
  
  -- Check rate limit
  IF NOT public.check_rate_limit(
    user_identifier, 
    p_form_type, 
    p_max_attempts, 
    p_window_minutes
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
  END IF;
  
  -- Log the submission attempt
  PERFORM public.log_sensitive_operation(
    'secure_form_submission_' || p_form_type,
    'form_security',
    auth.uid()::text
  );
  
  RETURN TRUE;
END;
$$;

-- Log Phase 3 & 4 completion
SELECT public.log_sensitive_operation(
  'phase_3_4_storage_api_security_complete',
  'data_protection',
  'file_storage_and_api_secured'
);
-- Fix Critical Security Issues: Enable RLS on all public tables

-- Enable RLS on security_audit_logs (already done above but ensuring)
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rate_limit_attempts
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for rate_limit_attempts (admin only access)
CREATE POLICY "Admins can manage rate limit attempts"
ON public.rate_limit_attempts
FOR ALL
USING (get_current_user_role() = 'admin');

-- Verify all existing tables have RLS enabled
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.progress_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Additional security enhancements
-- Create function to validate IP-based rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current window start time
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Count attempts in current window
  SELECT COALESCE(SUM(attempts), 0)
  INTO current_attempts
  FROM public.rate_limit_attempts
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start > window_start;
  
  -- If under limit, record attempt and allow
  IF current_attempts < p_max_attempts THEN
    INSERT INTO public.rate_limit_attempts (identifier, action, attempts)
    VALUES (p_identifier, p_action, 1)
    ON CONFLICT (identifier, action) 
    DO UPDATE SET 
      attempts = rate_limit_attempts.attempts + 1,
      window_start = CASE 
        WHEN rate_limit_attempts.window_start < window_start 
        THEN now() 
        ELSE rate_limit_attempts.window_start 
      END;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create function for secure file URL generation
CREATE OR REPLACE FUNCTION public.generate_secure_file_url(
  p_bucket_name TEXT,
  p_file_path TEXT,
  p_expires_in INTEGER DEFAULT 300 -- 5 minutes
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  signed_url TEXT;
  user_has_access BOOLEAN := false;
BEGIN
  -- Check if user has access to the file
  IF p_bucket_name = 'teacher-documents' THEN
    -- Check if user owns the file or is admin
    SELECT (
      (storage.foldername(p_file_path))[1] = auth.uid()::text OR
      get_current_user_role() = 'admin'
    ) INTO user_has_access;
  ELSIF p_bucket_name = 'assignments' THEN
    -- Check if user is enrolled in course or is teacher/admin
    SELECT EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.student_id = auth.uid()
        AND e.is_active = true
        AND (storage.foldername(p_file_path))[1] = c.id::text
    ) OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.teacher_id = auth.uid()
        AND (storage.foldername(p_file_path))[1] = c.id::text
    ) OR get_current_user_role() = 'admin'
    INTO user_has_access;
  END IF;
  
  IF NOT user_has_access THEN
    RAISE EXCEPTION 'Access denied to file: %', p_file_path;
  END IF;
  
  -- Log file access
  PERFORM public.log_file_access(p_file_path, 'access_request');
  
  -- In a real implementation, this would generate a signed URL
  -- For now, return a placeholder that indicates secure access granted
  RETURN format('secure://%s/%s?expires=%s', p_bucket_name, p_file_path, 
                 extract(epoch from now() + (p_expires_in || ' seconds')::interval));
END;
$$;
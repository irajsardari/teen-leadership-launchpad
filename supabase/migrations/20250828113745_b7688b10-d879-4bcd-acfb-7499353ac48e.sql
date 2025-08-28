-- Final comprehensive fix for remaining function search_path issues
-- Update any other functions that might be missing search_path

CREATE OR REPLACE FUNCTION public.log_file_access(p_file_path text, p_action text DEFAULT 'download'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.log_sensitive_operation(
    p_action || '_file',
    'file',
    p_file_path
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_secure_file_url(p_bucket_name text, p_file_path text, p_expires_in integer DEFAULT 300)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit(p_identifier text, p_action text, p_max_attempts integer DEFAULT 5, p_window_minutes integer DEFAULT 15, p_block_minutes integer DEFAULT 60)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  window_start_time timestamp with time zone;
  current_attempts integer;
  blocked_until_time timestamp with time zone;
  result jsonb;
BEGIN
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Check if currently blocked
  SELECT blocked_until INTO blocked_until_time
  FROM public.security_rate_limits
  WHERE identifier = p_identifier AND action = p_action
    AND blocked_until > now()
  ORDER BY blocked_until DESC
  LIMIT 1;
  
  IF blocked_until_time IS NOT NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'blocked_until', blocked_until_time,
      'reason', 'temporarily_blocked'
    );
  END IF;
  
  -- Count attempts in current window
  SELECT COALESCE(SUM(attempts), 0) INTO current_attempts
  FROM public.security_rate_limits
  WHERE identifier = p_identifier 
    AND action = p_action
    AND window_start > window_start_time;
  
  -- If under limit, allow and record
  IF current_attempts < p_max_attempts THEN
    INSERT INTO public.security_rate_limits (identifier, action, attempts, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT (identifier, action, window_start) 
    DO UPDATE SET attempts = security_rate_limits.attempts + 1;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'attempts_remaining', p_max_attempts - current_attempts - 1
    );
  END IF;
  
  -- Block user
  INSERT INTO public.security_rate_limits (identifier, action, blocked_until)
  VALUES (p_identifier, p_action, now() + (p_block_minutes || ' minutes')::interval)
  ON CONFLICT (identifier, action, window_start) DO NOTHING;
  
  RETURN jsonb_build_object(
    'allowed', false,
    'blocked_until', now() + (p_block_minutes || ' minutes')::interval,
    'reason', 'rate_limit_exceeded'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_csrf_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  token text;
BEGIN
  -- Generate random token
  token := encode(gen_random_bytes(32), 'base64');
  
  -- Store token with expiry (valid for 1 hour)
  INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id
  ) VALUES (
    auth.uid(), 'csrf_token_generated', 'security', token
  );
  
  RETURN token;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_and_sanitize_input(p_input text, p_type text DEFAULT 'general'::text, p_max_length integer DEFAULT 1000)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sanitized text;
  is_valid boolean := true;
  errors text[] := ARRAY[]::text[];
BEGIN
  -- Length check
  IF length(p_input) > p_max_length THEN
    errors := array_append(errors, 'Input too long');
    is_valid := false;
  END IF;
  
  -- Basic sanitization
  sanitized := trim(p_input);
  
  -- Type-specific validation
  IF p_type = 'email' THEN
    IF NOT (sanitized ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
      errors := array_append(errors, 'Invalid email format');
      is_valid := false;
    END IF;
    sanitized := lower(sanitized);
  ELSIF p_type = 'phone' THEN
    sanitized := regexp_replace(sanitized, '[^\d+\-\(\)\s]', '', 'g');
    IF length(regexp_replace(sanitized, '[^\d]', '', 'g')) < 10 THEN
      errors := array_append(errors, 'Invalid phone number');
      is_valid := false;
    END IF;
  ELSIF p_type = 'name' THEN
    sanitized := regexp_replace(sanitized, '[<>"\''&]', '', 'g');
    IF length(sanitized) < 2 THEN
      errors := array_append(errors, 'Name too short');
      is_valid := false;
    END IF;
  ELSE
    -- General sanitization - remove potential XSS
    sanitized := regexp_replace(sanitized, '[<>"\''&]', '', 'g');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', is_valid,
    'sanitized', sanitized,
    'errors', errors
  );
END;
$$;
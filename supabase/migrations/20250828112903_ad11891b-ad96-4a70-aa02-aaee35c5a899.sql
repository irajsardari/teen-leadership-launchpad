-- Add missing security measures for teacher_applications table
-- Focus on audit logging and anonymous access blocking without policy conflicts

-- Ensure no anonymous access whatsoever
DROP POLICY IF EXISTS "teacher_apps_block_anonymous_access" ON public.teacher_applications;
CREATE POLICY "teacher_apps_block_anonymous_access" 
ON public.teacher_applications 
FOR ALL 
TO anon
USING (false);

-- Add comprehensive audit logging function for sensitive teacher application data
CREATE OR REPLACE FUNCTION audit_teacher_application_access() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to sensitive teacher application data
  PERFORM public.log_sensitive_operation(
    'teacher_application_' || lower(TG_OP),
    'sensitive_teacher_data',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Additional high-priority logging for sensitive personal data
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'TEACHER_APPLICATION_' || TG_OP,
    'teacher_applications',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for comprehensive audit logging if it doesn't exist
DROP TRIGGER IF EXISTS audit_teacher_application_access_trigger ON public.teacher_applications;
CREATE TRIGGER audit_teacher_application_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION audit_teacher_application_access();

-- Add a secure function to retrieve teacher applications with proper access control
CREATE OR REPLACE FUNCTION get_teacher_application_secure(application_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  full_name text,
  email text,
  phone_number text,
  specialization text,
  education text,
  experience_years integer,
  cv_url text,
  cover_letter text,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role text;
  has_access boolean := false;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for teacher application access';
  END IF;
  
  -- Get user role
  current_user_role := get_current_user_role();
  
  -- Check if user has access (owns the application or is admin)
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_applications ta
    WHERE ta.id = application_id 
    AND (ta.user_id = auth.uid() OR current_user_role = 'admin')
  ) INTO has_access;
  
  IF NOT has_access THEN
    RAISE EXCEPTION 'Access denied to teacher application';
  END IF;
  
  -- Log the secure access
  PERFORM public.log_sensitive_operation(
    'teacher_application_secure_access',
    'controlled_access',
    application_id::text
  );
  
  -- Return the application data
  RETURN QUERY
  SELECT 
    ta.id,
    ta.user_id,
    ta.full_name,
    ta.email,
    ta.phone_number,
    ta.specialization,
    ta.education,
    ta.experience_years,
    ta.cv_url,
    ta.cover_letter,
    ta.status,
    ta.created_at,
    ta.updated_at
  FROM public.teacher_applications ta
  WHERE ta.id = application_id;
END;
$$;
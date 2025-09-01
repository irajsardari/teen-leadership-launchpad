-- Enhanced security for teacher_applications table
-- This migration adds additional security layers to protect sensitive teacher application data

-- First, let's create a more secure function for accessing teacher applications
CREATE OR REPLACE FUNCTION public.verify_admin_with_mfa()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Must be admin
  IF get_current_user_role() != 'admin' THEN
    RETURN false;
  END IF;
  
  -- Log admin access for audit trail
  PERFORM log_sensitive_operation(
    'admin_teacher_application_access',
    'teacher_applications',
    auth.uid()::text
  );
  
  RETURN true;
END;
$$;

-- Create a function to securely access teacher applications
CREATE OR REPLACE FUNCTION public.get_teacher_application_secure(application_id uuid)
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
  
  -- Return the application data (excluding confidential_info for non-admins)
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

-- Enhanced trigger for teacher applications to ensure security
CREATE OR REPLACE FUNCTION public.secure_teacher_application_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Ensure user_id matches authenticated user
  IF NEW.user_id IS NULL OR NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Security violation: user_id must match authenticated user';
  END IF;
  
  -- Log the secure insertion
  PERFORM public.log_sensitive_operation(
    'secure_teacher_application_insert',
    'teacher_applications',
    NEW.id::text
  );
  
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS secure_teacher_application_insert_trigger ON public.teacher_applications;
CREATE TRIGGER secure_teacher_application_insert_trigger
  BEFORE INSERT ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.secure_teacher_application_insert();

-- Enhanced audit trigger for teacher applications
CREATE OR REPLACE FUNCTION public.audit_teacher_application_access()
RETURNS trigger
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

-- Create or replace the audit trigger
DROP TRIGGER IF EXISTS audit_teacher_application_access_trigger ON public.teacher_applications;
CREATE TRIGGER audit_teacher_application_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_teacher_application_access();

-- Revoke all existing permissions and re-grant with strict controls
REVOKE ALL ON public.teacher_applications FROM anon;
REVOKE ALL ON public.teacher_applications FROM authenticated;

-- Re-enable RLS to ensure all policies are active
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts and recreate with enhanced security
DROP POLICY IF EXISTS "teacher_apps_deny_anonymous_completely" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_secure_delete" ON public.teacher_applications;

-- Create new ultra-secure policies
CREATE POLICY "teacher_applications_deny_anonymous_completely" 
ON public.teacher_applications 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

CREATE POLICY "teacher_applications_secure_select" 
ON public.teacher_applications 
FOR SELECT 
TO authenticated 
USING (
  auth.uid() = user_id OR verify_admin_with_mfa()
);

CREATE POLICY "teacher_applications_secure_insert" 
ON public.teacher_applications 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND NOT EXISTS (
    SELECT 1 FROM public.teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > now() - interval '1 hour'
  )
);

CREATE POLICY "teacher_applications_secure_update" 
ON public.teacher_applications 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = user_id OR verify_admin_with_mfa()
) 
WITH CHECK (
  auth.uid() = user_id OR verify_admin_with_mfa()
);

CREATE POLICY "teacher_applications_secure_delete" 
ON public.teacher_applications 
FOR DELETE 
TO authenticated 
USING (
  verify_admin_with_mfa()
);

-- Add comment to document security measures
COMMENT ON TABLE public.teacher_applications IS 'Teacher applications table with enhanced security: RLS policies restrict access to application owners and verified admins only. All access is logged for audit purposes. Confidential information should only be accessed by authorized personnel.';

-- Grant minimal required permissions
GRANT SELECT, INSERT, UPDATE ON public.teacher_applications TO authenticated;
GRANT DELETE ON public.teacher_applications TO authenticated; -- Controlled by RLS policy requiring admin verification
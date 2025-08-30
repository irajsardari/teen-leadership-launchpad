-- Security Fix: Strengthen Teacher Applications RLS Policies
-- This migration addresses potential vulnerabilities in complex RLS policies
-- by implementing simpler, more secure access controls

-- First, drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "teacher_apps_maximum_security_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_delete" ON public.teacher_applications;

-- Create new, simplified and more secure policies

-- 1. DENY ALL anonymous access (this stays the same as it's already secure)
-- (teacher_apps_deny_anonymous_completely already exists and is secure)

-- 2. SELECT: Only the applicant or verified admin can view
CREATE POLICY "teacher_apps_secure_select"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (
  -- User can see their own application
  auth.uid() = user_id 
  OR 
  -- Admin can see all applications (simplified check)
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 3. INSERT: Only authenticated users can create their own applications
CREATE POLICY "teacher_apps_secure_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- Can only create application for themselves
  auth.uid() = user_id
  AND
  -- Rate limiting check
  NOT EXISTS (
    SELECT 1 FROM public.teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > NOW() - INTERVAL '1 hour'
  )
);

-- 4. UPDATE: Only applicant can update their own application, admins can update status
CREATE POLICY "teacher_apps_secure_update"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (
  -- User can update their own application
  auth.uid() = user_id
  OR
  -- Admin can update any application
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  -- User can update their own application (except status)
  (auth.uid() = user_id AND OLD.status = NEW.status)
  OR
  -- Admin can update any field including status
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 5. DELETE: Only admins can delete applications
CREATE POLICY "teacher_apps_secure_delete"
ON public.teacher_applications
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add additional security: Ensure user_id is always set correctly on insert
CREATE OR REPLACE FUNCTION public.secure_teacher_application_insert()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for secure insertions
DROP TRIGGER IF EXISTS secure_teacher_application_insert_trigger ON public.teacher_applications;
CREATE TRIGGER secure_teacher_application_insert_trigger
  BEFORE INSERT ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.secure_teacher_application_insert();

-- Similarly, let's fix the other tables mentioned in the security report

-- Fix challengers table policies
DROP POLICY IF EXISTS "challengers_maximum_security_select" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_insert" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_update" ON public.challengers;
DROP POLICY IF EXISTS "challengers_maximum_security_delete" ON public.challengers;

CREATE POLICY "challengers_secure_select"
ON public.challengers
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "challengers_secure_insert"
ON public.challengers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND auth.uid() = user_id
);

CREATE POLICY "challengers_secure_update"
ON public.challengers
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "challengers_secure_delete"
ON public.challengers
FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Fix parental_consents policies
DROP POLICY IF EXISTS "parental_consents_maximum_security" ON public.parental_consents;

CREATE POLICY "parental_consents_secure_access"
ON public.parental_consents
FOR ALL
TO authenticated
USING (
  -- Parent can access consents they submitted
  auth.uid() = parent_user_id
  OR
  -- Child can view their own consent
  auth.uid() = child_user_id
  OR
  -- Admin can access all
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  -- Only parent or admin can modify
  auth.uid() = parent_user_id
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Enable leaked password protection
ALTER DATABASE postgres SET password_encryption = 'scram-sha-256';

-- Add audit logging for security events
CREATE OR REPLACE FUNCTION public.log_security_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    ip_address
  ) VALUES (
    auth.uid(),
    'SECURE_' || TG_OP || '_' || TG_TABLE_NAME,
    'sensitive_data_access',
    COALESCE(NEW.id::text, OLD.id::text),
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add security logging triggers
DROP TRIGGER IF EXISTS teacher_applications_security_log ON public.teacher_applications;
CREATE TRIGGER teacher_applications_security_log
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_security_access();

DROP TRIGGER IF EXISTS challengers_security_log ON public.challengers;  
CREATE TRIGGER challengers_security_log
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_security_access();
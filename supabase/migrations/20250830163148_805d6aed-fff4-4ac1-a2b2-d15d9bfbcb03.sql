-- Security Fix: Strengthen Teacher Applications RLS Policies (Corrected)
-- This migration addresses potential vulnerabilities in complex RLS policies
-- by implementing simpler, more secure access controls

-- First, drop existing potentially vulnerable policies
DROP POLICY IF EXISTS "teacher_apps_maximum_security_select" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_update" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_apps_maximum_security_delete" ON public.teacher_applications;

-- Create new, simplified and more secure policies

-- 1. SELECT: Only the applicant or verified admin can view
CREATE POLICY "teacher_apps_secure_select"
ON public.teacher_applications
FOR SELECT
TO authenticated
USING (
  -- User can see their own application
  auth.uid() = user_id 
  OR 
  -- Admin can see all applications (direct check via profiles table)
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 2. INSERT: Only authenticated users can create their own applications
CREATE POLICY "teacher_apps_secure_insert"
ON public.teacher_applications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Must be authenticated and creating for themselves
  auth.uid() IS NOT NULL
  AND auth.uid() = user_id
  AND
  -- Simple rate limiting: one application per hour
  NOT EXISTS (
    SELECT 1 FROM public.teacher_applications 
    WHERE user_id = auth.uid() 
    AND created_at > NOW() - INTERVAL '1 hour'
  )
);

-- 3. UPDATE: Simplified update policy
CREATE POLICY "teacher_apps_secure_update"
ON public.teacher_applications
FOR UPDATE
TO authenticated
USING (
  -- User can update their own application OR admin can update any
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. DELETE: Only admins can delete applications
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

-- Add trigger to ensure data integrity on inserts
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

-- Fix challengers table policies with same approach
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

CREATE POLICY "parental_consents_secure_select"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (
  -- Parent can view consents they submitted
  auth.uid() = parent_user_id
  OR
  -- Child can view their own consent
  auth.uid() = child_user_id
  OR
  -- Admin can view all
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "parental_consents_secure_insert"
ON public.parental_consents
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only authenticated parent can create consent
  auth.uid() IS NOT NULL
  AND auth.uid() = parent_user_id
);

CREATE POLICY "parental_consents_secure_update"
ON public.parental_consents
FOR UPDATE
TO authenticated
USING (
  -- Only parent or admin can modify
  auth.uid() = parent_user_id
  OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "parental_consents_secure_delete"
ON public.parental_consents
FOR DELETE
TO authenticated
USING (
  -- Only admin can delete
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Add comprehensive audit logging for all sensitive operations
CREATE OR REPLACE FUNCTION public.log_secure_access()
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
    'SECURE_ACCESS_' || TG_OP || '_' || TG_TABLE_NAME,
    'protected_data',
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

-- Add security logging triggers to all sensitive tables
DROP TRIGGER IF EXISTS teacher_applications_secure_log ON public.teacher_applications;
CREATE TRIGGER teacher_applications_secure_log
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_secure_access();

DROP TRIGGER IF EXISTS challengers_secure_log ON public.challengers;  
CREATE TRIGGER challengers_secure_log
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_secure_access();

DROP TRIGGER IF EXISTS parental_consents_secure_log ON public.parental_consents;
CREATE TRIGGER parental_consents_secure_log
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_secure_access();
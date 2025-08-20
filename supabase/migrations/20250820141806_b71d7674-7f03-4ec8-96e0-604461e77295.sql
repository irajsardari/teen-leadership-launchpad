-- Security Enhancement Migration - Fix Critical Vulnerabilities (Fixed Version)

-- 1. Strengthen get_current_user_role function to handle null cases better
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COALESCE(role, 'challenger') FROM public.profiles WHERE id = auth.uid();
$function$;

-- 2. Ensure all profiles have a role (fix any null roles)
UPDATE public.profiles 
SET role = 'challenger' 
WHERE role IS NULL;

-- 3. Add NOT NULL constraint to profiles.role to prevent future null values
ALTER TABLE public.profiles 
ALTER COLUMN role SET NOT NULL;

-- 4. Add additional security function to check if user owns a record
CREATE OR REPLACE FUNCTION public.user_owns_challenger_record(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT record_user_id = auth.uid();
$function$;

-- 5. Strengthen teacher_applications RLS policies
DROP POLICY IF EXISTS "Authenticated users can submit own teacher application" ON public.teacher_applications;
CREATE POLICY "Authenticated users can submit own teacher application" 
ON public.teacher_applications 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

-- 6. Add stricter policy for teacher application updates
DROP POLICY IF EXISTS "Users can update their own applications" ON public.teacher_applications;
CREATE POLICY "Users can update their own applications" 
ON public.teacher_applications 
FOR UPDATE 
TO authenticated
USING (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL
)
WITH CHECK (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL
);

-- 7. Strengthen challengers table policies
DROP POLICY IF EXISTS "Authenticated users can register as challenger" ON public.challengers;
CREATE POLICY "Authenticated users can register as challenger" 
ON public.challengers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid()
);

-- 8. Add stricter challenger update policy
DROP POLICY IF EXISTS "Users can update own challenger records" ON public.challengers;
CREATE POLICY "Users can update own challenger records" 
ON public.challengers 
FOR UPDATE 
TO authenticated
USING (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL AND
  public.user_owns_challenger_record(user_id)
)
WITH CHECK (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL
);

-- 9. Strengthen confidential_records policies (admin only)
DROP POLICY IF EXISTS "Admins can view all confidential records" ON public.confidential_records;
CREATE POLICY "Admins can view all confidential records" 
ON public.confidential_records 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  public.get_current_user_role() = 'admin'
);

-- 10. Strengthen progress_notes policies
DROP POLICY IF EXISTS "Students view their own progress notes" ON public.progress_notes;
CREATE POLICY "Students view their own progress notes" 
ON public.progress_notes 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  student_id = auth.uid()
);

-- 11. Strengthen submissions policies 
DROP POLICY IF EXISTS "Students can manage their own submissions" ON public.submissions;
CREATE POLICY "Students can manage their own submissions" 
ON public.submissions 
FOR ALL
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  student_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  student_id = auth.uid()
);

-- 12. Add function to check if user is teacher of a course
CREATE OR REPLACE FUNCTION public.is_teacher_of_course(course_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id_param 
    AND c.teacher_id = auth.uid()
  );
$function$;

-- 13. Add audit trigger for sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log access to sensitive tables
  INSERT INTO public.resource_access_logs (
    user_id, 
    resource_id,
    action, 
    created_at
  ) VALUES (
    auth.uid(),
    COALESCE(NEW.id, OLD.id),
    TG_OP || ' on ' || TG_TABLE_NAME,
    now()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- 14. Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_challengers ON public.challengers;
CREATE TRIGGER audit_challengers
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_confidential_records ON public.confidential_records;
CREATE TRIGGER audit_confidential_records
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();
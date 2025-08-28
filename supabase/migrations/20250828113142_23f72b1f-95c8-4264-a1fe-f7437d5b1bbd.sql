-- Fix remaining security warnings
-- 1. Fix function search_path issues for all functions missing proper search_path
-- 2. The leaked password protection requires auth configuration (not database migration)

-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'challenger'
  );
  RETURN NEW;
END;
$$;

-- Check and fix any other functions that might be missing search_path
-- Update all security definer functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_authenticated_user_role()
RETURNS user_role
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.role 
  FROM public.profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_owns_challenger_record(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT record_user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_course(course_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id_param 
    AND c.teacher_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_safeguarding_access(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.safeguarding_permissions sp
        WHERE sp.user_id = check_user_id 
        AND sp.is_active = true
    ) OR public.get_current_user_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_resource_owned_by_user(res_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.teaching_resources tr
    where tr.id = res_id
      and tr.owner_id = user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_resource_shared_with_user(res_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.resource_shares rs
    where rs.resource_id = res_id
      and rs.to_teacher_id = user_id
  );
$$;

-- Log that we've completed the function search_path fixes
PERFORM public.log_sensitive_operation(
  'security_functions_hardened',
  'security_maintenance',
  'search_path_fixes_applied'
);
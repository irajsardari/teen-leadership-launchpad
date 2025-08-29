-- Fix Function Search Path Mutable warnings
-- Update all functions to have proper search_path settings

-- Fix functions that may not have proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.has_safeguarding_access(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1 FROM public.safeguarding_permissions sp
        WHERE sp.user_id = check_user_id 
        AND sp.is_active = true
    ) OR public.get_current_user_role() = 'admin';
$function$;

CREATE OR REPLACE FUNCTION public.get_authenticated_user_role()
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.role 
  FROM public.profiles p 
  WHERE p.id = auth.uid()
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_resource_shared_with_user(res_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.resource_shares rs
    where rs.resource_id = res_id
      and rs.to_teacher_id = user_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.user_owns_challenger_record(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT record_user_id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_course(course_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id_param 
    AND c.teacher_id = auth.uid()
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_resource_owned_by_user(res_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.teaching_resources tr
    where tr.id = res_id
      and tr.owner_id = user_id
  );
$function$;

-- Ensure all security-critical functions have proper search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
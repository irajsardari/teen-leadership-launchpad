-- Clean up security definer views that are causing warnings
DROP VIEW IF EXISTS public.admin_secure_teacher_applications;
DROP VIEW IF EXISTS public.admin_secure_challengers;
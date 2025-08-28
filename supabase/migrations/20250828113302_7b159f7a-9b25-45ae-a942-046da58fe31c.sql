-- Final attempt to fix all remaining function search_path issues
-- Let's identify and fix any remaining functions that might not have search_path set

-- Fix any remaining common functions that might be missing search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Check if there are any other functions that might need fixing
-- Let's also ensure all our recent security functions have proper search_path
CREATE OR REPLACE FUNCTION public.validate_challenger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.age IS NOT NULL AND (NEW.age < 10 OR NEW.age > 18) THEN
    RAISE EXCEPTION 'Age must be between 10 and 18';
  END IF;

  IF NEW.email IS NOT NULL AND NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF NEW.phone_number IS NOT NULL THEN
    IF length(regexp_replace(NEW.phone_number, '\\D', '', 'g')) < 10 THEN
      RAISE EXCEPTION 'Phone number must have at least 10 digits';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_teacher_application_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_teacher_application_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Ensure only authenticated users can insert
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_progress_notes_update_window()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.get_current_user_role() = 'admin' THEN
    RETURN NEW;
  END IF;
  IF auth.uid() IS NULL OR NEW.teacher_id <> auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to update this note';
  END IF;
  IF now() > OLD.created_at + INTERVAL '24 hours' THEN
    RAISE EXCEPTION 'Editing window has expired (24h)';
  END IF;
  RETURN NEW;
END;
$$;
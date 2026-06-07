
CREATE UNIQUE INDEX IF NOT EXISTS program_registrations_unique_active_email
ON public.program_registrations (program_id, lower(email))
WHERE status <> 'rejected';

CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role)
     OR (NEW.lms_role IS DISTINCT FROM OLD.lms_role) THEN
    IF current_setting('role', true) = 'service_role'
       OR auth.role() = 'service_role' THEN
      RETURN NEW;
    END IF;
    IF public.get_current_user_role() <> 'admin' THEN
      RAISE EXCEPTION 'Only admins can change role or lms_role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

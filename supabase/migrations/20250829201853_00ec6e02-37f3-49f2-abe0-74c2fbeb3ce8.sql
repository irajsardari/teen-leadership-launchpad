-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Prevent changing user_id in updates
  IF TG_OP = 'UPDATE' AND OLD.user_id != NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change application ownership';
  END IF;
  
  -- Ensure user_id matches authenticated user on insert
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create application for different user';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
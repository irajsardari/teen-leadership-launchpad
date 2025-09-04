-- Fix security warning: set search path for function
DROP FUNCTION IF EXISTS update_lexicon_updated_at();

CREATE OR REPLACE FUNCTION update_lexicon_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
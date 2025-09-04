-- Fix security warning: properly recreate function with search path
DROP TRIGGER IF EXISTS update_lexicon_generation_queue_updated_at ON lexicon_generation_queue;
DROP TRIGGER IF EXISTS update_lexicon_categories_updated_at ON lexicon_categories;
DROP FUNCTION IF EXISTS update_lexicon_updated_at();

-- Create secure function with proper search path
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

-- Recreate triggers
CREATE TRIGGER update_lexicon_generation_queue_updated_at
    BEFORE UPDATE ON lexicon_generation_queue
    FOR EACH ROW EXECUTE FUNCTION update_lexicon_updated_at();

CREATE TRIGGER update_lexicon_categories_updated_at
    BEFORE UPDATE ON lexicon_categories
    FOR EACH ROW EXECUTE FUNCTION update_lexicon_updated_at();
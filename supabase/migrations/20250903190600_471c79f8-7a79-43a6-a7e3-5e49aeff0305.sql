-- Add missing columns to dictionary table
DO $$ 
BEGIN
    -- Add difficulty_score if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dictionary' 
        AND column_name = 'difficulty_score'
    ) THEN
        ALTER TABLE public.dictionary ADD COLUMN difficulty_score integer DEFAULT 5;
        ALTER TABLE public.dictionary ADD CONSTRAINT check_difficulty_score CHECK (difficulty_score >= 1 AND difficulty_score <= 10);
    END IF;

    -- Add other columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dictionary' 
        AND column_name = 'age_appropriateness'
    ) THEN
        ALTER TABLE public.dictionary ADD COLUMN age_appropriateness text DEFAULT 'teenager';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dictionary' 
        AND column_name = 'complexity_level'
    ) THEN
        ALTER TABLE public.dictionary ADD COLUMN complexity_level text DEFAULT 'intermediate';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'dictionary' 
        AND column_name = 'ai_generated'
    ) THEN
        ALTER TABLE public.dictionary ADD COLUMN ai_generated boolean DEFAULT false;
    END IF;
END $$;

-- Create lexicon_imports table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lexicon_imports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  import_status text NOT NULL DEFAULT 'pending',
  total_terms integer DEFAULT 0,
  successful_imports integer DEFAULT 0,
  failed_imports integer DEFAULT 0,
  error_log text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  uploaded_by uuid
);

-- Enable RLS if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'lexicon_imports' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.lexicon_imports ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policy if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'lexicon_imports' 
        AND policyname = 'Admins manage lexicon imports'
    ) THEN
        CREATE POLICY "Admins manage lexicon imports" 
        ON public.lexicon_imports 
        FOR ALL 
        USING (get_current_user_role() = 'admin')
        WITH CHECK (get_current_user_role() = 'admin');
    END IF;
END $$;

-- Update existing terms with difficulty scores if they don't have them
UPDATE public.dictionary 
SET difficulty_score = CASE 
  WHEN term ILIKE '%leadership%' THEN 6
  WHEN term ILIKE '%management%' THEN 5
  WHEN term ILIKE '%psychology%' THEN 7
  WHEN term ILIKE '%strategy%' THEN 8
  WHEN term ILIKE '%innovation%' THEN 7
  WHEN term ILIKE '%communication%' THEN 4
  WHEN term ILIKE '%planning%' THEN 5
  WHEN term ILIKE '%decision%' THEN 6
  ELSE 5
END
WHERE difficulty_score IS NULL;
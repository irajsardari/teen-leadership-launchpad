-- Create lexicon_imports table to track bulk imports
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

-- Enable RLS
ALTER TABLE public.lexicon_imports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage lexicon imports" 
ON public.lexicon_imports 
FOR ALL 
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Add additional columns to dictionary table for better management
ALTER TABLE public.dictionary ADD COLUMN IF NOT EXISTS difficulty_score integer DEFAULT 5 CHECK (difficulty_score >= 1 AND difficulty_score <= 10);
ALTER TABLE public.dictionary ADD COLUMN IF NOT EXISTS age_appropriateness text DEFAULT 'teenager';
ALTER TABLE public.dictionary ADD COLUMN IF NOT EXISTS complexity_level text DEFAULT 'intermediate';
ALTER TABLE public.dictionary ADD COLUMN IF NOT EXISTS ai_generated boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dictionary_difficulty ON public.dictionary(difficulty_score);
CREATE INDEX IF NOT EXISTS idx_dictionary_category ON public.dictionary(category);
CREATE INDEX IF NOT EXISTS idx_dictionary_status ON public.dictionary(status);
CREATE INDEX IF NOT EXISTS idx_dictionary_verification ON public.dictionary(verification_status);
CREATE INDEX IF NOT EXISTS idx_dictionary_usage_count ON public.dictionary(usage_count);

-- Update some example terms with difficulty scores
UPDATE public.dictionary 
SET difficulty_score = CASE 
  WHEN term ILIKE '%leadership%' THEN 6
  WHEN term ILIKE '%management%' THEN 5
  WHEN term ILIKE '%psychology%' THEN 7
  WHEN term ILIKE '%strategy%' THEN 8
  ELSE 5
END
WHERE difficulty_score IS NULL;
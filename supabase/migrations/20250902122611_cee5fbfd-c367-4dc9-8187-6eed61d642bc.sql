-- Update dictionary table to add translation metadata
ALTER TABLE public.dictionary 
ADD COLUMN IF NOT EXISTS translation_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for translation performance
CREATE INDEX IF NOT EXISTS idx_dictionary_translations ON public.dictionary USING GIN(translations);

-- Update existing records to have translation metadata
UPDATE public.dictionary 
SET translation_updated_at = updated_at 
WHERE translation_updated_at IS NULL;
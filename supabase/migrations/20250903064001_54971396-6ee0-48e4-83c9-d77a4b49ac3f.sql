-- Add new fields first without touching constraints
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS examples text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS discipline_tags text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS sources text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS contributor_id uuid;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0;

-- Update discipline tags for existing terms
UPDATE dictionary SET discipline_tags = ARRAY[category] WHERE discipline_tags IS NULL AND category IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dictionary_discipline_tags ON dictionary USING GIN (discipline_tags);
CREATE INDEX IF NOT EXISTS idx_dictionary_verification_status ON dictionary (verification_status);
CREATE INDEX IF NOT EXISTS idx_dictionary_usage_count ON dictionary (usage_count);
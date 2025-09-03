-- First, update the category constraint to allow new disciplines
ALTER TABLE dictionary DROP CONSTRAINT IF EXISTS dictionary_category_check;

-- Add constraint for TMA Lexicon disciplines
ALTER TABLE dictionary ADD CONSTRAINT dictionary_category_check 
CHECK (category IN ('Management', 'Leadership', 'Psychology', 'Finance', 'Digital Life', 'Study Skills', 'Communication', 'Sociology', 'Philosophy', 'Ethics'));

-- Add new fields for TMA Lexicon
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS examples text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS discipline_tags text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS sources text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS contributor_id uuid;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0;

-- Update existing categories to match discipline system
UPDATE dictionary SET category = 'Management' WHERE category IN ('management', 'Management');
UPDATE dictionary SET category = 'Leadership' WHERE category IN ('leadership', 'Leadership');
UPDATE dictionary SET category = 'Psychology' WHERE category IN ('psychology', 'Psychology');
UPDATE dictionary SET category = 'Finance' WHERE category IN ('money', 'Money', 'finance', 'Finance');
UPDATE dictionary SET category = 'Digital Life' WHERE category IN ('digital', 'Digital Life', 'digital life');
UPDATE dictionary SET category = 'Study Skills' WHERE category IN ('study', 'Study Skills', 'study skills');

-- Add discipline tags to existing terms
UPDATE dictionary SET discipline_tags = ARRAY[category] WHERE discipline_tags IS NULL AND category IS NOT NULL;
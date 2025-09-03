-- Update existing categories first, then add constraint
UPDATE dictionary SET category = 'Finance' WHERE category = 'Money';

-- Drop existing constraint if it exists
ALTER TABLE dictionary DROP CONSTRAINT IF EXISTS dictionary_category_check;

-- Add new constraint with updated categories
ALTER TABLE dictionary ADD CONSTRAINT dictionary_category_check 
CHECK (category IN ('Management', 'Leadership', 'Psychology', 'Finance', 'Digital Life', 'Study Skills', 'Communication', 'Sociology', 'Philosophy', 'Ethics'));

-- Add new fields for TMA Lexicon (only if they don't exist)
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS examples text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS discipline_tags text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS sources text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS contributor_id uuid;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0;
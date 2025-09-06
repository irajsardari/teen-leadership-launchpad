-- Update dictionary category constraint to support World Reference Seeder categories
-- First, check and preserve existing data

-- Drop existing constraint
ALTER TABLE public.dictionary DROP CONSTRAINT IF EXISTS dictionary_category_check;

-- Update any legacy 'Money' categories to 'Finance' if they exist
UPDATE public.dictionary SET category = 'Finance' WHERE category = 'Money';

-- Add expanded constraint to support detailed categories for world-class lexicon
-- This includes all existing categories plus the new detailed ones
ALTER TABLE public.dictionary ADD CONSTRAINT dictionary_category_check 
CHECK (category IN (
  -- Existing core TMA categories (preserving current data)
  'Management', 'Leadership', 'Psychology', 'Finance', 'Digital Life', 'Study Skills', 
  'Communication', 'Sociology', 'Philosophy', 'Ethics', 'Entrepreneurship', 'Economics',
  
  -- Detailed World Reference Categories for comprehensive coverage
  'Strategic Management', 'Leadership Theory', 'Organizational Behavior', 
  'Operations Management', 'Financial Management', 'Human Resource Management',
  'Innovation Management', 'Change Management', 'Digital Transformation',
  'Business Strategy', 'Corporate Governance', 'Risk Management',
  'Supply Chain Management', 'Marketing Management', 'Sales Management',
  'Project Management', 'Quality Management', 'Performance Management',
  
  -- Any other existing categories we need to preserve
  'Technology', 'Innovation', 'Education', 'Research', 'Analysis'
));

-- Add comment explaining the expanded categories
COMMENT ON CONSTRAINT dictionary_category_check ON public.dictionary IS 
'Expanded to support both core TMA categories and detailed world reference categories for comprehensive management and leadership lexicon coverage';
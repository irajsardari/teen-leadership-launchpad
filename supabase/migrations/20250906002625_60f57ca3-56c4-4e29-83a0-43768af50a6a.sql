-- Update dictionary category constraint to support World Reference Seeder categories
-- This allows the detailed management categories needed for comprehensive academic lexicon

-- Drop existing constraint
ALTER TABLE public.dictionary DROP CONSTRAINT IF EXISTS dictionary_category_check;

-- Add expanded constraint to support detailed categories for world-class lexicon
ALTER TABLE public.dictionary ADD CONSTRAINT dictionary_category_check 
CHECK (category IN (
  -- Core TMA Categories
  'Management', 'Leadership', 'Psychology', 'Finance', 'Digital Life', 'Study Skills', 
  'Communication', 'Sociology', 'Philosophy', 'Ethics', 'Entrepreneurship', 'Economics',
  
  -- Detailed World Reference Categories for comprehensive coverage
  'Strategic Management', 'Leadership Theory', 'Organizational Behavior', 
  'Operations Management', 'Financial Management', 'Human Resource Management',
  'Innovation Management', 'Change Management', 'Digital Transformation',
  'Business Strategy', 'Corporate Governance', 'Risk Management',
  'Supply Chain Management', 'Marketing Management', 'Sales Management',
  'Project Management', 'Quality Management', 'Performance Management'
));

-- Add comment explaining the expanded categories
COMMENT ON CONSTRAINT dictionary_category_check ON public.dictionary IS 
'Supports both core TMA categories and detailed world reference categories for comprehensive management and leadership lexicon coverage';
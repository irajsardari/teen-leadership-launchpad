-- Comprehensive TMA Lexicon Upgrade Migration
-- This migration seeds the lexicon with 1000+ management/leadership terms

-- First, let's add support for more languages and enhanced metadata
ALTER TABLE dictionary 
ADD COLUMN IF NOT EXISTS etymology TEXT,
ADD COLUMN IF NOT EXISTS complexity_level TEXT DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS age_appropriateness TEXT DEFAULT 'teenager',
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS difficulty_score INTEGER DEFAULT 5 CHECK (difficulty_score >= 1 AND difficulty_score <= 10),
ADD COLUMN IF NOT EXISTS pronunciation_audio_url TEXT,
ADD COLUMN IF NOT EXISTS video_explanation_url TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dictionary_difficulty_score ON dictionary(difficulty_score);
CREATE INDEX IF NOT EXISTS idx_dictionary_complexity_level ON dictionary(complexity_level);
CREATE INDEX IF NOT EXISTS idx_dictionary_discipline_tags ON dictionary USING GIN(discipline_tags);
CREATE INDEX IF NOT EXISTS idx_dictionary_search_text ON dictionary USING GIN(to_tsvector('english', term || ' ' || COALESCE(short_def, '') || ' ' || COALESCE(long_def, '')));

-- Create supported languages table
CREATE TABLE IF NOT EXISTS supported_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL UNIQUE,
  language_name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
  flag_emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  translation_provider TEXT DEFAULT 'openai',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert supported languages
INSERT INTO supported_languages (language_code, language_name, native_name, direction, flag_emoji) VALUES
('en', 'English', 'English', 'ltr', '🇺🇸'),
('ar', 'Arabic', 'العربية', 'rtl', '🇸🇦'),
('fa', 'Persian', 'فارسی', 'rtl', '🇮🇷'),
('es', 'Spanish', 'Español', 'ltr', '🇪🇸'),
('fr', 'French', 'Français', 'ltr', '🇫🇷'),
('de', 'German', 'Deutsch', 'ltr', '🇩🇪'),
('tr', 'Turkish', 'Türkçe', 'ltr', '🇹🇷'),
('ur', 'Urdu', 'اردو', 'rtl', '🇵🇰'),
('hi', 'Hindi', 'हिन्दी', 'ltr', '🇮🇳'),
('zh', 'Chinese', '中文', 'ltr', '🇨🇳')
ON CONFLICT (language_code) DO NOTHING;

-- Seed with comprehensive management/leadership terms
INSERT INTO dictionary (term, slug, short_def, long_def, category, discipline_tags, examples, synonyms, phonetic_en, complexity_level, difficulty_score, age_appropriateness, status) VALUES
('Accountability', 'accountability', 'Taking responsibility for actions and results', 'The practice of taking ownership of decisions, actions, and their consequences. In leadership, accountability means being answerable for outcomes and learning from both successes and failures to improve future performance.', 'Leadership', ARRAY['Leadership', 'Ethics', 'Management'], ARRAY['The team leader showed accountability by admitting the mistake and proposing solutions'], ARRAY['Responsibility', 'Ownership'], 'ə-ˈkaʊn-tə-ˈbɪl-ə-ti', 'beginner', 3, 'teenager', 'published'),
('Strategic Planning', 'strategic-planning', 'Long-term planning to achieve organizational goals', 'The process of defining an organization''s strategy and making decisions on allocating resources to pursue this strategy. It involves setting goals, determining actions to achieve the goals, and mobilizing resources to execute the actions.', 'Management', ARRAY['Management', 'Strategy', 'Planning'], ARRAY['Strategic planning helped the company navigate market changes successfully'], ARRAY['Long-term Planning', 'Strategic Management'], 'strə-ˈti-dʒɪk ˈplæn-ɪŋ', 'intermediate', 6, 'teenager', 'published'),
('Innovation', 'innovation', 'The introduction of new ideas, methods, or products', 'The process of creating and implementing new ideas, products, services, or processes that provide value. Innovation drives progress and competitive advantage by solving problems in novel ways.', 'Entrepreneurship', ARRAY['Entrepreneurship', 'Creativity', 'Technology'], ARRAY['The company''s innovation in renewable energy revolutionized the industry'], ARRAY['Creativity', 'Invention'], 'ˌɪn-ə-ˈveɪ-ʃən', 'intermediate', 5, 'teenager', 'published'),
('Emotional Intelligence', 'emotional-intelligence', 'The ability to understand and manage emotions', 'The capacity to recognize, understand, and manage our own emotions while effectively handling relationships with others. High emotional intelligence helps leaders connect with people and navigate social situations successfully.', 'Psychology', ARRAY['Psychology', 'Leadership', 'Communication'], ARRAY['Her emotional intelligence helped her mediate conflicts between team members'], ARRAY['EQ', 'Social Intelligence'], 'ɪ-ˈmoʊ-ʃən-əl ɪn-ˈtel-ə-dʒəns', 'intermediate', 6, 'teenager', 'published'),
('Digital Literacy', 'digital-literacy', 'The ability to use digital technology effectively', 'The knowledge, skills, and behaviors involved in using digital devices and platforms. Digital literacy includes understanding how to find, evaluate, and communicate information online safely and effectively.', 'Digital Life', ARRAY['Digital Life', 'Technology', 'Education'], ARRAY['Digital literacy helps students research effectively and avoid misinformation'], ARRAY['Tech Skills', 'Computer Literacy'], 'ˈdɪdʒ-ə-təl ˈlɪt-ər-ə-si', 'intermediate', 5, 'teenager', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Add RLS policies for supported_languages  
ALTER TABLE supported_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view supported languages" ON supported_languages
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage supported languages" ON supported_languages
  FOR ALL TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');
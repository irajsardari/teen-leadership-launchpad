-- Transform Dictionary into TMA Lexicon with enhanced fields
-- Add new columns to support comprehensive lexicon functionality

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

-- Create function to seed lexicon with management/leadership terms
CREATE OR REPLACE FUNCTION seed_tma_lexicon()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    term_data record;
BEGIN
    -- Comprehensive management and leadership terms for teenagers
    FOR term_data IN 
        SELECT * FROM (VALUES
            ('accountability', 'Accountability', 'The obligation to take responsibility for one''s actions and decisions, especially in leadership roles.', 'Management', ARRAY['accountability', 'responsibility', 'ethics']),
            ('adaptability', 'Adaptability', 'The ability to adjust to new conditions and challenges, crucial for modern leadership.', 'Leadership', ARRAY['flexibility', 'change management', 'resilience']),
            ('assertiveness', 'Assertiveness', 'Confidently expressing one''s opinions and needs while respecting others.', 'Psychology', ARRAY['confidence', 'communication', 'self-advocacy']),
            ('brainstorming', 'Brainstorming', 'A creative problem-solving technique where individuals generate ideas freely.', 'Management', ARRAY['creativity', 'problem solving', 'teamwork']),
            ('collaboration', 'Collaboration', 'Working together effectively with others to achieve common goals.', 'Leadership', ARRAY['teamwork', 'cooperation', 'partnership']),
            ('decision-making', 'Decision Making', 'The process of choosing between alternatives to solve problems or achieve goals.', 'Management', ARRAY['analysis', 'judgment', 'problem solving']),
            ('delegation', 'Delegation', 'Assigning tasks and responsibilities to others while maintaining accountability.', 'Leadership', ARRAY['task management', 'trust', 'empowerment']),
            ('emotional-intelligence', 'Emotional Intelligence', 'The ability to understand and manage your own emotions and those of others.', 'Psychology', ARRAY['self-awareness', 'empathy', 'social skills']),
            ('feedback', 'Feedback', 'Information given to help improve performance or behavior.', 'Management', ARRAY['improvement', 'communication', 'development']),
            ('goal-setting', 'Goal Setting', 'The process of establishing specific, measurable, achievable, relevant, and time-bound objectives.', 'Management', ARRAY['planning', 'objectives', 'SMART goals']),
            ('innovation', 'Innovation', 'The introduction of new ideas, methods, or products to create value.', 'Leadership', ARRAY['creativity', 'change', 'improvement']),
            ('integrity', 'Integrity', 'Adherence to moral and ethical principles, being honest and having strong moral values.', 'Psychology', ARRAY['ethics', 'honesty', 'values']),
            ('mentorship', 'Mentorship', 'A relationship where an experienced person guides and supports someone less experienced.', 'Leadership', ARRAY['guidance', 'development', 'support']),
            ('networking', 'Networking', 'Building and maintaining professional relationships for mutual benefit.', 'Management', ARRAY['relationships', 'connections', 'professional development']),
            ('organization', 'Organization', 'The systematic arrangement of tasks, resources, and people to achieve objectives efficiently.', 'Management', ARRAY['structure', 'efficiency', 'systems']),
            ('prioritization', 'Prioritization', 'Determining the order of importance of tasks or goals to maximize effectiveness.', 'Management', ARRAY['time management', 'efficiency', 'focus']),
            ('resilience', 'Resilience', 'The ability to recover quickly from difficulties and adapt to challenging situations.', 'Psychology', ARRAY['strength', 'recovery', 'perseverance']),
            ('strategy', 'Strategy', 'A plan of action designed to achieve long-term goals or overall aims.', 'Management', ARRAY['planning', 'vision', 'direction']),
            ('team-building', 'Team Building', 'Activities and processes designed to improve team performance and relationships.', 'Leadership', ARRAY['teamwork', 'collaboration', 'group dynamics']),
            ('time-management', 'Time Management', 'The ability to use time effectively and efficiently to accomplish tasks and goals.', 'Management', ARRAY['productivity', 'scheduling', 'efficiency']),
            ('vision', 'Vision', 'A clear picture of what you want to achieve in the future, providing direction and motivation.', 'Leadership', ARRAY['future planning', 'inspiration', 'direction']),
            ('work-life-balance', 'Work Life Balance', 'Managing time and energy between work responsibilities and personal life effectively.', 'Psychology', ARRAY['wellness', 'balance', 'self-care'])
        ) AS t(slug, term, definition, category, tags)
    LOOP
        INSERT INTO dictionary (
            slug, term, short_def, long_def, category, discipline_tags, 
            status, created_at, updated_at
        )
        VALUES (
            term_data.slug,
            term_data.term,
            term_data.definition,
            term_data.definition,
            term_data.category,
            term_data.tags,
            'published',
            now(),
            now()
        )
        ON CONFLICT (slug) DO UPDATE SET
            short_def = EXCLUDED.short_def,
            long_def = EXCLUDED.long_def,
            category = EXCLUDED.category,
            discipline_tags = EXCLUDED.discipline_tags,
            updated_at = now();
    END LOOP;
    
    RAISE NOTICE 'TMA Lexicon seeded with management and leadership terms';
END;
$$;

-- Seed the lexicon
SELECT seed_tma_lexicon();

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_dictionary_discipline_tags ON dictionary USING GIN (discipline_tags);
CREATE INDEX IF NOT EXISTS idx_dictionary_search ON dictionary (term, category);
CREATE INDEX IF NOT EXISTS idx_dictionary_status ON dictionary (status);

-- Update usage tracking function
CREATE OR REPLACE FUNCTION increment_term_usage(term_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE dictionary 
    SET usage_count = COALESCE(usage_count, 0) + 1 
    WHERE slug = term_slug;
END;
$$;
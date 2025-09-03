-- Add new fields for TMA Lexicon (without constraint issues)
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS examples text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS discipline_tags text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS sources text[];
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS contributor_id uuid;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0;

-- Add discipline tags to existing terms based on their category
UPDATE dictionary SET discipline_tags = ARRAY[category] WHERE discipline_tags IS NULL AND category IS NOT NULL;

-- Set verification status for existing terms
UPDATE dictionary SET verification_status = 'verified' WHERE verification_status = 'pending' AND status = 'published';

-- Seed some essential management and leadership terms
INSERT INTO dictionary (slug, term, short_def, long_def, category, discipline_tags, status, verification_status, created_at, updated_at)
VALUES 
  ('accountability', 'Accountability', 'The obligation to take responsibility for one''s actions and decisions.', 'The obligation to take responsibility for one''s actions and decisions, especially in leadership roles. Teenagers learning management must understand accountability.', 'Management', ARRAY['responsibility', 'ethics', 'management'], 'published', 'verified', now(), now()),
  ('adaptability', 'Adaptability', 'The ability to adjust to new conditions and challenges.', 'The ability to adjust to new conditions and challenges, crucial for modern leadership. Teenagers must learn to be adaptable in changing environments.', 'Leadership', ARRAY['flexibility', 'change', 'resilience'], 'published', 'verified', now(), now()),
  ('collaboration', 'Collaboration', 'Working together effectively with others to achieve common goals.', 'Working together effectively with others to achieve common goals. Essential skill for teenage leaders in team environments.', 'Leadership', ARRAY['teamwork', 'cooperation', 'partnership'], 'published', 'verified', now(), now()),
  ('decision-making', 'Decision Making', 'The process of choosing between alternatives to solve problems.', 'The process of choosing between alternatives to solve problems or achieve goals. Critical skill for teenage managers and leaders.', 'Management', ARRAY['analysis', 'judgment', 'problem solving'], 'published', 'verified', now(), now()),
  ('delegation', 'Delegation', 'Assigning tasks and responsibilities to others while maintaining accountability.', 'Assigning tasks and responsibilities to others while maintaining accountability. Important leadership skill for teenagers learning management.', 'Leadership', ARRAY['task management', 'trust', 'empowerment'], 'published', 'verified', now(), now()),
  ('emotional-intelligence', 'Emotional Intelligence', 'The ability to understand and manage emotions - yours and others.', 'The ability to understand and manage your own emotions and those of others. Essential for teenage leaders developing people skills.', 'Psychology', ARRAY['self-awareness', 'empathy', 'social skills'], 'published', 'verified', now(), now()),
  ('goal-setting', 'Goal Setting', 'Establishing specific, measurable, achievable objectives.', 'The process of establishing specific, measurable, achievable, relevant, and time-bound objectives (SMART goals). Fundamental skill for teenage success.', 'Management', ARRAY['planning', 'objectives', 'SMART goals'], 'published', 'verified', now(), now()),
  ('innovation', 'Innovation', 'The introduction of new ideas, methods, or products.', 'The introduction of new ideas, methods, or products to create value. Important skill for teenage entrepreneurs and leaders.', 'Leadership', ARRAY['creativity', 'change', 'improvement'], 'published', 'verified', now(), now()),
  ('integrity', 'Integrity', 'Adherence to moral and ethical principles.', 'Adherence to moral and ethical principles, being honest and having strong moral values. Foundation of teenage character development.', 'Psychology', ARRAY['ethics', 'honesty', 'values'], 'published', 'verified', now(), now()),
  ('time-management', 'Time Management', 'The ability to use time effectively and efficiently.', 'The ability to use time effectively and efficiently to accomplish tasks and goals. Essential skill for teenage students and future leaders.', 'Management', ARRAY['productivity', 'scheduling', 'efficiency'], 'published', 'verified', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dictionary_discipline_tags ON dictionary USING GIN (discipline_tags);
CREATE INDEX IF NOT EXISTS idx_dictionary_category_status ON dictionary (category, status);
CREATE INDEX IF NOT EXISTS idx_dictionary_usage_count ON dictionary (usage_count DESC);
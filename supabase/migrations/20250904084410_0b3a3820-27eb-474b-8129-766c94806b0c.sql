-- Add new fields to dictionary table for AI-powered lexicon
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_en_new text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS phonetic_ar_new text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS definition_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS definition_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS definition_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS example_en text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS example_ar text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS example_fa text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS ai_generated_metadata jsonb DEFAULT '{}';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS last_ai_update timestamp with time zone;

-- Update existing columns to be more flexible
ALTER TABLE dictionary ALTER COLUMN short_def DROP NOT NULL;
ALTER TABLE dictionary ALTER COLUMN category DROP DEFAULT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dictionary_category ON dictionary(category);
CREATE INDEX IF NOT EXISTS idx_dictionary_status ON dictionary(status);
CREATE INDEX IF NOT EXISTS idx_dictionary_ai_generated ON dictionary(ai_generated);
CREATE INDEX IF NOT EXISTS idx_dictionary_slug ON dictionary(slug);
CREATE INDEX IF NOT EXISTS idx_dictionary_term_search ON dictionary USING gin(to_tsvector('english', term));
CREATE INDEX IF NOT EXISTS idx_dictionary_definition_search ON dictionary USING gin(to_tsvector('english', COALESCE(definition_en, '')));

-- Create lexicon_generation_queue table for managing AI generation tasks
CREATE TABLE IF NOT EXISTS lexicon_generation_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    term text NOT NULL,
    category text,
    priority integer DEFAULT 5,
    status text DEFAULT 'pending',
    requested_by uuid,
    requested_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error_message text,
    generated_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on lexicon_generation_queue
ALTER TABLE lexicon_generation_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for lexicon_generation_queue
CREATE POLICY "Admins can manage generation queue" ON lexicon_generation_queue
    FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Anyone can request term generation" ON lexicon_generation_queue
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their requests" ON lexicon_generation_queue
    FOR SELECT USING (requested_by = auth.uid() OR get_current_user_role() = 'admin');

-- Create lexicon_categories table for managing categories
CREATE TABLE IF NOT EXISTS lexicon_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    color text DEFAULT '#6366f1',
    icon text DEFAULT 'Book',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on lexicon_categories
ALTER TABLE lexicon_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for lexicon_categories
CREATE POLICY "Anyone can view active categories" ON lexicon_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON lexicon_categories
    FOR ALL USING (get_current_user_role() = 'admin');

-- Insert default categories
INSERT INTO lexicon_categories (name, description, color, icon) VALUES
    ('Management', 'Leadership and organizational management concepts', '#3b82f6', 'Users'),
    ('Leadership', 'Leadership principles and techniques', '#8b5cf6', 'Crown'),
    ('Psychology', 'Psychological concepts and behavioral insights', '#06b6d4', 'Brain'),
    ('Finance', 'Financial and economic terminology', '#10b981', 'DollarSign'),
    ('Entrepreneurship', 'Business creation and innovation concepts', '#f59e0b', 'Lightbulb'),
    ('Communication', 'Communication skills and techniques', '#ef4444', 'MessageCircle'),
    ('Strategy', 'Strategic planning and execution', '#84cc16', 'Target'),
    ('Technology', 'Technology and digital transformation', '#6366f1', 'Laptop')
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_lexicon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lexicon_generation_queue_updated_at
    BEFORE UPDATE ON lexicon_generation_queue
    FOR EACH ROW EXECUTE FUNCTION update_lexicon_updated_at();

CREATE TRIGGER update_lexicon_categories_updated_at
    BEFORE UPDATE ON lexicon_categories
    FOR EACH ROW EXECUTE FUNCTION update_lexicon_updated_at();

-- Add audit trigger for dictionary changes
CREATE TRIGGER audit_dictionary_changes
    AFTER INSERT OR UPDATE OR DELETE ON dictionary
    FOR EACH ROW EXECUTE FUNCTION audit_sensitive_data();
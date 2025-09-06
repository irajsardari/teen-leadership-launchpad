-- Add approval tracking to term translations and analytics
-- Add fields for translation approval workflow
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS approved_translations jsonb DEFAULT '{}';
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS pending_translations jsonb DEFAULT '{}';

-- Create analytics and tracking tables
CREATE TABLE IF NOT EXISTS lexicon_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- 'view', 'search', 'export', 'edit'
  term_id uuid,
  search_query text,
  language text DEFAULT 'en',
  user_id uuid,
  ip_address inet DEFAULT inet_client_addr(),
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE lexicon_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics
CREATE POLICY "Admins can view all analytics" 
ON lexicon_analytics FOR SELECT 
TO authenticated 
USING (get_current_user_role() = 'admin');

CREATE POLICY "System can insert analytics" 
ON lexicon_analytics FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS term_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id uuid NOT NULL,
  user_email text,
  feedback_type text NOT NULL, -- 'correction', 'improvement', 'translation'
  message text NOT NULL,
  language text DEFAULT 'en',
  status text DEFAULT 'pending', -- 'pending', 'reviewed', 'implemented', 'rejected'
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on feedback
ALTER TABLE term_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedback
CREATE POLICY "Anyone can submit feedback" 
ON term_feedback FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Admins can manage feedback" 
ON term_feedback FOR ALL 
TO authenticated 
USING (get_current_user_role() = 'admin');

-- Create bulk import/export tracking
CREATE TABLE IF NOT EXISTS bulk_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type text NOT NULL, -- 'import', 'export'
  status text DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  file_name text,
  total_records integer DEFAULT 0,
  processed_records integer DEFAULT 0,
  success_count integer DEFAULT 0,
  error_count integer DEFAULT 0,
  error_log jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS on bulk operations
ALTER TABLE bulk_operations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bulk operations
CREATE POLICY "Admins can manage bulk operations" 
ON bulk_operations FOR ALL 
TO authenticated 
USING (get_current_user_role() = 'admin');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lexicon_analytics_term_id ON lexicon_analytics(term_id);
CREATE INDEX IF NOT EXISTS idx_lexicon_analytics_event_type ON lexicon_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_lexicon_analytics_created_at ON lexicon_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_term_feedback_term_id ON term_feedback(term_id);
CREATE INDEX IF NOT EXISTS idx_term_feedback_status ON term_feedback(status);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON bulk_operations(status);

-- Create analytics functions
CREATE OR REPLACE FUNCTION log_term_view(p_term_id uuid, p_language text DEFAULT 'en')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO lexicon_analytics (event_type, term_id, language, user_id)
  VALUES ('view', p_term_id, p_language, auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION log_search_query(p_query text, p_language text DEFAULT 'en', p_results_count integer DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO lexicon_analytics (event_type, search_query, language, user_id, metadata)
  VALUES ('search', p_query, p_language, auth.uid(), jsonb_build_object('results_count', p_results_count));
END;
$$;
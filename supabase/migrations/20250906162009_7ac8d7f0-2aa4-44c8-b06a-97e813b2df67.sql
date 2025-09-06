-- Fix search path for security definer functions
DROP FUNCTION IF EXISTS log_term_view(uuid, text);
DROP FUNCTION IF EXISTS log_search_query(text, text, integer);

-- Recreate functions with proper search path
CREATE OR REPLACE FUNCTION log_term_view(p_term_id uuid, p_language text DEFAULT 'en')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
AS $$
BEGIN
  INSERT INTO lexicon_analytics (event_type, search_query, language, user_id, metadata)
  VALUES ('search', p_query, p_language, auth.uid(), jsonb_build_object('results_count', p_results_count));
END;
$$;
-- Create content table for posts/articles
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL, -- Plain text version for analysis
  published_at TIMESTAMP WITH TIME ZONE,
  categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  auto_indexed_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dictionary table for terms
CREATE TABLE public.dictionary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_def TEXT,
  long_def TEXT,
  category TEXT CHECK (category IN ('Management', 'Leadership', 'Psychology', 'Money', 'Digital Life', 'Study Skills')),
  synonyms TEXT[] DEFAULT ARRAY[]::TEXT[],
  related TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of slugs
  translations JSONB DEFAULT '{}', -- {ar: {term, short_def}, fa: {term, short_def}}
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'needs_review')),
  created_from_content_id UUID REFERENCES public.content(id),
  frequency INTEGER DEFAULT 1,
  context TEXT, -- First paragraph or context where term was found
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking term interactions
CREATE TABLE public.dictionary_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term_id UUID REFERENCES public.dictionary(id),
  content_id UUID REFERENCES public.content(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('dict_term_view', 'dict_popover_open', 'dict_created_draft', 'auto_category_assigned')),
  from_article BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_analytics ENABLE ROW LEVEL SECURITY;

-- Content policies
CREATE POLICY "Anyone can view published content" ON public.content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage content" ON public.content
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all content" ON public.content
  FOR ALL USING (get_current_user_role() = 'admin');

-- Dictionary policies  
CREATE POLICY "Anyone can view published dictionary terms" ON public.dictionary
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view draft dictionary terms" ON public.dictionary
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all dictionary terms" ON public.dictionary
  FOR ALL USING (get_current_user_role() = 'admin');

-- Analytics policies
CREATE POLICY "System can insert analytics" ON public.dictionary_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON public.dictionary_analytics
  FOR SELECT USING (get_current_user_role() = 'admin');

-- Create indexes for performance
CREATE INDEX idx_content_published ON public.content(published_at) WHERE status = 'published';
CREATE INDEX idx_content_categories ON public.content USING GIN(categories);
CREATE INDEX idx_content_tags ON public.content USING GIN(tags);
CREATE INDEX idx_dictionary_term ON public.dictionary(term);
CREATE INDEX idx_dictionary_status ON public.dictionary(status);
CREATE INDEX idx_dictionary_category ON public.dictionary(category);
CREATE INDEX idx_dictionary_synonyms ON public.dictionary USING GIN(synonyms);

-- Create triggers for updated_at
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dictionary_updated_at
  BEFORE UPDATE ON public.dictionary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed dictionary terms
INSERT INTO public.dictionary (term, slug, short_def, category, status) VALUES
  ('Leadership', 'leadership', 'The ability to guide, influence, and inspire others toward achieving common goals.', 'Leadership', 'published'),
  ('Critical Thinking', 'critical-thinking', 'The objective analysis and evaluation of an issue to form a judgment.', 'Psychology', 'published'),
  ('Growth Mindset', 'growth-mindset', 'The belief that abilities and intelligence can be developed through effort and learning.', 'Psychology', 'published'),
  ('Financial Literacy', 'financial-literacy', 'The knowledge and skills needed to make informed financial decisions.', 'Money', 'published'),
  ('Digital Citizenship', 'digital-citizenship', 'Responsible and ethical use of technology and digital platforms.', 'Digital Life', 'published'),
  ('Time Management', 'time-management', 'The process of organizing and planning how to divide time between activities.', 'Study Skills', 'published'),
  ('Resilience', 'resilience', 'The ability to recover quickly from difficulties and adapt to challenging situations.', 'Psychology', 'published'),
  ('Empathy', 'empathy', 'The ability to understand and share the feelings of others.', 'Leadership', 'published'),
  ('Integrity', 'integrity', 'The quality of being honest and having strong moral principles.', 'Leadership', 'published'),
  ('Communication', 'communication', 'The exchange of information and ideas between individuals or groups.', 'Leadership', 'published');
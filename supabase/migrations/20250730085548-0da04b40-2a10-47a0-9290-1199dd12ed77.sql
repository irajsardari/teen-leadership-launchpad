-- Create function for updating timestamps first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for teacher documents
INSERT INTO storage.buckets (id, name, public) VALUES ('teacher-documents', 'teacher-documents', false);

-- Create teacher_applications table
CREATE TABLE public.teacher_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  specialization TEXT,
  experience_years INTEGER,
  education TEXT,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit teacher application" 
ON public.teacher_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own applications" 
ON public.teacher_applications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own applications" 
ON public.teacher_applications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all teacher applications" 
ON public.teacher_applications 
FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all teacher applications" 
ON public.teacher_applications 
FOR UPDATE 
USING (get_current_user_role() = 'admin');

-- Create storage policies for teacher documents
CREATE POLICY "Teachers can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Teachers can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all teacher documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'teacher-documents' AND get_current_user_role() = 'admin');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_teacher_applications_updated_at
BEFORE UPDATE ON public.teacher_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
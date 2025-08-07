-- Add confidential information field to challengers table
ALTER TABLE public.challengers 
ADD COLUMN confidential_info TEXT;

-- Add confidential information field to teacher_applications table  
ALTER TABLE public.teacher_applications
ADD COLUMN confidential_info TEXT;

-- Create a new table for secure confidential data (admin access only)
CREATE TABLE public.confidential_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'challenger' or 'teacher'
  entity_id UUID NOT NULL,
  confidential_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on confidential_records
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Only admins can access confidential records
CREATE POLICY "Admins can view all confidential records" 
ON public.confidential_records 
FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert confidential records" 
ON public.confidential_records 
FOR INSERT 
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update confidential records" 
ON public.confidential_records 
FOR UPDATE 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete confidential records" 
ON public.confidential_records 
FOR DELETE 
USING (get_current_user_role() = 'admin');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_confidential_records_updated_at
BEFORE UPDATE ON public.confidential_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
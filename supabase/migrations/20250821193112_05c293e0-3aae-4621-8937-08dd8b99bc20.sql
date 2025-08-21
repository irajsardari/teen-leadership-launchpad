-- Create parental_consents table
CREATE TABLE public.parental_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_user_id UUID NOT NULL,
  parent_guardian_name TEXT NOT NULL,
  parent_guardian_email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  digital_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consent_permissions table  
CREATE TABLE public.consent_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consent_id UUID NOT NULL REFERENCES public.parental_consents(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  required BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for parental_consents
CREATE POLICY "Admins can manage all parental consents" 
ON public.parental_consents 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Parents can manage consents for their children" 
ON public.parental_consents 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS policies for consent_permissions
CREATE POLICY "Admins can manage all consent permissions" 
ON public.consent_permissions 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view consent permissions" 
ON public.consent_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create function for parental consent submission
CREATE OR REPLACE FUNCTION public.submit_parental_consent(
  p_child_user_id UUID,
  p_parent_guardian_name TEXT,
  p_parent_guardian_email TEXT,
  p_relationship TEXT,
  p_digital_signature TEXT,
  p_permissions JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  consent_id UUID;
  permission RECORD;
BEGIN
  -- Insert parental consent
  INSERT INTO public.parental_consents (
    child_user_id,
    parent_guardian_name,
    parent_guardian_email,
    relationship,
    consent_given,
    consent_date,
    digital_signature
  ) VALUES (
    p_child_user_id,
    p_parent_guardian_name,
    p_parent_guardian_email,
    p_relationship,
    true,
    now(),
    p_digital_signature
  )
  RETURNING id INTO consent_id;
  
  -- Insert consent permissions
  FOR permission IN SELECT * FROM jsonb_array_elements(p_permissions)
  LOOP
    INSERT INTO public.consent_permissions (
      consent_id,
      permission_type,
      granted,
      required,
      granted_at
    ) VALUES (
      consent_id,
      permission->>'permission_type',
      (permission->>'granted')::boolean,
      (permission->>'required')::boolean,
      CASE WHEN (permission->>'granted')::boolean THEN now() ELSE NULL END
    );
  END LOOP;
  
  -- Update profile with consent information
  UPDATE public.profiles 
  SET 
    parental_consent_required = false,
    parental_consent_date = now()
  WHERE id = p_child_user_id;
  
  -- Log the submission
  PERFORM public.log_sensitive_operation(
    'parental_consent_submitted',
    'parental_consents',
    consent_id::text
  );
  
  RETURN consent_id;
END;
$$;

-- Create update trigger for parental_consents
CREATE TRIGGER update_parental_consents_updated_at
  BEFORE UPDATE ON public.parental_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
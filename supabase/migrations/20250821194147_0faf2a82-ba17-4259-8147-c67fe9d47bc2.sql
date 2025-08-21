-- Update the submit_parental_consent function to include parent_user_id tracking
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
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit parental consent';
  END IF;
  
  -- Insert parental consent with parent_user_id tracking
  INSERT INTO public.parental_consents (
    child_user_id,
    parent_user_id,
    parent_guardian_name,
    parent_guardian_email,
    relationship,
    consent_given,
    consent_date,
    digital_signature
  ) VALUES (
    p_child_user_id,
    auth.uid(), -- Track who submitted this consent
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

-- Create function to check if user can manage a specific child's consent
CREATE OR REPLACE FUNCTION public.can_manage_child_consent(p_child_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Admins can manage any consent
  IF get_current_user_role() = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Check if current user has submitted consent for this child
  RETURN EXISTS (
    SELECT 1 FROM public.parental_consents 
    WHERE child_user_id = p_child_user_id 
    AND parent_user_id = auth.uid()
  );
END;
$$;
-- Continue fixing remaining function search_path issues
-- Let's fix more utility and security functions

CREATE OR REPLACE FUNCTION public.set_user_role(_email text, _role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Ensure only admins can execute via API
  IF public.get_current_user_role() <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized to set roles';
  END IF;

  -- Update if profile exists for the user
  UPDATE public.profiles p
  SET role = _role
  FROM auth.users u
  WHERE p.id = u.id
    AND u.email = _email;

  -- Insert if missing
  INSERT INTO public.profiles (id, full_name, role)
  SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name',''), _role
  FROM auth.users u
  WHERE u.email = _email
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles p2 WHERE p2.id = u.id
    )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_safeguarding_report(p_report_type text, p_description text, p_contact_info text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  report_id UUID;
BEGIN
  -- Insert safeguarding report
  INSERT INTO public.safeguarding_reports (
    report_type,
    description,
    contact_info,
    reporter_id
  ) VALUES (
    p_report_type,
    p_description,
    p_contact_info,
    auth.uid()
  )
  RETURNING id INTO report_id;
  
  -- Log the submission
  PERFORM public.log_sensitive_operation(
    'safeguarding_report_submitted',
    'safeguarding_reports',
    report_id::text
  );
  
  RETURN report_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_safeguarding_access(target_user_id uuid, access_role safeguarding_role)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    permission_id UUID;
BEGIN
    -- Only admins can grant safeguarding access
    IF get_current_user_role() != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can grant safeguarding access';
    END IF;
    
    -- Insert or update permission
    INSERT INTO public.safeguarding_permissions (user_id, role, granted_by, is_active)
    VALUES (target_user_id, access_role, auth.uid(), true)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
        is_active = true,
        granted_by = auth.uid(),
        granted_at = now()
    RETURNING id INTO permission_id;
    
    -- Log the permission grant
    PERFORM public.log_sensitive_operation(
        'safeguarding_access_granted',
        'safeguarding_permissions',
        permission_id::text
    );
    
    RETURN permission_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_child_consent(p_child_user_id uuid)
RETURNS boolean
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

CREATE OR REPLACE FUNCTION public.submit_parental_consent(p_child_user_id uuid, p_parent_guardian_name text, p_parent_guardian_email text, p_relationship text, p_digital_signature text, p_permissions jsonb)
RETURNS uuid
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
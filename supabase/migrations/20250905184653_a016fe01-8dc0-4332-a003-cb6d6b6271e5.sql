-- Fix parental consent security issue by restricting child access to sensitive parent data

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "secure_parental_consents_select" ON public.parental_consents;

-- Create more restrictive policies for different access levels

-- Parents can view all details of their own consent records
CREATE POLICY "parents_view_own_consents" 
ON public.parental_consents 
FOR SELECT 
USING (parent_user_id = auth.uid());

-- Children can only verify consent exists but cannot see sensitive parent details
-- We'll create a security definer function for this
CREATE OR REPLACE FUNCTION public.child_consent_status(p_child_user_id uuid)
RETURNS TABLE(
  id uuid,
  child_user_id uuid, 
  consent_given boolean,
  consent_date timestamp with time zone,
  relationship text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow children to see their own consent status with limited data
  IF auth.uid() != p_child_user_id AND get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: can only view own consent status';
  END IF;
  
  RETURN QUERY
  SELECT 
    pc.id,
    pc.child_user_id,
    pc.consent_given,
    pc.consent_date,
    pc.relationship,
    pc.created_at
  FROM public.parental_consents pc
  WHERE pc.child_user_id = p_child_user_id;
  
  -- Log access for security audit
  PERFORM public.log_sensitive_operation(
    'child_consent_status_accessed',
    'parental_consents_limited',
    p_child_user_id::text
  );
END;
$$;

-- Admins can view all consent records
CREATE POLICY "admins_view_all_consents" 
ON public.parental_consents 
FOR SELECT 
USING (simple_is_admin());

-- Add additional security: prevent direct child access to full records
-- Children must use the security function instead
CREATE POLICY "block_child_direct_access" 
ON public.parental_consents 
FOR SELECT 
USING (
  -- Block if user is trying to access as child but not through proper function
  NOT (child_user_id = auth.uid() AND parent_user_id != auth.uid() AND NOT simple_is_admin())
);

-- Create a helper function for secure consent verification
CREATE OR REPLACE FUNCTION public.verify_parental_consent_exists(p_child_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  consent_exists boolean := false;
BEGIN
  -- Only allow children to check their own consent or admins
  IF auth.uid() != p_child_user_id AND get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Access denied: can only verify own consent status';
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM public.parental_consents 
    WHERE child_user_id = p_child_user_id 
    AND consent_given = true
  ) INTO consent_exists;
  
  -- Log the verification attempt
  PERFORM public.log_sensitive_operation(
    'parental_consent_verification',
    'child_safety_check',
    p_child_user_id::text
  );
  
  RETURN consent_exists;
END;
$$;

-- Update the audit trigger to log more detailed information
CREATE OR REPLACE FUNCTION public.audit_parental_consent_enhanced()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log with enhanced details for child safety monitoring
  PERFORM public.log_sensitive_operation(
    'parental_consent_' || lower(TG_OP),
    'child_family_data_critical',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Additional admin audit for child safety
  PERFORM public.log_admin_action(
    'parental_consent_' || lower(TG_OP),
    'child_protection_family_data',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'child_user_id', COALESCE(NEW.child_user_id, OLD.child_user_id),
      'parent_user_id', COALESCE(NEW.parent_user_id, OLD.parent_user_id),
      'operation', TG_OP,
      'access_timestamp', now(),
      'security_level', 'CHILD_FAMILY_DATA_PROTECTED'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Replace the existing trigger
DROP TRIGGER IF EXISTS audit_parental_consent ON public.parental_consents;
CREATE TRIGGER audit_parental_consent_enhanced
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_parental_consent_enhanced();
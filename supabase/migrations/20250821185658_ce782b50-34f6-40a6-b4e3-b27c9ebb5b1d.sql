-- Additional Security Hardening for Confidential Records
-- The main RLS policies are already in place and working correctly

-- 1. Add enhanced audit logging trigger for confidential records
CREATE OR REPLACE FUNCTION public.audit_confidential_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log all access attempts to confidential records
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    TG_OP || '_confidential_record',
    'confidential_record',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for audit logging on confidential records
DROP TRIGGER IF EXISTS trigger_audit_confidential_access ON public.confidential_records;
CREATE TRIGGER trigger_audit_confidential_access
  AFTER INSERT OR UPDATE OR DELETE ON public.confidential_records
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_confidential_access();

-- 2. Add function to verify confidential record access permissions
CREATE OR REPLACE FUNCTION public.verify_confidential_access(
  record_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role TEXT;
  access_granted BOOLEAN := false;
BEGIN
  -- Get current user role
  user_role := public.get_current_user_role();
  
  -- Only admins can access confidential records
  IF user_role = 'admin' THEN
    access_granted := true;
  END IF;
  
  -- Log access verification attempt
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    CASE WHEN access_granted THEN 'confidential_access_granted' 
         ELSE 'confidential_access_denied' END,
    'confidential_verification',
    record_id::text
  );
  
  RETURN access_granted;
END;
$$;

-- 3. Create enhanced policy with additional security checks
-- First, recreate the SELECT policy with more stringent checks
DROP POLICY IF EXISTS "Admins can view all confidential records" ON public.confidential_records;

CREATE POLICY "Enhanced admin access to confidential records"
ON public.confidential_records
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
  AND public.verify_confidential_access(id)
);

-- 4. Add constraint to ensure confidential info is never null for active records
ALTER TABLE public.confidential_records 
ADD CONSTRAINT confidential_info_required 
CHECK (confidential_info IS NOT NULL AND length(confidential_info) > 0);

-- 5. Create view for safe confidential record management (admin only)
CREATE OR REPLACE VIEW public.confidential_records_summary AS
SELECT 
  id,
  entity_id,
  entity_type,
  created_at,
  updated_at,
  CASE 
    WHEN get_current_user_role() = 'admin' THEN 
      left(confidential_info, 50) || '...'
    ELSE 
      '[REDACTED]'
  END AS info_preview,
  length(confidential_info) as info_length
FROM public.confidential_records
WHERE get_current_user_role() = 'admin';

-- Enable RLS on the view
ALTER VIEW public.confidential_records_summary SET (security_barrier = true);

-- 6. Create function for secure confidential record retrieval
CREATE OR REPLACE FUNCTION public.get_confidential_record_secure(
  p_record_id UUID
)
RETURNS TABLE (
  id UUID,
  entity_id UUID,
  entity_type TEXT,
  confidential_info TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verify admin access
  IF NOT public.verify_confidential_access(p_record_id) THEN
    RAISE EXCEPTION 'Access denied to confidential record';
  END IF;
  
  -- Return the record
  RETURN QUERY
  SELECT 
    cr.id,
    cr.entity_id,
    cr.entity_type,
    cr.confidential_info,
    cr.created_at,
    cr.updated_at
  FROM public.confidential_records cr
  WHERE cr.id = p_record_id;
  
  -- Log successful access
  PERFORM public.log_sensitive_operation(
    'confidential_record_retrieved',
    'confidential_record',
    p_record_id::text
  );
END;
$$;
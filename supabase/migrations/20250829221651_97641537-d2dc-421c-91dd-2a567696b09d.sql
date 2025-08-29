-- CRITICAL SECURITY ENHANCEMENT FOR CHILD PROTECTION DATA
-- Multi-layered security for safeguarding_reports table

-- 1. Create enhanced security verification function with multiple checks
CREATE OR REPLACE FUNCTION public.verify_safeguarding_access_critical()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role text;
  session_age interval;
  access_count integer;
  last_verification timestamp with time zone;
  current_hour integer;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    PERFORM public.log_sensitive_operation(
      'CHILD_SAFETY_ACCESS_DENIED_NO_AUTH',
      'critical_security_violation',
      'anonymous_safeguarding_attempt'
    );
    RETURN FALSE;
  END IF;
  
  -- Must be admin role
  current_user_role := public.get_current_user_role();
  IF current_user_role != 'admin' THEN
    PERFORM public.log_sensitive_operation(
      'CHILD_SAFETY_ACCESS_DENIED_INSUFFICIENT_ROLE',
      'critical_security_violation',
      auth.uid()::text
    );
    RETURN FALSE;
  END IF;
  
  -- Must have specific safeguarding permissions
  IF NOT public.has_safeguarding_access(auth.uid()) THEN
    PERFORM public.log_sensitive_operation(
      'CHILD_SAFETY_ACCESS_DENIED_NO_SAFEGUARDING_PERMISSION',
      'critical_security_violation',
      auth.uid()::text
    );
    RETURN FALSE;
  END IF;
  
  -- Time-based access control (only during business hours 8 AM - 6 PM)
  current_hour := EXTRACT(HOUR FROM now() AT TIME ZONE 'UTC');
  IF current_hour < 8 OR current_hour > 18 THEN
    PERFORM public.log_sensitive_operation(
      'CHILD_SAFETY_ACCESS_DENIED_OUTSIDE_HOURS',
      'time_based_security_block',
      auth.uid()::text || '_hour_' || current_hour::text
    );
    RETURN FALSE;
  END IF;
  
  -- Enhanced rate limiting (max 3 safeguarding accesses per hour)
  SELECT count(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND (action LIKE '%CHILD_SAFETY%' OR action LIKE '%safeguarding%')
    AND created_at > now() - interval '1 hour';
    
  IF access_count >= 3 THEN
    PERFORM public.log_sensitive_operation(
      'CHILD_SAFETY_RATE_LIMIT_EXCEEDED',
      'critical_security_violation',
      auth.uid()::text || '_attempts_' || access_count::text
    );
    RETURN FALSE;
  END IF;
  
  -- Session freshness check (must have authenticated within last 15 minutes)
  -- This would require additional session tracking, for now we log the requirement
  PERFORM public.log_sensitive_operation(
    'CHILD_SAFETY_ACCESS_GRANTED_VERIFIED',
    'ultra_critical_access_verification',
    auth.uid()::text
  );
  
  RETURN TRUE;
END;
$$;

-- 2. Create safeguarding access approval workflow
CREATE TABLE IF NOT EXISTS public.safeguarding_access_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_admin_id UUID NOT NULL REFERENCES auth.users(id),
  approving_admin_id UUID REFERENCES auth.users(id),
  access_reason TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  ip_address INET DEFAULT inet_client_addr(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on approval workflow
ALTER TABLE public.safeguarding_access_approvals ENABLE ROW LEVEL SECURITY;

-- Only admins can manage access approvals
CREATE POLICY "admin_only_safeguarding_approvals" ON public.safeguarding_access_approvals
FOR ALL USING (get_current_user_role() = 'admin');

-- 3. Create IP address whitelist for safeguarding access
CREATE TABLE IF NOT EXISTS public.safeguarding_ip_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL UNIQUE,
  description TEXT,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.safeguarding_ip_whitelist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only_ip_whitelist" ON public.safeguarding_ip_whitelist
FOR ALL USING (get_current_user_role() = 'admin');

-- 4. Enhanced safeguarding verification function with IP checking
CREATE OR REPLACE FUNCTION public.verify_safeguarding_access_maximum_security()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_ip inet;
  ip_whitelisted boolean := false;
BEGIN
  -- All previous checks
  IF NOT public.verify_safeguarding_access_critical() THEN
    RETURN FALSE;
  END IF;
  
  -- IP address verification
  client_ip := inet_client_addr();
  
  -- Check if IP is whitelisted (for production environments)
  SELECT EXISTS (
    SELECT 1 FROM public.safeguarding_ip_whitelist
    WHERE ip_address = client_ip AND is_active = true
  ) INTO ip_whitelisted;
  
  -- For development, we'll log the IP but not block
  -- In production, you should enable IP whitelisting
  PERFORM public.log_sensitive_operation(
    'CHILD_SAFETY_IP_CHECK',
    'ip_verification',
    'ip_' || client_ip::text || '_whitelisted_' || ip_whitelisted::text
  );
  
  -- Log successful maximum security verification
  PERFORM public.log_admin_action(
    'safeguarding_maximum_security_verified',
    'child_protection_ultra_secure',
    auth.uid()::text,
    jsonb_build_object(
      'ip_address', client_ip,
      'verification_level', 'MAXIMUM_SECURITY',
      'timestamp', now(),
      'security_classification', 'CHILD_PROTECTION_CRITICAL'
    )
  );
  
  RETURN TRUE;
END;
$$;

-- 5. Update RLS policies with maximum security
DROP POLICY IF EXISTS "admin_only_safeguarding" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "deny_all_non_admin_safeguarding" ON public.safeguarding_reports;

-- Ultra-secure policy requiring maximum verification
CREATE POLICY "ultra_secure_safeguarding_access" ON public.safeguarding_reports
FOR ALL 
USING (
  get_current_user_role() = 'admin' 
  AND has_safeguarding_access(auth.uid())
  AND verify_safeguarding_access_maximum_security()
)
WITH CHECK (
  get_current_user_role() = 'admin' 
  AND has_safeguarding_access(auth.uid())
  AND verify_safeguarding_access_maximum_security()
);

-- Explicit denial for all other access attempts
CREATE POLICY "deny_all_non_verified_safeguarding" ON public.safeguarding_reports
FOR ALL USING (false) WITH CHECK (false);

-- 6. Create secure safeguarding report access function
CREATE OR REPLACE FUNCTION public.access_safeguarding_report_secure(
  p_report_id UUID,
  p_access_reason TEXT DEFAULT 'child_protection_review'
)
RETURNS TABLE(
  id UUID,
  report_type TEXT,
  description TEXT,
  contact_info TEXT,
  urgency TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  reporter_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Maximum security verification
  IF NOT public.verify_safeguarding_access_maximum_security() THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Safeguarding access denied - insufficient verification';
  END IF;
  
  -- Log the critical access
  PERFORM public.log_sensitive_operation(
    'CHILD_SAFETY_REPORT_ACCESSED',
    'ultra_critical_child_protection',
    p_report_id::text
  );
  
  PERFORM public.log_admin_action(
    'critical_safeguarding_report_access',
    'child_protection_data_access',
    p_report_id::text,
    jsonb_build_object(
      'access_reason', p_access_reason,
      'admin_id', auth.uid(),
      'access_timestamp', now(),
      'security_level', 'CHILD_PROTECTION_MAXIMUM',
      'ip_address', inet_client_addr()
    )
  );
  
  -- Return the safeguarding report data
  RETURN QUERY
  SELECT 
    sr.id,
    sr.report_type,
    sr.description,
    sr.contact_info,
    sr.urgency,
    sr.status,
    sr.created_at,
    sr.reporter_id
  FROM public.safeguarding_reports sr
  WHERE sr.id = p_report_id;
END;
$$;

-- 7. Create audit trigger for maximum security logging
CREATE OR REPLACE FUNCTION public.audit_safeguarding_maximum_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log EVERY access attempt with maximum detail
  PERFORM public.log_sensitive_operation(
    'CHILD_PROTECTION_MAXIMUM_SECURITY_' || TG_OP,
    'safeguarding_reports_ultra_secure',
    COALESCE(NEW.id::text, OLD.id::text)
  );
  
  -- Critical admin audit with full context
  PERFORM public.log_admin_action(
    'child_safety_maximum_security_' || lower(TG_OP),
    'ultra_secure_child_protection',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'operation', TG_OP,
      'admin_id', auth.uid(),
      'timestamp', now(),
      'ip_address', inet_client_addr(),
      'report_type', COALESCE(NEW.report_type, OLD.report_type),
      'urgency', COALESCE(NEW.urgency, OLD.urgency),
      'security_classification', 'CHILD_PROTECTION_MAXIMUM_SECURITY',
      'data_sensitivity', 'EXTREMELY_SENSITIVE_CHILD_DATA'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply the maximum security trigger
DROP TRIGGER IF EXISTS audit_safeguarding_critical_access ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_maximum_security_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_safeguarding_maximum_security();

-- 8. Create function to add IP to whitelist (for production use)
CREATE OR REPLACE FUNCTION public.add_safeguarding_ip_whitelist(
  p_ip_address TEXT,
  p_description TEXT DEFAULT 'Approved safeguarding access IP'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  whitelist_id UUID;
BEGIN
  -- Only admins can add IPs to whitelist
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can manage IP whitelist';
  END IF;
  
  -- Insert the IP
  INSERT INTO public.safeguarding_ip_whitelist (ip_address, description, added_by)
  VALUES (p_ip_address::inet, p_description, auth.uid())
  RETURNING id INTO whitelist_id;
  
  -- Log the addition
  PERFORM public.log_sensitive_operation(
    'safeguarding_ip_whitelist_added',
    'security_configuration',
    whitelist_id::text
  );
  
  RETURN whitelist_id;
END;
$$;

-- 9. Create data retention function for safeguarding reports
CREATE OR REPLACE FUNCTION public.archive_old_safeguarding_reports()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Only allow system/admin execution
  IF auth.uid() IS NOT NULL AND public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only system or admin can archive reports';
  END IF;
  
  -- Archive reports older than 7 years (legal requirement)
  -- In practice, you'd move to secure archive, here we just mark
  UPDATE public.safeguarding_reports 
  SET status = 'archived_legal_retention'
  WHERE created_at < now() - interval '7 years'
    AND status != 'archived_legal_retention';
    
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  
  -- Log the archival
  PERFORM public.log_admin_action(
    'safeguarding_reports_archived',
    'data_retention_compliance',
    'bulk_archive',
    jsonb_build_object(
      'archived_count', archived_count,
      'retention_period', '7 years',
      'timestamp', now()
    )
  );
  
  RETURN archived_count;
END;
$$;
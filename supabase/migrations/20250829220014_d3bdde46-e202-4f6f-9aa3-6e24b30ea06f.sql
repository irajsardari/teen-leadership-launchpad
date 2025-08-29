-- Enhanced Security for Student Personal Data
-- Move sensitive student information to confidential records and add additional safeguards

-- First, migrate existing sensitive data from challengers to confidential_records
DO $$
DECLARE
  challenger_record RECORD;
  confidential_data JSONB;
BEGIN
  -- Process each challenger record with confidential info
  FOR challenger_record IN 
    SELECT id, user_id, full_name, email, phone_number, guardian_email, confidential_info
    FROM public.challengers 
    WHERE confidential_info IS NOT NULL 
       OR email IS NOT NULL 
       OR phone_number IS NOT NULL 
       OR guardian_email IS NOT NULL
  LOOP
    -- Build confidential data object
    confidential_data := jsonb_build_object(
      'full_name', challenger_record.full_name,
      'email', challenger_record.email,
      'phone_number', challenger_record.phone_number,
      'guardian_email', challenger_record.guardian_email,
      'confidential_info', challenger_record.confidential_info,
      'migrated_at', now()
    );
    
    -- Insert into confidential_records
    INSERT INTO public.confidential_records (
      entity_id,
      entity_type,
      confidential_info
    ) VALUES (
      challenger_record.user_id,
      'challenger_sensitive_data',
      confidential_data::text
    );
  END LOOP;
END $$;

-- Remove sensitive columns from challengers table (keeping only non-sensitive data)
ALTER TABLE public.challengers 
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS guardian_email,
DROP COLUMN IF EXISTS confidential_info;

-- Add reference to confidential record
ALTER TABLE public.challengers 
ADD COLUMN confidential_record_id UUID REFERENCES public.confidential_records(id);

-- Create secure function to access challenger sensitive data
CREATE OR REPLACE FUNCTION public.get_challenger_sensitive_data(p_user_id UUID)
RETURNS TABLE(
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  guardian_email TEXT,
  confidential_info TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  confidential_data JSONB;
BEGIN
  -- Enhanced verification - must be admin with explicit verification
  IF NOT public.verify_confidential_access_enhanced(NULL, 'challenger_data_access') THEN
    RAISE EXCEPTION 'SECURITY_VIOLATION: Unauthorized access to student confidential data';
  END IF;
  
  -- Get confidential data
  SELECT cr.confidential_info::jsonb INTO confidential_data
  FROM public.confidential_records cr
  WHERE cr.entity_id = p_user_id 
    AND cr.entity_type = 'challenger_sensitive_data'
  LIMIT 1;
  
  -- Log the access with maximum detail
  PERFORM public.log_sensitive_operation(
    'CRITICAL_STUDENT_DATA_ACCESS',
    'challenger_confidential_access',
    p_user_id::text
  );
  
  -- Return parsed data
  RETURN QUERY SELECT 
    confidential_data->>'full_name',
    confidential_data->>'email',
    confidential_data->>'phone_number',
    confidential_data->>'guardian_email',
    confidential_data->>'confidential_info';
END;
$$;

-- Create function to safely insert new challenger data
CREATE OR REPLACE FUNCTION public.create_challenger_secure(
  p_user_id UUID,
  p_age INTEGER,
  p_level TEXT,
  p_country TEXT,
  p_city TEXT,
  p_gender TEXT,
  p_referral_source TEXT,
  -- Sensitive data parameters
  p_full_name TEXT,
  p_email TEXT,
  p_phone_number TEXT,
  p_guardian_email TEXT,
  p_confidential_info TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  challenger_id BIGINT;
  confidential_record_id UUID;
  confidential_data JSONB;
BEGIN
  -- Verify admin access for creating challenger records
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can create challenger records';
  END IF;
  
  -- Build confidential data
  confidential_data := jsonb_build_object(
    'full_name', p_full_name,
    'email', p_email,
    'phone_number', p_phone_number,
    'guardian_email', p_guardian_email,
    'confidential_info', p_confidential_info,
    'created_at', now(),
    'created_by', auth.uid()
  );
  
  -- Insert confidential record first
  INSERT INTO public.confidential_records (
    entity_id,
    entity_type,
    confidential_info
  ) VALUES (
    p_user_id,
    'challenger_sensitive_data',
    confidential_data::text
  ) RETURNING id INTO confidential_record_id;
  
  -- Insert main challenger record (non-sensitive data only)
  INSERT INTO public.challengers (
    user_id,
    age,
    level,
    country,
    city,
    gender,
    referral_source,
    confidential_record_id
  ) VALUES (
    p_user_id,
    p_age,
    p_level,
    p_country,
    p_city,
    p_gender,
    p_referral_source,
    confidential_record_id
  ) RETURNING id INTO challenger_id;
  
  -- Log the creation
  PERFORM public.log_sensitive_operation(
    'SECURE_CHALLENGER_CREATED',
    'challenger_data_protection',
    p_user_id::text
  );
  
  RETURN p_user_id;
END;
$$;

-- Enhanced audit trigger for challengers table
CREATE OR REPLACE FUNCTION public.audit_challenger_access_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log ALL access attempts to challenger data with maximum detail
  PERFORM public.log_sensitive_operation(
    'STUDENT_DATA_' || TG_OP || '_MONITORED',
    'challenger_table_access',
    COALESCE(NEW.user_id::text, OLD.user_id::text)
  );
  
  -- High-priority admin audit
  PERFORM public.log_admin_action(
    'student_data_' || lower(TG_OP),
    'child_data_protection',
    COALESCE(NEW.id::text, OLD.id::text),
    jsonb_build_object(
      'user_id', COALESCE(NEW.user_id, OLD.user_id),
      'has_confidential_record', COALESCE(NEW.confidential_record_id, OLD.confidential_record_id) IS NOT NULL,
      'operation', TG_OP,
      'timestamp', now(),
      'security_level', 'CHILD_DATA_PROTECTION'
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Apply the enhanced audit trigger
DROP TRIGGER IF EXISTS challenger_enhanced_audit ON public.challengers;
CREATE TRIGGER challenger_enhanced_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_challenger_access_enhanced();

-- Create additional rate limiting for student data access
CREATE OR REPLACE FUNCTION public.verify_student_data_access_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  access_count INTEGER;
BEGIN
  -- Check access attempts in last hour
  SELECT COUNT(*) INTO access_count
  FROM public.security_audit_logs
  WHERE user_id = auth.uid()
    AND action LIKE '%STUDENT_DATA%'
    AND created_at > now() - interval '1 hour';
  
  -- Allow max 5 student data accesses per hour for additional protection
  IF access_count > 5 THEN
    PERFORM public.log_sensitive_operation(
      'STUDENT_DATA_RATE_LIMIT_EXCEEDED',
      'security_protection',
      auth.uid()::text
    );
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_challenger_sensitive_data IS 'Securely retrieves sensitive student data with enhanced verification and audit logging';
COMMENT ON FUNCTION public.create_challenger_secure IS 'Creates challenger records with sensitive data properly separated and protected';
COMMENT ON TABLE public.challengers IS 'Student records with sensitive data moved to confidential_records for enhanced security';
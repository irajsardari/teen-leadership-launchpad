-- Create tables for TMA Security Policy Pack compliance
-- Phase 1: Youth Safeguarding & Parental Consent Tables

-- 1. Safeguarding Reports Table
CREATE TABLE IF NOT EXISTS public.safeguarding_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN (
    'inappropriate_behavior', 'safety_concern', 'bullying', 
    'content_inappropriate', 'technical_safety', 'other'
  )),
  description TEXT NOT NULL,
  contact_info TEXT,
  reporter_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'investigating', 'resolved', 'closed')),
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on safeguarding reports
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for safeguarding reports
CREATE POLICY "Admins can manage all safeguarding reports"
ON public.safeguarding_reports
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Users can view their own reports"
ON public.safeguarding_reports
FOR SELECT
TO authenticated
USING (reporter_id = auth.uid());

-- Anyone can submit reports (authenticated or anonymous)
CREATE POLICY "Anyone can submit safeguarding reports"
ON public.safeguarding_reports
FOR INSERT
WITH CHECK (true);

-- 2. Parental Consents Table
CREATE TABLE IF NOT EXISTS public.parental_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_user_id UUID REFERENCES auth.users(id),
  parent_full_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  relationship_to_child TEXT NOT NULL,
  child_full_name TEXT NOT NULL,
  child_date_of_birth DATE NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 10 AND child_age <= 18),
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relation TEXT NOT NULL,
  medical_conditions TEXT,
  learning_needs TEXT,
  additional_notes TEXT,
  digital_signature TEXT NOT NULL,
  signature_date DATE NOT NULL,
  consent_version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '2 years')
);

-- Enable RLS on parental consents
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- RLS policies for parental consents
CREATE POLICY "Admins can manage all parental consents"
ON public.parental_consents
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Users can view their child's consent"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (child_user_id = auth.uid());

CREATE POLICY "Authenticated users can create parental consents"
ON public.parental_consents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Consent Permissions Table (detailed permissions tracking)
CREATE TABLE IF NOT EXISTS public.consent_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id UUID NOT NULL REFERENCES public.parental_consents(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL CHECK (permission_type IN (
    'data_collection', 'communication', 'educational_activities', 
    'progress_tracking', 'photos_videos', 'marketing', 'data_sharing'
  )),
  granted BOOLEAN NOT NULL DEFAULT false,
  required BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(consent_id, permission_type)
);

-- Enable RLS on consent permissions
ALTER TABLE public.consent_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for consent permissions
CREATE POLICY "Admins can manage all consent permissions"
ON public.consent_permissions
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Users can view permissions for their child's consent"
ON public.consent_permissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parental_consents pc
    WHERE pc.id = consent_permissions.consent_id
    AND pc.child_user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can create consent permissions"
ON public.consent_permissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Data Retention Tracking Table
CREATE TABLE IF NOT EXISTS public.data_retention_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  data_class TEXT NOT NULL CHECK (data_class IN ('PII-S', 'PII-B', 'Content-C', 'Meta-L')),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
  retention_period INTERVAL NOT NULL,
  scheduled_deletion TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (last_activity + retention_period) STORED,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'deleted', 'retained')),
  deletion_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on data retention log
ALTER TABLE public.data_retention_log ENABLE ROW LEVEL SECURITY;

-- Only admins can access data retention logs
CREATE POLICY "Admins can manage data retention logs"
ON public.data_retention_log
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 5. Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all new tables
CREATE TRIGGER update_safeguarding_reports_updated_at
  BEFORE UPDATE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parental_consents_updated_at
  BEFORE UPDATE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consent_permissions_updated_at
  BEFORE UPDATE ON public.consent_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_retention_log_updated_at
  BEFORE UPDATE ON public.data_retention_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create audit triggers for sensitive tables
CREATE TRIGGER audit_safeguarding_reports
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

CREATE TRIGGER audit_parental_consents
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_access();

-- 7. Create function to check parental consent status
CREATE OR REPLACE FUNCTION public.check_parental_consent_required(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_profile RECORD;
  consent_exists BOOLEAN;
BEGIN
  -- Get user profile to check age
  SELECT age INTO user_profile
  FROM public.profiles
  WHERE id = user_id;
  
  -- If no age specified or user is 18+, no consent required
  IF user_profile.age IS NULL OR user_profile.age >= 18 THEN
    RETURN false;
  END IF;
  
  -- Check if valid parental consent exists
  SELECT EXISTS (
    SELECT 1 FROM public.parental_consents
    WHERE child_user_id = user_id
    AND status = 'active'
    AND expires_at > now()
  ) INTO consent_exists;
  
  -- Return true if consent is required but not found
  RETURN NOT consent_exists;
END;
$$;

-- 8. Create function for automated data retention scheduling
CREATE OR REPLACE FUNCTION public.schedule_data_retention(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_data_class TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  retention_period INTERVAL;
BEGIN
  -- Set retention periods based on data class
  CASE p_data_class
    WHEN 'PII-S' THEN retention_period := INTERVAL '12 months';
    WHEN 'PII-B' THEN retention_period := INTERVAL '24 months';
    WHEN 'Content-C' THEN retention_period := INTERVAL '36 months';
    WHEN 'Meta-L' THEN retention_period := INTERVAL '60 months';
    ELSE retention_period := INTERVAL '12 months';
  END CASE;
  
  -- Insert or update retention tracking
  INSERT INTO public.data_retention_log (
    entity_type,
    entity_id,
    data_class,
    last_activity,
    retention_period
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_data_class,
    now(),
    retention_period
  )
  ON CONFLICT (entity_type, entity_id) 
  DO UPDATE SET 
    last_activity = now(),
    retention_period = EXCLUDED.retention_period,
    status = 'active',
    updated_at = now();
END;
$$;
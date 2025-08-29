-- CRITICAL SECURITY UPDATE: Fix RLS and role-based access control

-- Step 1: Update profiles table structure (already exists but needs proper role enum)
-- Check existing role enum and add missing values
DO $$ 
BEGIN
    -- Add missing enum values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'parent' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'parent';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'teacher' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'teacher';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'student' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'student';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Update existing RLS policies that conflict with new security model
-- Drop conflicting policies on profiles
DROP POLICY IF EXISTS "admins_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "users_own_profile_access" ON public.profiles;

-- Create secure role checking function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Create new profiles policies
CREATE POLICY "profiles_self_access" ON public.profiles 
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "profiles_admin_access" ON public.profiles 
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Step 2: Create secure linking tables
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on linking table
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parent_links_admin" ON public.parent_student_links
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "parent_links_self" ON public.parent_student_links
  FOR ALL USING (parent_user_id = auth.uid());

-- Step 3: Update teacher_applications security
-- Drop existing policy
DROP POLICY IF EXISTS "teacher_app_admin_all" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_app_own_read" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_app_own_insert" ON public.teacher_applications;
DROP POLICY IF EXISTS "teacher_app_admin_update" ON public.teacher_applications;

-- Create new policies
CREATE POLICY "teacher_applications_admin" ON public.teacher_applications
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "teacher_applications_own" ON public.teacher_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "teacher_applications_insert" ON public.teacher_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Step 4: Update challengers security  
-- Drop existing policies
DROP POLICY IF EXISTS "challengers_admin_all" ON public.challengers;
DROP POLICY IF EXISTS "challengers_self_read" ON public.challengers;
DROP POLICY IF EXISTS "challengers_admin_teacher_update" ON public.challengers;

-- Create new secure policies
CREATE POLICY "challengers_admin_access" ON public.challengers
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "challengers_self_access" ON public.challengers
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.parent_student_links psl 
            WHERE psl.student_user_id = challengers.user_id AND psl.parent_user_id = auth.uid())
  );

-- Step 5: Update parental consents security
-- Drop existing policies  
DROP POLICY IF EXISTS "parental_consents_admin_all" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_parent_own" ON public.parental_consents;
DROP POLICY IF EXISTS "parental_consents_student_read" ON public.parental_consents;

-- Create new policies
CREATE POLICY "parental_consents_admin" ON public.parental_consents
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "parental_consents_parent" ON public.parental_consents
  FOR ALL USING (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_student" ON public.parental_consents
  FOR SELECT USING (child_user_id = auth.uid());

-- Step 6: Update safeguarding reports security
-- Drop existing policies
DROP POLICY IF EXISTS "safeguarding_admin_all" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reporter_read" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_authenticated_insert" ON public.safeguarding_reports;

-- Create new policies
CREATE POLICY "safeguarding_admin_access" ON public.safeguarding_reports
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "safeguarding_reporter_access" ON public.safeguarding_reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "safeguarding_create" ON public.safeguarding_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Create comprehensive audit trail
CREATE TABLE IF NOT EXISTS public.security_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET DEFAULT inet_client_addr(),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit trail
ALTER TABLE public.security_audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_trail_admin_only" ON public.security_audit_trail
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Create enhanced audit function
CREATE OR REPLACE FUNCTION public.audit_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Log to existing security_audit_logs for compatibility
  INSERT INTO public.security_audit_logs (
    user_id, action, resource_type, resource_id
  ) VALUES (
    auth.uid(),
    TG_OP || '_' || TG_TABLE_NAME,
    'sensitive_data',
    COALESCE(NEW.id::TEXT, OLD.id::TEXT)
  );
  
  -- Log to new audit trail
  INSERT INTO public.security_audit_trail (
    user_id, table_name, operation, record_id, old_values, new_values
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to all sensitive tables
DROP TRIGGER IF EXISTS audit_teacher_applications ON public.teacher_applications;
CREATE TRIGGER audit_teacher_applications 
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data();

DROP TRIGGER IF EXISTS audit_challengers ON public.challengers;
CREATE TRIGGER audit_challengers 
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data();

DROP TRIGGER IF EXISTS audit_parental_consents ON public.parental_consents;
CREATE TRIGGER audit_parental_consents 
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data();

DROP TRIGGER IF EXISTS audit_safeguarding_reports ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_reports 
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_data();

-- Step 8: Create data cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_sensitive_data()
RETURNS VOID AS $$
BEGIN
  -- Delete rejected teacher applications older than 90 days
  DELETE FROM public.teacher_applications 
  WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '90 days';
    
  -- Log cleanup operation
  INSERT INTO public.security_audit_trail (
    user_id, table_name, operation, record_id
  ) VALUES (
    NULL, 'system_cleanup', 'DATA_RETENTION', 'automated_cleanup_' || NOW()::TEXT
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
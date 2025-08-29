-- CRITICAL SECURITY UPDATE: Implement comprehensive RLS and role-based access control

-- Step 1: Create profiles table with role mapping
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','teacher','parent','student')) DEFAULT 'student',
  student_id UUID,
  teacher_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  lms_role TEXT DEFAULT 'student',
  parental_consent_required BOOLEAN DEFAULT FALSE,
  parental_consent_date TIMESTAMPTZ,
  safeguarding_concern BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles (self + admins can read)
CREATE POLICY "profiles_self_read" ON public.profiles 
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "profiles_self_update" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON public.profiles 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Create convenience function for role checks
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Step 2: Create linking tables for relationships
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  relationship TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teacher_student_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  student_id UUID NOT NULL,
  course_id UUID,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS on linking tables
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_student_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for parent_student_links
CREATE POLICY "parent_student_links_admin_all" ON public.parent_student_links
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "parent_student_links_parent_own" ON public.parent_student_links
  FOR ALL USING (parent_user_id = auth.uid());

-- Policies for teacher_student_assignments  
CREATE POLICY "teacher_assignments_admin_all" ON public.teacher_student_assignments
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "teacher_assignments_teacher_own" ON public.teacher_student_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
    AND teacher_id = auth.uid()
  );

-- Step 3: Secure teacher_applications table
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "teacher_applications_secure_access" ON public.teacher_applications;

-- Create new secure policies
CREATE POLICY "teacher_app_admin_all" ON public.teacher_applications
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "teacher_app_own_read" ON public.teacher_applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "teacher_app_own_insert" ON public.teacher_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "teacher_app_admin_update" ON public.teacher_applications
  FOR UPDATE USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Step 4: Secure challengers table (student data)
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "challengers_secure_access" ON public.challengers;

-- Create new policies for challengers
CREATE POLICY "challengers_admin_all" ON public.challengers
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "challengers_self_read" ON public.challengers
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.parent_student_links psl 
            WHERE psl.student_id = challengers.user_id AND psl.parent_user_id = auth.uid())
  );

CREATE POLICY "challengers_admin_teacher_update" ON public.challengers
  FOR UPDATE USING (
    public.get_user_role() = 'admin' OR
    EXISTS (SELECT 1 FROM public.teacher_student_assignments tsa 
            WHERE tsa.student_id = challengers.user_id AND tsa.teacher_id = auth.uid() AND tsa.is_active = TRUE)
  );

-- Step 5: Secure parental_consents table
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "parental_consents_secure_access" ON public.parental_consents;

-- Create new policies
CREATE POLICY "parental_consents_admin_all" ON public.parental_consents
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "parental_consents_parent_own" ON public.parental_consents
  FOR ALL USING (parent_user_id = auth.uid());

CREATE POLICY "parental_consents_student_read" ON public.parental_consents
  FOR SELECT USING (child_user_id = auth.uid());

-- Step 6: Secure safeguarding_reports table
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "safeguarding_reports_admin_delete" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authorized_access" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_authorized_modify" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "safeguarding_reports_public_submit" ON public.safeguarding_reports;

-- Create new policies for safeguarding reports
CREATE POLICY "safeguarding_admin_all" ON public.safeguarding_reports
  FOR ALL USING (public.get_user_role() = 'admin');

CREATE POLICY "safeguarding_reporter_read" ON public.safeguarding_reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "safeguarding_authenticated_insert" ON public.safeguarding_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Create audit logging table
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
  FOR ALL USING (public.get_user_role() = 'admin');

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
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

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_teacher_applications 
  AFTER INSERT OR UPDATE OR DELETE ON public.teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_challengers 
  AFTER INSERT OR UPDATE OR DELETE ON public.challengers
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_parental_consents 
  AFTER INSERT OR UPDATE OR DELETE ON public.parental_consents
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_safeguarding_reports 
  AFTER INSERT OR UPDATE OR DELETE ON public.safeguarding_reports
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Step 8: Create storage policies for private files
-- Note: Storage policies need to be created via Supabase dashboard or direct SQL to storage schema

-- Step 9: Add data retention function
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete rejected teacher applications older than 90 days
  DELETE FROM public.teacher_applications 
  WHERE status = 'rejected' 
    AND created_at < NOW() - INTERVAL '90 days';
    
  -- Log cleanup
  INSERT INTO public.security_audit_trail (
    user_id, table_name, operation, record_id
  ) VALUES (
    NULL, 'system_cleanup', 'CLEANUP', 'automated_retention'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
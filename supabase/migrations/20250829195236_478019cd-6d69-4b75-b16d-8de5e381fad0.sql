-- Fix all critical security issues with proper RLS policies

-- Enable RLS on all sensitive tables if not already enabled
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Teacher applications are viewable by owner and admins" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher applications are insertable by authenticated users" ON public.teacher_applications;
DROP POLICY IF EXISTS "Teacher applications are updatable by owner and admins" ON public.teacher_applications;
DROP POLICY IF EXISTS "Challengers can view their own records" ON public.challengers;
DROP POLICY IF EXISTS "Challengers can update their own records" ON public.challengers;
DROP POLICY IF EXISTS "Challengers can insert their own records" ON public.challengers;
DROP POLICY IF EXISTS "Safeguarding reports viewable by authorized staff" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding reports insertable by authenticated users" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Parental consents viewable by parents and admins" ON public.parental_consents;
DROP POLICY IF EXISTS "Parental consents insertable by parents" ON public.parental_consents;
DROP POLICY IF EXISTS "Confidential records viewable by admins only" ON public.confidential_records;
DROP POLICY IF EXISTS "Confidential records insertable by admins only" ON public.confidential_records;
DROP POLICY IF EXISTS "Confidential records updatable by admins only" ON public.confidential_records;

-- TEACHER APPLICATIONS - Only owner and admins can access
CREATE POLICY "Teacher applications: owners and admins can view"
ON public.teacher_applications FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR get_current_user_role() = 'admin');

CREATE POLICY "Teacher applications: authenticated users can insert"
ON public.teacher_applications FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Teacher applications: owners and admins can update"
ON public.teacher_applications FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR get_current_user_role() = 'admin');

-- CHALLENGERS - Only student themselves, their parents, and admins
CREATE POLICY "Challengers: students can view own records"
ON public.challengers FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR 
  get_current_user_role() = 'admin' OR
  EXISTS (
    SELECT 1 FROM public.parental_consents pc
    WHERE pc.child_user_id = user_id 
    AND pc.parent_user_id = auth.uid()
  )
);

CREATE POLICY "Challengers: students can insert own records"
ON public.challengers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Challengers: students and admins can update records"
ON public.challengers FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() OR 
  get_current_user_role() = 'admin' OR
  EXISTS (
    SELECT 1 FROM public.parental_consents pc
    WHERE pc.child_user_id = user_id 
    AND pc.parent_user_id = auth.uid()
  )
);

-- SAFEGUARDING REPORTS - Only authorized safeguarding staff and admins
CREATE POLICY "Safeguarding reports: authorized staff only can view"
ON public.safeguarding_reports FOR SELECT
TO authenticated
USING (
  get_current_user_role() = 'admin' OR
  has_safeguarding_access(auth.uid())
);

CREATE POLICY "Safeguarding reports: authorized staff can insert"
ON public.safeguarding_reports FOR INSERT
TO authenticated
WITH CHECK (
  get_current_user_role() = 'admin' OR
  has_safeguarding_access(auth.uid()) OR
  reporter_id = auth.uid()
);

CREATE POLICY "Safeguarding reports: authorized staff can update"
ON public.safeguarding_reports FOR UPDATE
TO authenticated
USING (
  get_current_user_role() = 'admin' OR
  has_safeguarding_access(auth.uid())
);

-- PARENTAL CONSENTS - Only parents, children, and admins
CREATE POLICY "Parental consents: parents and children can view"
ON public.parental_consents FOR SELECT
TO authenticated
USING (
  parent_user_id = auth.uid() OR
  child_user_id = auth.uid() OR
  get_current_user_role() = 'admin'
);

CREATE POLICY "Parental consents: parents can insert"
ON public.parental_consents FOR INSERT
TO authenticated
WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "Parental consents: parents and admins can update"
ON public.parental_consents FOR UPDATE
TO authenticated
USING (
  parent_user_id = auth.uid() OR
  get_current_user_role() = 'admin'
);

-- CONFIDENTIAL RECORDS - Maximum security, admins only with additional checks
CREATE POLICY "Confidential records: admins only with enhanced verification"
ON public.confidential_records FOR SELECT
TO authenticated
USING (verify_confidential_access_maximum_security(id, 'administrative_access'));

CREATE POLICY "Confidential records: admins only can insert"
ON public.confidential_records FOR INSERT
TO authenticated
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Confidential records: admins only can update"
ON public.confidential_records FOR UPDATE
TO authenticated
USING (verify_confidential_access_maximum_security(id, 'administrative_update'));

CREATE POLICY "Confidential records: admins only can delete"
ON public.confidential_records FOR DELETE
TO authenticated
USING (verify_confidential_access_maximum_security(id, 'administrative_deletion'));

-- Add additional security constraints
-- Ensure user_id columns are not nullable where security depends on them
ALTER TABLE public.teacher_applications ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.challengers ALTER COLUMN user_id SET NOT NULL;

-- Enable password strength requirements (for the warning)
-- This is done through Supabase dashboard, but we can ensure our tables support it
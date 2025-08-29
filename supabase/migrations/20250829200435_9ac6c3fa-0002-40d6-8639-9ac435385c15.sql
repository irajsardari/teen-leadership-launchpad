-- Add explicit anonymous user blocking policies for all sensitive tables

-- Block all anonymous access to teacher applications
CREATE POLICY "teacher_apps_block_anonymous" ON public.teacher_applications 
FOR ALL TO anon 
USING (false) 
WITH CHECK (false);

-- Block all anonymous access to challengers
CREATE POLICY "challengers_block_anonymous" ON public.challengers 
FOR ALL TO anon 
USING (false) 
WITH CHECK (false);

-- Block all anonymous access to parental consents  
CREATE POLICY "parental_consents_block_anonymous" ON public.parental_consents 
FOR ALL TO anon 
USING (false) 
WITH CHECK (false);

-- Block all anonymous access to safeguarding reports
CREATE POLICY "safeguarding_block_anonymous" ON public.safeguarding_reports 
FOR ALL TO anon 
USING (false) 
WITH CHECK (false);

-- Clean up duplicate confidential records policies and create minimal set
DROP POLICY IF EXISTS "Confidential records: admins only can delete" ON public.confidential_records;
DROP POLICY IF EXISTS "Confidential records: admins only can insert" ON public.confidential_records;
DROP POLICY IF EXISTS "Confidential records: admins only can update" ON public.confidential_records;
DROP POLICY IF EXISTS "Confidential records: admins only with enhanced verification" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_sec_v1_admin_delete" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_sec_v1_admin_insert" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_sec_v1_admin_select" ON public.confidential_records;
DROP POLICY IF EXISTS "cr_sec_v1_admin_update" ON public.confidential_records;

-- Create minimal confidential records policies
CREATE POLICY "confidential_records_admin_only" ON public.confidential_records 
FOR ALL TO authenticated 
USING (get_current_user_role() = 'admin') 
WITH CHECK (get_current_user_role() = 'admin');
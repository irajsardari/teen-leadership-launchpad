-- CRITICAL SECURITY FIX: Maximum Child Safety Protection for Safeguarding Reports
-- Implement bulletproof security for child protection data

-- Ensure RLS is enabled on safeguarding_reports
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to rebuild with maximum security
DO $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'safeguarding_reports'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.safeguarding_reports', policy_name);
    END LOOP;
END $$;

-- RESTRICTIVE POLICIES (These must ALL be satisfied - maximum security)

-- Block ALL anonymous access completely - zero tolerance
CREATE POLICY "safeguarding_block_all_anonymous"
ON public.safeguarding_reports
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block authenticated users without proper authorization - child safety priority
CREATE POLICY "safeguarding_block_unauthorized_users"
ON public.safeguarding_reports
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
    -- Only allow admins OR users with active safeguarding permissions
    (get_current_user_role() = 'admin'::text) OR 
    has_safeguarding_access(auth.uid())
);

-- Block unauthorized modifications to protect data integrity
CREATE POLICY "safeguarding_block_unauthorized_modifications"
ON public.safeguarding_reports
AS RESTRICTIVE
FOR ALL
TO authenticated
WITH CHECK (
    -- Only allow admins OR users with active safeguarding permissions
    (get_current_user_role() = 'admin'::text) OR 
    has_safeguarding_access(auth.uid())
);

-- PERMISSIVE POLICIES (Grant specific access - but still subject to restrictive policies)

-- Authorized personnel can read safeguarding reports
CREATE POLICY "safeguarding_authorized_read"
ON public.safeguarding_reports
FOR SELECT
TO authenticated
USING (
    (get_current_user_role() = 'admin'::text) OR 
    has_safeguarding_access(auth.uid())
);

-- Only admins can delete safeguarding reports (permanent record keeping)
CREATE POLICY "safeguarding_admin_delete_only"
ON public.safeguarding_reports
FOR DELETE
TO authenticated
USING (get_current_user_role() = 'admin'::text);

-- Authorized personnel can update reports (for case management)
CREATE POLICY "safeguarding_authorized_update"
ON public.safeguarding_reports
FOR UPDATE
TO authenticated
USING (
    (get_current_user_role() = 'admin'::text) OR 
    has_safeguarding_access(auth.uid())
)
WITH CHECK (
    (get_current_user_role() = 'admin'::text) OR 
    has_safeguarding_access(auth.uid())
);

-- Anyone authenticated can submit reports (report submission should be open)
CREATE POLICY "safeguarding_allow_report_submission"
ON public.safeguarding_reports
FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- Additional security: Ensure reporter_id is always set
ALTER TABLE public.safeguarding_reports 
DROP CONSTRAINT IF EXISTS safeguarding_reports_reporter_required;

ALTER TABLE public.safeguarding_reports 
ADD CONSTRAINT safeguarding_reports_reporter_required 
CHECK (reporter_id IS NOT NULL);
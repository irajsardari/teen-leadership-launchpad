-- Fix security vulnerability in parental_consents table - Phase 2
-- Use CASCADE to ensure policies are properly dropped

-- Drop ALL existing policies for parental_consents table with CASCADE
DROP POLICY IF EXISTS "parental_consents_block_anonymous_access" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_authenticated_users_only" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_parents_view_own" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_parents_insert_own" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_parents_update_own" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_admin_delete_only" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_admin_view_all" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parental_consents_admin_update_all" ON public.parental_consents CASCADE;

-- Also drop any remaining old policies
DROP POLICY IF EXISTS "admins_view_all_consents" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "block_anon_parental_consents" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "block_child_direct_access" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "parents_view_own_consents" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "secure_parental_consents_delete" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "secure_parental_consents_insert" ON public.parental_consents CASCADE;
DROP POLICY IF EXISTS "secure_parental_consents_update" ON public.parental_consents CASCADE;

-- Now create the new secure policies with unique names

-- 1. Completely block all anonymous access
CREATE POLICY "pc_deny_anonymous_all_access"
ON public.parental_consents
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 2. Parents can view only their own consent records
CREATE POLICY "pc_parent_view_own_only"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
);

-- 3. Parents can insert only their own consent records
CREATE POLICY "pc_parent_insert_own_only"
ON public.parental_consents
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
);

-- 4. Parents can update only their own consent records
CREATE POLICY "pc_parent_update_own_only"
ON public.parental_consents
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
);

-- 5. Administrators can view all consent records (for safeguarding)
CREATE POLICY "pc_admin_view_all_safeguarding"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 6. Administrators can update consent records (for data correction)
CREATE POLICY "pc_admin_update_all_correction"
ON public.parental_consents
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 7. Only administrators can delete consent records
CREATE POLICY "pc_admin_delete_only"
ON public.parental_consents
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);
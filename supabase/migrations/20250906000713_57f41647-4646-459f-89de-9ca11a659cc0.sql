-- Fix security vulnerability in parental_consents table
-- Replace existing policies with more secure, clearly defined ones

-- First, drop all existing policies for parental_consents
DROP POLICY IF EXISTS "admins_view_all_consents" ON public.parental_consents;
DROP POLICY IF EXISTS "block_anon_parental_consents" ON public.parental_consents;
DROP POLICY IF EXISTS "block_child_direct_access" ON public.parental_consents;
DROP POLICY IF EXISTS "parents_view_own_consents" ON public.parental_consents;
DROP POLICY IF EXISTS "secure_parental_consents_delete" ON public.parental_consents;
DROP POLICY IF EXISTS "secure_parental_consents_insert" ON public.parental_consents;
DROP POLICY IF EXISTS "secure_parental_consents_update" ON public.parental_consents;

-- Create new, more secure policies

-- 1. Completely block all anonymous access
CREATE POLICY "parental_consents_block_anonymous_access"
ON public.parental_consents
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 2. Allow only authenticated users with proper authorization
CREATE POLICY "parental_consents_authenticated_users_only"
ON public.parental_consents
FOR ALL
TO authenticated
USING (false)  -- Default deny, specific policies below will grant access
WITH CHECK (false);

-- 3. Parents can view their own consent records only
CREATE POLICY "parental_consents_parents_view_own"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
);

-- 4. Parents can insert their own consent records only
CREATE POLICY "parental_consents_parents_insert_own"
ON public.parental_consents
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND parent_user_id = auth.uid()
);

-- 5. Parents can update their own consent records only
CREATE POLICY "parental_consents_parents_update_own"
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

-- 6. Only administrators can delete consent records
CREATE POLICY "parental_consents_admin_delete_only"
ON public.parental_consents
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 7. Administrators can view all consent records (for safeguarding purposes)
CREATE POLICY "parental_consents_admin_view_all"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND get_current_user_role() = 'admin'
);

-- 8. Administrators can update consent records (for data correction purposes)
CREATE POLICY "parental_consents_admin_update_all"
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

-- Add additional security constraint: Ensure parent_user_id is never null for data integrity
-- This prevents orphaned consent records
ALTER TABLE public.parental_consents 
ALTER COLUMN parent_user_id SET NOT NULL;

-- Add check constraint to ensure consent records have valid relationships
ALTER TABLE public.parental_consents 
ADD CONSTRAINT parental_consents_valid_relationship 
CHECK (relationship IN ('parent', 'guardian', 'legal_guardian', 'foster_parent', 'step_parent'));

-- Create index for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_parental_consents_parent_user_id 
ON public.parental_consents(parent_user_id);

CREATE INDEX IF NOT EXISTS idx_parental_consents_child_user_id 
ON public.parental_consents(child_user_id);

-- Add comment documenting the security model
COMMENT ON TABLE public.parental_consents IS 
'Contains sensitive family data including parent names, emails, and digital signatures. Access is strictly controlled: only the parent who created a consent record can view/modify it, plus administrators for safeguarding purposes. Children cannot access parent personal information.';
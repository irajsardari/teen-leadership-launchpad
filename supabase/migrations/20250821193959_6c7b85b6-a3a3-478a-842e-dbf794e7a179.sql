-- Add parent_user_id column to track which parent submitted the consent
ALTER TABLE public.parental_consents 
ADD COLUMN IF NOT EXISTS parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop ALL existing policies for parental_consents
DROP POLICY IF EXISTS "Admins can manage all parental consents" ON public.parental_consents;
DROP POLICY IF EXISTS "Parents can manage consents for their children" ON public.parental_consents;
DROP POLICY IF EXISTS "Parents can manage their own submitted consents" ON public.parental_consents;
DROP POLICY IF EXISTS "Parents can view consents they submitted" ON public.parental_consents;

-- Drop ALL existing policies for consent_permissions
DROP POLICY IF EXISTS "Admins can manage all consent permissions" ON public.consent_permissions;
DROP POLICY IF EXISTS "Users can view consent permissions" ON public.consent_permissions;
DROP POLICY IF EXISTS "Parents can view permissions for their consents" ON public.consent_permissions;

-- Create secure RLS policies for parental_consents
CREATE POLICY "pc_admin_all_access" 
ON public.parental_consents 
FOR ALL 
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "pc_parent_own_access" 
ON public.parental_consents 
FOR ALL 
USING (auth.uid() IS NOT NULL AND parent_user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND parent_user_id = auth.uid());

-- Create secure RLS policies for consent_permissions
CREATE POLICY "cp_admin_all_access" 
ON public.consent_permissions 
FOR ALL 
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "cp_parent_view_own" 
ON public.consent_permissions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.parental_consents pc 
    WHERE pc.id = consent_permissions.consent_id 
    AND pc.parent_user_id = auth.uid()
  )
);
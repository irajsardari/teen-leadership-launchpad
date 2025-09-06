-- Complete security improvements for parental_consents table
-- Add data integrity constraints and performance optimizations

-- Ensure parent_user_id is never null for data integrity
-- This prevents orphaned consent records
ALTER TABLE public.parental_consents 
ALTER COLUMN parent_user_id SET NOT NULL;

-- Add check constraint to ensure consent records have valid relationships
ALTER TABLE public.parental_consents 
ADD CONSTRAINT IF NOT EXISTS parental_consents_valid_relationship 
CHECK (relationship IN ('parent', 'guardian', 'legal_guardian', 'foster_parent', 'step_parent'));

-- Add constraint to ensure child_user_id and parent_user_id are different
-- This prevents self-consent scenarios
ALTER TABLE public.parental_consents 
ADD CONSTRAINT IF NOT EXISTS parental_consents_different_users 
CHECK (child_user_id != parent_user_id);

-- Add constraint to ensure valid email format for parent_guardian_email
ALTER TABLE public.parental_consents 
ADD CONSTRAINT IF NOT EXISTS parental_consents_valid_email 
CHECK (parent_guardian_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create unique constraint to prevent duplicate consents for same child-parent pair
ALTER TABLE public.parental_consents 
ADD CONSTRAINT IF NOT EXISTS parental_consents_unique_child_parent 
UNIQUE (child_user_id, parent_user_id);

-- Create performance indexes for security queries
CREATE INDEX IF NOT EXISTS idx_parental_consents_parent_user_id 
ON public.parental_consents(parent_user_id);

CREATE INDEX IF NOT EXISTS idx_parental_consents_child_user_id 
ON public.parental_consents(child_user_id);

CREATE INDEX IF NOT EXISTS idx_parental_consents_created_at 
ON public.parental_consents(created_at);

-- Add table comment documenting the security model
COMMENT ON TABLE public.parental_consents IS 
'SECURITY CRITICAL: Contains sensitive family data including parent names, emails, and digital signatures. Access strictly controlled - only the parent who created a consent record can view/modify it, plus administrators for safeguarding purposes. Children cannot access parent personal information. All access is logged for audit purposes.';

-- Add column comments for sensitive fields
COMMENT ON COLUMN public.parental_consents.parent_guardian_name IS 'PII: Parent/guardian full name - restricted access';
COMMENT ON COLUMN public.parental_consents.parent_guardian_email IS 'PII: Parent/guardian email - restricted access';
COMMENT ON COLUMN public.parental_consents.digital_signature IS 'PII: Digital signature - highly restricted access';
COMMENT ON COLUMN public.parental_consents.parent_user_id IS 'Security key: Must match auth.uid() for parent access';
COMMENT ON COLUMN public.parental_consents.child_user_id IS 'Reference: Child user - no direct access to parent data allowed';
-- Restrict public access to resource_taxonomy and require authentication
-- Ensure RLS is enabled and enforced (safe if already enabled)
ALTER TABLE public.resource_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_taxonomy FORCE ROW LEVEL SECURITY;

-- Replace public read policy with authenticated-only read
DROP POLICY IF EXISTS "Anyone can view resource taxonomy" ON public.resource_taxonomy;

CREATE POLICY "Authenticated users can view resource taxonomy"
ON public.resource_taxonomy
FOR SELECT
TO authenticated
USING (true);

-- Keep existing admin management policy untouched

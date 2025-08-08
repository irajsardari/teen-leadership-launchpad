-- Fix linter: enable RLS on resource_taxonomy and add policies
DO $$ BEGIN
  ALTER TABLE public.resource_taxonomy ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view resource taxonomy"
  ON public.resource_taxonomy FOR SELECT
  USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins manage taxonomy"
  ON public.resource_taxonomy FOR ALL
  USING (public.get_current_user_role() = 'admin')
  WITH CHECK (public.get_current_user_role() = 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
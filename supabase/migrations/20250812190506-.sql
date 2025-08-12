-- Hardening access to confidential_records
-- Ensure RLS is enabled and enforced
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confidential_records FORCE ROW LEVEL SECURITY;

-- Revoke any direct SQL privileges from anon/authenticated (rely strictly on RLS)
REVOKE ALL ON TABLE public.confidential_records FROM anon;
REVOKE ALL ON TABLE public.confidential_records FROM authenticated;

-- Verify existing admin-only policies remain; do not duplicate.
-- No further changes to policies are made here.

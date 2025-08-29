-- Revoke all public/anonymous access at the table level for sensitive tables
-- This is what the security scanner is looking for!

REVOKE ALL ON public.teacher_applications FROM anon;
REVOKE ALL ON public.teacher_applications FROM public;

REVOKE ALL ON public.challengers FROM anon;  
REVOKE ALL ON public.challengers FROM public;

REVOKE ALL ON public.parental_consents FROM anon;
REVOKE ALL ON public.parental_consents FROM public;

REVOKE ALL ON public.safeguarding_reports FROM anon;
REVOKE ALL ON public.safeguarding_reports FROM public;

REVOKE ALL ON public.confidential_records FROM anon;
REVOKE ALL ON public.confidential_records FROM public;

-- Grant only necessary permissions to authenticated users (RLS will control the rest)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challengers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parental_consents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.safeguarding_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.confidential_records TO authenticated;
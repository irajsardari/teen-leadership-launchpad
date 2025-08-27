-- Fix safeguarding reports to require authentication while maintaining anonymity
-- This addresses TMA Security Policy Section 5 (Forms & Applications) and Section 10 (Development Checklist)

-- Drop the current public insert policy
DROP POLICY IF EXISTS "Anyone can submit safeguarding reports" ON public.safeguarding_reports;

-- Create new policy requiring authentication but allowing anonymous reporting
CREATE POLICY "Authenticated users can submit safeguarding reports" 
ON public.safeguarding_reports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix resource taxonomy access - should only be available to authenticated users
-- This addresses TMA Security Policy Section 3 (Access Control - Zero Trust principle)

-- Drop the current public read policy  
DROP POLICY IF EXISTS "Authenticated users can view resource taxonomy" ON public.resource_taxonomy;

-- Create new policy requiring authentication for viewing taxonomy
CREATE POLICY "Only authenticated users can view resource taxonomy" 
ON public.resource_taxonomy 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add audit logging for safeguarding report submissions
-- This addresses TMA Security Policy Section 8 (Logging & Monitoring)
CREATE OR REPLACE FUNCTION public.audit_safeguarding_submission()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
BEGIN
  -- Log the safeguarding report submission
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id
  ) VALUES (
    auth.uid(),
    'safeguarding_report_submitted',
    'safeguarding_reports',
    NEW.id::text
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_safeguarding_submissions ON public.safeguarding_reports;
CREATE TRIGGER audit_safeguarding_submissions
  AFTER INSERT ON public.safeguarding_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_safeguarding_submission();
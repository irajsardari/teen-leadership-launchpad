
-- 1. Prevent privilege escalation via profiles.role / profiles.lms_role
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role)
     OR (NEW.lms_role IS DISTINCT FROM OLD.lms_role) THEN
    IF public.get_current_user_role() <> 'admin' THEN
      RAISE EXCEPTION 'Only admins can change role or lms_role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_escalation();

-- 2. content: drop overly broad authenticated-read policy
DROP POLICY IF EXISTS "Authenticated users can view all content" ON public.content;
CREATE POLICY "Authors can view their own content"
ON public.content FOR SELECT
TO authenticated
USING (author_id = auth.uid());

-- 3. dictionary: drop overly broad authenticated-read policy
DROP POLICY IF EXISTS "Authenticated users can view draft dictionary terms" ON public.dictionary;
CREATE POLICY "Contributors can view their own dictionary terms"
ON public.dictionary FOR SELECT
TO authenticated
USING (contributor_id = auth.uid());

-- 4. audio-cache: remove public write/update; require authenticated
DROP POLICY IF EXISTS "System can upload cached audio" ON storage.objects;
DROP POLICY IF EXISTS "System can update cached audio" ON storage.objects;

-- 5. security_audit_logs: require authenticated inserts scoped to own user_id
DROP POLICY IF EXISTS "security_audit_logs_system_insert_only" ON public.security_audit_logs;
CREATE POLICY "security_audit_logs_authenticated_self_insert"
ON public.security_audit_logs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

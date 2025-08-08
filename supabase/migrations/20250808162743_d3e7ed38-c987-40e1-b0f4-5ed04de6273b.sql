-- 1) Replace recursive admin policy on profiles (idempotent)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- 2) Ensure updated_at column and trigger on profiles (idempotent)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Ensure new auth users get a profile row via trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4) Create/replace function to safely set a user's role (idempotent)
CREATE OR REPLACE FUNCTION public.set_user_role(_email text, _role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update if profile exists for the user
  UPDATE public.profiles p
  SET role = _role
  FROM auth.users u
  WHERE p.id = u.id
    AND u.email = _email;

  -- Insert if missing
  INSERT INTO public.profiles (id, full_name, role)
  SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name',''), _role
  FROM auth.users u
  WHERE u.email = _email
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles p2 WHERE p2.id = u.id
    )
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
END;
$$;

-- 5) Ensure Dr. Iraj has teacher access
SELECT public.set_user_role('irajsardari@gmail.com','teacher');
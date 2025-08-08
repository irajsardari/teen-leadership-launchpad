-- Promote user to admin by email
DO $$
DECLARE v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'irajsardari@gmail.com';
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found with email %', 'irajsardari@gmail.com';
  END IF;

  -- Ensure a profile exists and set role to admin
  INSERT INTO public.profiles (id, role, full_name)
  SELECT u.id, 'admin', COALESCE(u.raw_user_meta_data->>'full_name', '')
  FROM auth.users u
  WHERE u.id = v_user_id
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;
-- Set admin role for irajsardari@yahoo.com
INSERT INTO public.profiles (id, full_name, role)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', ''), 'admin'
FROM auth.users u
WHERE u.email = 'irajsardari@yahoo.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  )
ON CONFLICT (id) DO UPDATE SET role = 'admin';
-- PHASE 1: Auth & Roles - Fix enum conversion and implement security
-- Create user_role enum for consistency
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Update profiles table - handle default value properly
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'challenger';

-- Convert existing data and change column type
UPDATE public.profiles SET role = 'challenger' WHERE role IS NULL OR role = '';
UPDATE public.profiles SET role = 'admin' WHERE role = 'admin';
UPDATE public.profiles SET role = 'mentor' WHERE role = 'teacher'; -- Convert teacher to mentor

-- Now change the column type
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.user_role USING 
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.user_role
    WHEN role = 'teacher' THEN 'mentor'::public.user_role
    ELSE 'challenger'::public.user_role
  END;

-- Set the default to the enum value
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'challenger'::public.user_role;

-- Add foreign key constraint to auth.users if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fk' AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles
          ADD CONSTRAINT profiles_id_fk
          FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Log this security update
SELECT public.log_sensitive_operation(
  'user_role_enum_created_and_applied',
  'data_protection',
  'phase_1_auth_roles'
);
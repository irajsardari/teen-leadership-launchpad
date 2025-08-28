-- PHASE 1 & 2: Comprehensive Security Implementation - Safe approach

-- Create user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Create a new column with the enum type, populate it, then switch
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_new public.user_role;

-- Populate the new column based on existing values
UPDATE public.profiles 
SET role_new = CASE 
  WHEN role = 'admin' THEN 'admin'::public.user_role
  WHEN role = 'teacher' THEN 'mentor'::public.user_role
  ELSE 'challenger'::public.user_role
END;

-- Make the new column not null with default
ALTER TABLE public.profiles ALTER COLUMN role_new SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_new SET DEFAULT 'challenger'::public.user_role;

-- Drop old column and rename new one
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
ALTER TABLE public.profiles RENAME COLUMN role_new TO role;

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

-- PHASE 2: Implement comprehensive RLS policies

-- 2.1 PROFILES - Secure policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing profile policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create secure profile policies
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_update_own_profile"  
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_insert_own_profile"
  ON public.profiles FOR INSERT
  TO authenticated  
  WITH CHECK (id = auth.uid());

CREATE POLICY "admins_all_profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log the security implementation
SELECT public.log_sensitive_operation(
  'phase_1_2_security_implemented',
  'data_protection', 
  'profiles_secured_with_enum'
);
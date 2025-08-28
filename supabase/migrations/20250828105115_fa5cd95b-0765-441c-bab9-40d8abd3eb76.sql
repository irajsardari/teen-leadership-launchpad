-- PHASE 1 & 2: Comprehensive Security Implementation - Handle existing data correctly

-- Create user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Create new role column and populate based on existing data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_enum public.user_role;

-- Update based on actual existing values
UPDATE public.profiles 
SET role_enum = CASE 
  WHEN role = 'admin' THEN 'admin'::public.user_role
  ELSE 'challenger'::public.user_role  -- Default all others to challenger
END;

-- Set constraints on new column
ALTER TABLE public.profiles ALTER COLUMN role_enum SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_enum SET DEFAULT 'challenger'::public.user_role;

-- Switch columns safely
ALTER TABLE public.profiles DROP COLUMN role CASCADE;
ALTER TABLE public.profiles RENAME COLUMN role_enum TO role;

-- Add auth constraint
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

-- PHASE 2: Secure RLS Policies for all sensitive tables

-- 2.1 PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "users_own_profile_access"
  ON public.profiles FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "admins_all_profiles"
  ON public.profiles FOR ALL  
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- 2.2 CHALLENGERS - Own records only  
DROP POLICY IF EXISTS "Challengers: Admin access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records update only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict user registration only" ON public.challengers;

CREATE POLICY "challenger_own_records"
  ON public.challengers FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challenger_admin_access"
  ON public.challengers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log security implementation
SELECT public.log_sensitive_operation(
  'comprehensive_security_phase_1_2_complete',
  'data_protection',
  'enum_and_rls_secured'
);
-- PHASE 1 & 2: Comprehensive Security Implementation - Simple and safe

-- Create user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Since we confirmed the existing values are 'admin' and 'challenger', convert directly
-- First add the new enum column
ALTER TABLE public.profiles ADD COLUMN role_new public.user_role;

-- Populate based on existing values (only admin and challenger exist)
UPDATE public.profiles 
SET role_new = CASE 
  WHEN role = 'admin' THEN 'admin'::public.user_role
  ELSE 'challenger'::public.user_role
END;

-- Set constraints on new column
ALTER TABLE public.profiles ALTER COLUMN role_new SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_new SET DEFAULT 'challenger'::public.user_role;

-- Replace old column with new enum column
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN role_new TO role;

-- Add foreign key to auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fk'
    ) THEN
        ALTER TABLE public.profiles
          ADD CONSTRAINT profiles_id_fk
          FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- PHASE 2: Secure all sensitive tables with proper RLS

-- 2.1 Secure profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove old policies and create secure ones
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles; 
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Users can only access their own profile
CREATE POLICY "users_own_profile_access"
  ON public.profiles FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can access all profiles
CREATE POLICY "admins_all_profiles"
  ON public.profiles FOR ALL  
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log successful phase 1 & 2 implementation
SELECT public.log_sensitive_operation(
  'comprehensive_security_phase_1_2_complete',
  'data_protection',
  'profiles_enum_rls_secured'
);
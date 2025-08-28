-- PHASE 1 & 2: Comprehensive Security - Handle dependencies properly

-- Create user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Drop all policies that depend on the role column first
DROP POLICY IF EXISTS "admins_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "challenger_admin_access" ON public.challengers;
DROP POLICY IF EXISTS "challenger_admin_all" ON public.challengers;

-- Now we can safely modify the role column
ALTER TABLE public.profiles ADD COLUMN role_new public.user_role;

-- Populate new column based on existing values
UPDATE public.profiles 
SET role_new = CASE 
  WHEN role = 'admin' THEN 'admin'::public.user_role
  ELSE 'challenger'::public.user_role  
END;

-- Set constraints
ALTER TABLE public.profiles ALTER COLUMN role_new SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_new SET DEFAULT 'challenger'::public.user_role;

-- Drop old column and rename new one
ALTER TABLE public.profiles DROP COLUMN role CASCADE;
ALTER TABLE public.profiles RENAME COLUMN role_new TO role;

-- Add foreign key constraint to auth.users
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

-- Now recreate all RLS policies with proper security

-- PROFILES: Secure user access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any remaining old policies
DROP POLICY IF EXISTS "users_own_profile_access" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure profile policies
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

-- CHALLENGERS: Secure application access  
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Drop existing challenger policies and create secure ones
DROP POLICY IF EXISTS "challenger_self_insert" ON public.challengers;
DROP POLICY IF EXISTS "challenger_read_own" ON public.challengers; 
DROP POLICY IF EXISTS "challenger_update_own" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Admin access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records update only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict user registration only" ON public.challengers;

CREATE POLICY "challenger_own_records"
  ON public.challengers FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challenger_admin_all"
  ON public.challengers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log successful security implementation
SELECT public.log_sensitive_operation(
  'comprehensive_rls_security_implemented',
  'data_protection',
  'phase_1_2_complete_with_enum'
);
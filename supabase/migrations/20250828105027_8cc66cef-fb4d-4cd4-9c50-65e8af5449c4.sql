-- PHASE 1 & 2: Comprehensive Security - Handle dependencies properly

-- Create user_role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Add new enum column alongside existing text column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role_enum public.user_role;

-- Populate the enum column based on existing text values
UPDATE public.profiles 
SET role_enum = CASE 
  WHEN role = 'admin' THEN 'admin'::public.user_role
  ELSE 'challenger'::public.user_role
END;

-- Set the enum column as not null with default
ALTER TABLE public.profiles ALTER COLUMN role_enum SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_enum SET DEFAULT 'challenger'::public.user_role;

-- Update the get_current_user_role function to use the new enum column
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(role_enum::text, 'challenger') FROM public.profiles WHERE id = auth.uid();
$$;

-- Now we can safely drop the old text column since the function uses role_enum
ALTER TABLE public.profiles DROP COLUMN role;

-- Rename the enum column to role
ALTER TABLE public.profiles RENAME COLUMN role_enum TO role;

-- Add foreign key constraint
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

-- PHASE 2: Secure profiles with proper RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create secure restrictive policies
CREATE POLICY "users_own_profile_only"
  ON public.profiles FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "admins_all_profiles_access"
  ON public.profiles FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log the successful security implementation
SELECT public.log_sensitive_operation(
  'phase_1_2_security_with_enum_complete',
  'data_protection',
  'profiles_secured_dependencies_handled'
);
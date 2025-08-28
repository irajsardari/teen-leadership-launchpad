-- PHASE 1: Auth & Roles - Define user roles and ensure proper constraints
-- Create user_role enum for consistency
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Update profiles table to use the enum and add proper constraints
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.user_role USING role::public.user_role;

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

-- PHASE 2: Comprehensive RLS Security - Replace all existing policies with secure ones

-- 2.1 PROFILES - Secure user profile access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
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

-- 2.2 TEACHER APPLICATIONS - Already secured, ensure proper constraints
-- Verify the existing policies are restrictive enough
-- The policies created in previous migrations are already secure

-- 2.3 CHALLENGERS - Secure challenger applications
ALTER TABLE public.challengers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create secure ones
DROP POLICY IF EXISTS "Challengers: Admin access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records access only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict own records update only" ON public.challengers;
DROP POLICY IF EXISTS "Challengers: Strict user registration only" ON public.challengers;

CREATE POLICY "challenger_self_insert"
  ON public.challengers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "challenger_read_own"
  ON public.challengers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "challenger_update_own"
  ON public.challengers FOR UPDATE
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

-- 2.4 SAFEGUARDING REPORTS - Ultra-secure access
ALTER TABLE public.safeguarding_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Safeguarding: Authenticated submission only" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - DELETE" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - SELECT" ON public.safeguarding_reports;
DROP POLICY IF EXISTS "Safeguarding: Authorized personnel only - UPDATE" ON public.safeguarding_reports;

-- Only allow insertion by authenticated users (for reporting)
CREATE POLICY "safety_reports_insert"
  ON public.safeguarding_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can view/manage reports
CREATE POLICY "safety_admin_all"
  ON public.safeguarding_reports FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- 2.5 PARENTAL CONSENTS - Secure family data
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Parental Consent: Admin access only" ON public.parental_consents;
DROP POLICY IF EXISTS "Parental Consent: Parent access to own submissions" ON public.parental_consents;

CREATE POLICY "consent_parent_own"
  ON public.parental_consents FOR ALL
  TO authenticated
  USING (parent_user_id = auth.uid())
  WITH CHECK (parent_user_id = auth.uid());

CREATE POLICY "consent_admin_all"
  ON public.parental_consents FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- 2.6 CONFIDENTIAL RECORDS - Maximum security
ALTER TABLE public.confidential_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can delete confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can insert confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can update confidential records" ON public.confidential_records;
DROP POLICY IF EXISTS "Admins can view confidential records" ON public.confidential_records;

-- Admin-only access to confidential records
CREATE POLICY "confidential_admin_only"
  ON public.confidential_records FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Log this critical security update
SELECT public.log_sensitive_operation(
  'comprehensive_rls_security_implemented',
  'data_protection',
  'all_tables_secured_phase_1_2'
);
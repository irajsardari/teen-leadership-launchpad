-- SECURITY FIX: Remove Public Role Policies (Simple Version)
-- Fix the main security issue: public role policies on sensitive tables

-- Step 1: Clean profiles table policies and recreate securely
DO $$
DECLARE
    policy_name text;
BEGIN
    -- Drop all profiles policies
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_name);
    END LOOP;
END $$;

-- Create secure profiles policies (authenticated-only)
CREATE POLICY "profiles_final_anon_deny"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "profiles_final_admin"
ON public.profiles
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "profiles_final_self"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 2: Fix teacher applications admin policy (was public role)
DROP POLICY IF EXISTS "teacher_applications_admin" ON public.teacher_applications;
CREATE POLICY "teacher_applications_admin_secure"
ON public.teacher_applications
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Step 3: Fix challengers admin policy (was public role)  
DROP POLICY IF EXISTS "challengers_admin_access" ON public.challengers;
CREATE POLICY "challengers_admin_secure"
ON public.challengers
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Step 4: Fix parental consents admin policy (was public role)
DROP POLICY IF EXISTS "parental_consents_admin" ON public.parental_consents;
CREATE POLICY "parental_consents_admin_secure"
ON public.parental_consents
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');
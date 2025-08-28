-- PHASE 1 & 2: Comprehensive Security Implementation
-- Fix the role column type issue first

-- Create user_role enum for consistency
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'mentor', 'challenger');
    END IF;
END $$;

-- Fix the role column by removing default, changing type, then adding default back
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN role TYPE public.user_role USING role::public.user_role;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'challenger'::public.user_role;

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

-- PHASE 3: Storage Security - Create secure file storage policies
-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('cv', 'cv', false),
  ('student_docs', 'student_docs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop existing storage policies to start fresh
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

-- Secure storage policies - users can only access files in their own folder
CREATE POLICY "upload_own_files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('cv', 'student_docs', 'teacher-documents') AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "read_own_files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id IN ('cv', 'student_docs', 'teacher-documents') AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "admin_read_all_files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "admin_manage_all_files"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Log this security implementation
SELECT public.log_sensitive_operation(
  'phase_1_3_security_implemented',
  'data_protection',
  'roles_rls_storage_secured'
);
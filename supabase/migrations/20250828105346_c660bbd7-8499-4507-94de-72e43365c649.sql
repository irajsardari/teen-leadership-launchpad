-- PHASE 3: File Storage Security - Secure file access with private buckets and proper policies

-- Ensure storage buckets exist and are private
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('teacher-cvs', 'teacher-cvs', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('student-documents', 'student-documents', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create secure storage policies - users can only access their own files

-- Drop existing storage policies to create fresh secure ones
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can access all documents" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

-- Secure file upload policies - users can only upload to their own folder
CREATE POLICY "secure_upload_own_files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('teacher-cvs', 'student-documents') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Secure file read policies - users can only read their own files
CREATE POLICY "secure_read_own_files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id IN ('teacher-cvs', 'student-documents') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Secure file update policies - users can only update their own files  
CREATE POLICY "secure_update_own_files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('teacher-cvs', 'student-documents') AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id IN ('teacher-cvs', 'student-documents') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Secure file delete policies - users can only delete their own files
CREATE POLICY "secure_delete_own_files"
  ON storage.objects FOR DELETE  
  TO authenticated
  USING (
    bucket_id IN ('teacher-cvs', 'student-documents') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin access to all files for management
CREATE POLICY "admin_full_file_access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'  
  ));

-- PHASE 7: Platform Security - Create audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL, 
  resource_id text,
  details jsonb,
  ip_address inet DEFAULT inet_client_addr(),
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can access audit logs
CREATE POLICY "admin_audit_log_admin_only"
  ON public.admin_audit_log FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_resource_type text,
  p_resource_id text DEFAULT NULL,
  p_details jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id, action, resource_type, resource_id, details
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id, p_details
  );
END;
$$;

-- Log this security implementation
SELECT public.log_sensitive_operation(
  'phase_3_7_security_implemented',
  'data_protection',
  'file_storage_and_audit_secured'
);
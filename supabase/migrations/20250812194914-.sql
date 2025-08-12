-- Idempotent security hardening migration

-- 1) Create non-public assignments bucket
insert into storage.buckets (id, name, public)
values ('assignments', 'assignments', false)
on conflict (id) do nothing;

-- 2) Storage policies (assignments)
-- Students can read their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Students can read own assignment files'
  ) THEN
    CREATE POLICY "Students can read own assignment files"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'assignments'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Students can upload their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Students can upload own assignment files'
  ) THEN
    CREATE POLICY "Students can upload own assignment files"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'assignments'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Students can update their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Students can update own assignment files'
  ) THEN
    CREATE POLICY "Students can update own assignment files"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'assignments'
      AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'assignments'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Students can delete their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Students can delete own assignment files'
  ) THEN
    CREATE POLICY "Students can delete own assignment files"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'assignments'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- Admins can manage all assignment files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins manage all assignment files'
  ) THEN
    CREATE POLICY "Admins manage all assignment files"
    ON storage.objects
    FOR ALL
    USING (
      bucket_id = 'assignments' AND public.get_current_user_role() = 'admin'
    )
    WITH CHECK (
      bucket_id = 'assignments' AND public.get_current_user_role() = 'admin'
    );
  END IF;
END$$;

-- 3) Storage policies (teacher-documents)
-- Admins manage all files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins manage all teacher documents'
  ) THEN
    CREATE POLICY "Admins manage all teacher documents"
    ON storage.objects
    FOR ALL
    USING (
      bucket_id = 'teacher-documents' AND public.get_current_user_role() = 'admin'
    )
    WITH CHECK (
      bucket_id = 'teacher-documents' AND public.get_current_user_role() = 'admin'
    );
  END IF;
END$$;

-- Owners read/upload/update/delete their own files (path prefix: <uid>/...)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners read own teacher documents'
  ) THEN
    CREATE POLICY "Owners read own teacher documents"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners upload teacher documents'
  ) THEN
    CREATE POLICY "Owners upload teacher documents"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners update teacher documents'
  ) THEN
    CREATE POLICY "Owners update teacher documents"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Owners delete teacher documents'
  ) THEN
    CREATE POLICY "Owners delete teacher documents"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'teacher-documents' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END$$;

-- 4) Progress notes: allow students to view their own
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'progress_notes' AND policyname = 'Students view their own progress notes'
  ) THEN
    CREATE POLICY "Students view their own progress notes"
    ON public.progress_notes
    FOR SELECT
    USING (student_id = auth.uid());
  END IF;
END$$;

-- 5) Triggers
-- teacher_applications: set user_id on insert
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_teacher_application_user_id') THEN
    CREATE TRIGGER set_teacher_application_user_id
    BEFORE INSERT ON public.teacher_applications
    FOR EACH ROW EXECUTE FUNCTION public.set_teacher_application_user_id();
  END IF;
END$$;

-- teacher_applications: auto update updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_teacher_applications_updated_at') THEN
    CREATE TRIGGER update_teacher_applications_updated_at
    BEFORE UPDATE ON public.teacher_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- challengers: validation on write
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validate_challenger_before_write') THEN
    CREATE TRIGGER validate_challenger_before_write
    BEFORE INSERT OR UPDATE ON public.challengers
    FOR EACH ROW EXECUTE FUNCTION public.validate_challenger();
  END IF;
END$$;

-- progress_notes: enforce 24h update window
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_progress_notes_update_window') THEN
    CREATE TRIGGER enforce_progress_notes_update_window
    BEFORE UPDATE ON public.progress_notes
    FOR EACH ROW EXECUTE FUNCTION public.enforce_progress_notes_update_window();
  END IF;
END$$;
-- Phase 1: Teacher Portal schema, RLS, and storage policies

-- 1) Enums
DO $$ BEGIN
  CREATE TYPE public.attendance_status AS ENUM ('present','absent','late','excused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.resource_visibility AS ENUM ('private','shared','global');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.approval_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Tables
-- 2.A teaching_resources
CREATE TABLE IF NOT EXISTS public.teaching_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  level TEXT,
  type TEXT,
  owner_id UUID NOT NULL,
  approval_status public.approval_status NOT NULL DEFAULT 'pending',
  visibility public.resource_visibility NOT NULL DEFAULT 'private',
  storage_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teaching_resources ENABLE ROW LEVEL SECURITY;

-- 2.B resource_shares
CREATE TABLE IF NOT EXISTS public.resource_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.teaching_resources(id) ON DELETE CASCADE,
  from_teacher_id UUID NOT NULL,
  to_teacher_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(resource_id, to_teacher_id)
);

ALTER TABLE public.resource_shares ENABLE ROW LEVEL SECURITY;

-- 2.C attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  session_id UUID,
  status public.attendance_status NOT NULL,
  notes TEXT,
  recorded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, session_id)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 2.D progress_notes
CREATE TABLE IF NOT EXISTS public.progress_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_notes ENABLE ROW LEVEL SECURITY;

-- 2.E resource_access_logs (basic audit log)
CREATE TABLE IF NOT EXISTS public.resource_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.teaching_resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- e.g., 'upload','download'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_access_logs ENABLE ROW LEVEL SECURITY;

-- 3) Course sessions: per-session lesson plan
DO $$ BEGIN
  ALTER TABLE public.course_sessions ADD COLUMN lesson_plan TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 4) Updated_at triggers
DO $$ BEGIN
  CREATE TRIGGER update_teaching_resources_updated_at
  BEFORE UPDATE ON public.teaching_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_progress_notes_updated_at
  BEFORE UPDATE ON public.progress_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5) Time-based edit window for progress_notes (24h)
CREATE OR REPLACE FUNCTION public.enforce_progress_notes_update_window()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins bypass
  IF public.get_current_user_role() = 'admin' THEN
    RETURN NEW;
  END IF;

  -- Only author can update within 24 hours
  IF auth.uid() IS NULL OR NEW.teacher_id <> auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to update this note';
  END IF;

  IF now() > OLD.created_at + INTERVAL '24 hours' THEN
    RAISE EXCEPTION 'Editing window has expired (24h)';
  END IF;

  RETURN NEW;
END;
$$;

DO $$ BEGIN
  CREATE TRIGGER progress_notes_update_window
  BEFORE UPDATE ON public.progress_notes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_progress_notes_update_window();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6) RLS Policies
-- teaching_resources
CREATE POLICY IF NOT EXISTS "Admins manage all teaching resources"
ON public.teaching_resources FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY IF NOT EXISTS "Owners manage their resources"
ON public.teaching_resources FOR ALL
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY IF NOT EXISTS "Teachers view shared resources"
ON public.teaching_resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.resource_shares rs
    WHERE rs.resource_id = teaching_resources.id
      AND rs.to_teacher_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Teachers view global approved resources"
ON public.teaching_resources FOR SELECT
USING (
  visibility = 'global' AND approval_status = 'approved'
);

-- resource_shares
CREATE POLICY IF NOT EXISTS "Admins manage all resource_shares"
ON public.resource_shares FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY IF NOT EXISTS "Owners manage shares of their resources"
ON public.resource_shares FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.teaching_resources tr
    WHERE tr.id = resource_id AND tr.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teaching_resources tr
    WHERE tr.id = resource_id AND tr.owner_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Recipients can view shares"
ON public.resource_shares FOR SELECT
USING (to_teacher_id = auth.uid());

-- attendance
CREATE POLICY IF NOT EXISTS "Admins manage all attendance"
ON public.attendance FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY IF NOT EXISTS "Teachers manage attendance for their courses"
ON public.attendance FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = attendance.course_id AND c.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = attendance.course_id AND c.teacher_id = auth.uid()
  )
);

-- Allow students to view their own attendance records
CREATE POLICY IF NOT EXISTS "Students view their own attendance"
ON public.attendance FOR SELECT
USING (student_id = auth.uid());

-- progress_notes
CREATE POLICY IF NOT EXISTS "Admins manage all progress notes"
ON public.progress_notes FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY IF NOT EXISTS "Teachers manage own progress notes"
ON public.progress_notes FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- resource_access_logs
CREATE POLICY IF NOT EXISTS "Admins view all access logs"
ON public.resource_access_logs FOR SELECT
USING (public.get_current_user_role() = 'admin');

CREATE POLICY IF NOT EXISTS "Users insert own access logs"
ON public.resource_access_logs FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users view own access logs"
ON public.resource_access_logs FOR SELECT
USING (user_id = auth.uid());

-- 7) Resource taxonomy seeds
CREATE TABLE IF NOT EXISTS public.resource_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(category, value)
);

-- Seed values (idempotent)
INSERT INTO public.resource_taxonomy (category, value)
SELECT 'subject', v FROM (VALUES
  ('Leadership'),('Communication'),('Emotional Intelligence'),('Digital Literacy'),('Finance & Ethics'),('Community Impact')
) t(v)
ON CONFLICT (category, value) DO NOTHING;

INSERT INTO public.resource_taxonomy (category, value)
SELECT 'level', v FROM (VALUES
  ('Pathfinder (10–11)'),('Explorer (12–14)'),('Navigator (15–16)'),('Vanguard (17–18)')
) t(v)
ON CONFLICT (category, value) DO NOTHING;

INSERT INTO public.resource_taxonomy (category, value)
SELECT 'type', v FROM (VALUES
  ('PDF'),('Slide'),('Video'),('Worksheet'),('Link'),('Rubric')
) t(v)
ON CONFLICT (category, value) DO NOTHING;

-- 8) Storage policies for private teacher-documents bucket
-- Allow owners full control over their own folder
CREATE POLICY IF NOT EXISTS "Teachers can upload own files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'teacher-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Teachers can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'teacher-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'teacher-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Teachers can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'teacher-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Teachers can read own files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'teacher-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Read access via shares
CREATE POLICY IF NOT EXISTS "Teachers can read shared resources"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'teacher-documents'
  AND EXISTS (
    SELECT 1 FROM public.teaching_resources tr
    JOIN public.resource_shares rs ON rs.resource_id = tr.id
    WHERE tr.storage_path = storage.objects.name
      AND rs.to_teacher_id = auth.uid()
  )
);

-- Read access to global approved resources
CREATE POLICY IF NOT EXISTS "Teachers can read global approved resources"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'teacher-documents'
  AND EXISTS (
    SELECT 1 FROM public.teaching_resources tr
    WHERE tr.storage_path = storage.objects.name
      AND tr.visibility = 'global'
      AND tr.approval_status = 'approved'
  )
);

-- Admin override for teacher-documents
CREATE POLICY IF NOT EXISTS "Admins can access teacher-documents"
ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'teacher-documents' AND public.get_current_user_role() = 'admin'
)
WITH CHECK (
  bucket_id = 'teacher-documents' AND public.get_current_user_role() = 'admin'
);

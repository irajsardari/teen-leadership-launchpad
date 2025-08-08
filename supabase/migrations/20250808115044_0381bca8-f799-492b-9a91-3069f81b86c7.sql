-- Extend enums for approval_status and resource_visibility
DO $$ BEGIN
  ALTER TYPE approval_status ADD VALUE IF NOT EXISTS 'rejected';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TYPE resource_visibility ADD VALUE IF NOT EXISTS 'shared';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TYPE resource_visibility ADD VALUE IF NOT EXISTS 'org';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- teaching_resources: add approval metadata and audit fields
ALTER TABLE public.teaching_resources
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS audit_meta jsonb,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- resource_shares: add optional note
ALTER TABLE public.resource_shares
  ADD COLUMN IF NOT EXISTS note text;

-- resource_links table
CREATE TABLE IF NOT EXISTS public.resource_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.teaching_resources(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id),
  session_id uuid REFERENCES public.course_sessions(id),
  linked_by uuid REFERENCES public.profiles(id),
  linked_at timestamptz DEFAULT now(),
  CONSTRAINT resource_links_course_or_session_chk CHECK (course_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.resource_links ENABLE ROW LEVEL SECURITY;

-- RLS for resource_links
DROP POLICY IF EXISTS "Admins manage all resource_links" ON public.resource_links;
CREATE POLICY "Admins manage all resource_links"
ON public.resource_links
FOR ALL
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Teachers manage links for their courses" ON public.resource_links;
CREATE POLICY "Teachers manage links for their courses"
ON public.resource_links
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = resource_links.course_id AND c.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.courses c ON c.id = cs.course_id
    WHERE cs.id = resource_links.session_id AND c.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = resource_links.course_id AND c.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.courses c ON c.id = cs.course_id
    WHERE cs.id = resource_links.session_id AND c.teacher_id = auth.uid()
  )
);

-- teaching_resources RLS additions
-- Students: view approved resources linked to their enrollments
DROP POLICY IF EXISTS "Students view approved linked resources" ON public.teaching_resources;
CREATE POLICY "Students view approved linked resources"
ON public.teaching_resources
FOR SELECT
USING (
  approval_status = 'approved'
  AND EXISTS (
    SELECT 1
    FROM public.resource_links rl
    LEFT JOIN public.course_sessions cs ON cs.id = rl.session_id
    JOIN public.enrollments e ON (
      (rl.course_id IS NOT NULL AND e.course_id = rl.course_id)
      OR (rl.session_id IS NOT NULL AND cs.course_id = e.course_id)
    )
    WHERE rl.resource_id = teaching_resources.id
      AND e.student_id = auth.uid()
      AND e.is_active = true
  )
);

-- Teachers: view resources linked to their courses/sessions
DROP POLICY IF EXISTS "Teachers view resources linked to their courses" ON public.teaching_resources;
CREATE POLICY "Teachers view resources linked to their courses"
ON public.teaching_resources
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.resource_links rl
    JOIN public.courses c ON c.id = rl.course_id
    WHERE rl.resource_id = teaching_resources.id AND c.teacher_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.resource_links rl
    JOIN public.course_sessions cs ON cs.id = rl.session_id
    JOIN public.courses c ON c.id = cs.course_id
    WHERE rl.resource_id = teaching_resources.id AND c.teacher_id = auth.uid()
  )
);

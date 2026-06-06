
-- ============================================================
-- 1. PROGRAMS
-- ============================================================
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  audience text NOT NULL DEFAULT 'executive', -- executive|teen|parent|teacher
  tagline text,
  description text,
  learning_outcomes text[] DEFAULT ARRAY[]::text[],
  instructor_name text,
  instructor_title text,
  instructor_bio text,
  instructor_photo_url text,
  duration_text text,
  contact_email text,
  contact_phone text,
  hero_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
  registration_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY programs_public_read ON public.programs
  FOR SELECT USING (is_published = true AND is_public = true);
CREATE POLICY programs_authed_read ON public.programs
  FOR SELECT TO authenticated USING (is_published = true OR get_current_user_role() = 'admin');
CREATE POLICY programs_admin_all ON public.programs
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');

-- Link courses to programs
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON public.courses(program_id);

-- ============================================================
-- 2. PROGRAM REGISTRATIONS (public apply, admin approve)
-- ============================================================
CREATE TABLE public.program_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id uuid, -- populated after approval / account creation
  full_name text NOT NULL,
  email text NOT NULL,
  mobile text,
  country text,
  occupation text,
  organization text,
  educational_background text,
  motivation text,
  status text NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  reviewed_by uuid,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.program_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_registrations TO authenticated;
GRANT ALL ON public.program_registrations TO service_role;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY reg_anon_insert ON public.program_registrations
  FOR INSERT TO anon WITH CHECK (status = 'pending');
CREATE POLICY reg_authed_insert ON public.program_registrations
  FOR INSERT TO authenticated WITH CHECK (status = 'pending');
CREATE POLICY reg_admin_all ON public.program_registrations
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY reg_self_select ON public.program_registrations
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE INDEX idx_reg_program ON public.program_registrations(program_id);
CREATE INDEX idx_reg_status ON public.program_registrations(status);
CREATE INDEX idx_reg_email ON public.program_registrations(email);

-- ============================================================
-- 3. ANNOUNCEMENTS (schema only, UI in Phase 2)
-- ============================================================
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY ann_admin_all ON public.announcements
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY ann_enrolled_read ON public.announcements
  FOR SELECT TO authenticated USING (
    is_published = true AND (
      (course_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.enrollments e WHERE e.course_id = announcements.course_id AND e.student_id = auth.uid() AND e.is_active = true
      )) OR
      (program_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.enrollments e JOIN public.courses c ON c.id = e.course_id
        WHERE c.program_id = announcements.program_id AND e.student_id = auth.uid() AND e.is_active = true
      ))
    )
  );
CREATE POLICY ann_teacher_manage ON public.announcements
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = announcements.course_id AND c.teacher_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = announcements.course_id AND c.teacher_id = auth.uid())
  );

-- ============================================================
-- 4. QUIZZES
-- ============================================================
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time_limit_minutes integer,
  pass_score integer NOT NULL DEFAULT 60, -- percentage
  max_attempts integer DEFAULT 3,
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quiz_scope_check CHECK (course_id IS NOT NULL OR session_id IS NOT NULL)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY quizzes_admin_all ON public.quizzes
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY quizzes_teacher_manage ON public.quizzes
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.course_sessions s JOIN public.courses c ON c.id = s.course_id WHERE s.id = quizzes.session_id AND c.teacher_id = auth.uid())
  ) WITH CHECK (true);
CREATE POLICY quizzes_student_read ON public.quizzes
  FOR SELECT TO authenticated USING (
    is_published = true AND (
      EXISTS (SELECT 1 FROM public.enrollments e WHERE e.course_id = quizzes.course_id AND e.student_id = auth.uid() AND e.is_active = true)
      OR EXISTS (SELECT 1 FROM public.course_sessions s JOIN public.enrollments e ON e.course_id = s.course_id
                 WHERE s.id = quizzes.session_id AND e.student_id = auth.uid() AND e.is_active = true)
    )
  );

-- ============================================================
-- 5. QUIZ QUESTIONS
-- ============================================================
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'mcq_single', -- mcq_single|mcq_multi|true_false
  points integer NOT NULL DEFAULT 1,
  display_order integer NOT NULL DEFAULT 0,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY qq_admin_all ON public.quiz_questions
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY qq_teacher_manage ON public.quiz_questions
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quizzes q
            LEFT JOIN public.courses c ON c.id = q.course_id
            LEFT JOIN public.course_sessions s ON s.id = q.session_id
            LEFT JOIN public.courses c2 ON c2.id = s.course_id
            WHERE q.id = quiz_questions.quiz_id AND (c.teacher_id = auth.uid() OR c2.teacher_id = auth.uid()))
  ) WITH CHECK (true);
-- NOTE: students do NOT read this table directly; they use get_quiz_for_student RPC.

-- ============================================================
-- 6. QUIZ OPTIONS
-- ============================================================
CREATE TABLE public.quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_options TO authenticated;
GRANT ALL ON public.quiz_options TO service_role;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY qo_admin_all ON public.quiz_options
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');
CREATE POLICY qo_teacher_manage ON public.quiz_options
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quiz_questions qq JOIN public.quizzes q ON q.id = qq.quiz_id
            LEFT JOIN public.courses c ON c.id = q.course_id
            LEFT JOIN public.course_sessions s ON s.id = q.session_id
            LEFT JOIN public.courses c2 ON c2.id = s.course_id
            WHERE qq.id = quiz_options.question_id AND (c.teacher_id = auth.uid() OR c2.teacher_id = auth.uid()))
  ) WITH CHECK (true);
-- NOTE: students do NOT read this table directly.

-- ============================================================
-- 7. QUIZ ATTEMPTS & ANSWERS
-- ============================================================
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  score integer,
  max_score integer,
  percentage numeric(5,2),
  passed boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY qa_student_own ON public.quiz_attempts
  FOR ALL TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY qa_admin_all ON public.quiz_attempts
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');

CREATE TABLE public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_option_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  is_correct boolean,
  points_awarded integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answers TO authenticated;
GRANT ALL ON public.quiz_answers TO service_role;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY qans_student_own ON public.quiz_answers
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.id = quiz_answers.attempt_id AND a.student_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.id = quiz_answers.attempt_id AND a.student_id = auth.uid())
  );
CREATE POLICY qans_admin_all ON public.quiz_answers
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');

-- ============================================================
-- 8. CERTIFICATES (schema only; generation in Phase 2)
-- ============================================================
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  certificate_number text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  pdf_url text,
  issued_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY cert_student_read ON public.certificates
  FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY cert_admin_all ON public.certificates
  FOR ALL TO authenticated USING (get_current_user_role() = 'admin') WITH CHECK (get_current_user_role() = 'admin');

-- ============================================================
-- 9. SECURE FUNCTIONS
-- ============================================================

-- Get quiz + questions + options for a student WITHOUT revealing correct answers.
CREATE OR REPLACE FUNCTION public.get_quiz_for_student(_quiz_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _quiz jsonb;
  _is_admin boolean;
  _enrolled boolean;
BEGIN
  _is_admin := get_current_user_role() = 'admin';

  SELECT EXISTS (
    SELECT 1 FROM quizzes q
    LEFT JOIN enrollments e1 ON e1.course_id = q.course_id AND e1.student_id = auth.uid() AND e1.is_active = true
    LEFT JOIN course_sessions s ON s.id = q.session_id
    LEFT JOIN enrollments e2 ON e2.course_id = s.course_id AND e2.student_id = auth.uid() AND e2.is_active = true
    WHERE q.id = _quiz_id AND q.is_published = true AND (e1.id IS NOT NULL OR e2.id IS NOT NULL)
  ) INTO _enrolled;

  IF NOT (_is_admin OR _enrolled) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT jsonb_build_object(
    'quiz', to_jsonb(q.*),
    'questions', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', qq.id,
          'question_text', qq.question_text,
          'question_type', qq.question_type,
          'points', qq.points,
          'display_order', qq.display_order,
          'options', COALESCE((
            SELECT jsonb_agg(jsonb_build_object('id', qo.id, 'option_text', qo.option_text, 'display_order', qo.display_order) ORDER BY qo.display_order)
            FROM quiz_options qo WHERE qo.question_id = qq.id
          ), '[]'::jsonb)
        ) ORDER BY qq.display_order
      )
      FROM quiz_questions qq WHERE qq.quiz_id = q.id
    ), '[]'::jsonb)
  )
  INTO _quiz
  FROM quizzes q WHERE q.id = _quiz_id;

  RETURN _quiz;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_quiz_for_student(uuid) TO authenticated;

-- Submit a quiz attempt: takes attempt id and an array of {question_id, selected_option_ids[]}.
-- Scores server-side, writes quiz_answers, updates attempt with score/percentage/passed.
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(_attempt_id uuid, _answers jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _attempt quiz_attempts%ROWTYPE;
  _quiz quizzes%ROWTYPE;
  _ans jsonb;
  _qid uuid;
  _selected uuid[];
  _correct uuid[];
  _q_points integer;
  _is_correct boolean;
  _total_score integer := 0;
  _max_score integer := 0;
  _pct numeric(5,2);
  _passed boolean;
BEGIN
  SELECT * INTO _attempt FROM quiz_attempts WHERE id = _attempt_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF _attempt.student_id <> auth.uid() THEN RAISE EXCEPTION 'Not your attempt'; END IF;
  IF _attempt.submitted_at IS NOT NULL THEN RAISE EXCEPTION 'Already submitted'; END IF;

  SELECT * INTO _quiz FROM quizzes WHERE id = _attempt.quiz_id;

  -- compute max_score
  SELECT COALESCE(SUM(points),0) INTO _max_score FROM quiz_questions WHERE quiz_id = _quiz.id;

  FOR _ans IN SELECT * FROM jsonb_array_elements(_answers)
  LOOP
    _qid := (_ans->>'question_id')::uuid;
    SELECT ARRAY(SELECT (jsonb_array_elements_text(_ans->'selected_option_ids'))::uuid) INTO _selected;

    SELECT points INTO _q_points FROM quiz_questions WHERE id = _qid AND quiz_id = _quiz.id;
    IF _q_points IS NULL THEN CONTINUE; END IF;

    SELECT ARRAY(SELECT id FROM quiz_options WHERE question_id = _qid AND is_correct = true ORDER BY id) INTO _correct;

    -- exact match (order-independent)
    _is_correct := (
      (SELECT COUNT(*) FROM unnest(_selected)) = (SELECT COUNT(*) FROM unnest(_correct))
      AND NOT EXISTS (SELECT 1 FROM unnest(_selected) x WHERE x <> ALL(_correct))
      AND NOT EXISTS (SELECT 1 FROM unnest(_correct) x WHERE x <> ALL(_selected))
    );

    INSERT INTO quiz_answers(attempt_id, question_id, selected_option_ids, is_correct, points_awarded)
    VALUES (_attempt_id, _qid, _selected, _is_correct, CASE WHEN _is_correct THEN _q_points ELSE 0 END);

    IF _is_correct THEN _total_score := _total_score + _q_points; END IF;
  END LOOP;

  _pct := CASE WHEN _max_score > 0 THEN ROUND((_total_score::numeric / _max_score::numeric) * 100, 2) ELSE 0 END;
  _passed := _pct >= _quiz.pass_score;

  UPDATE quiz_attempts SET
    submitted_at = now(),
    score = _total_score,
    max_score = _max_score,
    percentage = _pct,
    passed = _passed
  WHERE id = _attempt_id;

  RETURN jsonb_build_object('score', _total_score, 'max_score', _max_score, 'percentage', _pct, 'passed', _passed);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb) TO authenticated;

-- ============================================================
-- 10. UPDATED_AT TRIGGERS
-- ============================================================
CREATE TRIGGER trg_programs_updated BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_reg_updated BEFORE UPDATE ON public.program_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_quizzes_updated BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 11. SEED: Trade Finance Academy program + course + modules
-- ============================================================
DO $$
DECLARE
  _prog_id uuid;
  _course_id uuid;
BEGIN
  INSERT INTO public.programs (
    slug, name, audience, tagline, description,
    learning_outcomes, instructor_name, instructor_title, instructor_bio,
    duration_text, contact_email, is_published, is_public, registration_open
  ) VALUES (
    'trade-finance-academy',
    'International Banking & Trade Finance Executive Program',
    'executive',
    'A pilot executive program in international trade finance',
    'A comprehensive executive program covering international trade fundamentals, payment instruments, documentary credits, bank guarantees, and trade compliance. Designed for banking professionals, trade officers, and finance executives.',
    ARRAY[
      'Understand the fundamentals of international trade and finance',
      'Master trade documents and their commercial role',
      'Compare and apply different payment methods in cross-border transactions',
      'Issue and examine documentary credits under UCP 600',
      'Evaluate and structure bank guarantees and standby letters of credit',
      'Apply compliance and risk frameworks to trade finance operations'
    ],
    'TBD',
    'Program Instructor',
    'Instructor biography to be added.',
    '6 modules · ~12 weeks',
    'info@teenmanagement.com',
    true, false, true
  ) RETURNING id INTO _prog_id;

  INSERT INTO public.courses (
    title, term_name, term_number, description, difficulty_level,
    duration_weeks, is_active, program_id
  ) VALUES (
    'International Banking & Trade Finance Executive Program',
    'Trade Finance Pilot',
    1,
    'Pilot cohort of the Trade Finance Academy executive program.',
    'advanced', 12, true, _prog_id
  ) RETURNING id INTO _course_id;

  INSERT INTO public.course_sessions (course_id, title, session_number, description, duration_minutes, is_published) VALUES
    (_course_id, 'International Trade Fundamentals', 1, 'Foundations of cross-border commerce, Incoterms, and trade flows.', 120, true),
    (_course_id, 'Trade Documents', 2, 'Commercial invoices, bills of lading, certificates of origin, and supporting documents.', 120, true),
    (_course_id, 'Payment Methods', 3, 'Open account, advance payment, collections, and letters of credit compared.', 120, true),
    (_course_id, 'Documentary Credits', 4, 'UCP 600, issuance, examination, and discrepancies.', 120, true),
    (_course_id, 'Bank Guarantees', 5, 'Types of guarantees, standby letters of credit, URDG 758.', 120, true),
    (_course_id, 'Compliance & Risk', 6, 'AML, sanctions, KYC, and trade-based money-laundering risk frameworks.', 120, true);
END $$;

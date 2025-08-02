-- Create LMS Database Schema for Teenagers Management Academy

-- 1. Update profiles table to support LMS roles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lms_role text DEFAULT 'student';

-- Add check constraint for valid LMS roles
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_lms_roles 
CHECK (lms_role IN ('student', 'teacher', 'admin'));

-- 2. Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  term_number integer NOT NULL,
  term_name text NOT NULL,
  duration_weeks integer,
  difficulty_level text DEFAULT 'beginner',
  thumbnail_url text,
  is_active boolean DEFAULT true,
  teacher_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Create course sessions table
CREATE TABLE public.course_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  title text NOT NULL,
  description text,
  duration_minutes integer,
  learning_objectives text[],
  is_published boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(course_id, session_number)
);

-- 4. Create materials table
CREATE TABLE public.materials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  material_type text NOT NULL CHECK (material_type IN ('video', 'pdf', 'document', 'quiz', 'worksheet')),
  file_url text,
  video_url text,
  content_text text,
  display_order integer DEFAULT 0,
  is_downloadable boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 5. Create enrollments table
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_active boolean DEFAULT true,
  UNIQUE(student_id, course_id)
);

-- 6. Create assignments table
CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  instructions text,
  assignment_type text NOT NULL CHECK (assignment_type IN ('reflection', 'essay', 'quiz', 'project', 'discussion')),
  due_date timestamp with time zone,
  max_points integer DEFAULT 100,
  is_required boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 7. Create submissions table (for reflections and assignments)
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text,
  file_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
  points_earned integer,
  teacher_feedback text,
  submitted_at timestamp with time zone,
  graded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- 8. Create session progress table
CREATE TABLE public.session_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.course_sessions(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completion_date timestamp with time zone,
  time_spent_minutes integer DEFAULT 0,
  last_accessed timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(student_id, session_id)
);

-- Enable RLS on all LMS tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses
CREATE POLICY "Anyone can view published courses" ON public.courses
FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can manage their courses" ON public.courses
FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Admins can manage all courses" ON public.courses
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for course_sessions
CREATE POLICY "Students can view sessions of enrolled courses" ON public.course_sessions
FOR SELECT USING (
  is_published = true AND 
  EXISTS (
    SELECT 1 FROM public.enrollments 
    WHERE student_id = auth.uid() 
    AND course_id = course_sessions.course_id 
    AND is_active = true
  )
);

CREATE POLICY "Teachers can manage sessions of their courses" ON public.course_sessions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE id = course_sessions.course_id 
    AND teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all sessions" ON public.course_sessions
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for materials
CREATE POLICY "Students can view materials of enrolled sessions" ON public.materials
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.enrollments e ON e.course_id = cs.course_id
    WHERE cs.id = materials.session_id
    AND e.student_id = auth.uid()
    AND e.is_active = true
    AND cs.is_published = true
  )
);

CREATE POLICY "Teachers can manage materials of their sessions" ON public.materials
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.courses c ON c.id = cs.course_id
    WHERE cs.id = materials.session_id
    AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all materials" ON public.materials
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for enrollments
CREATE POLICY "Students can view their own enrollments" ON public.enrollments
FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can enroll themselves" ON public.enrollments
FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view enrollments for their courses" ON public.enrollments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE id = enrollments.course_id 
    AND teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all enrollments" ON public.enrollments
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for assignments
CREATE POLICY "Students can view assignments for enrolled sessions" ON public.assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.enrollments e ON e.course_id = cs.course_id
    WHERE cs.id = assignments.session_id
    AND e.student_id = auth.uid()
    AND e.is_active = true
    AND cs.is_published = true
  )
);

CREATE POLICY "Teachers can manage assignments for their sessions" ON public.assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.courses c ON c.id = cs.course_id
    WHERE cs.id = assignments.session_id
    AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all assignments" ON public.assignments
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for submissions
CREATE POLICY "Students can manage their own submissions" ON public.submissions
FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view submissions for their assignments" ON public.submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.course_sessions cs ON cs.id = a.session_id
    JOIN public.courses c ON c.id = cs.course_id
    WHERE a.id = submissions.assignment_id
    AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can grade submissions for their assignments" ON public.submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.course_sessions cs ON cs.id = a.session_id
    JOIN public.courses c ON c.id = cs.course_id
    WHERE a.id = submissions.assignment_id
    AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all submissions" ON public.submissions
FOR ALL USING (get_current_user_role() = 'admin');

-- Create RLS policies for session_progress
CREATE POLICY "Students can manage their own progress" ON public.session_progress
FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view progress for their sessions" ON public.session_progress
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_sessions cs
    JOIN public.courses c ON c.id = cs.course_id
    WHERE cs.id = session_progress.session_id
    AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all progress" ON public.session_progress
FOR SELECT USING (get_current_user_role() = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX idx_courses_term_number ON public.courses(term_number);
CREATE INDEX idx_course_sessions_course_id ON public.course_sessions(course_id);
CREATE INDEX idx_materials_session_id ON public.materials(session_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_assignments_session_id ON public.assignments(session_id);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_session_progress_student_id ON public.session_progress(student_id);
CREATE INDEX idx_session_progress_session_id ON public.session_progress(session_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_sessions_updated_at
BEFORE UPDATE ON public.course_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_progress_updated_at
BEFORE UPDATE ON public.session_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
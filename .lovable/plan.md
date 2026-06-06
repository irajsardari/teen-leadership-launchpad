## Goal

Build a **reusable LMS foundation** on top of your existing schema, then launch **Trade Finance Academy** as the first Program — covering landing page, registration, admin approval, student portal, resources, and quizzes. Phase 2 (attendance/certificates/announcements) and Phase 3 (video/CPD) will follow in later passes.

The architecture must let TMA, Parent Academy, Teacher Training, and MCN plug in later **without redesign**.

---

## Architecture Principles

- **Program** = top-level container (Trade Finance, TMA, Parent Academy, MCN…). Owns branding, audience, registration form schema, instructor info, landing copy.
- **Course** (existing table) belongs to a Program. Already has modules via `course_sessions`. Reused as-is.
- **Module/Session** (existing `course_sessions`) reused. We'll add `module_number` grouping later if needed.
- **Materials** (existing) reused for PDFs, PPT, DOCX, video links, external links.
- **Enrollment** (existing) reused, plus a new `program_registrations` table for pre-approval applications.
- **Quizzes** = new tables (`quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers`) scoped to a session, reusable by any Program.
- **Certificates** = schema stub now (`certificates` table), generation in Phase 2.
- **Announcements** = schema stub now (`announcements` table scoped to program/course), UI in Phase 2.

---

## Phase 1 Deliverables (this pass)

### 1. Database migrations (one migration, fully granted + RLS)

New tables in `public`:

- `programs` — id, slug, name, audience (text), description, learning_outcomes (text[]), instructor_name, instructor_bio, instructor_photo_url, duration_text, contact_email, contact_phone, is_published, is_public, registration_open, created_at/updated_at
- `program_registrations` — id, program_id, user_id (nullable until account is created), full_name, email, mobile, country, occupation, organization, educational_background, status ('pending'|'approved'|'rejected'), reviewed_by, reviewed_at, notes, created_at
- `announcements` — id, program_id (nullable), course_id (nullable), title, body, published_at, created_by
- `quizzes` — id, session_id (nullable) or course_id, title, description, time_limit_minutes, pass_score, is_published, created_at
- `quiz_questions` — id, quiz_id, question_text, question_type ('mcq_single'|'mcq_multi'|'true_false'), points, display_order
- `quiz_options` — id, question_id, option_text, is_correct, display_order
- `quiz_attempts` — id, quiz_id, student_id, started_at, submitted_at, score, max_score, passed
- `quiz_answers` — id, attempt_id, question_id, selected_option_ids (uuid[]), is_correct, points_awarded
- `certificates` — id, student_id, course_id, program_id, certificate_number, issued_at, pdf_url (stub; generation Phase 2)

Add to existing `profiles`:

- `lms_role` already exists — extend allowed values to include `'executive_student'` and `'program_admin'` (text column, no enum change needed)
- Link `courses.program_id` (new column, nullable for backward compat)

Foreign keys, GRANTs to authenticated + service_role (no anon on registrations/attempts), RLS:

- `programs`: public SELECT where `is_public=true`; admins manage all
- `program_registrations`: insert allowed for anyone (anon + authenticated) with rate-limit guard at edge; SELECT only to the registrant (by email match via SECURITY DEFINER fn or user_id) and to admins; UPDATE only admins
- `announcements`: SELECT to enrolled students or public if program_id is public; admins/teachers manage
- `quizzes/questions/options`: SELECT to enrolled students (no `is_correct` exposed in client query — handled via a view or RPC); admins/teachers manage
- `quiz_attempts/answers`: student sees own; admins see all; INSERT/UPDATE scoped to `auth.uid()`
- `certificates`: student sees own; admins manage

### 2. Seed the Trade Finance Academy Program

A single insert creating the program with slug `trade-finance-academy`, plus a course shell ("International Banking & Trade Finance Executive Program") with the 6 modules from your brief as `course_sessions`.

### 3. Routes & Pages

- `/trade-finance` → `TradeFinanceLandingPage` (program landing, hidden from main nav)
- `/trade-finance/register` → `TradeFinanceRegistrationPage` (validated zod form → inserts `program_registrations`)
- `/trade-finance/thank-you` → confirmation page
- `/portal/programs/:slug` → student program home (after login + approval): announcements feed, course modules, resources, quizzes
- `/portal/quiz/:quizId` → take quiz (timer, MCQ, submit → score)
- `/portal/quiz/:quizId/results/:attemptId` → results
- `/admin/programs` → list programs (create/edit)
- `/admin/programs/:slug/registrations` → approve/reject queue
- `/admin/programs/:slug/quizzes` → quiz builder (create quiz → add questions → add options → mark correct → publish)

### 4. Generic LMS components (reusable across future programs)

- `<ProgramLandingTemplate program={...} />` — accepts any program; not hardcoded to Trade Finance
- `<RegistrationForm program={...} />` — fields driven by `program.audience` (executive vs. teen vs. parent)
- `<ProgramPortal program={...} />` — shows enrolled student's program home
- `<QuizPlayer />`, `<QuizBuilder />`
- `<RegistrationsApprovalTable />`

### 5. Approval workflow

- Visitor submits registration → row in `program_registrations` (status='pending')
- Admin opens `/admin/programs/trade-finance-academy/registrations` → clicks Approve
- On approve: edge function `approve-registration` creates a Supabase auth user (magic-link invite email), creates `profiles` row with `lms_role='executive_student'`, creates `enrollments` row for the program's course, sets registration status='approved', sends welcome email
- On reject: status='rejected', optional notes, optional rejection email

### 6. Security

- Registration endpoint rate-limited (use existing `security_rate_limits` table)
- Zod validation on all form inputs
- Quiz correct-answer leakage prevented: students fetch questions via RPC `get_quiz_for_student` which omits `is_correct`; scoring happens server-side via RPC `submit_quiz_attempt`
- All new tables have explicit GRANTs + RLS per project rules

---

## Out of scope this pass (Phase 2/3)

- Attendance UI for Trade Finance (existing `attendance` table will be reused; UI built next)
- PDF certificate generation (schema ready, generation later)
- Announcement create/edit UI (schema ready; will add CRUD next)
- Video player, CPD hours, learning paths

---

## File plan (high level)

New:
- `supabase/migrations/<timestamp>_lms_foundation.sql`
- `supabase/functions/approve-registration/index.ts`
- `supabase/functions/submit-quiz-attempt/index.ts`
- `src/pages/trade-finance/LandingPage.tsx`
- `src/pages/trade-finance/RegistrationPage.tsx`
- `src/pages/trade-finance/ThankYouPage.tsx`
- `src/pages/portal/ProgramPortalPage.tsx`
- `src/pages/portal/QuizPlayerPage.tsx`
- `src/pages/portal/QuizResultsPage.tsx`
- `src/pages/admin/ProgramsAdminPage.tsx`
- `src/pages/admin/ProgramRegistrationsPage.tsx`
- `src/pages/admin/QuizBuilderPage.tsx`
- `src/components/lms/ProgramLandingTemplate.tsx`
- `src/components/lms/RegistrationForm.tsx`
- `src/components/lms/QuizPlayer.tsx`
- `src/components/lms/QuizBuilder.tsx`
- `src/components/lms/RegistrationsApprovalTable.tsx`

Edited:
- `src/App.tsx` — register new routes

---

## Estimated rollout

Big migration (review carefully when prompted), ~15 new files, 2 edge functions. After you approve the plan I'll start with the migration, then the seed data, then the UI in logical chunks.

**Approve to proceed, or tell me what to adjust.**

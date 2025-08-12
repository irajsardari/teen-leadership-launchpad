-- 1) Storage: secure buckets and policies
-- Create non-public assignments bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('assignments', 'assignments', false)
on conflict (id) do nothing;

-- Policies for assignments bucket
-- Students can read their own files (path prefix: <uid>/...)
create policy if not exists "Students can read own assignment files"
  on storage.objects
  for select
  using (
    bucket_id = 'assignments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can upload their own files
create policy if not exists "Students can upload own assignment files"
  on storage.objects
  for insert
  with check (
    bucket_id = 'assignments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can update their own files
create policy if not exists "Students can update own assignment files"
  on storage.objects
  for update
  using (
    bucket_id = 'assignments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'assignments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can delete their own files
create policy if not exists "Students can delete own assignment files"
  on storage.objects
  for delete
  using (
    bucket_id = 'assignments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can manage all assignment files
create policy if not exists "Admins manage all assignment files"
  on storage.objects
  for all
  using (
    bucket_id = 'assignments' and public.get_current_user_role() = 'admin'
  )
  with check (
    bucket_id = 'assignments' and public.get_current_user_role() = 'admin'
  );

-- Secure existing teacher-documents bucket
-- Admins manage all files
create policy if not exists "Admins manage all teacher documents"
  on storage.objects
  for all
  using (
    bucket_id = 'teacher-documents' and public.get_current_user_role() = 'admin'
  )
  with check (
    bucket_id = 'teacher-documents' and public.get_current_user_role() = 'admin'
  );

-- Teachers/applicants can read, write, update, delete their own files in their UID folder
create policy if not exists "Owners read own teacher documents"
  on storage.objects
  for select
  using (
    bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Owners upload teacher documents"
  on storage.objects
  for insert
  with check (
    bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Owners update teacher documents"
  on storage.objects
  for update
  using (
    bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Owners delete teacher documents"
  on storage.objects
  for delete
  using (
    bucket_id = 'teacher-documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 2) Progress notes: allow students to view their own notes
create policy if not exists "Students view their own progress notes"
  on public.progress_notes
  for select
  using (student_id = auth.uid());

-- 3) Triggers to enforce ownership/validation and timestamps
-- Ensure teacher_applications.user_id is set to the current user on insert
create trigger if not exists set_teacher_application_user_id
  before insert on public.teacher_applications
  for each row execute function public.set_teacher_application_user_id();

-- Update updated_at on teacher_applications
create trigger if not exists update_teacher_applications_updated_at
  before update on public.teacher_applications
  for each row execute function public.update_updated_at_column();

-- Validate challengers data on insert/update
create trigger if not exists validate_challenger_before_write
  before insert or update on public.challengers
  for each row execute function public.validate_challenger();

-- Enforce 24h update window on progress notes
create trigger if not exists enforce_progress_notes_update_window
  before update on public.progress_notes
  for each row execute function public.enforce_progress_notes_update_window();
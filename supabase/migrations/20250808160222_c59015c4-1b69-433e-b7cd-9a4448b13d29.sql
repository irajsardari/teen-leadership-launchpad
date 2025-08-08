-- Add updated_at column if missing
alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

-- Keep updated_at in sync
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

-- Ensure new auth users get a profile row
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ensure Dr. Iraj has teacher access
insert into public.profiles (id, full_name, role)
select u.id, coalesce(u.raw_user_meta_data->>'full_name',''), 'teacher'
from auth.users u
where u.email = 'irajsardari@gmail.com'
on conflict (id) do update set role = excluded.role;
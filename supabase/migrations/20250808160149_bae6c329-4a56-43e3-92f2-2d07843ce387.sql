-- Ensure profiles table exists
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'challenger',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Allow users to select their own profile row
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can view their own profile'
  ) then
    create policy "Users can view their own profile"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id);
  end if;
end
$$;

-- Allow users to update their own profile (optional, for future use)
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
    on public.profiles
    for update
    to authenticated
    using (auth.uid() = id);
  end if;
end
$$;

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
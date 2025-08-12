-- Break circular RLS recursion between teaching_resources and resource_shares

-- Helper: is resource shared with user (bypasses RLS safely)
create or replace function public.is_resource_shared_with_user(res_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.resource_shares rs
    where rs.resource_id = res_id
      and rs.to_teacher_id = user_id
  );
$$;

-- Helper: is resource owned by user (bypasses RLS safely)
create or replace function public.is_resource_owned_by_user(res_id uuid, user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.teaching_resources tr
    where tr.id = res_id
      and tr.owner_id = user_id
  );
$$;

-- Replace recursive policy conditions
alter policy "Teachers view shared resources"
  on public.teaching_resources
  using ( public.is_resource_shared_with_user(id, auth.uid()) );

alter policy "Owners manage shares of their resources"
  on public.resource_shares
  using ( public.is_resource_owned_by_user(resource_id, auth.uid()) )
  with check ( public.is_resource_owned_by_user(resource_id, auth.uid()) );
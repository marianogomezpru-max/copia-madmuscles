-- Fixes "infinite recursion detected in policy for relation profiles":
-- member_read_profiles queried public.profiles from inside its own policy
-- on public.profiles, which re-triggers the same policy forever. A
-- security definer function breaks the loop (it reads profiles bypassing
-- RLS internally), and every other table's member/full-access policies
-- that check profiles benefit too, since they were tripping over this
-- same recursion indirectly.

create or replace function public.household_owner_for(p_uid uuid)
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select user_id from public.profiles where auth_user_id = p_uid limit 1;
$$;

grant execute on function public.household_owner_for(uuid) to authenticated;

drop policy if exists "member_read_profiles" on public.profiles;
create policy "member_read_profiles" on public.profiles for select
  using (
    user_id = auth.uid()
    or user_id = public.household_owner_for(auth.uid())
  );

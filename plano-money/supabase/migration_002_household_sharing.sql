-- Plano.Money — real per-member household sharing
-- Run in the Supabase SQL Editor AFTER schema.sql. Safe to re-run.

-- Each household gets a short shareable code so a family member can join
-- it during their own signup, without the admin needing to know their
-- email in advance or use any elevated/service-role credentials.
alter table public.settings add column if not exists invite_code text unique;

update public.settings
set invite_code = lower(substr(md5(random()::text || user_id::text), 1, 8))
where invite_code is null;

-- Links a profile row to the real Supabase Auth user who "is" that
-- household member, once they join. Profiles without a linked auth user
-- are still just admin-managed labels (e.g. for attribution only), the
-- same as before this migration.
alter table public.profiles add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
create unique index if not exists profiles_auth_user_id_key on public.profiles(auth_user_id) where auth_user_id is not null;

-- Who logged this income (mirrors expense_transactions.profile_id) — a
-- member can add their own variable income and it counts toward the
-- household total, without seeing the household's fixed income.
alter table public.variable_income_transactions add column if not exists profile_id uuid references public.profiles(id) on delete set null;

-- false (default) = counts toward the shared family totals the admin
-- (and everyone else with a visible category) sees. true = the member's
-- own private tracking — never summed into the family's numbers, and only
-- that member (plus the admin, who sees everything) can see the row.
alter table public.expense_transactions add column if not exists is_personal boolean not null default false;
alter table public.variable_income_transactions add column if not exists is_personal boolean not null default false;

-- For couples: the admin can flip a member to "full access" — same
-- visibility as the admin (fixed income, budgets, savings, investments,
-- every expense category), no per-category opt-in needed. Off by default,
-- which keeps the restrictive child-style model as the starting point for
-- every newly-joined member.
alter table public.profiles add column if not exists full_access boolean not null default false;

-- security definer so it can read profiles regardless of the caller's own
-- RLS visibility into that table — used inside other tables' policies.
create or replace function public.is_full_access_member(p_owner uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and user_id = p_owner and full_access = true
  );
$$;

grant execute on function public.is_full_access_member(uuid) to authenticated;

-- null = a shared "family" goal (visible to the whole household, anyone
-- can see it and log contributions); set = a personal goal owned by that
-- one profile, invisible to everyone else in the household except the
-- admin (who already sees everything).
alter table public.goals add column if not exists profile_id uuid references public.profiles(id) on delete set null;

-- Members start with zero visible expense categories — the admin opts
-- categories IN from Perfiles, rather than a new member defaulting to
-- seeing everything (which is what a null visible_categories means
-- elsewhere, e.g. the admin's own profile row).
create or replace function public.join_household(p_invite_code text, p_display_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_owner uuid;
  v_profile_id uuid;
begin
  select user_id into v_owner from public.settings where invite_code = lower(p_invite_code);
  if v_owner is null then
    raise exception 'invalid_invite_code';
  end if;

  select id into v_profile_id from public.profiles where auth_user_id = auth.uid();
  if v_profile_id is not null then
    raise exception 'already_in_a_household';
  end if;

  insert into public.profiles (user_id, name, role, visible_categories, auth_user_id)
  values (v_owner, p_display_name, 'member', '[]'::jsonb, auth.uid())
  returning id into v_profile_id;

  return v_profile_id;
end;
$$;

grant execute on function public.join_household(text, text) to authenticated;

-- Members can read (not manage) the profile list of their own household,
-- so the UI can show names/attribution — but not edit anything there.
drop policy if exists "member_read_profiles" on public.profiles;
create policy "member_read_profiles" on public.profiles for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles me
      where me.auth_user_id = auth.uid() and me.user_id = public.profiles.user_id
    )
  );

-- Members can see/add/edit/delete their OWN expense entries — split in two:
-- "family" ones (is_personal = false) must be in a category the admin has
-- explicitly opted them into, since those count toward the household's
-- shared numbers; "personal" ones (is_personal = true) can be in ANY
-- category since they're just that member's own private tracking, never
-- summed into the family's totals and never gated by admin-granted
-- categories. Neither ever touches the owner's or other members' rows —
-- and other tables (budgets, savings, investments, fixed income) get no
-- member policy at all, so owner-only "owner_all" is the only rule left
-- standing there.
drop policy if exists "member_own_expenses" on public.expense_transactions;
drop policy if exists "member_family_expenses" on public.expense_transactions;
create policy "member_family_expenses" on public.expense_transactions for all
  using (
    not public.expense_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
        and coalesce(p.visible_categories, '[]'::jsonb) @> to_jsonb(public.expense_transactions.category_id)
    )
  )
  with check (
    not public.expense_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
        and coalesce(p.visible_categories, '[]'::jsonb) @> to_jsonb(public.expense_transactions.category_id)
    )
  );

drop policy if exists "member_personal_expenses" on public.expense_transactions;
create policy "member_personal_expenses" on public.expense_transactions for all
  using (
    public.expense_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
    )
  )
  with check (
    public.expense_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
    )
  );

-- Same family/personal split for income: a member's family-scoped variable
-- income counts toward the household total; personal is just their own,
-- never summed in. They can't see anyone else's income either way,
-- including the admin's fixed income (that table gets no member policy).
drop policy if exists "member_own_variable_income" on public.variable_income_transactions;
drop policy if exists "member_family_variable_income" on public.variable_income_transactions;
create policy "member_family_variable_income" on public.variable_income_transactions for all
  using (
    not public.variable_income_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  )
  with check (
    not public.variable_income_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  );

drop policy if exists "member_personal_variable_income" on public.variable_income_transactions;
create policy "member_personal_variable_income" on public.variable_income_transactions for all
  using (
    public.variable_income_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  )
  with check (
    public.variable_income_transactions.is_personal
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  );

-- Family goals (profile_id null): every household member can see them and
-- log contributions (this policy is intentionally "for all", not just
-- select+update — a member could in principle also rename a shared goal;
-- treated as an acceptable trade-off for keeping this simple).
drop policy if exists "member_family_goals" on public.goals;
create policy "member_family_goals" on public.goals for all
  using (
    public.goals.profile_id is null
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.user_id = public.goals.user_id
    )
  )
  with check (
    public.goals.profile_id is null
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.user_id = public.goals.user_id
    )
  );

-- Personal goals (profile_id set): fully private to that one member — not
-- even visible to siblings or a full-access spouse, only to themself and
-- (via owner_all) the admin.
drop policy if exists "member_own_personal_goals" on public.goals;
create policy "member_own_personal_goals" on public.goals for all
  using (
    exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.id = public.goals.profile_id
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.id = public.goals.profile_id
    )
  );

-- Full-access members (e.g. a spouse): same reach as the admin over every
-- family-scoped table — but personal expenses/income/goals belonging to
-- someone else stay private even from them, same as everyone but the admin.
drop policy if exists "full_access_fixed_incomes" on public.fixed_incomes;
create policy "full_access_fixed_incomes" on public.fixed_incomes for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_budgets" on public.budgets;
create policy "full_access_budgets" on public.budgets for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_savings" on public.savings;
create policy "full_access_savings" on public.savings for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_investments" on public.investments;
create policy "full_access_investments" on public.investments for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_settings" on public.settings;
create policy "full_access_settings" on public.settings for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_family_expenses" on public.expense_transactions;
create policy "full_access_family_expenses" on public.expense_transactions for all
  using (not is_personal and public.is_full_access_member(user_id))
  with check (not is_personal and public.is_full_access_member(user_id));

drop policy if exists "full_access_family_variable_income" on public.variable_income_transactions;
create policy "full_access_family_variable_income" on public.variable_income_transactions for all
  using (not is_personal and public.is_full_access_member(user_id))
  with check (not is_personal and public.is_full_access_member(user_id));

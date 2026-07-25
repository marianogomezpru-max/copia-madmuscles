-- Plano.Money — automatic access suspension on non-payment
-- If a customer's subscription lapses (renewal fails, they cancel, or a
-- refund/chargeback comes through), their household's access to every
-- financial table gets cut off at the database level — not just hidden in
-- the UI. `settings` itself is deliberately exempt from the gate, so the
-- app can still read the household's own access_suspended flag and show a
-- clear "renewá tu pago" screen instead of a confusing blank app.

alter table public.settings add column if not exists access_suspended boolean not null default false;
alter table public.settings add column if not exists access_suspended_at timestamptz;

-- Lets the webhook functions (and the RLS gate below) map a later
-- cancellation/refund event back to the household that must be suspended.
alter table public.access_codes add column if not exists stripe_customer_id text;
alter table public.access_codes add column if not exists stripe_subscription_id text;
alter table public.access_codes add column if not exists hotmart_subscriber_code text;
create index if not exists access_codes_stripe_subscription_id_idx on public.access_codes (stripe_subscription_id);
create index if not exists access_codes_hotmart_subscriber_code_idx on public.access_codes (hotmart_subscriber_code);

create or replace function public.household_access_active(p_owner uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select not coalesce((select access_suspended from public.settings where user_id = p_owner), false);
$$;

grant execute on function public.household_access_active(uuid) to authenticated;

-- is_full_access_member already gates every full_access_* policy (fixed
-- incomes, budgets, savings, investments, family expenses/income, vacation
-- trips/expenses) — folding the suspension check in here covers all of
-- them without touching each policy individually.
create or replace function public.is_full_access_member(p_owner uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.household_access_active(p_owner) and exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and user_id = p_owner and full_access = true
  );
$$;

-- Regenerate every plain "owner_all" policy (the admin's own access) with
-- the suspension check added — same loop pattern as schema.sql, minus
-- "settings" which must stay always-readable-by-its-owner so the app can
-- detect and display the suspension. Vacation tables included since they
-- use the identical owner_all pattern.
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles', 'fixed_incomes', 'variable_income_transactions',
    'expense_transactions', 'budgets', 'goals', 'savings', 'investments',
    'vacation_trips', 'vacation_expenses'
  ])
  loop
    execute format('drop policy if exists "owner_all" on public.%I', t);
    execute format(
      'create policy "owner_all" on public.%I for all using (user_id = auth.uid() and public.household_access_active(user_id)) with check (user_id = auth.uid() and public.household_access_active(user_id))',
      t
    );
  end loop;
end $$;

-- Member policies gate through public.profiles directly (not through
-- is_full_access_member), so each needs the same check added by hand.
drop policy if exists "member_read_profiles" on public.profiles;
create policy "member_read_profiles" on public.profiles for select
  using (
    (user_id = auth.uid() or user_id = public.household_owner_for(auth.uid()))
    and public.household_access_active(user_id)
  );

drop policy if exists "member_family_expenses" on public.expense_transactions;
create policy "member_family_expenses" on public.expense_transactions for all
  using (
    not public.expense_transactions.is_personal
    and public.household_access_active(public.expense_transactions.user_id)
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
    and public.household_access_active(public.expense_transactions.user_id)
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
    and public.household_access_active(public.expense_transactions.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
    )
  )
  with check (
    public.expense_transactions.is_personal
    and public.household_access_active(public.expense_transactions.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.expense_transactions.user_id
        and p.id = public.expense_transactions.profile_id
    )
  );

drop policy if exists "member_family_variable_income" on public.variable_income_transactions;
create policy "member_family_variable_income" on public.variable_income_transactions for all
  using (
    not public.variable_income_transactions.is_personal
    and public.household_access_active(public.variable_income_transactions.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  )
  with check (
    not public.variable_income_transactions.is_personal
    and public.household_access_active(public.variable_income_transactions.user_id)
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
    and public.household_access_active(public.variable_income_transactions.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  )
  with check (
    public.variable_income_transactions.is_personal
    and public.household_access_active(public.variable_income_transactions.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.user_id = public.variable_income_transactions.user_id
        and p.id = public.variable_income_transactions.profile_id
    )
  );

drop policy if exists "member_family_goals" on public.goals;
create policy "member_family_goals" on public.goals for all
  using (
    public.goals.profile_id is null
    and public.household_access_active(public.goals.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.user_id = public.goals.user_id
    )
  )
  with check (
    public.goals.profile_id is null
    and public.household_access_active(public.goals.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.user_id = public.goals.user_id
    )
  );

drop policy if exists "member_own_personal_goals" on public.goals;
create policy "member_own_personal_goals" on public.goals for all
  using (
    public.household_access_active(public.goals.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.id = public.goals.profile_id
    )
  )
  with check (
    public.household_access_active(public.goals.user_id)
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid() and p.id = public.goals.profile_id
    )
  );

-- Suspend or reactivate a household by whichever gateway reference the
-- webhook has on hand — called with the service_role key, so it bypasses
-- RLS itself (it's what turns household_access_active on/off).
create or replace function public.set_access_suspended_by_ref(
  p_source text, p_ref text, p_suspended boolean
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_owner uuid;
begin
  if p_source = 'stripe' then
    select used_by into v_owner from public.access_codes
      where (stripe_subscription_id = p_ref or stripe_customer_id = p_ref) and used_by is not null
      order by used_at desc nulls last limit 1;
  elsif p_source = 'hotmart' then
    select used_by into v_owner from public.access_codes
      where hotmart_subscriber_code = p_ref and used_by is not null
      order by used_at desc nulls last limit 1;
  end if;

  if v_owner is null then
    return;
  end if;

  update public.settings
  set access_suspended = p_suspended,
      access_suspended_at = case when p_suspended then now() else null end
  where user_id = v_owner;
end;
$$;

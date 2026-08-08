-- Plano.Money — Control Vacaciones
-- A fully separate expense tracker (its own budget, its own fixed category
-- list) that never feeds into the household's regular totals. Run in the
-- Supabase SQL Editor after the previous migrations.

create table if not exists public.vacation_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Vacaciones',
  days integer not null,
  budget numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vacation_expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.vacation_trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  amount numeric not null,
  date date not null,
  note text,
  profile_id uuid references public.profiles(id) on delete set null
);

alter table public.vacation_trips enable row level security;
alter table public.vacation_expenses enable row level security;

drop policy if exists "owner_all" on public.vacation_trips;
create policy "owner_all" on public.vacation_trips for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "owner_all" on public.vacation_expenses;
create policy "owner_all" on public.vacation_expenses for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Same "full access" members (e.g. a spouse) who already see the
-- household's regular budgets/savings also get to plan and log vacation
-- spending — restricted members (the category-gated child model) do not,
-- same boundary as the rest of the household's financial-planning tables.
drop policy if exists "full_access_vacation_trips" on public.vacation_trips;
create policy "full_access_vacation_trips" on public.vacation_trips for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

drop policy if exists "full_access_vacation_expenses" on public.vacation_expenses;
create policy "full_access_vacation_expenses" on public.vacation_expenses for all
  using (public.is_full_access_member(user_id)) with check (public.is_full_access_member(user_id));

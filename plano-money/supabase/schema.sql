-- Plano.Money — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.

create extension if not exists pgcrypto;

-- Household members (the app's existing "profiles" concept — admin/member,
-- per-category visibility). All owned by the Supabase auth user who created
-- the household; there's one auth login per household for now, not one per
-- member.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  visible_categories jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.fixed_incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null
);

create table if not exists public.variable_income_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null,
  date date not null
);

create table if not exists public.expense_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  category_id text not null,
  date date not null,
  note text,
  photo text,
  profile_id uuid references public.profiles(id) on delete set null
);

create table if not exists public.budgets (
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  amount numeric not null,
  primary key (user_id, category_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target numeric not null,
  saved numeric not null default 0
);

create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null,
  date date not null
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  name text not null,
  amount numeric not null,
  date date not null
);

-- One row per household: language, monthly savings goal, and the
-- monthly-snapshot rollover bookkeeping the app already relies on locally.
create table if not exists public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'es',
  monthly_savings_goal numeric not null default 0,
  last_seen_month text,
  monthly_snapshots jsonb not null default '{}'::jsonb
);

-- Row Level Security: every table is only readable/writable by the auth
-- user that owns it (user_id = auth.uid()).
alter table public.profiles enable row level security;
alter table public.fixed_incomes enable row level security;
alter table public.variable_income_transactions enable row level security;
alter table public.expense_transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;
alter table public.savings enable row level security;
alter table public.investments enable row level security;
alter table public.settings enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles', 'fixed_incomes', 'variable_income_transactions',
    'expense_transactions', 'budgets', 'goals', 'savings', 'investments', 'settings'
  ])
  loop
    execute format('drop policy if exists "owner_all" on public.%I', t);
    execute format(
      'create policy "owner_all" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())',
      t
    );
  end loop;
end $$;

-- On signup, create the household's settings row and its first (admin)
-- profile automatically — mirrors what handleLogin used to do client-side
-- the first time someone logged in with a new email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.profiles (user_id, name, role, visible_categories)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Admin'), 'admin', null);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

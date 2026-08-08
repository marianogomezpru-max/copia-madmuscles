-- Plano.Money — paid access codes (Hotmart / Stripe)
-- A brand-new (non-invited) signup now requires a valid, unused access code.
-- Codes are only ever written by the Vercel webhook functions using the
-- service_role key (never exposed to the browser) — no RLS policy grants
-- authenticated/anon access to this table, it is intentionally unreachable
-- from client-side code.

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  email text,
  source text not null, -- 'hotmart' | 'stripe' | 'manual'
  external_ref text,    -- gateway's order/transaction/session id, for idempotency
  used boolean not null default false,
  used_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  unique (source, external_ref)
);

alter table public.access_codes enable row level security;
-- Deliberately no policies: authenticated/anon get zero access. Only the
-- service_role key (server-side only) and the SECURITY DEFINER trigger
-- below can read/write this table.

-- A brand-new household (i.e. no invite_code, meaning this signup isn't
-- joining an existing paying admin's household) must present a valid,
-- unused access code — proof of payment — or the account creation itself
-- is aborted. Joining an existing household via invite code is unaffected:
-- the household admin already paid for those seats.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_invite_code text := new.raw_user_meta_data->>'invite_code';
  v_access_code text := new.raw_user_meta_data->>'access_code';
  v_code_id uuid;
begin
  if v_invite_code is null or v_invite_code = '' then
    if v_access_code is null or v_access_code = '' then
      raise exception 'access_code_required';
    end if;

    select id into v_code_id from public.access_codes
      where code = lower(v_access_code) and used = false
      for update;

    if v_code_id is null then
      raise exception 'invalid_access_code';
    end if;

    update public.access_codes set used = true, used_by = new.id, used_at = now()
      where id = v_code_id;
  end if;

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

-- Plano.Money — standalone content purchases (ebooks/bonos sold on their own,
-- outside the app's own Supabase Auth signup). A buyer never creates a
-- Plano.Money account for these — they just verify the email they bought
-- with, and get a short-lived signed token that unlocks that one piece of
-- content in their browser. Completely separate from access_codes (which
-- gates app signup) and from settings.access_suspended (app subscription
-- status) — this is its own lightweight system.

create table if not exists public.content_purchases (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  content_slug text not null,
  source text not null, -- 'hotmart' | 'stripe' | 'manual'
  external_ref text,
  hotmart_product_id text,
  created_at timestamptz not null default now(),
  unique (source, external_ref, content_slug)
);

create index if not exists content_purchases_email_slug_idx on public.content_purchases (lower(email), content_slug);

alter table public.content_purchases enable row level security;
-- No policies: unreachable from anon/authenticated. Only the service_role
-- key (server-side, via the verify/webhook functions) touches this table.

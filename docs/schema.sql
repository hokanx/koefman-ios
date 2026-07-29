-- ============================================================================
-- KÖFMAN Simple Office — Supabase schema (v1, single-user MVP)
-- Run in the Supabase SQL editor on a fresh project.
--
-- Principles:
--   * Single-user: every row is owned by user_id = auth.uid(); RLS enforces it.
--   * Money as integer MINOR UNITS (cents) — never floats.
--   * Tax rate as numeric percent (e.g. 19.00).
--   * Number sequences live in business_settings and increment atomically.
-- ============================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ---------- Enums ----------
create type customer_type as enum ('private', 'business');
create type offer_status  as enum ('draft', 'sent', 'signed', 'rejected');
create type invoice_status as enum ('open', 'paid', 'overdue', 'cancelled');

-- ---------- updated_at helper ----------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================================
-- profiles  (1 row per auth user)
-- ============================================================================
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile + empty business_settings row on signup.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.business_settings (user_id) values (new.id);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- business_settings  (1 row per user — profile, branding, sequences)
-- ============================================================================
create table business_settings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  business_name       text,
  address             text,
  email               text,
  phone               text,
  tax_number          text,
  vat_id              text,
  logo_url            text,
  brand_primary_color text    not null default '#111111',
  brand_accent_color  text    not null default '#C8A24B',
  pdf_footer_note     text,
  currency            text    not null default 'EUR',
  default_tax_rate    numeric(5,2) not null default 19.00,
  payment_terms       text,
  offer_number_prefix   text  not null default 'A-',   -- Angebot
  invoice_number_prefix text  not null default 'R-',   -- Rechnung
  next_offer_seq      integer not null default 1,
  next_invoice_seq    integer not null default 1,
  language            text    not null default 'de',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create trigger trg_business_settings_updated before update on business_settings
  for each row execute function set_updated_at();

-- ============================================================================
-- customers
-- ============================================================================
create table customers (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  customer_type  customer_type not null default 'private',
  name           text not null,
  contact_person text,
  phone          text,
  email          text,
  address        text,
  notes          text,
  -- optional industry fields (shown conditionally by business type)
  vehicle_plate      text,
  vehicle_brand      text,
  vehicle_model      text,
  repair_notes       text,
  property_size      text,
  cleaning_frequency text,
  service_location   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_customers_user on customers(user_id);
create trigger trg_customers_updated before update on customers
  for each row execute function set_updated_at();

-- ============================================================================
-- offers + items + acceptance
-- ============================================================================
create table offers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  customer_id   uuid not null references customers(id) on delete restrict,
  offer_number  text not null,
  date          date not null default current_date,
  status        offer_status not null default 'draft',
  notes         text,
  internal_notes text,
  subtotal      integer not null default 0,   -- cents
  tax_total     integer not null default 0,   -- cents
  grand_total   integer not null default 0,   -- cents
  currency      text not null default 'EUR',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, offer_number)
);
create index idx_offers_user on offers(user_id);
create index idx_offers_customer on offers(customer_id);
create trigger trg_offers_updated before update on offers
  for each row execute function set_updated_at();

create table offer_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  offer_id    uuid not null references offers(id) on delete cascade,
  title       text not null,
  description text,
  quantity    numeric(12,3) not null default 1,
  unit        text,
  unit_price  integer not null default 0,      -- cents
  tax_rate    numeric(5,2) not null default 19.00,
  line_total  integer not null default 0,      -- cents (net)
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index idx_offer_items_offer on offer_items(offer_id);

create table offer_acceptances (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  offer_id        uuid not null references offers(id) on delete cascade,
  signature_image text,        -- PNG data-URL
  signature_text  text,        -- typed-name fallback
  signer_name     text,
  signed_at       timestamptz not null default now(),
  unique (offer_id)            -- one acceptance per offer
);
create index idx_offer_acceptances_offer on offer_acceptances(offer_id);

-- ============================================================================
-- invoices + items
-- ============================================================================
create table invoices (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  customer_id     uuid not null references customers(id) on delete restrict,
  source_offer_id uuid references offers(id) on delete set null,
  invoice_number  text not null,
  date            date not null default current_date,
  due_date        date,
  status          invoice_status not null default 'open',
  paid_at         timestamptz,
  notes           text,
  subtotal        integer not null default 0,  -- cents
  tax_total       integer not null default 0,  -- cents
  grand_total     integer not null default 0,  -- cents
  currency        text not null default 'EUR',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, invoice_number)
);
create index idx_invoices_user on invoices(user_id);
create index idx_invoices_customer on invoices(customer_id);
create index idx_invoices_source_offer on invoices(source_offer_id);
create trigger trg_invoices_updated before update on invoices
  for each row execute function set_updated_at();

create table invoice_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  invoice_id  uuid not null references invoices(id) on delete cascade,
  title       text not null,
  description text,
  quantity    numeric(12,3) not null default 1,
  unit        text,
  unit_price  integer not null default 0,      -- cents
  tax_rate    numeric(5,2) not null default 19.00,
  line_total  integer not null default 0,      -- cents (net)
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index idx_invoice_items_invoice on invoice_items(invoice_id);

-- ============================================================================
-- Atomic document-number generator
-- Usage (from the app, on finalize):
--   select next_document_number('offer');   -> e.g. 'A-2026-0001'
--   select next_document_number('invoice');
-- ============================================================================
create or replace function next_document_number(doc_type text)
returns text language plpgsql security definer set search_path = public as $$
declare
  seq     integer;
  prefix  text;
  result  text;
begin
  if doc_type = 'offer' then
    update business_settings
      set next_offer_seq = next_offer_seq + 1
      where user_id = auth.uid()
      returning next_offer_seq - 1, offer_number_prefix into seq, prefix;
  elsif doc_type = 'invoice' then
    update business_settings
      set next_invoice_seq = next_invoice_seq + 1
      where user_id = auth.uid()
      returning next_invoice_seq - 1, invoice_number_prefix into seq, prefix;
  else
    raise exception 'unknown doc_type: %', doc_type;
  end if;

  result := prefix || to_char(current_date, 'YYYY') || '-' || lpad(seq::text, 4, '0');
  return result;
end; $$;

-- ============================================================================
-- Row-Level Security — enable + owner-only policies on every table
-- ============================================================================
alter table profiles          enable row level security;
alter table business_settings enable row level security;
alter table customers         enable row level security;
alter table offers            enable row level security;
alter table offer_items       enable row level security;
alter table offer_acceptances enable row level security;
alter table invoices          enable row level security;
alter table invoice_items     enable row level security;

-- profiles keyed by id (= auth user)
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- everything else keyed by user_id
create policy "own rows" on business_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on customers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on offers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on offer_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on offer_acceptances
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on invoice_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Storage buckets (create in Dashboard → Storage, or via API):
--   * 'logos'      — business logos (private; owner read/write)
--   * 'signatures' — captured signature PNGs (private; owner read/write)
-- Add matching storage RLS policies keyed to (storage.foldername(name))[1] = auth.uid()::text
-- ============================================================================

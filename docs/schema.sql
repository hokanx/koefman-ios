-- KÖFMAN Simple Office — schema.sql
--
-- NOTE: This file was reconstructed from docs/SPEC.md section 4 ("Data model")
-- because the original schema.sql was not included in this session's inputs.
-- Per the Phase 1 kickoff doc, the intended workflow is: create a fresh Supabase
-- project, run schema.sql in the SQL editor, THEN start Claude Code — so a
-- schema may already be live on your project. Before running this, diff it
-- against whatever you already applied; do not run it a second time against a
-- project that already has these tables (it is not written to be idempotent
-- against manual edits you may have made).
--
-- Single-owner-per-install model: every row is keyed to auth.uid() via RLS.
-- Money is stored as integer minor units (cents) to avoid float errors.

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at current on every row update
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on profiles for update using (id = auth.uid());
create policy "profiles_delete_own" on profiles for delete using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- business_settings — one row per user
-- ---------------------------------------------------------------------------
create table business_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  business_name text not null default '',
  address text,
  email text,
  phone text,
  tax_number text,
  vat_id text,
  logo_url text,
  brand_primary_color text not null default '#0F1115',
  brand_accent_color text not null default '#D4AF37',
  pdf_footer_note text,
  currency text not null default 'EUR',
  default_tax_rate numeric(5, 2) not null default 19.00,
  payment_terms text,
  offer_number_prefix text not null default 'ANG-',
  invoice_number_prefix text not null default 'RE-',
  next_offer_seq integer not null default 1,
  next_invoice_seq integer not null default 1,
  language text not null default 'de',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger business_settings_set_updated_at
  before update on business_settings
  for each row execute function set_updated_at();

alter table business_settings enable row level security;

create policy "business_settings_select_own" on business_settings for select using (user_id = auth.uid());
create policy "business_settings_insert_own" on business_settings for insert with check (user_id = auth.uid());
create policy "business_settings_update_own" on business_settings for update using (user_id = auth.uid());
create policy "business_settings_delete_own" on business_settings for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Auto-provision profile + business_settings on signup
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.business_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create type customer_type as enum ('private', 'business');

create table customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_type customer_type not null default 'private',
  name text not null,
  contact_person text,
  phone text,
  email text,
  address text,
  notes text,
  -- industry fields, shown conditionally in the UI by business type
  vehicle_plate text,
  vehicle_brand text,
  vehicle_model text,
  repair_notes text,
  property_size text,
  cleaning_frequency text,
  service_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_user_id_idx on customers (user_id);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

alter table customers enable row level security;

create policy "customers_select_own" on customers for select using (user_id = auth.uid());
create policy "customers_insert_own" on customers for insert with check (user_id = auth.uid());
create policy "customers_update_own" on customers for update using (user_id = auth.uid());
create policy "customers_delete_own" on customers for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- offers
-- ---------------------------------------------------------------------------
create type offer_status as enum ('draft', 'sent', 'signed', 'rejected');

create table offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  offer_number text not null,
  customer_id uuid not null references customers (id) on delete restrict,
  date date not null default current_date,
  status offer_status not null default 'draft',
  notes text,
  internal_notes text,
  subtotal integer not null default 0,
  tax_total integer not null default 0,
  grand_total integer not null default 0,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, offer_number)
);

create index offers_user_id_idx on offers (user_id);
create index offers_customer_id_idx on offers (customer_id);

create trigger offers_set_updated_at
  before update on offers
  for each row execute function set_updated_at();

alter table offers enable row level security;

create policy "offers_select_own" on offers for select using (user_id = auth.uid());
create policy "offers_insert_own" on offers for insert with check (user_id = auth.uid());
create policy "offers_update_own" on offers for update using (user_id = auth.uid());
create policy "offers_delete_own" on offers for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- offer_items
-- ---------------------------------------------------------------------------
create table offer_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  offer_id uuid not null references offers (id) on delete cascade,
  title text not null,
  description text,
  quantity numeric(10, 2) not null default 1,
  unit text not null default 'pcs',
  unit_price integer not null default 0,
  tax_rate numeric(5, 2) not null default 19.00,
  line_total integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index offer_items_offer_id_idx on offer_items (offer_id);

create trigger offer_items_set_updated_at
  before update on offer_items
  for each row execute function set_updated_at();

alter table offer_items enable row level security;

create policy "offer_items_select_own" on offer_items for select using (user_id = auth.uid());
create policy "offer_items_insert_own" on offer_items for insert with check (user_id = auth.uid());
create policy "offer_items_update_own" on offer_items for update using (user_id = auth.uid());
create policy "offer_items_delete_own" on offer_items for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- offer_acceptances — signature capture, one per signed offer
-- ---------------------------------------------------------------------------
create table offer_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  offer_id uuid not null unique references offers (id) on delete cascade,
  signature_image text not null, -- PNG data-URL
  signature_text text,           -- typed-name fallback
  signer_name text not null,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index offer_acceptances_offer_id_idx on offer_acceptances (offer_id);

alter table offer_acceptances enable row level security;

create policy "offer_acceptances_select_own" on offer_acceptances for select using (user_id = auth.uid());
create policy "offer_acceptances_insert_own" on offer_acceptances for insert with check (user_id = auth.uid());
create policy "offer_acceptances_update_own" on offer_acceptances for update using (user_id = auth.uid());
create policy "offer_acceptances_delete_own" on offer_acceptances for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------
create type invoice_status as enum ('open', 'paid', 'overdue', 'cancelled');

create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  invoice_number text not null,
  customer_id uuid not null references customers (id) on delete restrict,
  source_offer_id uuid references offers (id) on delete set null,
  date date not null default current_date,
  due_date date not null default (current_date + interval '14 days'),
  status invoice_status not null default 'open',
  paid_at timestamptz,
  notes text,
  subtotal integer not null default 0,
  tax_total integer not null default 0,
  grand_total integer not null default 0,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index invoices_user_id_idx on invoices (user_id);
create index invoices_customer_id_idx on invoices (customer_id);
create index invoices_source_offer_id_idx on invoices (source_offer_id);

create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();

alter table invoices enable row level security;

create policy "invoices_select_own" on invoices for select using (user_id = auth.uid());
create policy "invoices_insert_own" on invoices for insert with check (user_id = auth.uid());
create policy "invoices_update_own" on invoices for update using (user_id = auth.uid());
create policy "invoices_delete_own" on invoices for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- invoice_items
-- ---------------------------------------------------------------------------
create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  invoice_id uuid not null references invoices (id) on delete cascade,
  title text not null,
  description text,
  quantity numeric(10, 2) not null default 1,
  unit text not null default 'pcs',
  unit_price integer not null default 0,
  tax_rate numeric(5, 2) not null default 19.00,
  line_total integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index invoice_items_invoice_id_idx on invoice_items (invoice_id);

create trigger invoice_items_set_updated_at
  before update on invoice_items
  for each row execute function set_updated_at();

alter table invoice_items enable row level security;

create policy "invoice_items_select_own" on invoice_items for select using (user_id = auth.uid());
create policy "invoice_items_insert_own" on invoice_items for insert with check (user_id = auth.uid());
create policy "invoice_items_update_own" on invoice_items for update using (user_id = auth.uid());
create policy "invoice_items_delete_own" on invoice_items for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Atomic number sequences — call these on finalize (draft -> sent, or invoice
-- creation) so offer/invoice numbers never gap or collide under concurrent use.
-- ---------------------------------------------------------------------------
create or replace function next_offer_number(p_user_id uuid)
returns text as $$
declare
  v_prefix text;
  v_seq integer;
begin
  update business_settings
    set next_offer_seq = next_offer_seq + 1
    where user_id = p_user_id
    returning offer_number_prefix, next_offer_seq - 1 into v_prefix, v_seq;

  if v_prefix is null then
    raise exception 'business_settings row not found for user %', p_user_id;
  end if;

  return v_prefix || v_seq::text;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function next_invoice_number(p_user_id uuid)
returns text as $$
declare
  v_prefix text;
  v_seq integer;
begin
  update business_settings
    set next_invoice_seq = next_invoice_seq + 1
    where user_id = p_user_id
    returning invoice_number_prefix, next_invoice_seq - 1 into v_prefix, v_seq;

  if v_prefix is null then
    raise exception 'business_settings row not found for user %', p_user_id;
  end if;

  return v_prefix || v_seq::text;
end;
$$ language plpgsql security definer set search_path = public;

-- ---------------------------------------------------------------------------
-- Storage buckets (private): create these in the Supabase dashboard, then
-- apply matching storage policies, e.g.:
--
--   insert into storage.buckets (id, name, public) values ('logos', 'logos', false);
--   insert into storage.buckets (id, name, public) values ('signatures', 'signatures', false);
--
--   create policy "logos_owner_rw" on storage.objects for all
--     using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text)
--     with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);
--
--   create policy "signatures_owner_rw" on storage.objects for all
--     using (bucket_id = 'signatures' and (storage.foldername(name))[1] = auth.uid()::text)
--     with check (bucket_id = 'signatures' and (storage.foldername(name))[1] = auth.uid()::text);
-- ---------------------------------------------------------------------------

-- Smart Shine Car Valeting Centre — Supabase Setup
-- Run this in your Supabase project: Dashboard > SQL Editor > New Query

-- 1. Services table
create table if not exists services (
  id bigserial primary key,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null,
  duration integer not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Bookings table
create table if not exists bookings (
  id bigserial primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  service_id integer not null,
  service_name text not null,
  service_price numeric(10,2) not null,
  date text not null,
  time text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

-- 3. Reviews table
create table if not exists reviews (
  id bigserial primary key,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  service_name text,
  created_at timestamptz not null default now()
);

-- 4. Settings table
create table if not exists settings (
  id bigserial primary key,
  business_name text not null default 'Smart Shine Car Valeting Centre',
  address text not null default 'Guildford, Surrey',
  phone text not null default '+44 7700 000000',
  email text not null default 'info@smartshine.co.uk',
  open_time text not null default '08:00',
  close_time text not null default '19:00',
  slot_duration integer not null default 30,
  working_days text not null default 'Mon,Tue,Wed,Thu,Fri,Sat',
  updated_at timestamptz
);

-- 5. Seed default settings
insert into settings (id) values (1) on conflict (id) do nothing;

-- 6. Seed sample services
insert into services (name, description, price, duration, is_active) values
  ('Mini Valet', 'Exterior wash, vacuum interior, wipe down dash', 35.00, 60, true),
  ('Full Valet', 'Full interior & exterior clean, polish, wax', 75.00, 120, true),
  ('Executive Valet', 'Deep clean, machine polish, full protection', 150.00, 240, true),
  ('Engine Clean', 'Engine bay degreased and cleaned', 50.00, 60, true),
  ('Ceramic Coating', 'Long-lasting ceramic protection applied', 250.00, 300, true)
on conflict do nothing;

-- 7. Site content table (CMS)
create table if not exists site_content (
  id bigserial primary key,
  key text not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- 8. Disable RLS (since we use service_role key from server)
alter table services disable row level security;
alter table bookings disable row level security;
alter table reviews disable row level security;
alter table settings disable row level security;
alter table site_content disable row level security;

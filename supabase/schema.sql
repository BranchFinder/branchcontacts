-- Supabase → SQL Editor میں یہ پوری فائل چلا دیں
create table categories (
  slug text primary key,
  name text not null,
  blurb text
);

create table brands (
  slug text primary key,
  name text not null,
  full_name text,
  category text references categories(slug),
  helpline text,
  website text,
  blurb text
);

create table cities (
  slug text primary key,
  name text not null,
  province text,
  lat double precision,
  lng double precision
);

create table branches (
  id bigint generated always as identity primary key,
  slug text not null,
  brand text references brands(slug),
  city text references cities(slug),
  name text not null,
  address text,
  phone text,
  branch_code text,
  hours text,
  features text[] default '{}',
  lat double precision,
  lng double precision,
  updated date default current_date,
  unique (brand, city, slug)
);

create index on branches (brand);
create index on branches (city);

-- عوامی پڑھنے کی اجازت (ویب سائٹ کو صرف پڑھنا ہے)
alter table categories enable row level security;
alter table brands enable row level security;
alter table cities enable row level security;
alter table branches enable row level security;
create policy "public read" on categories for select using (true);
create policy "public read" on brands for select using (true);
create policy "public read" on cities for select using (true);
create policy "public read" on branches for select using (true);

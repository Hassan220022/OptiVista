-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id),
  brand text,
  description text,
  frame_type text,
  frame_material text,
  frame_color text,
  lens_width_mm integer,
  bridge_width_mm integer,
  temple_length_mm integer,
  price_cents integer not null,
  currency_code text default 'USD',
  thumbnail_url text,
  is_active boolean default true,
  stock_quantity integer default 0,
  avg_rating numeric(2,1) default 0.0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index products_category_id_idx on public.products(category_id);
create index products_slug_idx on public.products(slug);
create index products_brand_idx on public.products(brand);

-- Enable RLS
alter table public.products enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.products
  for each row execute procedure moddatetime (updated_at);

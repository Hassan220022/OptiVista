-- Create carts table
create table public.carts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  status text check (status in ('active', 'converted', 'abandoned')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create cart_items table
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  cart_id uuid references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer default 1,
  unit_price_cents integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.carts
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at before update on public.cart_items
  for each row execute procedure moddatetime (updated_at);

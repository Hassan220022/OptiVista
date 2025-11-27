-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  status text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount_cents integer not null,
  currency_code text default 'USD',
  shipping_address_json jsonb,
  payment_provider text,
  payment_reference text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create order_items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  unit_price_cents integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.orders
  for each row execute procedure moddatetime (updated_at);
create trigger handle_updated_at before update on public.order_items
  for each row execute procedure moddatetime (updated_at);

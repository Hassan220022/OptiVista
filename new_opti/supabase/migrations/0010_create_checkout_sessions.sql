-- Create checkout_sessions table for managing checkout flow
create table public.checkout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  cart_id uuid references public.carts(id) on delete set null,
  address_id uuid,
  shipping_method_id text,
  promo_code text,
  subtotal_cents integer not null default 0,
  shipping_cost_cents integer not null default 0,
  tax_amount_cents integer not null default 0,
  discount_amount_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'USD',
  payment_intent_id text,
  payment_method text,
  status text not null default 'pending' check (status in ('pending', 'payment_initiated', 'completed', 'cancelled', 'expired')),
  order_id uuid,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index checkout_sessions_user_id_idx on public.checkout_sessions(user_id);
create index checkout_sessions_status_idx on public.checkout_sessions(status);
create index checkout_sessions_expires_at_idx on public.checkout_sessions(expires_at);

-- Enable RLS
alter table public.checkout_sessions enable row level security;

-- RLS policies
create policy "Users can view own checkout sessions"
  on public.checkout_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own checkout sessions"
  on public.checkout_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkout sessions"
  on public.checkout_sessions for update
  using (auth.uid() = user_id);

-- Trigger for updated_at
create trigger handle_checkout_sessions_updated_at before update on public.checkout_sessions
  for each row execute procedure moddatetime (updated_at);

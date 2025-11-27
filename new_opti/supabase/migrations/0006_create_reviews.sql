-- Create reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  title text,
  body text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index reviews_product_id_idx on public.reviews(product_id);
create index reviews_user_id_idx on public.reviews(user_id);

-- Enable RLS
alter table public.reviews enable row level security;

-- Trigger for updated_at
create trigger handle_updated_at before update on public.reviews
  for each row execute procedure moddatetime (updated_at);

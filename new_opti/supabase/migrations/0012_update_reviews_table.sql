-- Add missing columns to reviews table to match the prompt specification

-- Add order_id for verified purchase tracking
alter table public.reviews 
  add column if not exists order_id uuid references public.orders(id) on delete set null;

-- Add is_verified_purchase flag
alter table public.reviews 
  add column if not exists is_verified_purchase boolean default false;

-- Add is_approved for moderation
alter table public.reviews 
  add column if not exists is_approved boolean default true;

-- Add helpful_count for review usefulness
alter table public.reviews 
  add column if not exists helpful_count integer default 0;

-- Add additional indexes
create index if not exists reviews_is_approved_idx on public.reviews(is_approved);
create index if not exists reviews_rating_idx on public.reviews(rating);
create index if not exists reviews_order_id_idx on public.reviews(order_id);

-- Update RLS policies for moderated reviews
drop policy if exists "Anyone can view approved reviews" on public.reviews;
create policy "Anyone can view approved reviews"
  on public.reviews for select
  using (is_approved = true);

drop policy if exists "Users can view own pending reviews" on public.reviews;
create policy "Users can view own pending reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

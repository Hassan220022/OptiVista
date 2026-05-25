-- ==========================================================================
-- OptiVista — Complete Initial Migration
-- Fresh self-hosted Supabase instance
-- Consolidates all prior migrations (0002–0013) + RLS policies + storage
-- Security-audited: no role escalation, no recursive RLS, search_path locked
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 0. Extensions
-- --------------------------------------------------------------------------
create extension if not exists "uuid-ossp"      schema extensions;
create extension if not exists moddatetime       schema extensions;

-- --------------------------------------------------------------------------
-- 1. Helper functions (must exist before RLS policies reference them)
--    All SECURITY DEFINER functions use SET search_path to prevent injection.
--    is_admin/is_seller query profiles directly — safe because SECURITY DEFINER
--    runs as the migration owner (typically postgres), bypassing RLS.
-- --------------------------------------------------------------------------

-- is_admin(): returns true when the current user's profile role is 'admin'
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- is_seller(): returns true when the current user is an approved seller
create or replace function public.is_seller()
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'seller'
      and is_seller_approved = true
  );
$$;

-- --------------------------------------------------------------------------
-- 2. Profiles (includes seller fields from 0013)
-- --------------------------------------------------------------------------
create table public.profiles (
  id                      uuid not null references auth.users(id) on delete cascade primary key,
  full_name               text,
  phone_number            text,
  gender                  text check (gender in ('male', 'female', 'other')),
  pd_value_mm             numeric(5,2),
  preferred_language      text default 'en',
  avatar_url              text,
  -- Role: user | admin | seller
  role                    text default 'user' check (role in ('user', 'admin', 'seller')),
  -- Seller fields
  store_name              text,
  store_description       text,
  store_logo_url          text,
  is_seller_approved      boolean default false,
  seller_approved_at      timestamptz,
  seller_commission_rate  numeric(5,2) default 10.00,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table public.profiles enable row level security;

create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute procedure moddatetime(updated_at);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer set search_path = public, extensions;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Prevent users from escalating their own role or approving themselves as seller
create or replace function public.prevent_role_escalation()
returns trigger as $$
begin
  -- Only admins can change role, is_seller_approved, or seller_commission_rate
  if (NEW.role <> OLD.role
      or NEW.is_seller_approved <> OLD.is_seller_approved
      or NEW.seller_commission_rate <> OLD.seller_commission_rate)
     and not public.is_admin() then
    raise exception 'Cannot modify privileged fields: role, is_seller_approved, or seller_commission_rate';
  end if;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, extensions;

create trigger prevent_role_escalation_trigger
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- Profiles RLS
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id and role = 'user');

create policy "Users can update own non-privileged fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Sellers can view other seller profiles (for marketplace browsing)
create policy "Sellers can view seller profiles"
  on public.profiles for select
  using (role = 'seller' and is_seller_approved = true);

-- --------------------------------------------------------------------------
-- 3. Categories
-- --------------------------------------------------------------------------
create table public.categories (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  gender      text check (gender in ('male', 'female', 'unisex')),
  image_url   text,
  sort_order  integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.categories enable row level security;

create trigger handle_categories_updated_at before update on public.categories
  for each row execute procedure moddatetime(updated_at);

-- Categories RLS: public read, admin write
create policy "Public read access for categories"
  on public.categories for select
  to authenticated, anon
  using (is_active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 4. Products (includes seller_id from 0013)
-- --------------------------------------------------------------------------
create table public.products (
  id                uuid default gen_random_uuid() primary key,
  name              text not null,
  slug              text not null unique,
  category_id       uuid references public.categories(id),
  seller_id         uuid references public.profiles(id),
  brand             text,
  description       text,
  frame_type        text,
  frame_material    text,
  frame_color       text,
  lens_width_mm     integer,
  bridge_width_mm   integer,
  temple_length_mm  integer,
  price_cents       integer not null,
  currency_code     text default 'USD',
  thumbnail_url     text,
  is_active         boolean default true,
  stock_quantity    integer default 0,
  avg_rating        numeric(2,1) default 0.0,
  ar_enabled        boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_slug_idx         on public.products(slug);
create index products_brand_idx        on public.products(brand);
create index products_seller_id_idx    on public.products(seller_id);

alter table public.products enable row level security;

create trigger handle_products_updated_at before update on public.products
  for each row execute procedure moddatetime(updated_at);

-- Products RLS — explicit per-action policies (no overlapping FOR ALL)
create policy "Public read access for products"
  on public.products for select
  to authenticated, anon
  using (is_active = true);

create policy "Sellers can insert own products"
  on public.products for insert
  to authenticated
  with check (seller_id = auth.uid() and public.is_seller());

create policy "Sellers can update own products"
  on public.products for update
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

create policy "Sellers can delete own products"
  on public.products for delete
  using (seller_id = auth.uid());

create policy "Admins can manage all products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- --------------------------------------------------------------------------
-- 5. Product Images (gallery — replaces MySQL `pictures` table)
-- --------------------------------------------------------------------------
create table public.product_images (
  id          uuid default gen_random_uuid() primary key,
  product_id  uuid not null references public.products(id) on delete cascade,
  image_url   text not null,
  alt_text    text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

create index product_images_product_id_idx on public.product_images(product_id);

alter table public.product_images enable row level security;

-- Only show images for active products
create policy "Public read active product images"
  on public.product_images for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_active = true
    )
  );

create policy "Admins can manage all product images"
  on public.product_images for all
  using (public.is_admin());

create policy "Sellers can manage own product images"
  on public.product_images for all
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.seller_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------------
-- 6. AR Assets
-- --------------------------------------------------------------------------
create table public.ar_assets (
  id                      uuid default gen_random_uuid() primary key,
  product_id              uuid references public.products(id) on delete cascade,
  supabase_path_ar_model  text not null,
  supabase_path_texture   text,
  scale_factor            numeric(6,3) default 1.0,
  offset_x                numeric(6,3) default 0.0,
  offset_y                numeric(6,3) default 0.0,
  offset_z                numeric(6,3) default 0.0,
  platform_notes          text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

alter table public.ar_assets enable row level security;

create trigger handle_ar_assets_updated_at before update on public.ar_assets
  for each row execute procedure moddatetime(updated_at);

-- AR Assets RLS: authenticated read, admin write
create policy "Authenticated read access for AR assets"
  on public.ar_assets for select
  to authenticated
  using (true);

create policy "Admins can manage AR assets"
  on public.ar_assets for all
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 7. Reviews (includes 0012 additions: order_id, is_verified_purchase, etc.)
-- --------------------------------------------------------------------------
create table public.reviews (
  id                    uuid default gen_random_uuid() primary key,
  product_id            uuid references public.products(id) on delete cascade,
  user_id               uuid references public.profiles(id) on delete cascade,
  seller_id             uuid references public.profiles(id),
  order_id              uuid references public.orders(id) on delete set null,
  rating                integer check (rating >= 1 and rating <= 5),
  title                 text,
  body                  text,
  is_verified_purchase  boolean default false,
  is_approved           boolean default true,
  helpful_count         integer default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index reviews_product_id_idx     on public.reviews(product_id);
create index reviews_user_id_idx        on public.reviews(user_id);
create index reviews_is_approved_idx    on public.reviews(is_approved);
create index reviews_rating_idx         on public.reviews(rating);
create index reviews_order_id_idx       on public.reviews(order_id);

alter table public.reviews enable row level security;

create trigger handle_reviews_updated_at before update on public.reviews
  for each row execute procedure moddatetime(updated_at);

-- Protect is_verified_purchase and is_approved from user modification
create or replace function public.protect_review_fields()
returns trigger as $$
begin
  if (NEW.is_verified_purchase <> OLD.is_verified_purchase
      or NEW.is_approved <> OLD.is_approved)
     and not public.is_admin() then
    raise exception 'Cannot modify verified/approved fields';
  end if;
  return NEW;
end;
$$ language plpgsql security definer set search_path = public, extensions;

create trigger protect_review_fields_trigger
  before update on public.reviews
  for each row execute function public.protect_review_fields();

-- Reviews RLS
create policy "Anyone can view approved reviews"
  on public.reviews for select
  to authenticated, anon
  using (is_approved = true);

create policy "Users can view own pending reviews"
  on public.reviews for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own reviews"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can delete any review"
  on public.reviews for delete
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 8. Carts & Cart Items
-- --------------------------------------------------------------------------
create table public.carts (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  status      text check (status in ('active', 'converted', 'abandoned')) default 'active',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table public.cart_items (
  id                uuid default gen_random_uuid() primary key,
  cart_id           uuid references public.carts(id) on delete cascade,
  product_id        uuid references public.products(id) on delete cascade,
  quantity          integer default 1,
  unit_price_cents  integer not null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.carts       enable row level security;
alter table public.cart_items  enable row level security;

create trigger handle_carts_updated_at before update on public.carts
  for each row execute procedure moddatetime(updated_at);
create trigger handle_cart_items_updated_at before update on public.cart_items
  for each row execute procedure moddatetime(updated_at);

-- Carts RLS
create policy "Users can view own carts"
  on public.carts for select
  using (auth.uid() = user_id);

create policy "Users can create own carts"
  on public.carts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own carts"
  on public.carts for update
  using (auth.uid() = user_id);

create policy "Users can delete own carts"
  on public.carts for delete
  using (auth.uid() = user_id);

-- Cart Items RLS
create policy "Users can view own cart items"
  on public.cart_items for select
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

create policy "Users can insert own cart items"
  on public.cart_items for insert
  with check (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

create policy "Users can update own cart items"
  on public.cart_items for update
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------------
-- 9. Addresses
-- --------------------------------------------------------------------------
create table public.addresses (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references public.profiles(id) on delete cascade not null,
  label             text default 'Home',
  full_name         text not null,
  phone             text,
  street_address    text not null,
  street_address_2 text,
  city              text not null,
  state             text,
  postal_code       text not null,
  country           text not null default 'US',
  is_default        boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index addresses_user_id_idx     on public.addresses(user_id);
create index addresses_is_default_idx on public.addresses(is_default);

alter table public.addresses enable row level security;

create trigger handle_addresses_updated_at before update on public.addresses
  for each row execute procedure moddatetime(updated_at);

-- Ensure only one default address per user
create or replace function ensure_single_default_address()
returns trigger as $$
begin
  if NEW.is_default = true then
    update public.addresses
    set is_default = false
    where user_id = NEW.user_id and id != NEW.id;
  end if;
  return NEW;
end;
$$ language plpgsql set search_path = public;

create trigger ensure_single_default_address_trigger
  before insert or update on public.addresses
  for each row execute function ensure_single_default_address();

-- Addresses RLS
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can create own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 10. Orders & Order Items
--    user_id is NOT NULL — every order must have an owner
-- --------------------------------------------------------------------------
create table public.orders (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid not null references public.profiles(id),
  status                text check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount_cents    integer not null,
  currency_code         text default 'USD',
  shipping_address_json jsonb,
  payment_provider      text,
  payment_reference     text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table public.order_items (
  id                uuid default gen_random_uuid() primary key,
  order_id          uuid references public.orders(id) on delete cascade,
  product_id        uuid references public.products(id),
  quantity          integer not null,
  unit_price_cents  integer not null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create trigger handle_orders_updated_at before update on public.orders
  for each row execute procedure moddatetime(updated_at);
create trigger handle_order_items_updated_at before update on public.order_items
  for each row execute procedure moddatetime(updated_at);

-- Orders RLS: users can create and view, but NOT update status (use cancel_own_order)
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Users can only cancel their own pending orders via stored procedure
-- (no direct UPDATE policy for regular users)
create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can manage all orders"
  on public.orders for all
  using (public.is_admin());

-- Stored procedure for users to cancel their own pending orders
create or replace function public.cancel_own_order(p_order_id uuid)
returns void as $$
begin
  update public.orders
  set status = 'cancelled'
  where id = p_order_id
    and user_id = auth.uid()
    and status = 'pending';
end;
$$ language plpgsql security definer set search_path = public, extensions;

-- Order Items RLS
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_items.order_id and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 11. Checkout Sessions
-- --------------------------------------------------------------------------
create table public.checkout_sessions (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references public.profiles(id) on delete cascade not null,
  cart_id               uuid references public.carts(id) on delete set null,
  address_id            uuid references public.addresses(id),
  shipping_method_id    text,
  promo_code            text,
  subtotal_cents        integer not null default 0,
  shipping_cost_cents   integer not null default 0,
  tax_amount_cents      integer not null default 0,
  discount_amount_cents integer not null default 0,
  total_cents           integer not null default 0,
  currency              text not null default 'USD',
  payment_intent_id     text,
  payment_method        text,
  status                text not null default 'pending'
                        check (status in ('pending', 'payment_initiated', 'completed', 'cancelled', 'expired')),
  order_id              uuid references public.orders(id),
  expires_at            timestamptz not null,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index checkout_sessions_user_id_idx    on public.checkout_sessions(user_id);
create index checkout_sessions_status_idx    on public.checkout_sessions(status);
create index checkout_sessions_expires_at_idx on public.checkout_sessions(expires_at);

alter table public.checkout_sessions enable row level security;

create trigger handle_checkout_sessions_updated_at before update on public.checkout_sessions
  for each row execute procedure moddatetime(updated_at);

-- Checkout Sessions RLS
create policy "Users can view own checkout sessions"
  on public.checkout_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own checkout sessions"
  on public.checkout_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkout sessions"
  on public.checkout_sessions for update
  using (auth.uid() = user_id);

create policy "Admins can view all checkout sessions"
  on public.checkout_sessions for select
  using (public.is_admin());

create policy "Admins can manage checkout sessions"
  on public.checkout_sessions for all
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 12. Feedback
-- --------------------------------------------------------------------------
create table public.feedback (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id),
  type        text check (type in ('AR_accuracy', 'UX', 'performance', 'other')),
  rating      integer check (rating >= 1 and rating <= 5),
  message     text,
  device_info jsonb,
  created_at  timestamptz default now()
);

alter table public.feedback enable row level security;

-- Feedback RLS
create policy "Users can view own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can create feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all feedback"
  on public.feedback for select
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 13. Wishlist (from MySQL schema, missing from Supabase migrations)
-- --------------------------------------------------------------------------
create table public.wishlist (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, product_id)
);

create index wishlist_user_id_idx    on public.wishlist(user_id);
create index wishlist_product_id_idx on public.wishlist(product_id);

alter table public.wishlist enable row level security;

-- Wishlist RLS
create policy "Users can view own wishlist"
  on public.wishlist for select
  using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from own wishlist"
  on public.wishlist for delete
  using (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- 14. Seller Stats (from 0013)
-- --------------------------------------------------------------------------
create table public.seller_stats (
  id                  uuid default gen_random_uuid() primary key,
  seller_id           uuid not null references public.profiles(id) on delete cascade,
  date                date not null default current_date,
  total_orders        integer default 0,
  total_revenue_cents bigint default 0,
  total_products      integer default 0,
  total_views         integer default 0,
  created_at          timestamptz default now(),
  unique(seller_id, date)
);

alter table public.seller_stats enable row level security;

create policy "Sellers can view own stats"
  on public.seller_stats for select
  using (seller_id = auth.uid());

create policy "Admins can view all stats"
  on public.seller_stats for all
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 15. Seller Payouts (from 0013)
-- --------------------------------------------------------------------------
create table public.seller_payouts (
  id              uuid default gen_random_uuid() primary key,
  seller_id       uuid not null references public.profiles(id) on delete cascade,
  amount_cents    bigint not null,
  currency        text default 'USD',
  status          text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  payout_method   text,
  payout_details  jsonb,
  processed_at    timestamptz,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.seller_payouts enable row level security;

create trigger handle_seller_payouts_updated_at before update on public.seller_payouts
  for each row execute procedure moddatetime(updated_at);

create policy "Sellers can view own payouts"
  on public.seller_payouts for select
  using (seller_id = auth.uid());

create policy "Admins can manage all payouts"
  on public.seller_payouts for all
  using (public.is_admin());

-- --------------------------------------------------------------------------
-- 16. Audit Logs (from MySQL schema, missing from Supabase migrations)
-- --------------------------------------------------------------------------
create table public.audit_logs (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete set null,
  action      text not null,
  details     jsonb,
  ip_address  inet,
  created_at  timestamptz default now()
);

create index audit_logs_user_id_idx  on public.audit_logs(user_id);
create index audit_logs_action_idx    on public.audit_logs(action);
create index audit_logs_created_at_idx on public.audit_logs(created_at);

alter table public.audit_logs enable row level security;

-- Audit Logs RLS: only admins can read, service role writes
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

-- No INSERT policy for regular users — only service_role can insert
-- (via backend API with service_role key)

-- --------------------------------------------------------------------------
-- 17. Storage Buckets
-- --------------------------------------------------------------------------

-- Product Images bucket (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- AR Models bucket (authenticated read)
-- NOTE: removed application/octet-stream to prevent arbitrary file uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ar-models',
  'ar-models',
  false,
  52428800,  -- 50 MB (3D models are large)
  array['model/gltf-binary', 'model/vnd.usdz+zip']
) on conflict (id) do nothing;

-- User Avatars bucket (private, owner-only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-avatars',
  'user-avatars',
  false,
  2097152,  -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Review Images bucket (public read, authenticated upload)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-images',
  'review-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- --------------------------------------------------------------------------
-- 18. Storage RLS Policies
-- --------------------------------------------------------------------------

-- Product Images: public read, admin/seller write
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and public.is_admin()
  );

create policy "Sellers can upload own product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.uid()::text = (storage.foldername(name))[1]
    and public.is_seller()
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- AR Models: authenticated read, admin write
create policy "Authenticated read AR models"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'ar-models');

create policy "Admins can manage AR models"
  on storage.objects for insert
  with check (bucket_id = 'ar-models' and public.is_admin());

create policy "Admins can delete AR models"
  on storage.objects for delete
  using (bucket_id = 'ar-models' and public.is_admin());

-- User Avatars: owner read/write
create policy "Owner read user avatars"
  on storage.objects for select
  using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Owner upload user avatars"
  on storage.objects for insert
  with check (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Owner update user avatars"
  on storage.objects for update
  using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Owner delete user avatars"
  on storage.objects for delete
  using (bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Review Images: public read, authenticated upload
create policy "Public read review images"
  on storage.objects for select
  using (bucket_id = 'review-images');

create policy "Authenticated users can upload review images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'review-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Owner can delete review images"
  on storage.objects for delete
  using (
    bucket_id = 'review-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- --------------------------------------------------------------------------
-- 19. Realtime (enable for key tables — exclude checkout_sessions for security)
-- --------------------------------------------------------------------------
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.carts;
alter publication supabase_realtime add table public.cart_items;

-- ==========================================================================
-- End of initial migration
-- ==========================================================================
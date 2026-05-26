-- Allow seller dashboards to read the rows that power their own store views.
-- Public product/review policies only expose active/approved rows; sellers also need
-- their own inactive products and pending reviews for management screens.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
      and policyname = 'Sellers can view own products'
  ) then
    create policy "Sellers can view own products"
      on public.products for select
      to authenticated
      using (seller_id = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'reviews'
      and policyname = 'Sellers can view reviews for own store'
  ) then
    create policy "Sellers can view reviews for own store"
      on public.reviews for select
      to authenticated
      using (seller_id = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'Sellers can view orders containing own products'
  ) then
    create policy "Sellers can view orders containing own products"
      on public.orders for select
      to authenticated
      using (
        exists (
          select 1
          from public.order_items oi
          join public.products p on p.id = oi.product_id
          where oi.order_id = orders.id
            and p.seller_id = auth.uid()
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'Sellers can view order items for own products'
  ) then
    create policy "Sellers can view order items for own products"
      on public.order_items for select
      to authenticated
      using (
        exists (
          select 1
          from public.products p
          where p.id = order_items.product_id
            and p.seller_id = auth.uid()
        )
      );
  end if;
end $$;

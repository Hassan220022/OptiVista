-- Break the orders -> order_items -> orders RLS recursion introduced by seller
-- dashboard read access. Cross-table ownership checks for orders must bypass RLS.

create or replace function public.seller_can_view_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.order_items oi
    join public.products p on p.id = oi.product_id
    where oi.order_id = p_order_id
      and p.seller_id = auth.uid()
  );
$$;

drop policy if exists "Sellers can view orders containing own products"
  on public.orders;

create policy "Sellers can view orders containing own products"
  on public.orders for select
  to authenticated
  using (public.seller_can_view_order(id));

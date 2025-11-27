-- Orders policies
-- Users see only their own orders
create policy "Users can view own orders"
  on public.orders for select
  using ( auth.uid() = user_id );

-- Admin can see all
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Order Items policies
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_items.order_id
      and user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

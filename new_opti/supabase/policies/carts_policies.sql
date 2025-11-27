-- Carts policies
-- RLS where user_id = auth.uid()
create policy "Users can view own carts"
  on public.carts for select
  using ( auth.uid() = user_id );

create policy "Users can create own carts"
  on public.carts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own carts"
  on public.carts for update
  using ( auth.uid() = user_id );

-- Cart Items policies (via cart_id)
create policy "Users can view own cart items"
  on public.cart_items for select
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert own cart items"
  on public.cart_items for insert
  with check (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update own cart items"
  on public.cart_items for update
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete own cart items"
  on public.cart_items for delete
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id
      and user_id = auth.uid()
    )
  );

-- Make cart pricing authoritative in the database.
-- Supabase clients may create/update their cart items, but they must not be
-- trusted to set item prices.

create or replace function public.set_cart_item_unit_price()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if new.quantity is null or new.quantity < 1 then
    raise exception 'Quantity must be positive';
  end if;

  select price_cents
  into new.unit_price_cents
  from public.products
  where id = new.product_id
    and is_active = true;

  if new.unit_price_cents is null then
    raise exception 'Invalid product';
  end if;

  return new;
end;
$$;

drop trigger if exists set_cart_item_unit_price_trigger on public.cart_items;

create trigger set_cart_item_unit_price_trigger
  before insert or update on public.cart_items
  for each row execute function public.set_cart_item_unit_price();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cart_items_quantity_positive'
      and conrelid = 'public.cart_items'::regclass
  ) then
    alter table public.cart_items
      add constraint cart_items_quantity_positive check (quantity > 0) not valid;

    alter table public.cart_items validate constraint cart_items_quantity_positive;
  end if;
end $$;

alter policy "Users can insert own cart items"
  on public.cart_items
  with check (
    quantity > 0
    and exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

alter policy "Users can update own cart items"
  on public.cart_items
  using (
    exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  )
  with check (
    quantity > 0
    and exists (
      select 1 from public.carts
      where id = cart_items.cart_id and user_id = auth.uid()
    )
  );

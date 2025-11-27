-- Products policies
-- Allow SELECT to authenticated and anon
create policy "Public read access"
  on public.products for select
  to authenticated, anon
  using ( true );

-- Restrict INSERT/UPDATE/DELETE to admin users
create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

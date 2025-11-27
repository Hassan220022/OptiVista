-- Profiles policies
-- User can read/update only where id = auth.uid()
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Admins can read all (assuming role check via profiles or custom claims)
-- For now, using a simple check on the profiles table itself might cause recursion if not careful,
-- but typically admin policies are separate.
-- Here is a basic one:
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

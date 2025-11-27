-- Reviews policies
-- All can read
create policy "Public read access"
  on public.reviews for select
  to authenticated, anon
  using ( true );

-- User can create own reviews
create policy "Users can create own reviews"
  on public.reviews for insert
  with check ( auth.uid() = user_id );

-- User can update/delete own reviews
create policy "Users can update own reviews"
  on public.reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete own reviews"
  on public.reviews for delete
  using ( auth.uid() = user_id );

-- Admin can delete any review
create policy "Admins can delete any review"
  on public.reviews for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Allow admins to review and moderate all product reviews.
-- Required by the Supabase-only admin dashboard.

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reviews'
      and policyname = 'Admins can view all reviews'
  ) then
    create policy "Admins can view all reviews"
      on public.reviews for select
      to authenticated
      using (public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reviews'
      and policyname = 'Admins can update reviews'
  ) then
    create policy "Admins can update reviews"
      on public.reviews for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

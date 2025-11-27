-- Feedback policies
-- Only owner can read own feedback
create policy "Users can view own feedback"
  on public.feedback for select
  using ( auth.uid() = user_id );

-- Users can create feedback
create policy "Users can create feedback"
  on public.feedback for insert
  with check ( auth.uid() = user_id );

-- Admins can view all feedback
create policy "Admins can view all feedback"
  on public.feedback for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

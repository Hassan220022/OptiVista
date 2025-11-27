-- Storage policies (conceptual, applied to storage.objects)

-- Product Images: Public read
create policy "Public Access Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- AR Models: Authenticated read
create policy "Authenticated Access AR Models"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'ar-models' );

-- User Avatars: Owner read/write
create policy "Owner Access User Avatars"
  on storage.objects for select
  using ( bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Owner Upload User Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'user-avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- Storage buckets for media uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('property-images',  'property-images',  true, 10485760, array['image/jpeg','image/jpg','image/png','image/webp']),
  ('agent-photos',     'agent-photos',     true, 5242880,  array['image/jpeg','image/jpg','image/png','image/webp']),
  ('blog-images',      'blog-images',      true, 10485760, array['image/jpeg','image/jpg','image/png','image/webp']),
  ('community-images', 'community-images', true, 10485760, array['image/jpeg','image/jpg','image/png','image/webp'])
on conflict (id) do nothing;

-- RLS: anyone can read public bucket objects
create policy "Public read property-images"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Public read agent-photos"
  on storage.objects for select
  using (bucket_id = 'agent-photos');

create policy "Public read blog-images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Public read community-images"
  on storage.objects for select
  using (bucket_id = 'community-images');

-- RLS: authenticated users can upload/update/delete
create policy "Auth upload property-images"
  on storage.objects for insert
  with check (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "Auth update property-images"
  on storage.objects for update
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "Auth delete property-images"
  on storage.objects for delete
  using (bucket_id = 'property-images' and auth.role() = 'authenticated');

create policy "Auth upload agent-photos"
  on storage.objects for insert
  with check (bucket_id = 'agent-photos' and auth.role() = 'authenticated');

create policy "Auth update agent-photos"
  on storage.objects for update
  using (bucket_id = 'agent-photos' and auth.role() = 'authenticated');

create policy "Auth delete agent-photos"
  on storage.objects for delete
  using (bucket_id = 'agent-photos' and auth.role() = 'authenticated');

create policy "Auth upload blog-images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Auth update blog-images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Auth delete blog-images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Auth upload community-images"
  on storage.objects for insert
  with check (bucket_id = 'community-images' and auth.role() = 'authenticated');

create policy "Auth update community-images"
  on storage.objects for update
  using (bucket_id = 'community-images' and auth.role() = 'authenticated');

create policy "Auth delete community-images"
  on storage.objects for delete
  using (bucket_id = 'community-images' and auth.role() = 'authenticated');

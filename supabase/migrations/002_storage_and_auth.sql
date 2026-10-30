create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('papers', 'papers', false, 52428800, array['application/pdf']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Published paper PDFs are readable"
on storage.objects for select
using (
  bucket_id = 'papers'
  and exists (
    select 1 from public.papers
    where papers.storage_path = storage.objects.name
      and papers.is_published = true
  )
);

create policy "Admins upload paper PDFs"
on storage.objects for insert
with check (bucket_id = 'papers' and public.is_admin());

create policy "Admins update paper PDFs"
on storage.objects for update
using (bucket_id = 'papers' and public.is_admin())
with check (bucket_id = 'papers' and public.is_admin());

create policy "Admins delete paper PDFs"
on storage.objects for delete
using (bucket_id = 'papers' and public.is_admin());
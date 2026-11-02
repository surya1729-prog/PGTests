alter table public.exam_years drop constraint if exists exam_years_year_check;
alter table public.exam_years add constraint exam_years_year_check check (year between 1900 and 2100);

update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]::text[]
where id = 'papers';
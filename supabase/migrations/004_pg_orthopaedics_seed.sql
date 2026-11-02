insert into public.exams (exam_name, slug, description)
values ('PG Orthopaedics', 'pg-orthopaedics', 'Previous-year question papers for PG Orthopaedics')
on conflict (slug) do update set exam_name = excluded.exam_name, description = excluded.description;

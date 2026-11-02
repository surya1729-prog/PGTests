create table if not exists public.question_papers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  year integer not null check (year between 1900 and 2100),
  session text not null,
  paper_number integer not null check (paper_number between 1 and 2),
  title text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  unique (exam_id, year, session, paper_number)
);

create table if not exists public.paper_questions (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.question_papers(id) on delete cascade,
  question_number integer not null,
  question_text text not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  unique (paper_id, sort_order)
);

create index if not exists question_papers_lookup_idx on public.question_papers(exam_id, year, paper_number);
create index if not exists paper_questions_order_idx on public.paper_questions(paper_id, sort_order);

alter table public.question_papers enable row level security;
alter table public.paper_questions enable row level security;

drop policy if exists "Public can view published question papers" on public.question_papers;
create policy "Public can view published question papers" on public.question_papers
  for select using (is_published = true or public.is_admin());

drop policy if exists "Admins manage question papers" on public.question_papers;
create policy "Admins manage question papers" on public.question_papers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can view questions from published papers" on public.paper_questions;
create policy "Public can view questions from published papers" on public.paper_questions
  for select using (exists (select 1 from public.question_papers where question_papers.id = paper_questions.paper_id and (question_papers.is_published = true or public.is_admin())));

drop policy if exists "Admins manage paper questions" on public.paper_questions;
create policy "Admins manage paper questions" on public.paper_questions
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.exams (exam_name, slug, description)
values ('PG Orthopaedics', 'pg-orthopaedics', 'Year-wise PG Orthopaedics question papers')
on conflict (slug) do update set exam_name = excluded.exam_name, description = excluded.description;

with exam as (select id from public.exams where slug = 'pg-orthopaedics'),
paper as (
  insert into public.question_papers (exam_id, year, session, paper_number, title)
  select exam.id, 1996, 'April', 1, 'Degree - Paper I'
  from exam
  on conflict (exam_id, year, session, paper_number) do update set title = excluded.title
  returning id
)
insert into public.paper_questions (paper_id, question_number, question_text, sort_order)
select paper.id, source.question_number, source.question_text, source.sort_order
from paper
cross join (values
  (1, 'Describe the anatomy of the Brachial plexus. Discuss the management of carpal tunnel syndrome', 1),
  (2, 'Describe the surgical anatomy of ankle joint and the surgical approaches to the ankle joint', 2),
  (3, 'Write short notes:\n\na) Sprengel''s shoulder\n\nb) Bence-Jones proteins\n\nc) Hallux Valgus\n\nd) Febella', 3)
) as source(question_number, question_text, sort_order)
on conflict (paper_id, sort_order) do update set question_number = excluded.question_number, question_text = excluded.question_text;

create extension if not exists "pgcrypto";

create type public.profile_role as enum ('student', 'admin');
create type public.paper_type as enum ('question_paper', 'answer_key', 'solution', 'additional_resource');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role public.profile_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  exam_name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.exam_years (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  year integer not null check (year between 2000 and 2100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (exam_id, year)
);

create table public.papers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  exam_year_id uuid not null references public.exam_years(id) on delete cascade,
  title text not null,
  description text,
  paper_type public.paper_type not null,
  subject text,
  keywords text[] not null default '{}',
  storage_path text not null,
  file_size bigint not null check (file_size > 0),
  is_published boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  paper_id uuid not null references public.papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, paper_id)
);

create index papers_exam_year_idx on public.papers(exam_id, exam_year_id);
create index papers_search_idx on public.papers using gin(to_tsvector('english', title || ' ' || coalesce(description, '') || ' ' || coalesce(subject, '')));
create index favorites_user_idx on public.favorites(user_id);

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.exam_years enable row level security;
alter table public.papers enable row level security;
alter table public.favorites enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create policy "Profiles are visible to their owner" on public.profiles for select using (id = auth.uid());
create policy "Users update their own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Public can view active exams" on public.exams for select using (is_active = true or public.is_admin());
create policy "Public can view active years" on public.exam_years for select using (is_active = true or public.is_admin());
create policy "Public can view published papers" on public.papers for select using (is_published = true or public.is_admin());
create policy "Admins manage exams" on public.exams for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage years" on public.exam_years for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage papers" on public.papers for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view their favorites" on public.favorites for select using (user_id = auth.uid());
create policy "Users add their favorites" on public.favorites for insert with check (user_id = auth.uid());
create policy "Users remove their favorites" on public.favorites for delete using (user_id = auth.uid());

insert into public.exams (exam_name, slug, description) values
  ('NEET PG', 'neet-pg', 'National Eligibility cum Entrance Test'),
  ('INI-CET', 'ini-cet', 'Institute of National Importance Combined Entrance Test'),
  ('FMGE', 'fmge', 'Foreign Medical Graduate Examination')
on conflict (slug) do nothing;

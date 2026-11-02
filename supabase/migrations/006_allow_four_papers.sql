alter table public.question_papers
drop constraint if exists question_papers_paper_number_check;

alter table public.question_papers
add constraint question_papers_paper_number_check check (paper_number between 1 and 4);

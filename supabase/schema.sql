create extension if not exists pgcrypto;

create table if not exists public.family_feeds (
  id uuid primary key default gen_random_uuid(),
  date_key date not null,
  author text not null,
  content varchar(70) not null,
  created_at timestamptz not null default now(),
  constraint family_feeds_author_check check (
    author in ('아셀(첫째)', '이삭(둘째)', '조이(셋째)', '아빠', '엄마')
  ),
  constraint family_feeds_content_check check (
    char_length(trim(content)) between 1 and 70
  )
);

create index if not exists family_feeds_date_key_created_at_idx
  on public.family_feeds (date_key, created_at desc);

alter table public.family_feeds enable row level security;

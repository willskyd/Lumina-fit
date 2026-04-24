create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  membership text not null default 'Studio Member',
  weekly_goal integer not null default 4,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  category text not null,
  duration_minutes integer not null,
  intensity text not null,
  level text not null,
  calories integer not null default 0,
  participants integer not null default 0,
  is_live boolean not null default false,
  start_time_label text,
  instructor_name text not null,
  instructor_avatar text,
  cover_image text not null,
  video_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  coach_name text not null,
  summary text not null,
  duration_weeks integer not null,
  completion integer not null default 0,
  next_session text,
  accent text not null default '#10B981',
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  author_avatar text,
  challenge_id uuid references public.challenges (id) on delete set null,
  caption text not null,
  image_url text,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.workout_plans enable row level security;
alter table public.challenges enable row level security;
alter table public.community_posts enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "Classes are public" on public.classes;
create policy "Classes are public"
on public.classes for select
using (true);

drop policy if exists "Workout plans are public" on public.workout_plans;
create policy "Workout plans are public"
on public.workout_plans for select
using (true);

drop policy if exists "Challenges are public" on public.challenges;
create policy "Challenges are public"
on public.challenges for select
using (true);

drop policy if exists "Community posts are public" on public.community_posts;
create policy "Community posts are public"
on public.community_posts for select
using (true);

drop policy if exists "Authenticated users can post" on public.community_posts;
create policy "Authenticated users can post"
on public.community_posts for insert
with check (auth.role() = 'authenticated');

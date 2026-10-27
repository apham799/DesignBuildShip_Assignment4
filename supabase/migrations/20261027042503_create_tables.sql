-- Bucket List: the four tables that hold someone's data (see AGENTS.md → Data model).
--
-- Who owns a row: user_id is the Clerk user id, taken from the signed-in user's
-- token (auth.jwt() ->> 'sub'). The app never sends it; the default fills it in.
--
-- Who can see a row: RLS is on for every table, and every policy is the same rule,
-- "user_id matches the token". A signed-out visitor has no token, so matches nothing.
-- Built-in courses and practice facilities are bundled in the app, not stored here.

-- ---------------------------------------------------------------------------
-- rounds: one row per round played
-- ---------------------------------------------------------------------------
create table public.rounds (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null default (auth.jwt() ->> 'sub'),
  course_id     text not null,           -- built-in course id or a custom_courses.id
  course_name   text not null,           -- copied in, so the round survives course edits
  tee_id        text not null,
  tee_name      text not null,
  mode          text not null default 'holes' check (mode in ('holes', 'totals')),
  holes         jsonb not null default '[]'::jsonb,
  totals        jsonb,                   -- only for mode = 'totals'
  current_hole  int not null default 1 check (current_hole >= 1),
  weather       jsonb,                   -- snapshot at tee time; null if the API was down
  started_at    timestamptz not null default now(),
  finished_at   timestamptz              -- null = in progress
);

create index rounds_user_started_idx on public.rounds (user_id, started_at desc);

-- ---------------------------------------------------------------------------
-- practice_sessions: one row per range or simulator session
-- ---------------------------------------------------------------------------
create table public.practice_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           text not null default (auth.jwt() ->> 'sub'),
  date              timestamptz not null default now(),
  facility_id       text,                -- built-in facility id, if one was used
  setting           text not null check (setting in ('outdoor', 'indoor')),
  focus             text not null check (focus in ('driving', 'approach', 'shortGame', 'putting', 'mixed')),
  minutes           int not null check (minutes > 0),
  balls             int check (balls >= 0),
  drill_ids         text[] not null default '{}',
  challenge_id      text,
  challenge_score   int,
  challenge_out_of  int,
  feel              smallint not null check (feel between 1 and 5),
  notes             text,
  weather           jsonb                -- snapshot when logged
);

create index practice_sessions_user_date_idx on public.practice_sessions (user_id, date desc);

-- ---------------------------------------------------------------------------
-- custom_courses: courses a golfer adds themselves
-- ---------------------------------------------------------------------------
create table public.custom_courses (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null default (auth.jwt() ->> 'sub'),
  name        text not null check (length(trim(name)) > 0),
  area        text not null default '',
  tees        jsonb not null default '[]'::jsonb,
  holes       jsonb not null default '[]'::jsonb,
  lat         double precision check (lat between -90 and 90),
  lon         double precision check (lon between -180 and 180),
  created_at  timestamptz not null default now()
);

create index custom_courses_user_idx on public.custom_courses (user_id);

-- ---------------------------------------------------------------------------
-- user_settings: one row per person (focus, weekly goal, hole notes, progress)
-- ---------------------------------------------------------------------------
create table public.user_settings (
  user_id      text primary key default (auth.jwt() ->> 'sub'),
  focus        jsonb,
  weekly_goal  int not null default 1 check (weekly_goal between 1 and 14),
  hole_notes   jsonb not null default '{}'::jsonb,
  progress     jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Access: signed-in users only (role "authenticated", which Clerk's Supabase
-- integration puts in the token). Signed-out visitors (role "anon") get nothing.
-- ---------------------------------------------------------------------------
revoke all on public.rounds, public.practice_sessions, public.custom_courses, public.user_settings from anon;
grant select, insert, update, delete on public.rounds, public.practice_sessions, public.custom_courses, public.user_settings to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security: on for every table, one rule for every action.
-- (select auth.jwt() ...) is wrapped in a subquery so it runs once per query,
-- not once per row.
-- ---------------------------------------------------------------------------
alter table public.rounds            enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.custom_courses    enable row level security;
alter table public.user_settings     enable row level security;

-- rounds
create policy "Users see their own rounds" on public.rounds
  for select to authenticated using ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users add their own rounds" on public.rounds
  for insert to authenticated with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users update their own rounds" on public.rounds
  for update to authenticated using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users delete their own rounds" on public.rounds
  for delete to authenticated using ((select auth.jwt() ->> 'sub') = user_id);

-- practice_sessions
create policy "Users see their own practice" on public.practice_sessions
  for select to authenticated using ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users add their own practice" on public.practice_sessions
  for insert to authenticated with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users update their own practice" on public.practice_sessions
  for update to authenticated using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users delete their own practice" on public.practice_sessions
  for delete to authenticated using ((select auth.jwt() ->> 'sub') = user_id);

-- custom_courses
create policy "Users see their own courses" on public.custom_courses
  for select to authenticated using ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users add their own courses" on public.custom_courses
  for insert to authenticated with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users update their own courses" on public.custom_courses
  for update to authenticated using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users delete their own courses" on public.custom_courses
  for delete to authenticated using ((select auth.jwt() ->> 'sub') = user_id);

-- user_settings
create policy "Users see their own settings" on public.user_settings
  for select to authenticated using ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users add their own settings" on public.user_settings
  for insert to authenticated with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users update their own settings" on public.user_settings
  for update to authenticated using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "Users delete their own settings" on public.user_settings
  for delete to authenticated using ((select auth.jwt() ->> 'sub') = user_id);

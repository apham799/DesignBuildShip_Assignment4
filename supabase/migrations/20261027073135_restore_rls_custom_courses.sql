-- Step 7, fixed: put the real row-level security rule back on custom_courses.
-- Signed-in users see only rows whose user_id matches their Clerk token.
drop policy "BROKEN: everyone sees every course" on public.custom_courses;

create policy "Users see their own courses" on public.custom_courses
  for select to authenticated using ((select auth.jwt() ->> 'sub') = user_id);

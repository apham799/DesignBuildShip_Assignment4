-- Step 7, on purpose: break row-level security to watch the e2e test fail.
--
-- Replaces "Users see their own courses" with a policy that lets any signed-in user
-- read every row in custom_courses. The next migration puts the real rule back.
drop policy "Users see their own courses" on public.custom_courses;

create policy "BROKEN: everyone sees every course" on public.custom_courses
  for select to authenticated using (true);

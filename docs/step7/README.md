# Step 7: watching the test fail first

The test is `tests/e2e/two-users.spec.ts`: Golfer A and Golfer B (Clerk test users)
sign in, each adds a custom course, and after a fresh page load each should see
only their own.

## 1. Break row-level security on purpose

Migration `supabase/migrations/20261027072758_break_rls_custom_courses_for_test.sql`
replaced the select policy on `custom_courses`:

```sql
-- was:  using ((select auth.jwt() ->> 'sub') = user_id)
create policy "BROKEN: everyone sees every course" on public.custom_courses
  for select to authenticated using (true);
```

## 2. The test failed

Full output: [`test-failing.txt`](test-failing.txt). Page at the moment of failure:
[`page-when-failing.md`](page-when-failing.md).

```
Error: expect(locator).toHaveCount(expected) failed
Locator:  getByText('Golfer B\'s course 1793086090878')
Expected: 0
Received: 1
> 47 |   await expect(a.getByText(courseB)).toHaveCount(0);
```

Golfer A's course list showed Golfer B's course (and older test courses from both
users). The app code didn't change: the browser asked for "my courses" exactly as
before, but the database no longer limited the answer to A's rows.

## 3. Fix it, and the test passed

Migration `supabase/migrations/20261027073135_restore_rls_custom_courses.sql` put the
real rule back. Output: [`test-passing.txt`](test-passing.txt). Supabase's security
advisor reported no issues afterwards.

RLS was broken for about 3½ minutes (07:27:58 to 07:31:35 UTC, Oct 27 2026), on a
development project holding only test data and the student's own.

## In one sentence

The app never filters by user itself; the only thing standing between Golfer A and
Golfer B's data is the row-level security policy, so when I changed it to
`using (true)` Supabase returned everyone's rows and the test caught B's course on
A's screen.

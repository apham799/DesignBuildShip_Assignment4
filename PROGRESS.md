# Assignment 4 · Full Stack App: Progress Tracker

Due **Tuesday, Oct 27, 2026 at 5:30 PM**. Submit the Vercel URL and the GitHub URL in Google Classroom.

Stack: Next.js + Tailwind · Clerk (auth, dev keys) · Supabase (DB + RLS) · one external API · Playwright · Vercel Hobby

## Decisions

- **Tool:** Bucket List (extends A3). Real Chicago courses; weather informs a round and picks indoor vs outdoor practice
- **API:** Open-Meteo forecast (no key). Uses: temperature, wind speed/gusts/direction, precip probability/amount, weather code
- **Where the API is called (browser or server) and why:** on the **server**, via a Next.js route that caches each course's forecast (~15 min). No key to hide, so the reasons are **caching + rate limits** (Open-Meteo free tier ≈ 10k calls/day) and one place to turn errors into the "unavailable" state
- **Where Supabase is called:** from the **browser**, with the Clerk session token on every request (`accessToken: getToken`). Supabase verifies the token (third-party auth) and **RLS** decides which rows come back. No secret key anywhere
- **Tables:** `rounds` (with weather snapshot), `practice_sessions` (with weather snapshot), `custom_courses`, `user_settings`. All have `user_id`. Built-in courses and facilities are bundled in code, not tables

## Steps

### 1. Choose the tool and the API
- [x] Pick the tool and the API
- [x] Agent calls the API and shows one real response
- [x] Check what comes back when a search finds nothing
- [x] Ask: *"Explain this response: what each field means, and which ones my tool needs."*

- [x] Real course scorecards + practice facilities researched (6 courses with official cards, 8 facilities; totals checked)
- [x] Loaded into `src/data/courses.ts` + `src/data/facilities.ts` (Jackson Park front 9 confirmed by you: 4,4,4,4,5,3,4,3,4)

### 2. Plan the data
- [x] Agree on the tables, each with a `user_id` column (4: see Decisions)
- [x] Write the data model in `AGENTS.md`
- [ ] **You:** read `AGENTS.md` yourself and push back on anything
- [ ] Ask: *"Draw a diagram of my tables: what each one holds, and how each row belongs to one person."*

### 3. Protect the keys
- [x] Add a deny rule to `.claude/settings.json` **before** any key exists
- [x] `.env.local` created (written by the Clerk CLI during `init`, not by the agent; the agent never opened it)
- [x] Make sure `.env*` is in `.gitignore` (confirmed: `.env.local` doesn't show in `git status`)
- [ ] Ask: *"Explain why this deny rule protects my keys. Then explain the difference between my publishable and secret keys, and where each one is allowed to go."*

### 4. Sign-in with Clerk
- [x] `npx -y clerk@latest init --app …` (app "DBS_Assignment4", dev instance; `clerk doctor` all green)
- [x] Sign in / Sign up / user button in the nav
- [ ] **You:** sign up as your first test user at http://localhost:3000
- [x] Signed-out visitors can't reach anyone's data. First checked with a page guard (all pages → sign-in); then **changed by you** to a guest trial: pages are open, a guest only ever sees their own tab's data, and RLS returns no rows without a token
- [ ] Ask: *"Show me how the Clerk CLI works: what `clerk init` added to my project, file by file."*

### 5. Supabase, connected to Clerk
- [x] Create a Supabase project (ref `dwiwckzfdhhvyjrfhjzf`)
- [x] Supabase MCP server added, scoped with `project_ref`, local scope
- [x] **You:** `/mcp` → sign in to Supabase (connected; MCP sees project `dwiwckzfdhhvyjrfhjzf`, empty DB)
- [x] **You:** add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local` (no secret key needed)
- [x] Supabase dashboard: Authentication → Sign In / Providers → Clerk (third-party auth) (done by you)
- [x] App reads/saves through Supabase instead of `localStorage` (`src/lib/db.ts`, `src/lib/storage.ts`, `src/components/data-sync.tsx`)
- [x] Signed-in check: saving through Clerk token → Supabase works (Playwright, fresh page loads)
- [x] Guest trial: signed-out visitors can try it (this tab only, `sessionStorage`); it's added to the account on sign-up/sign-in
- [x] Migration `supabase/migrations/20261027042503_create_tables.sql` reviewed and applied
- [x] Tables created as migrations, with RLS on **every** table (4 tables × 4 policies; `anon` has no access; security advisor: 0 issues)
- [ ] Ask: *"Explain each row-level security policy in plain words, then show me a query that one of them would block."*

### 6. Where to call the API
- [x] Decide browser or server and write down why (server: caching + rate limits; see Decisions)
- [x] Server route `src/app/api/weather/route.ts` → `fetchForecast` (`"use cache"`, 15 min per location; first call ~0.74 s, cached ~0.03 s)
- [x] Course setup: conditions now + next 4 hours + advice; a snapshot is saved with the round; summary shows it
- [x] Practice page: outdoor / covered heated / indoor pick from Chicago weather, with real facilities (plans for 9 AM if it's night)
- [x] Design a **loading** state (skeleton)
- [x] Design an **empty** (nothing found) state (custom course with no location; no forecast for this hour)
- [x] Design an **API down** state (retry; "you can still play"; round saves with no weather). Try it: add `?weather=down` to a course or the practice page
- [x] Tests: weather is saved with a round; a round still starts when weather is down
- [ ] Ask: *"Draw a diagram of one request, from the click to the screen: the browser, my server, Clerk, Supabase, and the API."*

### 7. Playwright test, failing first
- [x] Two Clerk test users created (`bucketlist-a/b+clerk_test@example.com`; random passwords, never stored; tests sign in with Clerk tickets)
- [x] One e2e test: two users sign in, each saves something, neither sees the other's (`tests/e2e/two-users.spec.ts`, passes)
- [x] Bonus: guest trial is kept after sign-in (`tests/e2e/guest-trial.spec.ts`, passes)
- [x] Test already caught a bug: a form saved before the account loaded, and the save was lost; fixed (form waits for data)
- [x] Break RLS on purpose and watch it **fail**: migration `…072758_break_rls_custom_courses_for_test` (`using (true)`) → `Expected: 0, Received: 1`: Golfer A saw Golfer B's course (`docs/step7/`)
- [x] Fix RLS and watch it **pass**: migration `…073135_restore_rls_custom_courses`; security advisor clean
- [ ] Ask: *"Explain why the test failed when I broke row-level security, in one sentence I could say in class."*

### 8. Review and deploy
- [x] Work on a branch (not `main`): `feature/clerk-supabase`
- [x] Run `/security-review` and handle its findings: run on `feature/clerk-supabase` (diff vs `main`, 51 files); **no HIGH/MEDIUM findings**. Live RLS policies and Supabase security advisor also checked (clean). Noted low-impact edge case: on a shared computer, a guest trial left in a tab would be imported into whoever signs in next in that same tab
- [ ] Read the agent's changes yourself before merging
- [ ] Deploy to Vercel with the env vars set
- [ ] A classmate makes an account and uses it
- [ ] Ask: *"Quiz me on how my app works, one question at a time, and tell me what I got wrong. Start with the questions in Be Ready to Explain."*

## Housekeeping
- [ ] `AGENTS.md` is the context file (no `CLAUDE.md`); check with `/context`
- [ ] `README.md` written
- [ ] Commits along the way show progress (no single big commit)
- [ ] Free tiers only; usage limits and spending alerts set on Vercel, Supabase, and Clerk
- [ ] Persistence check: save, sign out, sign back in on **another device**, and it's still there

## Assignment 3 feedback, incorporated
- [x] "See your bucket list" bounced home first: a toast's URL cleanup was a router navigation racing the click → `history.replaceState`
- [x] Left/right split felt even ("where do I look?") → 4/8 everywhere, wide side = the task; Practice's side column is just settings
- [x] Too many fonts and styles → two typefaces, four roles, regular + semibold only; 16 ad-hoc sizes removed
- [x] Forms too long → practice log asks 3 things; 4 optional fields fold under "Add details"
- [x] "What does it look like before any info?" → checked: landing page, guest trial, and an empty bucket list that says what to do first

## Be ready to explain (notes for class)
1. **Tracing a save:** browser → server → Clerk → Supabase → API:
2. **Access control:** where the app knows who you are / where it decides what you see:
3. **Where API calls happen, and why:**
4. **Testing:** what the failure looked like, and what I changed: broke the `custom_courses` select policy to `using (true)`; the two-user test failed with `Expected: 0, Received: 1` because A's course list showed B's course; restored the `auth.jwt() ->> 'sub' = user_id` rule and it passed. Write-up: `docs/step7/README.md`
5. **Agentic workflow:** what I stopped the agent from doing / what I caught reading its changes:

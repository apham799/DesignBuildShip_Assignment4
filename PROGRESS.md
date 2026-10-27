# Assignment 4 · Full Stack App: Progress Tracker

Due **Tuesday, Oct 27, 2026 at 5:30 PM**. Submit the Vercel URL and the GitHub URL in Google Classroom.

Stack: Next.js + Tailwind · Clerk (auth, dev keys) · Supabase (DB + RLS) · one external API · Playwright · Vercel Hobby

## Decisions

- **Tool:** Bucket List (extends A3). Real Chicago courses; weather informs a round and picks indoor vs outdoor practice
- **API:** Open-Meteo forecast (no key). Uses: temperature, wind speed/gusts/direction, precip probability/amount, weather code
- **Where the API is called (browser or server) and why:** _TBD_
- **Tables:** `rounds` (with weather snapshot), `practice_sessions` (with weather snapshot), `custom_courses`, `user_settings`. All have `user_id`. Built-in courses and facilities are bundled in code, not tables

## Steps

### 1. Choose the tool and the API
- [x] Pick the tool and the API
- [x] Agent calls the API and shows one real response
- [x] Check what comes back when a search finds nothing
- [x] Ask: *"Explain this response: what each field means, and which ones my tool needs."*

- [ ] Real course scorecards + practice facilities researched (in progress)

### 2. Plan the data
- [x] Agree on the tables, each with a `user_id` column (4: see Decisions)
- [x] Write the data model in `AGENTS.md`
- [ ] **You:** read `AGENTS.md` yourself and push back on anything
- [ ] Ask: *"Draw a diagram of my tables: what each one holds, and how each row belongs to one person."*

### 3. Protect the keys
- [ ] Add a deny rule to `.claude/settings.json` **before** any key exists
- [ ] Create `.env.local` yourself (the agent is blocked from it)
- [ ] Make sure `.env*` is in `.gitignore`
- [ ] Ask: *"Explain why this deny rule protects my keys. Then explain the difference between my publishable and secret keys, and where each one is allowed to go."*

### 4. Sign-in with Clerk
- [ ] `npx -y clerk@latest init`
- [ ] Signed-out visitors can't reach any data; check it while signed out
- [ ] Ask: *"Show me how the Clerk CLI works: what `clerk init` added to my project, file by file."*

### 5. Supabase, connected to Clerk
- [ ] Create a Supabase project
- [ ] Connect the Supabase MCP server, scoped to that one project
- [ ] Supabase dashboard: Authentication → Sign In / Providers → Clerk (third-party auth)
- [ ] Tables created as migrations, with RLS on **every** table
- [ ] Ask: *"Explain each row-level security policy in plain words, then show me a query that one of them would block."*

### 6. Where to call the API
- [ ] Decide browser or server and write down why (keys, rate limits, caching, or none of those)
- [ ] Design a **loading** state
- [ ] Design an **empty** (nothing found) state
- [ ] Design an **API down** state
- [ ] Ask: *"Draw a diagram of one request, from the click to the screen: the browser, my server, Clerk, Supabase, and the API."*

### 7. Playwright test, failing first
- [ ] One e2e test: two users sign in, each saves something, neither sees the other's
- [ ] Break RLS on purpose and watch it **fail** (note what the failure looked like)
- [ ] Fix RLS and watch it **pass**
- [ ] Ask: *"Explain why the test failed when I broke row-level security, in one sentence I could say in class."*

### 8. Review and deploy
- [ ] Work on a branch (not `main`)
- [ ] Run `/security-review` and handle its findings
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

## Be ready to explain (notes for class)
1. **Tracing a save:** browser → server → Clerk → Supabase → API:
2. **Access control:** where the app knows who you are / where it decides what you see:
3. **Where API calls happen, and why:**
4. **Testing:** what the failure looked like, and what I changed:
5. **Agentic workflow:** what I stopped the agent from doing / what I caught reading its changes:

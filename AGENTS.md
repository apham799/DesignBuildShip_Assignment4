# Bucket List: project context

Design, Build, Ship (MPCS 51238), Assignment 4, "Full Stack App". This extends the Assignment 3 golf tool (log a round hole by hole → get a practice focus → log practice) into a multi-user app. Classmates sign up, their data lives in Supabase, and each person sees only their own. Weather from Open-Meteo informs a round and helps choose between indoor and outdoor practice.

Progress is tracked in `PROGRESS.md`.

## Stack
- Next.js + Tailwind CSS, deployed on Vercel's free Hobby plan from a GitHub repo.
- **Clerk** for sign-up, sign-in and sign-out. Development keys only.
- **Supabase** (Postgres) for saved data, connected to Clerk through Supabase third-party auth. Row-level security is on for **every** table.
- **Open-Meteo** forecast API (no key) as the one external API.
- **Playwright** for the end-to-end test.

## Hard constraints
- Keys live in `.env.local` and Vercel env vars, never in code or commits. The agent may not read `.env*` (deny rule in `.claude/settings.json`). The student creates `.env.local` by hand.
- The Supabase secret / service-role key is **never** used in the browser or in a `NEXT_PUBLIC_` variable. App queries go through the Clerk session token so RLS applies.
- Schema changes are written as migrations, never as one-off edits in the dashboard.
- Work on a branch and run `/security-review` before merging to `main`.
- Don't add packages, services or tables we don't need. Push back if one is suggested.
- Commit in small steps that show progress.

## Data model

### Reference data (bundled in the code, not in the database)
Built-in courses and practice facilities are shared, read-only and small, so they ship as typed data in `src/data/`, not as tables. Nobody owns them, they're versioned in git, and they need no RLS.

- `src/data/courses.ts`: real Chicago-area courses with official scorecards (par, handicap and yards per tee for each hole), plus `lat`/`lon` for weather. The source of each scorecard is noted in the file.
- `src/data/facilities.ts`: real practice facilities, each with `type: "outdoor" | "indoor" | "covered_heated"`, address, `lat`/`lon`, a description and seasonal notes.

### Tables (all in `public`, all with RLS)

Every table has `user_id text not null default (auth.jwt() ->> 'sub')`, which is the Clerk user id (e.g. `user_2abc…`). The app never sends `user_id` itself. The default fills it in from the signed-in user's token.

**`rounds`**: one row per round played.
| column | type | notes |
|---|---|---|
| `id` | uuid pk | `gen_random_uuid()` |
| `user_id` | text | owner (Clerk `sub`) |
| `course_id` | text | built-in course id **or** a `custom_courses.id` |
| `course_name`, `tee_id`, `tee_name` | text | copied in at start, so the round still makes sense if a custom course is edited or deleted |
| `mode` | text | `'holes'` or `'totals'` |
| `holes` | jsonb | array of `HoleScore` (par, yards, handicap, strokes, putts, fairway, green, penalties, note, played) |
| `totals` | jsonb null | only for `mode = 'totals'` |
| `current_hole` | int | where Resume takes you |
| `weather` | jsonb null | **snapshot at tee time** (see below); null if the API was down |
| `started_at` | timestamptz | |
| `finished_at` | timestamptz null | null means the round is in progress |

**`practice_sessions`**: one row per logged range or simulator session.
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | text | owner |
| `date` | timestamptz | |
| `facility_id` | text null | built-in facility id, if one was used |
| `setting` | text | `'outdoor'` or `'indoor'` |
| `focus` | text | `driving`, `approach`, `shortGame`, `putting` or `mixed` |
| `minutes`, `balls` | int | `balls` nullable |
| `drill_ids` | text[] | |
| `challenge_id`, `challenge_score`, `challenge_out_of` | text / int / int | nullable |
| `feel` | smallint | 1–5 |
| `notes` | text null | |
| `weather` | jsonb null | snapshot when logged |

**`custom_courses`**: courses a golfer adds themselves.
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `user_id` | text | owner |
| `name`, `area` | text | |
| `tees` | jsonb | `[{ id, name }]` |
| `holes` | jsonb | `[{ number, par, handicap, yards: { [teeId]: n } }]`; yards may be missing |
| `lat`, `lon` | double null | optional. Without them, weather isn't shown for the course |
| `created_at` | timestamptz | |

**`user_settings`**: one row per person for everything else A3 kept in `localStorage`.
| column | type | notes |
|---|---|---|
| `user_id` | text **pk** | owner, so there's one row each |
| `focus` | jsonb null | current practice focus |
| `weekly_goal` | int | sessions per week |
| `hole_notes` | jsonb | `{ [courseId]: { [hole]: { text, roundId, updatedAt } } }` |
| `progress` | jsonb | achievements, challenge levels, streak and trophy-case "seen" state |
| `updated_at` | timestamptz | |

Stays in `localStorage` (device-only, never synced): the unfinished practice-log draft and dismissed one-time tips.

### Weather snapshot (`weather` jsonb)
```json
{ "for_time": "2026-10-26T12:00", "fetched_at": "…", "temp_f": 59.7, "wind_mph": 7.9, "gust_mph": 13.2,
  "wind_dir_deg": 14, "precip_prob": 0, "precip_in": 0, "weather_code": 3 }
```
Stored as a copy, so History can compare scores to conditions ("+6 in wind over 15 mph") without calling the API again.

### Row-level security
Each table has RLS enabled and four policies (select, insert, update, delete), all built on one rule:
`(select auth.jwt() ->> 'sub') = user_id`. A signed-out visitor has no token, so they match no rows.

## Weather (Open-Meteo)
- Forecast endpoint: `https://api.open-meteo.com/v1/forecast`, hourly fields `temperature_2m, precipitation_probability, precipitation, weather_code, wind_speed_10m, wind_gusts_10m, wind_direction_10m`, in °F, mph, inches and `America/Chicago`.
- Errors come back as HTTP 400 `{ "error": true, "reason": "…" }` (bad coordinates, date past the ~16-day window). There's no empty result. "Nothing found" in this app means no forecast for that date yet, or a custom course without a location.
- Every weather view has designed **loading**, **no forecast**, and **unavailable** states. If the API is down, rounds and practice still save, just with `weather: null`.

## Design rules (Clubhouse, carried over from A3)
- Page and card backgrounds are **white**. Cream and tan are accents only. Keep club green, brass and the soft drop shadows.
- **Two typefaces** (Fraunces for headings and big numbers, a plain sans for body and UI) and **four text roles** (`display`, `heading`, `body`, `label`). Body text 16px minimum, labels 14px minimum.
- Muted text has ≥ 7:1 contrast on white. **Red is for errors only**, always paired with an icon.

## UX rules (carried over from A3)
- First visit (signed in, no data): never an empty screen. Offer "Start a round" and "Practice now".
- Signed out: a landing page that explains the tool and offers sign-in. It shows no saved data.
- Forms: one column, a real `<label>` on every field, errors directly under the field, typed input kept on error, and focus moves to the first invalid field.
- Use the shared components in `src/components/ui/` everywhere.
- Every page sits under the shared nav (Home · Play · Practice · History). In-flow pages show a back link and where you are ("Hole 4 of 18").
- Everything works with the keyboard and has visible focus rings.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

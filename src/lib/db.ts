"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Course, PracticeSession, Round, Store, WeatherSnapshot } from "./types";

// Talks to Supabase from the browser. Every request carries the signed-in user's
// Clerk session token; Supabase checks it (third-party auth) and row-level security
// limits every query to rows whose user_id matches the token. The app never sends
// user_id: the database fills it in from the token.

export function createSupabase(getToken: () => Promise<string | null>): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    accessToken: getToken,
  });
}

// ---- Rows ↔ app objects ----

type Json = Record<string, unknown>;

// Postgres returns "…+00:00"; the app compares ISO strings, so normalize to "…Z".
const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : undefined);
const opt = <T>(v: T | null): T | undefined => (v === null ? undefined : v);

function weatherToRow(w?: WeatherSnapshot) {
  if (!w) return null;
  return {
    for_time: w.forTime,
    fetched_at: w.fetchedAt,
    temp_f: w.tempF,
    wind_mph: w.windMph,
    gust_mph: w.gustMph,
    wind_dir_deg: w.windDirDeg,
    precip_prob: w.precipProb,
    precip_in: w.precipIn,
    weather_code: w.weatherCode,
  };
}

function weatherFromRow(w: Json | null): WeatherSnapshot | undefined {
  if (!w) return undefined;
  return {
    forTime: w.for_time as string,
    fetchedAt: w.fetched_at as string,
    tempF: w.temp_f as number,
    windMph: w.wind_mph as number,
    gustMph: w.gust_mph as number,
    windDirDeg: w.wind_dir_deg as number,
    precipProb: w.precip_prob as number,
    precipIn: w.precip_in as number,
    weatherCode: w.weather_code as number,
  };
}

function roundToRow(r: Round) {
  return {
    id: r.id,
    course_id: r.courseId,
    course_name: r.courseName,
    tee_id: r.teeId,
    tee_name: r.teeName,
    mode: r.mode,
    holes: r.holes,
    totals: r.totals ?? null,
    current_hole: r.currentHole,
    weather: weatherToRow(r.weather),
    started_at: r.startedAt,
    finished_at: r.finishedAt ?? null,
  };
}

function roundFromRow(row: Json): Round {
  return {
    id: row.id as string,
    courseId: row.course_id as string,
    courseName: row.course_name as string,
    teeId: row.tee_id as string,
    teeName: row.tee_name as string,
    mode: row.mode as Round["mode"],
    holes: row.holes as Round["holes"],
    totals: opt(row.totals as Round["totals"] | null),
    currentHole: row.current_hole as number,
    weather: weatherFromRow(row.weather as Json | null),
    startedAt: iso(row.started_at)!,
    finishedAt: iso(row.finished_at),
  };
}

function practiceToRow(p: PracticeSession) {
  return {
    id: p.id,
    date: p.date,
    facility_id: p.facilityId ?? null,
    setting: p.setting ?? "outdoor",
    focus: p.focus,
    minutes: p.minutes,
    balls: p.balls ?? null,
    drill_ids: p.drillIds,
    challenge_id: p.challengeId ?? null,
    challenge_score: p.challengeScore ?? null,
    challenge_out_of: p.challengeOutOf ?? null,
    feel: p.feel,
    notes: p.notes ?? null,
    weather: weatherToRow(p.weather),
  };
}

function practiceFromRow(row: Json): PracticeSession {
  return {
    id: row.id as string,
    date: iso(row.date)!,
    facilityId: opt(row.facility_id as string | null),
    setting: row.setting as PracticeSession["setting"],
    focus: row.focus as PracticeSession["focus"],
    minutes: row.minutes as number,
    balls: opt(row.balls as number | null),
    drillIds: row.drill_ids as string[],
    challengeId: opt(row.challenge_id as string | null),
    challengeScore: opt(row.challenge_score as number | null),
    challengeOutOf: opt(row.challenge_out_of as number | null),
    feel: row.feel as PracticeSession["feel"],
    notes: opt(row.notes as string | null),
    weather: weatherFromRow(row.weather as Json | null),
  };
}

// Custom course ids are "custom-<uuid>" in the app (so screens can tell them apart
// from built-in courses) and a plain uuid in the table.
const CUSTOM = "custom-";

function courseToRow(c: Course) {
  return {
    id: c.id.startsWith(CUSTOM) ? c.id.slice(CUSTOM.length) : c.id,
    name: c.name,
    area: c.area,
    tees: c.tees,
    holes: c.holes,
    lat: c.lat ?? null,
    lon: c.lon ?? null,
  };
}

function courseFromRow(row: Json): Course {
  return {
    id: `${CUSTOM}${row.id}`,
    name: row.name as string,
    area: row.area as string,
    source: "custom",
    tees: row.tees as Course["tees"],
    holes: row.holes as Course["holes"],
    lat: opt(row.lat as number | null),
    lon: opt(row.lon as number | null),
  };
}

export const courseRowId = (appId: string) => (appId.startsWith(CUSTOM) ? appId.slice(CUSTOM.length) : appId);

type AccountData = Pick<Store, "rounds" | "practice" | "customCourses" | "focus" | "weeklyGoal" | "holeNotes" | "unlocked" | "levels" | "streakSeen" | "trophyCaseViewedAt">;

function settingsToRow(s: AccountData) {
  return {
    focus: s.focus,
    weekly_goal: s.weeklyGoal,
    hole_notes: s.holeNotes,
    progress: { unlocked: s.unlocked, levels: s.levels, streakSeen: s.streakSeen, trophyCaseViewedAt: s.trophyCaseViewedAt },
    updated_at: new Date().toISOString(),
  };
}

// ---- Load everything for the signed-in user ----

export async function loadAccount(db: SupabaseClient): Promise<AccountData> {
  const [rounds, practice, courses, settings] = await Promise.all([
    db.from("rounds").select("*").order("started_at", { ascending: false }),
    db.from("practice_sessions").select("*").order("date", { ascending: false }),
    db.from("custom_courses").select("*").order("created_at", { ascending: false }),
    db.from("user_settings").select("*").maybeSingle(),
  ]);
  const failed = rounds.error ?? practice.error ?? courses.error ?? settings.error;
  if (failed) throw failed;

  const s = settings.data as Json | null;
  const progress = (s?.progress ?? {}) as Json;
  return {
    rounds: (rounds.data as Json[]).map(roundFromRow),
    practice: (practice.data as Json[]).map(practiceFromRow),
    customCourses: (courses.data as Json[]).map(courseFromRow),
    focus: (s?.focus as Store["focus"]) ?? null,
    weeklyGoal: (s?.weekly_goal as number) ?? 1,
    holeNotes: (s?.hole_notes as Store["holeNotes"]) ?? {},
    unlocked: (progress.unlocked as Store["unlocked"]) ?? {},
    levels: (progress.levels as Store["levels"]) ?? {},
    streakSeen: (progress.streakSeen as Store["streakSeen"]) ?? null,
    trophyCaseViewedAt: (progress.trophyCaseViewedAt as Store["trophyCaseViewedAt"]) ?? null,
  };
}

// ---- Save what changed ----

// One pending change: a row to write (upsert) or remove.
export type Change =
  | { table: "rounds"; op: "upsert" | "delete"; id: string }
  | { table: "practice_sessions"; op: "upsert" | "delete"; id: string }
  | { table: "custom_courses"; op: "upsert" | "delete"; id: string }
  | { table: "user_settings"; op: "upsert"; id: "me" };

export async function saveChange(db: SupabaseClient, change: Change, store: Store) {
  const run = async () => {
    if (change.table === "user_settings") return db.from("user_settings").upsert(settingsToRow(store), { onConflict: "user_id" });
    if (change.op === "delete") return db.from(change.table).delete().eq("id", change.table === "custom_courses" ? courseRowId(change.id) : change.id);

    if (change.table === "rounds") {
      const r = store.rounds.find((x) => x.id === change.id);
      return r ? db.from("rounds").upsert(roundToRow(r)) : null;
    }
    if (change.table === "practice_sessions") {
      const p = store.practice.find((x) => x.id === change.id);
      return p ? db.from("practice_sessions").upsert(practiceToRow(p)) : null;
    }
    const c = store.customCourses.find((x) => x.id === change.id);
    return c ? db.from("custom_courses").upsert(courseToRow(c)) : null;
  };
  const result = await run();
  if (result?.error) throw result.error;
}

// Every row the signed-in user owns, for "Erase my data".
export async function eraseAccount(db: SupabaseClient) {
  for (const table of ["rounds", "practice_sessions", "custom_courses", "user_settings"]) {
    // RLS limits the delete to this user's rows; the filter is only there because
    // PostgREST refuses a delete with no filter at all.
    const { error } = await db.from(table).delete().not("user_id", "is", null);
    if (error) throw error;
  }
}

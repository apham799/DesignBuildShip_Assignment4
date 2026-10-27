"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { type Change, saveChange } from "./db";
import type { Store } from "./types";

// Your data, held in memory while the app is open. Two modes:
//
// - Guest (signed out): a free trial. Data lives only in this tab's sessionStorage,
//   is never sent anywhere, and is gone when the tab closes. After sign-up or
//   sign-in it's added to the account (importGuest), then removed from the tab.
// - Account (signed in): <DataSync> loads it from Supabase and hands it over with connect().
// Pages read it with useStore(), which returns null until it has loaded (so pages
// show a skeleton instead of flashing the first-visit version). Every change goes
// through update(): the screen updates at once, then the rows that changed are
// saved to Supabase in the background. A failed save stays queued and is retried.
//
// Device-only bits (the unfinished practice draft, dismissed tips) stay in
// localStorage, under a key per user.

export function emptyStore(): Store {
  return {
    version: 1,
    rounds: [],
    practice: [],
    focus: null,
    holeNotes: {},
    customCourses: [],
    weeklyGoal: 1,
    seenTips: [],
    checklistDismissed: false,
    practiceDraft: null,
    unlocked: {},
    levels: {},
    streakSeen: null,
    trophyCaseViewedAt: null,
  };
}

let store: Store | null = null;
let db: SupabaseClient | null = null;
let userId: string | null = null;

export type Mode = "loading" | "guest" | "account";
let mode: Mode = "loading";

// ---- Guest trial (this tab only) ----

const GUEST_KEY = "bucket-list:v1:guest";

export const hasData = (s: Store) => s.rounds.length > 0 || s.practice.length > 0 || s.customCourses.length > 0 || s.focus !== null;

export function readGuest(): Store | null {
  try {
    const raw = sessionStorage.getItem(GUEST_KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

function writeGuest(s: Store) {
  try {
    sessionStorage.setItem(GUEST_KEY, JSON.stringify(s));
  } catch {}
}

export function clearGuest() {
  try {
    sessionStorage.removeItem(GUEST_KEY);
  } catch {}
}

// ---- Device-only data ----

type DeviceData = Pick<Store, "seenTips" | "checklistDismissed" | "practiceDraft">;
const deviceKey = (id: string) => `bucket-list:v1:device:${id}`;

function readDevice(id: string): Partial<DeviceData> {
  try {
    return JSON.parse(localStorage.getItem(deviceKey(id)) ?? "{}");
  } catch {
    return {};
  }
}

function writeDevice(s: Store) {
  if (!userId) return;
  const data: DeviceData = { seenTips: s.seenTips, checklistDismissed: s.checklistDismissed, practiceDraft: s.practiceDraft };
  try {
    localStorage.setItem(deviceKey(userId), JSON.stringify(data));
  } catch {}
}

// ---- Listeners ----

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---- Connecting to an account ----

export function connectGuest() {
  userId = null;
  db = null;
  pending.clear();
  saveState = "saved";
  mode = "guest";
  store = readGuest() ?? emptyStore();
  emit();
}

// Signed in, account not loaded yet: pages show a skeleton, never the guest's data.
export function startLoading() {
  userId = null;
  db = null;
  pending.clear();
  mode = "loading";
  store = null;
  emit();
}

export function connect(id: string, client: SupabaseClient, account: Partial<Store>) {
  mode = "account";
  userId = id;
  db = client;
  pending.clear();
  saveState = "saved";
  store = { ...emptyStore(), ...account, ...readDevice(id) };
  emit();
}

// Adds a guest trial to the account that just signed in. Ids are uuids, so
// nothing collides; the account's own settings win where both have one. The
// normal sync then saves every new row.
export function importGuest(guest: Store) {
  const byId = <T extends { id: string }>(mine: T[], theirs: T[]) => [...theirs.filter((t) => !mine.some((m) => m.id === t.id)), ...mine];
  update((s) => ({
    ...s,
    rounds: byId(s.rounds, guest.rounds),
    practice: byId(s.practice, guest.practice),
    customCourses: byId(s.customCourses, guest.customCourses),
    focus: s.focus ?? guest.focus,
    holeNotes: { ...guest.holeNotes, ...s.holeNotes },
    unlocked: { ...guest.unlocked, ...s.unlocked },
    levels: { ...guest.levels, ...s.levels },
  }));
}

// ---- Saving ----

export type SaveState = "saved" | "saving" | "error";
let saveState: SaveState = "saved";
const setSaveState = (next: SaveState) => {
  if (saveState !== next) {
    saveState = next;
    emit();
  }
};

// Keyed by table + id, so many quick changes to one round become one save of its
// latest version.
const pending = new Map<string, Change>();
let flushing = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;

function queue(change: Change) {
  pending.set(`${change.table}:${change.id}`, change);
}

// Works out which rows changed. Updates are immutable, so an unchanged row is the
// very same object in both versions.
function diff(prev: Store, next: Store) {
  const collections = [
    ["rounds", prev.rounds, next.rounds],
    ["practice_sessions", prev.practice, next.practice],
    ["custom_courses", prev.customCourses, next.customCourses],
  ] as const;
  for (const [table, before, after] of collections) {
    if (before === after) continue;
    const old = new Map<string, unknown>(before.map((x) => [x.id, x]));
    for (const item of after) if (old.get(item.id) !== item) queue({ table, op: "upsert", id: item.id });
    const kept = new Set(after.map((x) => x.id));
    for (const id of old.keys()) if (!kept.has(id)) queue({ table, op: "delete", id });
  }
  const settings = ["focus", "weeklyGoal", "holeNotes", "unlocked", "levels", "streakSeen", "trophyCaseViewedAt"] as const;
  if (settings.some((k) => prev[k] !== next[k])) queue({ table: "user_settings", op: "upsert", id: "me" });
}

async function flush() {
  if (flushing || !db || !store) return;
  flushing = true;
  clearTimeout(retryTimer);
  const client = db;
  try {
    while (pending.size > 0 && db === client && store) {
      const [key, change] = pending.entries().next().value!;
      setSaveState("saving");
      await saveChange(client, change, store);
      // A newer change to the same row may have arrived while this one was saving.
      if (pending.get(key) === change) pending.delete(key);
    }
    setSaveState("saved");
  } catch (error) {
    console.error("Couldn't save to Supabase", error);
    setSaveState("error");
    retryTimer = setTimeout(flush, 5000);
  } finally {
    flushing = false;
  }
}

export function retrySaving() {
  flush();
}

export function update(change: (store: Store) => Store) {
  if (!store) return;
  const prev = store;
  const next = change(prev);
  if (next === prev) return;
  store = next;
  if (mode === "guest") {
    writeGuest(next);
    emit();
    return;
  }
  diff(prev, next);
  writeDevice(next);
  emit();
  flush();
}

// ---- Hooks ----

export function useStore(): Store | null {
  return useSyncExternalStore(
    subscribe,
    () => store,
    () => null,
  );
}

export function useMode(): Mode {
  return useSyncExternalStore(
    subscribe,
    () => mode,
    () => "loading" as const,
  );
}

export function useSaveState(): SaveState {
  return useSyncExternalStore(
    subscribe,
    () => saveState,
    () => "saved" as const,
  );
}

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback still has to be a valid uuid: rows use uuid primary keys.
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ (Math.random() * 16) >> (+c / 4)).toString(16));
}

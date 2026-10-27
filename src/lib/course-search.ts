import type { Course } from "./types";

// A forgiving course search for the Play page. The list is small (the built-in
// courses plus your own), so it all runs in the browser as you type:
// - case, accents and punctuation don't matter ("marovitz" finds "Sydney R. Marovitz")
// - words can come in any order and only need their beginning ("port harb")
// - one typo is fine, two in long words ("jakson", "harbourside")
// - nicknames and neighborhoods count too ("Waveland", "Hyde Park")
// Every word typed has to match something.

export type CourseMatch = {
  course: Course;
  score: number;
  // Character ranges in course.name to highlight.
  highlight: [number, number][];
  // The nickname or neighborhood that matched, if one did, so the row can say why it's there.
  via?: string;
};

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

type Word = { text: string; start: number; end: number };

function words(s: string): Word[] {
  return [...s.matchAll(/[\p{L}\p{N}]+/gu)].map((m) => ({ text: normalize(m[0]), start: m.index!, end: m.index! + m[0].length }));
}

// Edit distance, giving up once it's past the limit.
function within(a: string, b: string, limit: number): boolean {
  if (Math.abs(a.length - b.length) > limit) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, row[j]);
    }
    if (best > limit) return false;
    prev = row;
  }
  return prev[b.length] <= limit;
}

// How well one typed word matches one word in the course: 3 exact, 2 the start of
// it, 1 close enough with a typo, 0 no match.
function wordScore(typed: string, word: string): number {
  if (word === typed) return 3;
  if (word.startsWith(typed)) return 2;
  if (typed.length < 4) return 0;
  const limit = typed.length >= 7 ? 2 : 1;
  return within(typed, word, limit) || within(typed, word.slice(0, typed.length), limit) ? 1 : 0;
}

export function searchCourses(courses: Course[], query: string): CourseMatch[] {
  const typed = words(query).map((w) => w.text);
  if (!typed.length) return courses.map((course) => ({ course, score: 0, highlight: [] }));

  const results: CourseMatch[] = [];
  courses.forEach((course) => {
    const nameWords = words(course.name);
    const areaWords = words(course.area);
    const keywords = (course.keywords ?? []).map((k) => ({ label: k, words: words(k) }));

    let score = 0;
    let viaKeyword: string | undefined;
    const highlight: [number, number][] = [];

    for (const t of typed) {
      let best = 0;
      let bestName: Word | undefined;
      let bestKeyword: string | undefined;
      for (const w of nameWords) {
        // Matches in the name count a little more than anywhere else.
        const s = wordScore(t, w.text) && wordScore(t, w.text) + 0.5;
        if (s > best) [best, bestName, bestKeyword] = [s, w, undefined];
      }
      for (const w of areaWords) {
        const s = wordScore(t, w.text);
        if (s > best) [best, bestName, bestKeyword] = [s, undefined, undefined];
      }
      for (const k of keywords) {
        for (const w of k.words) {
          const s = wordScore(t, w.text);
          if (s > best) [best, bestName, bestKeyword] = [s, undefined, k.label];
        }
      }
      if (!best) return; // every typed word has to match
      score += best;
      if (bestKeyword) viaKeyword ??= bestKeyword;
      if (bestName) {
        const prefix = bestName.text.startsWith(t);
        highlight.push([bestName.start, prefix ? bestName.start + t.length : bestName.end]);
      }
    }
    results.push({ course, score, highlight, via: viaKeyword });
  });

  // Best first; ties keep the list's own order.
  return results.map((r, i) => ({ r, i })).sort((a, b) => b.r.score - a.r.score || a.i - b.i).map(({ r }) => r);
}

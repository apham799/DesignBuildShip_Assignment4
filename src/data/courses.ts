import type { Course } from "@/lib/types";

// Built-in courses: real Chicago public courses with their official scorecards
// (par, handicap and yards from each tee, hole by hole). Every tee's yardages were
// checked against the card's printed totals. The source of each card is noted above it.
// Where a tee plays a hole at a different par (e.g. Jackson Park #1 is a par 5 from
// Red), parByTee holds it. Women's handicaps, where they differ, aren't modelled.
//
// Shared, read-only reference data, so it ships with the app instead of living in
// the database (see AGENTS.md).

const courses: Course[] = [
  // Jackson Park Golf Course: 6401 S. Richards Drive, Chicago, IL 60649
  // Confidence: medium. Sources:
  //   https://jacksonpark.cpdgolf.com/wp-content/uploads/sites/9682/2025/08/jackson-park-10.20.pdf
  //   https://jacksonpark.cpdgolf.com/the-course/
  //   https://www.chicagoparkdistrict.com/parks-facilities/jackson-park-golf-course-18-hole
  //   https://www.chicagogolfreport.com/jackson-park-golf-course/
  //   https://www.chicagogolfreport.com/matt-mcintee-troon/
  //   https://www.golfpass.com/travel-advisor/articles/new-municipal-golf-courses-renovations-2026
  {
    id: "jackson-park",
    name: "Jackson Park",
    area: "South Side · 18 holes",
    source: "sample",
    lat: 41.7793,
    lon: -87.5806,
    keywords: ["Jackson", "Hyde Park", "Woodlawn", "South Shore", "Richards Drive", "63rd Street"],
    tees: [{ id: "blue", name: "Blue" }, { id: "white", name: "White" }, { id: "red", name: "Red" }],
    holes: [
      { number: 1, par: 4, handicap: 4, yards: { blue: 395, white: 389, red: 383 }, parByTee: { red: 5 } },
      { number: 2, par: 4, handicap: 6, yards: { blue: 369, white: 358, red: 363 } },
      { number: 3, par: 4, handicap: 14, yards: { blue: 288, white: 259, red: 280 } },
      { number: 4, par: 4, handicap: 10, yards: { blue: 300, white: 296, red: 294 } },
      { number: 5, par: 5, handicap: 2, yards: { blue: 464, white: 458, red: 411 } },
      { number: 6, par: 3, handicap: 16, yards: { blue: 176, white: 171, red: 168 } },
      { number: 7, par: 4, handicap: 8, yards: { blue: 321, white: 316, red: 313 } },
      { number: 8, par: 3, handicap: 18, yards: { blue: 133, white: 130, red: 123 } },
      { number: 9, par: 4, handicap: 12, yards: { blue: 300, white: 297, red: 292 } },
      { number: 10, par: 4, handicap: 9, yards: { blue: 267, white: 264, red: 259 } },
      { number: 11, par: 4, handicap: 7, yards: { blue: 296, white: 294, red: 288 } },
      { number: 12, par: 3, handicap: 17, yards: { blue: 144, white: 141, red: 136 } },
      { number: 13, par: 3, handicap: 15, yards: { blue: 183, white: 179, red: 175 } },
      { number: 14, par: 5, handicap: 1, yards: { blue: 559, white: 551, red: 501 } },
      { number: 15, par: 5, handicap: 3, yards: { blue: 470, white: 465, red: 462 } },
      { number: 16, par: 4, handicap: 5, yards: { blue: 372, white: 366, red: 354 } },
      { number: 17, par: 3, handicap: 13, yards: { blue: 212, white: 201, red: 202 }, parByTee: { red: 4 } },
      { number: 18, par: 4, handicap: 11, yards: { blue: 259, white: 240, red: 253 } },
    ],
  },
  // Harborside International Golf Center - Port Course: 11001 S. Doty Avenue East, Chicago, IL 60628
  // Confidence: high. Sources:
  //   https://www.harborsidegolf.com/port-course/
  //   https://www.harborsidegolf.com/wp-content/uploads/sites/8971/2023/06/Port-Scorecard.pdf
  {
    id: "harborside-port",
    name: "Harborside · Port Course",
    area: "Far South Side · 18 holes",
    source: "sample",
    lat: 41.6946,
    lon: -87.5884,
    keywords: ["Harborside", "Lake Calumet", "Pullman", "Doty Avenue"],
    tees: [{ id: "tournament", name: "Tournament (gold)" }, { id: "championship", name: "Championship (blue)" }, { id: "regular", name: "Regular (white)" }, { id: "forward", name: "Forward (red)" }],
    holes: [
      { number: 1, par: 4, handicap: 9, yards: { tournament: 423, championship: 390, regular: 346, forward: 309 } },
      { number: 2, par: 5, handicap: 1, yards: { tournament: 544, championship: 511, regular: 479, forward: 432 } },
      { number: 3, par: 4, handicap: 11, yards: { tournament: 402, championship: 374, regular: 337, forward: 298 } },
      { number: 4, par: 3, handicap: 15, yards: { tournament: 232, championship: 207, regular: 179, forward: 125 } },
      { number: 5, par: 4, handicap: 5, yards: { tournament: 466, championship: 428, regular: 388, forward: 332 } },
      { number: 6, par: 3, handicap: 17, yards: { tournament: 180, championship: 145, regular: 115, forward: 83 } },
      { number: 7, par: 4, handicap: 13, yards: { tournament: 408, championship: 376, regular: 341, forward: 298 } },
      { number: 8, par: 4, handicap: 7, yards: { tournament: 430, championship: 401, regular: 365, forward: 312 } },
      { number: 9, par: 5, handicap: 3, yards: { tournament: 575, championship: 542, regular: 485, forward: 429 } },
      { number: 10, par: 4, handicap: 12, yards: { tournament: 401, championship: 375, regular: 351, forward: 305 } },
      { number: 11, par: 5, handicap: 2, yards: { tournament: 560, championship: 537, regular: 493, forward: 445 } },
      { number: 12, par: 4, handicap: 8, yards: { tournament: 455, championship: 419, regular: 378, forward: 331 } },
      { number: 13, par: 3, handicap: 18, yards: { tournament: 152, championship: 125, regular: 116, forward: 78 } },
      { number: 14, par: 4, handicap: 14, yards: { tournament: 361, championship: 331, regular: 293, forward: 260 } },
      { number: 15, par: 3, handicap: 16, yards: { tournament: 216, championship: 192, regular: 169, forward: 134 } },
      { number: 16, par: 4, handicap: 4, yards: { tournament: 389, championship: 359, regular: 324, forward: 286 } },
      { number: 17, par: 4, handicap: 10, yards: { tournament: 407, championship: 375, regular: 337, forward: 291 } },
      { number: 18, par: 5, handicap: 6, yards: { tournament: 522, championship: 502, regular: 481, forward: 416 } },
    ],
  },
  // Harborside International Golf Center - Starboard Course: 11001 S. Doty Avenue East, Chicago, IL 60628
  // Confidence: high. Sources:
  //   https://www.harborsidegolf.com/starboard-course/
  //   https://www.harborsidegolf.com/wp-content/uploads/sites/8971/2023/06/Port-Scorecard.pdf
  {
    id: "harborside-starboard",
    name: "Harborside · Starboard Course",
    area: "Far South Side · 18 holes",
    source: "sample",
    lat: 41.6946,
    lon: -87.5884,
    keywords: ["Harborside", "Lake Calumet", "Pullman", "Doty Avenue"],
    tees: [{ id: "tournament", name: "Tournament (gold)" }, { id: "championship", name: "Championship (blue)" }, { id: "regular", name: "Regular (white)" }, { id: "forward", name: "Forward (red)" }],
    holes: [
      { number: 1, par: 5, handicap: 1, yards: { tournament: 554, championship: 523, regular: 470, forward: 430 } },
      { number: 2, par: 4, handicap: 9, yards: { tournament: 398, championship: 380, regular: 333, forward: 295 } },
      { number: 3, par: 4, handicap: 13, yards: { tournament: 330, championship: 303, regular: 283, forward: 224 } },
      { number: 4, par: 3, handicap: 17, yards: { tournament: 156, championship: 134, regular: 93, forward: 69 } },
      { number: 5, par: 5, handicap: 5, yards: { tournament: 521, championship: 491, regular: 451, forward: 398 } },
      { number: 6, par: 4, handicap: 7, yards: { tournament: 442, championship: 416, regular: 379, forward: 343 } },
      { number: 7, par: 4, handicap: 11, yards: { tournament: 387, championship: 351, regular: 320, forward: 278 } },
      { number: 8, par: 3, handicap: 15, yards: { tournament: 209, championship: 179, regular: 146, forward: 116 } },
      { number: 9, par: 4, handicap: 3, yards: { tournament: 466, championship: 441, regular: 395, forward: 343 } },
      { number: 10, par: 4, handicap: 10, yards: { tournament: 416, championship: 394, regular: 347, forward: 299 } },
      { number: 11, par: 4, handicap: 12, yards: { tournament: 411, championship: 388, regular: 345, forward: 305 } },
      { number: 12, par: 5, handicap: 2, yards: { tournament: 560, championship: 548, regular: 510, forward: 424 } },
      { number: 13, par: 3, handicap: 16, yards: { tournament: 225, championship: 181, regular: 142, forward: 114 } },
      { number: 14, par: 4, handicap: 8, yards: { tournament: 474, championship: 462, regular: 411, forward: 334 } },
      { number: 15, par: 4, handicap: 14, yards: { tournament: 364, championship: 332, regular: 308, forward: 265 } },
      { number: 16, par: 4, handicap: 4, yards: { tournament: 425, championship: 400, regular: 365, forward: 316 } },
      { number: 17, par: 3, handicap: 18, yards: { tournament: 174, championship: 138, regular: 114, forward: 85 } },
      { number: 18, par: 5, handicap: 6, yards: { tournament: 592, championship: 559, regular: 502, forward: 472 } },
    ],
  },
  // Sydney R. Marovitz Golf Course: 3600 N. Recreation Drive, Chicago, IL 60613
  // Confidence: high. Sources:
  //   https://sydneymarovitz.cpdgolf.com/wp-content/uploads/sites/9687/2025/08/sydney-marovitz-10.20.pdf
  //   https://sydneymarovitz.cpdgolf.com/the-course/
  {
    id: "sydney-marovitz",
    name: "Sydney R. Marovitz",
    area: "North Side lakefront · 9 holes",
    source: "sample",
    lat: 41.9519,
    lon: -87.6411,
    keywords: ["Marovitz", "Waveland", "Lakeview", "Lincoln Park", "Lakefront", "Recreation Drive"],
    tees: [{ id: "blue", name: "Blue" }, { id: "white", name: "White" }, { id: "red", name: "Red" }],
    holes: [
      { number: 1, par: 4, handicap: 5, yards: { blue: 402, white: 358, red: 284 } },
      { number: 2, par: 5, handicap: 2, yards: { blue: 469, white: 461, red: 418 } },
      { number: 3, par: 3, handicap: 8, yards: { blue: 178, white: 172, red: 132 } },
      { number: 4, par: 4, handicap: 3, yards: { blue: 439, white: 403, red: 329 } },
      { number: 5, par: 5, handicap: 1, yards: { blue: 524, white: 470, red: 425 } },
      { number: 6, par: 3, handicap: 9, yards: { blue: 137, white: 129, red: 80 } },
      { number: 7, par: 4, handicap: 4, yards: { blue: 421, white: 377, red: 316 } },
      { number: 8, par: 4, handicap: 7, yards: { blue: 323, white: 311, red: 240 } },
      { number: 9, par: 4, handicap: 6, yards: { blue: 372, white: 353, red: 269 } },
    ],
  },
  // Columbus Park Golf Course: 5701 W. Jackson Boulevard, Chicago, IL 60644
  // Confidence: high. Sources:
  //   https://columbuspark.cpdgolf.com/wp-content/uploads/sites/9675/2025/08/columbus-park-7.19.pdf
  //   https://columbuspark.cpdgolf.com/the-course/
  {
    id: "columbus-park",
    name: "Columbus Park",
    area: "West Side · 9 holes",
    source: "sample",
    lat: 41.8764,
    lon: -87.7685,
    keywords: ["Columbus", "Austin", "West Side", "Jackson Boulevard"],
    tees: [{ id: "blue", name: "Blue" }, { id: "white", name: "White" }, { id: "red", name: "Red" }],
    holes: [
      { number: 1, par: 4, handicap: 7, yards: { blue: 315, white: 298, red: 291 } },
      { number: 2, par: 3, handicap: 9, yards: { blue: 152, white: 137, red: 121 } },
      { number: 3, par: 4, handicap: 2, yards: { blue: 401, white: 391, red: 360 }, parByTee: { red: 5 } },
      { number: 4, par: 4, handicap: 5, yards: { blue: 310, white: 300, red: 249 } },
      { number: 5, par: 5, handicap: 1, yards: { blue: 447, white: 429, red: 397 } },
      { number: 6, par: 4, handicap: 4, yards: { blue: 334, white: 322, red: 254 } },
      { number: 7, par: 4, handicap: 6, yards: { blue: 265, white: 250, red: 240 } },
      { number: 8, par: 3, handicap: 8, yards: { blue: 187, white: 179, red: 110 } },
      { number: 9, par: 4, handicap: 3, yards: { blue: 376, white: 368, red: 338 } },
    ],
  },
  // Robert A. Black Golf Course: 2045 W. Pratt Boulevard, Chicago, IL 60645
  // Confidence: high. Sources:
  //   https://robertblack.cpdgolf.com/wp-content/uploads/sites/9684/2025/08/robert-a-black-il-8.20.pdf
  //   https://robertblack.cpdgolf.com/the-course/
  {
    id: "robert-a-black",
    name: "Robert A. Black",
    area: "Far North Side · 9 holes",
    source: "sample",
    lat: 42.0049,
    lon: -87.6817,
    keywords: ["Robert Black", "West Ridge", "Rogers Park", "Pratt Boulevard"],
    tees: [{ id: "blue", name: "Blue" }, { id: "red", name: "Red" }],
    holes: [
      { number: 1, par: 5, handicap: 1, yards: { blue: 481, red: 447 } },
      { number: 2, par: 3, handicap: 8, yards: { blue: 130, red: 114 } },
      { number: 3, par: 4, handicap: 3, yards: { blue: 346, red: 319 } },
      { number: 4, par: 3, handicap: 7, yards: { blue: 167, red: 132 } },
      { number: 5, par: 4, handicap: 5, yards: { blue: 313, red: 293 } },
      { number: 6, par: 4, handicap: 4, yards: { blue: 310, red: 290 } },
      { number: 7, par: 3, handicap: 6, yards: { blue: 164, red: 135 } },
      { number: 8, par: 3, handicap: 9, yards: { blue: 103, red: 87 } },
      { number: 9, par: 4, handicap: 2, yards: { blue: 347, red: 329 } },
    ],
  },
];

// Pretend network latency, so loading states are real.
const LATENCY_MS = 450;

function respond<T>(value: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Behave like a real fetch when the device is offline.
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        reject(new Error("offline"));
        return;
      }
      resolve(value);
    }, LATENCY_MS);
  });
}

export function getCourses(): Promise<Course[]> {
  return respond(courses);
}

export function getCourse(id: string): Promise<Course | undefined> {
  return respond(courses.find((c) => c.id === id));
}

// Par for a hole from a given tee (most holes are the same from every tee).
export function holePar(hole: Course["holes"][number], teeId?: string) {
  return (teeId && hole.parByTee?.[teeId]) || hole.par;
}

export function coursePar(course: Pick<Course, "holes">, holeCount = course.holes.length, teeId?: string) {
  return course.holes.slice(0, holeCount).reduce((sum, h) => sum + holePar(h, teeId), 0);
}

export function teeYards(course: Course, teeId: string, holeCount = course.holes.length) {
  return course.holes.slice(0, holeCount).reduce((sum, h) => sum + (h.yards[teeId] ?? 0), 0);
}

// One how-to video per drill, picked by hand (a PGA pro or a known golf channel,
// short, showing this drill or one very close to it) and checked with YouTube's
// oEmbed lookup (it exists and allows embedding). Hand-picked rather than searched
// live, so every video is on topic and no API key is needed.

export type DrillVideo = { id: string; title: string; channel: string; minutes: number };

export const drillVideos: Record<string, DrillVideo> = {
  "fairway-gates": { id: "Zb23nMk7ckQ", title: "A MUST DO WITH DRIVER! (The fairway drill)", channel: "AlexElliottGolf", minutes: 8 },
  "stock-shot": { id: "gNgmjo9ME20", title: "How to Improve Your Shot-Shaping Strategy | Titleist Tips", channel: "Titleist", minutes: 9 },
  "distance-ladder": { id: "Ts_o0ymvw8c", title: "How to practice & improve -Block & Random", channel: "Nick Kumpis Golf", minutes: 3 },
  "back-of-green": { id: "2nHuhODroSE", title: "Why Your Irons Keep Coming Up Short", channel: "Isaak Ramsey | Play Ready Golf", minutes: 8 },
  "landing-spot": { id: "AF884ciovT4", title: "Titleist Tips: Towel Drill for More Precise Chip Shots", channel: "Titleist", minutes: 4 },
  "up-and-down-nine": { id: "vjXAIwK6NTs", title: "Short Game Practice: Can You Shoot 21? | Titleist", channel: "Titleist", minutes: 4 },
  "lag-ladder": { id: "PHZ8sEOomGg", title: "Lag Putting Drills For Better Distance Control", channel: "fitzygolfpro", minutes: 10 },
  "circle-drill": { id: "IukApU3-Uys", title: "Dave Pelz - 3 Foot Putting Circle Drill Golf Tip", channel: "Golf Life", minutes: 3 },
};

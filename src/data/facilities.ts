// Real Chicago practice facilities, for the indoor vs outdoor recommendation.
// "covered_heated" = an outdoor range with covered, heated bays (usable in cold or
// light rain, not in a thunderstorm). Hours and seasons change: the notes say what
// was published when this was researched (Oct 2026).

export type FacilityType = "outdoor" | "indoor" | "covered_heated";

export type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  lat: number;
  lon: number;
  // The few facts that decide whether to go, shown up front.
  highlights: string[];
  description: string;
  seasonalNotes: string;
  website: string;
};

export const facilities: Facility[] = [
  // Sources:
  //   https://diversey.cpdgolf.com/
  //   https://www.chicagoparkdistrict.com/parks-facilities/diversey-driving-range
  //   https://www.chicagogolfreport.com/where-to-play-golf-during-the-winter-in-chicago/
  {
    id: "diversey-driving-range",
    name: "Diversey Driving Range",
    type: "covered_heated",
    address: "141 W. Diversey Parkway, Chicago, IL 60657",
    lat: 41.9338,
    lon: -87.6351,
    highlights: ["Heated mat stalls", "Daily 9 AM–9 PM", "Putting greens"],
    description: "Two-tier lakefront range with synthetic turf and heated, covered hitting stalls, target greens, two synthetic putting greens, an 18-hole mini golf course, PGA instruction and club rentals. No chipping area.",
    seasonalNotes: "Open in winter. Daily 9 AM–9 PM, last bucket sold at 8 PM. Hours change by season, so call 773-661-0105.",
    website: "https://diversey.cpdgolf.com/",
  },
  // Sources:
  //   https://www.harborsidegolf.com/practice-facility/
  {
    id: "harborside-practice-facility",
    name: "Harborside International Practice Facility",
    type: "outdoor",
    address: "11001 S. Doty Avenue East, Chicago, IL 60628",
    lat: 41.6933,
    lon: -87.5942,
    highlights: ["Real grass tees", "Chipping, pitching and bunkers", "Closes for winter Nov 16"],
    description: "A 57-acre practice facility with bentgrass tees and fairways, four target greens for approach shots, separate chipping, pitching and bunker areas, and a putting green. Rated one of the top 50 public practice facilities in the US.",
    seasonalNotes: "Opens 6 AM; last bucket about 90 minutes before sunset. Usually closed Tuesdays for turf care. Expected to close for the season Mon Nov 16, 2026 (mats only if it stays open), and reopen mid-April.",
    website: "https://www.harborsidegolf.com/practice-facility/",
  },
  // Sources:
  //   https://www.choosechicago.com/listing/jackson-park-driving-range/
  //   https://troon.com/press-releases/jackson-park-golf-course-celebrating-125th-anniversary
  //   https://www.chicagogolfreport.com/matt-mcintee-troon/
  //   https://www.openstreetmap.org/way/311050750
  {
    id: "jackson-park-driving-range",
    name: "Jackson Park Driving Range",
    type: "outdoor",
    address: "63rd Street & Lake Shore Drive (near 6401 S. Richards Dr), Chicago, IL 60637",
    lat: 41.7846,
    lon: -87.5787,
    highlights: ["Seasonal range", "Call first: 773-667-0524"],
    description: "Public driving range next to the Jackson Park course, with about 33 hitting spots and club rental. Probably mats. The course restoration is adding a new putting green and a bigger short-game area.",
    seasonalNotes: "Seasonal; last published hours were 8 AM–8 PM daily. It's not on the Park District's current list and the restoration may affect it, so call before you go.",
    website: "https://jacksonpark.cpdgolf.com/",
  },
  // Sources:
  //   https://fiveirongolf.com/locations/chicago-the-loop
  //   https://www.chicagogolfreport.com/where-to-play-golf-during-the-winter-in-chicago/
  {
    id: "five-iron-golf-loop",
    name: "Five Iron Golf - The Loop",
    type: "indoor",
    address: "108 N. State Street, Suite 200 (Block 37), Chicago, IL 60602",
    lat: 41.8839,
    lon: -87.6286,
    highlights: ["Trackman simulators", "Open until 11 PM (1 AM Fri–Sat)"],
    description: "About a dozen Trackman simulator bays, a putting area, lessons and swing evaluations, and a bar.",
    seasonalNotes: "Open year-round: Sun–Thu 6 AM–11 PM, Fri–Sat 6 AM–1 AM. Five Iron also has River North, Bucktown and Lincoln Park locations.",
    website: "https://fiveirongolf.com/locations/chicago-the-loop",
  },
  // Sources:
  //   https://www.xgolfwrigleyville.com/
  //   https://www.yelp.com/biz/x-golf-chicago
  {
    id: "x-golf-wrigleyville",
    name: "X-Golf Wrigleyville",
    type: "indoor",
    address: "3549 N. Sheffield Avenue, Chicago, IL 60657",
    lat: 41.9464,
    lon: -87.6542,
    highlights: ["8 simulators", "Chipping and putting tracked", "From 10 AM"],
    description: "Eight simulators with automatic ball teeing and detailed shot data, including chipping and putting. PGA-pro lessons and a full bar.",
    seasonalNotes: "Open year-round. Winter: Mon–Tue 10 AM–10 PM, Wed–Thu to 11 PM, Fri–Sat to midnight, Sun to 8 PM. Busy on Cubs game days.",
    website: "https://www.xgolfwrigleyville.com/",
  },
  // Sources:
  //   https://www.shop900.com/topgolf-swing-suite/
  //   https://www.chicagogolfreport.com/where-to-play-golf-during-the-winter-in-chicago/
  {
    id: "topgolf-swing-suite-900",
    name: "Topgolf Swing Suite - 900 North Michigan",
    type: "indoor",
    address: "900 N. Michigan Avenue, Level 6, Chicago, IL 60611",
    lat: 41.8998,
    lon: -87.6246,
    highlights: ["Simulator lounge", "Noon–8 PM daily", "More social than practice"],
    description: "Full Swing simulator bays inside the 900 North Michigan Shops, with golf and other sim games, food and drink, and lessons with a PGA pro.",
    seasonalNotes: "Open year-round, noon–8 PM. Book ahead; up to 8 players per bay.",
    website: "https://swingsuite900.com/",
  },
  // Sources:
  //   https://parennialgolf.com/locations/west-loop
  //   https://www.chicagogolfreport.com/where-to-play-golf-during-the-winter-in-chicago/
  {
    id: "parennial-golf-west-loop",
    name: "PARennial Golf - West Loop",
    type: "indoor",
    address: "1335 W. Lake Street, Suite 103, Chicago, IL 60607",
    lat: 41.8851,
    lon: -87.6602,
    highlights: ["Trackman bays and a putting green", "Open 24/7", "Book in the app"],
    description: "A practice-focused studio with five private Trackman simulator bays, a putting green and club storage. Book a bay by the hour in the app, or walk in as a member.",
    seasonalNotes: "Open year-round, 24/7. No staff on site; phone support is available.",
    website: "https://parennialgolf.com/locations/west-loop",
  },
  // Sources:
  //   https://ravenswoodgc.com/
  //   https://www.chicagogolfreport.com/where-to-play-golf-during-the-winter-in-chicago/
  {
    id: "ravenswood-golf-club",
    name: "Ravenswood Golf Club",
    type: "indoor",
    address: "4711 N. Ravenswood Avenue, Chicago, IL 60640",
    lat: 41.9673,
    lon: -87.6744,
    highlights: ["Members only", "Indoor chipping and putting area"],
    description: "An indoor golf club with eight Trackman simulators and a 1,000 sq ft chipping and putting area (the best indoor short-game spot in the city), plus PGA instruction.",
    seasonalNotes: "Open year-round. Membership only (apply on the website); no public booking.",
    website: "https://ravenswoodgc.com/",
  },
];

export function getFacility(id: string) {
  return facilities.find((f) => f.id === id);
}

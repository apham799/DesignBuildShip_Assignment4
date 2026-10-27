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
    description: "Two-tier lakefront range with synthetic turf and covered, heated hitting-mat stalls, target greens, two synthetic putting greens, an 18-hole mini golf course, PGA instruction, and club rentals. No short-game/chipping area is listed.",
    seasonalNotes: "Operates in winter with covered, heated stalls (CPD and Chicago Golf Report winter guide). Listed hours are daily 9 AM-9 PM, last sale 8 PM. Hours change by season, so call 773-661-0105. Mini golf is likely seasonal (not confirmed).",
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
    description: "57-acre practice facility with bentgrass tees (real grass, not mats), bentgrass fairways, four target greens for approach shots, separate chipping, pitching, and bunker areas, and a putting green. GRAA Top 50 Public Facility.",
    seasonalNotes: "Opens 6 AM; last bucket about 90 min before sunset (3:30 PM as of 11/1/26). Closed for turf maintenance most Tuesdays (opens 10 AM Wednesday). Projected to close for the season Mon Nov 16, 2026, and moves to mats if open after that. 2027 season usually opens mid-April.",
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
    description: "Seasonal public driving range by the Jackson Park course, with club rental. OSM lists about 33 hitting positions. Reviews mention rubber tees and ball trays, which suggests mats, but the tee surface is not officially confirmed. Troon's Jackson Park restoration includes a new putting green and an expanded short-game practice area.",
    seasonalNotes: "Seasonal. The last official hours found (Choose Chicago, 2022) were daily 8 AM-8 PM. It is NOT on the current CPD golf facilities list, and the restoration may affect it, so call 773-667-0524 before visiting. Low confidence on current status.",
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
    description: "Indoor Trackman simulator bays (about 11-12 by third-party counts) with a putting area, lessons and swing evaluations from coaches, and a bar.",
    seasonalNotes: "Year-round. Sun-Thu 6 AM-11 PM, Fri-Sat 6 AM-1 AM. Five Iron also has River North (609 N. Dearborn), Bucktown, and Lincoln Park locations.",
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
    description: "Eight simulators with automatic ball teeing and detailed shot data. The venue says chipping and putting are tracked in the sim. PGA-pro lessons and a full bar.",
    seasonalNotes: "Year-round. Winter hours: Mon-Tue 10 AM-10 PM, Wed-Thu 10 AM-11 PM, Fri-Sat 10 AM-midnight, Sun 10 AM-8 PM. Busy on Cubs game days. (The X-Golf South Loop page said 'currently closed', so it was left out.)",
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
    description: "Simulator lounge (Full Swing bays) inside the 900 North Michigan Shops, with golf plus other sim games, food and drink from Aster Hall, and lessons with a PGA pro. More social than practice-focused. There is no full Topgolf venue inside Chicago city limits.",
    seasonalNotes: "Year-round. Recent listings say noon-8 PM daily (an older guide says Thu-Sun). Reservations recommended, up to 8 players per bay.",
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
    description: "Practice-focused indoor studio with five private Trackman iO simulator bays, a putting green, and club storage. Bays can be booked hourly in the app, or members can walk in.",
    seasonalNotes: "Year-round, open 24/7 with no staff on site (phone support available).",
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
    description: "Indoor golf club with eight Trackman simulators and a 1,000 sq ft chipping and putting area (the best indoor short-game option found), plus PGA instruction and two lounges.",
    seasonalNotes: "Year-round. Membership-based (applications on the website); public booking is not advertised. Lat/lon is approximate, from address geocoding.",
    website: "https://ravenswoodgc.com/",
  },
];

export function getFacility(id: string) {
  return facilities.find((f) => f.id === id);
}

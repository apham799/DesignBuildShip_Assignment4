import type { WeatherSnapshot } from "./types";

// Weather from Open-Meteo, as the app uses it. The browser never calls Open-Meteo:
// it calls our own /api/weather route, which calls Open-Meteo on the server and
// caches each location for 15 minutes (see weather-server.ts). These helpers turn
// a forecast into what a golfer cares about.

export type HourForecast = {
  time: string; // local Chicago hour, e.g. "2026-10-27T14:00"
  tempF: number;
  windMph: number;
  gustMph: number;
  windDirDeg: number; // where the wind comes from
  precipProb: number; // %
  precipIn: number;
  weatherCode: number; // WMO code
};

export type Forecast = { lat: number; lon: number; fetchedAt: string; hours: HourForecast[] };

// Downtown Chicago, for the practice pick (every facility is in the city).
export const CHICAGO = { lat: 41.88, lon: -87.63 };

export const thunder = (h: HourForecast) => h.weatherCode >= 95;

export function describeWeather(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "Mixed";
}

const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const compass = (deg: number) => points[Math.round((((deg % 360) + 360) % 360) / 45) % 8];

// The forecast's hours are Chicago local time; find the one we're in now.
function chicagoHourKey(at: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" })
      .formatToParts(at)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:00`;
}

// This hour and the next few. Empty if the forecast doesn't cover now.
export function upcoming(forecast: Forecast, count: number, at = new Date()): HourForecast[] {
  const i = forecast.hours.findIndex((h) => h.time === chicagoHourKey(at));
  return i === -1 ? [] : forecast.hours.slice(i, i + count);
}

// The hour to plan practice for: now during the day, otherwise 9 AM next morning
// (ranges and simulators are closed overnight).
export function practiceHour(forecast: Forecast, at = new Date()): { hour: HourForecast; later: boolean } | undefined {
  const [now, ...rest] = upcoming(forecast, 24, at);
  if (!now) return undefined;
  const h = Number(now.time.slice(11, 13));
  if (h >= 7 && h < 20) return { hour: now, later: false };
  const morning = rest.find((x) => x.time.endsWith("T09:00"));
  return morning ? { hour: morning, later: true } : { hour: now, later: false };
}

export const hourLabel = (time: string) => {
  const h = Number(time.slice(11, 13));
  return `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;
};

export function toSnapshot(h: HourForecast, fetchedAt: string): WeatherSnapshot {
  return { forTime: h.time, fetchedAt, tempF: h.tempF, windMph: h.windMph, gustMph: h.gustMph, windDirDeg: h.windDirDeg, precipProb: h.precipProb, precipIn: h.precipIn, weatherCode: h.weatherCode };
}

// What the weather means for a round, most important first.
export function roundAdvice(h: HourForecast): string[] {
  const tips: string[] = [];
  if (thunder(h)) tips.push("Thunderstorms in the forecast. Lightning means off the course, so check before you head out.");
  if (h.gustMph >= 25 || h.windMph >= 15) tips.push(`Wind ${Math.round(h.windMph)} mph, gusting ${Math.round(h.gustMph)}: club up into it, down with it, and keep the ball low.`);
  else if (h.windMph >= 8) tips.push("A steady breeze: about one club either way into or with it.");
  if (h.precipProb >= 50) tips.push("Rain likely: pack a towel and dry grips. Wet greens roll slower.");
  if (h.tempF < 50) tips.push("Cold air flies shorter: expect a little less carry on full shots.");
  if (h.tempF >= 85) tips.push("Hot out: drink water every few holes.");
  if (!tips.length) tips.push("Good scoring weather. Nothing to adjust for.");
  return tips;
}

export type PracticeSetting = "outdoor" | "covered_heated" | "indoor";

// Range, heated bay, or simulator, and why. (Heated bays are always covered,
// so "heated" says both.)
export function practicePick(h: HourForecast): { setting: PracticeSetting; reason: string } {
  if (thunder(h)) return { setting: "indoor", reason: "Thunderstorms around. Stay inside: a simulator is the only safe option." };
  if (h.tempF < 38) return { setting: "indoor", reason: `${Math.round(h.tempF)}°F is too cold for a good session outside. A simulator beats frozen fingers.` };
  if (h.precipProb >= 60 || h.precipIn >= 0.04) return { setting: "covered_heated", reason: `${h.precipProb}% chance of rain. A heated bay keeps you dry and still shows real ball flight.` };
  if (h.tempF < 50 || h.gustMph >= 30) return { setting: "covered_heated", reason: `${Math.round(h.tempF)}°F with gusts to ${Math.round(h.gustMph)} mph. A heated bay keeps your hands warm.` };
  return { setting: "outdoor", reason: `${Math.round(h.tempF)}°F and ${describeWeather(h.weatherCode).toLowerCase()}. Good range weather: grass tees and a real ball flight.` };
}

export const settingLabel: Record<PracticeSetting, string> = {
  outdoor: "Outdoor range",
  covered_heated: "Heated range bay",
  indoor: "Indoor simulator",
};

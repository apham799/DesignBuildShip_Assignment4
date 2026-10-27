import "server-only";

import { cacheLife } from "next/cache";
import type { Forecast, HourForecast } from "./weather";

// Calls Open-Meteo, on the server only. Cached per location: a fresh answer is
// reused for 15 minutes, so every golfer looking at the same course shares one
// call (Open-Meteo's free tier allows about 10,000 a day). A thrown error is never
// cached, so a failed call is retried on the next request.
export async function fetchForecast(lat: number, lon: number): Promise<Forecast> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: "America/Chicago",
    forecast_days: "7",
  }).toString();

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Open-Meteo answered ${res.status}`);
  const data = await res.json();
  const h = data?.hourly;
  if (!Array.isArray(h?.time)) throw new Error("Open-Meteo sent no hourly forecast");

  const hours: HourForecast[] = h.time.map((time: string, i: number) => ({
    time,
    tempF: h.temperature_2m[i],
    windMph: h.wind_speed_10m[i],
    gustMph: h.wind_gusts_10m[i],
    windDirDeg: h.wind_direction_10m[i],
    precipProb: h.precipitation_probability[i] ?? 0,
    precipIn: h.precipitation[i] ?? 0,
    weatherCode: h.weather_code[i],
  }));
  return { lat, lon, fetchedAt: new Date().toISOString(), hours: hours.filter((x) => typeof x.tempF === "number") };
}

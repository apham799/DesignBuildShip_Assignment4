"use client";

import { useCallback, useEffect, useState } from "react";
import type { Forecast } from "./weather";

// Asks our /api/weather route (never Open-Meteo directly) for a location's
// forecast. Four states, each with its own design on screen:
//   none        no location to look up (a custom course without one)
//   loading     waiting for the answer
//   ready       a forecast came back
//   unavailable the route or Open-Meteo failed; screens offer a retry
export type ForecastState = { status: "none" } | { status: "loading" } | { status: "ready"; forecast: Forecast } | { status: "unavailable" };

// Forecasts already fetched in this tab, so moving between pages doesn't refetch.
// One covers 7 days hour by hour, so it stays useful for the whole visit.
const recent = new Map<string, Forecast>();

export function useForecast(lat?: number, lon?: number): ForecastState & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const place = lat === undefined || lon === undefined ? null : `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const key = place && `${place}#${attempt}`;
  const [result, setResult] = useState<{ key: string; forecast?: Forecast } | null>(null);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // A retry always asks again; otherwise reuse what this tab already has.
  const fresh = place && attempt === 0 ? recent.get(place) : undefined;

  useEffect(() => {
    if (!key || !place || fresh) return;
    let live = true;
    // Add ?weather=down to the page URL to see the unavailable state.
    const simulate = new URLSearchParams(window.location.search).get("weather") === "down" ? "&simulate=down" : "";
    const [la, lo] = place.split(",");
    fetch(`/api/weather?lat=${la}&lon=${lo}${simulate}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`weather ${r.status}`))))
      .then((forecast: Forecast) => {
        recent.set(place, forecast);
        if (live) setResult({ key, forecast });
      })
      .catch(() => {
        if (live) setResult({ key });
      });
    return () => {
      live = false;
    };
  }, [key, place, fresh]);

  if (!place) return { status: "none", retry };
  if (fresh) return { status: "ready", forecast: fresh, retry };
  if (!result || result.key !== key) return { status: "loading", retry };
  return result.forecast ? { status: "ready", forecast: result.forecast, retry } : { status: "unavailable", retry };
}

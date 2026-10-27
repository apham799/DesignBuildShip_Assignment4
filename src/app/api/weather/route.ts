import { type NextRequest, NextResponse } from "next/server";
import { fetchForecast } from "@/lib/weather-server";

// GET /api/weather?lat=41.78&lon=-87.58 → the next 7 days, hour by hour.
//
// The browser calls this instead of Open-Meteo, so the call can be cached for
// everyone (see weather-server.ts) and every failure becomes one clear answer the
// screens can design for: 400 for a bad location, 502 when the forecast is
// unavailable. No key is involved; Open-Meteo doesn't need one.
//
// ?simulate=down returns the unavailable answer on purpose, to show that state.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  if (!params.get("lat") || !params.get("lon") || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "bad_location" }, { status: 400 });
  }
  if (params.get("simulate") === "down") {
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  // Two decimals is about a kilometre, finer than Open-Meteo's grid, and it lets
  // nearby requests share one cached forecast.
  const round = (n: number) => Math.round(n * 100) / 100;
  try {
    const forecast = await fetchForecast(round(lat), round(lon));
    return NextResponse.json(forecast, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("Weather unavailable", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

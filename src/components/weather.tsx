"use client";

import { facilities, type Facility } from "@/data/facilities";
import { type ForecastState, useForecast } from "@/lib/use-forecast";
import { CHICAGO, compass, describeWeather, practiceHour, type HourForecast, hourLabel, practicePick, roundAdvice, settingLabel, upcoming } from "@/lib/weather";
import { Badge, Button, Card, Skeleton } from "@/components/ui";

type State = ForecastState & { retry: () => void };

function WeatherSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
  );
}

function Unavailable({ retry, children }: { retry: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body font-semibold">The forecast isn&apos;t available right now</p>
      <p className="text-body text-muted">{children}</p>
      <Button size="sm" variant="secondary" className="w-fit" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}

function Now({ h }: { h: HourForecast }) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
      <p className="font-display text-5xl font-semibold leading-none">{Math.round(h.tempF)}°</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 text-body">
        <dt className="text-muted">Sky</dt>
        <dd>{describeWeather(h.weatherCode)}</dd>
        <dt className="text-muted">Wind</dt>
        <dd>
          {Math.round(h.windMph)} mph from the {compass(h.windDirDeg)}, gusts {Math.round(h.gustMph)}
        </dd>
        <dt className="text-muted">Rain</dt>
        <dd>{h.precipProb}% chance</dd>
      </dl>
    </div>
  );
}

function NextHours({ hours }: { hours: HourForecast[] }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Next few hours">
      {hours.map((h) => (
        <li key={h.time} className="flex flex-col items-center rounded-md bg-cream px-2 py-2 text-center">
          <span className="text-label text-muted">{hourLabel(h.time)}</span>
          <span className="text-heading">{Math.round(h.tempF)}°</span>
          <span className="text-label">{Math.round(h.windMph)} mph</span>
          <span className="text-label text-muted">{h.precipProb}% rain</span>
        </li>
      ))}
    </ol>
  );
}

// Conditions at a course, now and for the next few hours, with what to adjust.
export function CourseWeather({ courseName, weather }: { courseName: string; weather: State }) {
  return (
    <Card as="section" labelledBy="course-weather" className="flex flex-col gap-4">
      <h2 id="course-weather" className="text-heading">
        Conditions at {courseName}
      </h2>
      <CourseWeatherBody weather={weather} />
    </Card>
  );
}

function CourseWeatherBody({ weather }: { weather: State }) {
  if (weather.status === "loading") return <WeatherSkeleton label="Loading the forecast…" />;
  if (weather.status === "none")
    return <p className="text-body text-muted">There&apos;s no location saved for this course, so there&apos;s no forecast. The built-in Chicago courses all show the weather.</p>;
  if (weather.status === "unavailable")
    return <Unavailable retry={weather.retry}>You can still play: the round saves without the weather.</Unavailable>;

  const hours = upcoming(weather.forecast, 4);
  if (!hours.length) return <p className="text-body text-muted">No forecast for this hour yet. Check back closer to your tee time.</p>;
  return (
    <>
      <Now h={hours[0]} />
      <NextHours hours={hours} />
      <ul className="flex flex-col gap-2 text-body">
        {roundAdvice(hours[0]).map((tip) => (
          <li key={tip} className="flex gap-2">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-green" />
            {tip}
          </li>
        ))}
      </ul>
      <p className="text-label font-normal text-muted">Saved with your round when you start. Forecast from Open-Meteo.</p>
    </>
  );
}

const typeBadge: Record<Facility["type"], string> = { outdoor: "Outdoor", covered_heated: "Covered, heated", indoor: "Indoor" };

function FacilityList({ list }: { list: Facility[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {list.map((f) => (
        <li key={f.id} className="flex flex-col gap-1 rounded-md border border-rule p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <a href={f.website} target="_blank" rel="noreferrer" className="text-body font-semibold text-green underline underline-offset-[3px]">
              {f.name}
            </a>
            <Badge tone={f.type === "outdoor" ? "green" : "brass"}>{typeBadge[f.type]}</Badge>
          </div>
          <p className="text-label font-normal text-muted">{f.address}</p>
          <p className="text-body">{f.description}</p>
          <p className="text-label font-normal text-muted">{f.seasonalNotes}</p>
        </li>
      ))}
    </ul>
  );
}

// Range, covered bay or simulator today, from Chicago's weather, with real places.
export function PracticeWeather({ weather }: { weather: State }) {
  return (
    <Card as="section" labelledBy="where-to-practice" className="flex flex-col gap-4">
      <h2 id="where-to-practice" className="text-heading">
        Where to practice today
      </h2>
      <PracticeWeatherBody weather={weather} />
    </Card>
  );
}

function PracticeWeatherBody({ weather }: { weather: State }) {
  if (weather.status === "loading") return <WeatherSkeleton label="Checking Chicago's weather…" />;
  if (weather.status === "unavailable" || weather.status === "none")
    return (
      <>
        <Unavailable retry={weather.retry}>Without it we can&apos;t say range or simulator, so here&apos;s every spot in the city.</Unavailable>
        <FacilityList list={facilities} />
      </>
    );

  const target = practiceHour(weather.forecast);
  if (!target)
    return (
      <>
        <p className="text-body text-muted">No forecast for this hour yet, so here&apos;s every spot in the city.</p>
        <FacilityList list={facilities} />
      </>
    );

  const pick = practicePick(target.hour);
  // A covered bay is also fine on a good day; an indoor pick means indoor only.
  const fits = (f: Facility) => (pick.setting === "outdoor" ? f.type !== "indoor" : f.type === pick.setting);
  const list = [...facilities.filter(fits)];
  if (!list.length) list.push(...facilities.filter((f) => f.type === "indoor"));
  return (
    <>
      <div className="flex flex-col gap-1">
        <Badge tone={pick.setting === "outdoor" ? "green" : "brass"}>{settingLabel[pick.setting]}</Badge>
        <p className="text-body">
          {target.later && <span className="font-semibold">Places are closed now, so this is for tomorrow at 9 AM. </span>}
          {pick.reason}
        </p>
      </div>
      <FacilityList list={list} />
      <p className="text-label font-normal text-muted">From the Chicago forecast (Open-Meteo). Hours and seasons change, so check before you go.</p>
    </>
  );
}

// The Practice page's card: looks up Chicago's weather itself.
export function TodayPracticeWeather() {
  const weather = useForecast(CHICAGO.lat, CHICAGO.lon);
  return <PracticeWeather weather={weather} />;
}

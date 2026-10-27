import { expect, type Page, test } from "@playwright/test";

// Weather comes from our /api/weather route (which calls Open-Meteo). Starting a
// round saves a copy of this hour's weather with it; if the forecast is down, the
// round still starts, just without weather. (Runs as a guest, so the round is
// read back from the tab's trial storage.)

async function startJacksonPark(page: Page, query = "") {
  await page.goto(`/play/course/jackson-park${query}`);
  await expect(page.getByRole("heading", { name: "Conditions at Jackson Park" })).toBeVisible();
}

async function savedRound(page: Page) {
  await page.waitForURL(/\/round\/.+\/hole\/1/);
  return page.evaluate(() => JSON.parse(sessionStorage.getItem("bucket-list:v1:guest") ?? "{}").rounds?.[0]);
}

test("starting a round saves this hour's weather with it", async ({ page }) => {
  await startJacksonPark(page);
  await expect(page.getByText(/mph from the/).first()).toBeVisible();
  await page.getByRole("button", { name: "Start on hole 1" }).click();
  const round = await savedRound(page);
  expect(round.weather).toMatchObject({ tempF: expect.any(Number), windMph: expect.any(Number), weatherCode: expect.any(Number) });
});

test("when the forecast is down, the round still starts without it", async ({ page }) => {
  await startJacksonPark(page, "?weather=down");
  await expect(page.getByText("The forecast isn't available right now")).toBeVisible();
  await page.getByRole("button", { name: "Start on hole 1" }).click();
  const round = await savedRound(page);
  expect(round.weather).toBeUndefined();
});

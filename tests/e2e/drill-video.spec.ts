import { expect, test } from "@playwright/test";

// Each drill in a plan has a how-to video. Nothing loads from YouTube until the
// golfer taps "Watch how"; then the privacy-enhanced player appears in the card.
test("drill videos load only when asked for", async ({ page }) => {
  const youtube: string[] = [];
  page.on("request", (r) => {
    if (/youtube|ytimg|googlevideo/.test(new URL(r.url()).hostname)) youtube.push(r.url());
  });

  await page.goto("/practice");
  await page.getByText("Distance ladder").click(); // open the drill's How to
  const watch = page.getByRole("button", { name: /Watch how/ }).first();
  await expect(watch).toBeVisible();
  await page.waitForTimeout(500);
  expect(youtube).toEqual([]);

  await watch.click();
  const player = page.locator('iframe[src^="https://www.youtube-nocookie.com/embed/"]');
  await expect(player).toBeVisible();
  await expect(page.getByRole("link", { name: "Open on YouTube" })).toBeVisible();
});

// Challenges get a video too: Twenty threes (putting) reuses the 3-foot circle drill's.
test("challenges have a video too", async ({ page }) => {
  await page.goto("/practice");
  await page.getByText("Tailor it to your game").click();
  await page.getByRole("radio", { name: "Putting" }).check({ force: true });
  await page.getByRole("button", { name: "Build my plan" }).click();
  const card = page.locator("details", { hasText: "Twenty threes" });
  await card.locator("summary").click();
  await expect(card.getByRole("button", { name: /Watch how/ })).toContainText("3 min");
});


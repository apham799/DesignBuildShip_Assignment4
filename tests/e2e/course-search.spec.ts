import { expect, test } from "@playwright/test";

// The Play page's course search forgives typos, word order and nicknames, and
// says why a nickname match is there.
test("course search is forgiving", async ({ page }) => {
  await page.goto("/play");
  const box = page.getByLabel("Find a course");
  const results = page.locator("section[aria-labelledby=listed] li");
  await expect(results.first()).toBeVisible();

  await box.fill("jakson");
  await expect(results.first()).toContainText("Jackson Park");

  await box.fill("port harb");
  await expect(results).toHaveCount(1);
  await expect(results.first()).toContainText("Harborside · Port Course");

  await box.fill("waveland");
  await expect(results.first()).toContainText("Sydney R. Marovitz");
  await expect(results.first()).toContainText("Matches “Waveland”");

  await box.fill("zzz");
  await expect(page.getByRole("link", { name: "Add “zzz” as your course" })).toBeVisible();
});

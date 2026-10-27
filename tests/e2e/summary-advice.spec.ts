import { expect, test } from "@playwright/test";

// Recording where tee shots went is optional. A round played without those taps
// must not count every fairway as missed and send the golfer off to practise driving.
test("untracked tee shots aren't counted as missed fairways", async ({ page }) => {
  await page.goto("/play/course/jackson-park");
  await page.getByText("Front 9").click();
  await page.getByRole("button", { name: "Start on hole 1" }).click();

  // Par on every hole with 2 putts, never saying where the tee shot went.
  for (let hole = 1; hole <= 9; hole++) {
    await page.waitForURL(new RegExp(`/hole/${hole}$`));
    await page.getByRole("button", { name: hole === 9 ? "Finish round" : `Next: hole ${hole + 1}` }).click();
  }

  await page.waitForURL(/\/summary$/);
  const fairways = page.locator("dt", { hasText: "Fairways" }).locator("..");
  await expect(fairways).toContainText("Not tracked");
  await expect(page.getByText(/Where to focus: Driving/)).toHaveCount(0);
});

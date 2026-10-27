import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

// A signed-out visitor can try the app; nothing leaves their tab until they sign
// in, and then the trial is saved to their account.
test("a guest's trial is kept after signing in", async ({ page }) => {
  const course = `Guest trial course ${Date.now()}`;

  await page.goto("/play/new");
  await page.getByLabel("Course name").fill(course);
  await page.getByText("9 holes").click();
  await page.getByRole("button", { name: "Save course" }).click();
  const nudge = page.getByText("Trying it out: nothing is saved yet");
  await expect(nudge).toBeVisible();
  await page.screenshot({ path: "test-results/guest-nudge.png" });

  // The nudge can be closed, and stays closed for the rest of the tab.
  await page.getByRole("button", { name: "Dismiss: Trying it out: nothing is saved yet" }).click();
  await expect(nudge).toHaveCount(0);
  await page.goto("/practice");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(nudge).toHaveCount(0);

  // Signing in adds the trial to the account and saves it to Supabase.
  const saved = page.waitForResponse((r) => r.url().includes("/rest/v1/custom_courses") && r.request().method() === "POST");
  await clerk.signIn({ page, emailAddress: "bucketlist-a+clerk_test@example.com" });
  expect((await saved).ok()).toBe(true);

  // A fresh load reads it back from the account.
  await page.goto("/play");
  await expect(page.getByText(course)).toBeVisible();
  await expect(page.getByText("Trying it out: nothing is saved yet")).toHaveCount(0);
});

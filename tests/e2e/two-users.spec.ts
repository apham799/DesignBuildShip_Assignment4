import { clerk } from "@clerk/testing/playwright";
import { expect, type Page, test } from "@playwright/test";

// Two golfers sign in, each saves a course of their own, and neither can see the
// other's. This is the row-level security promise, checked end to end: browser →
// Clerk token → Supabase → RLS → back to the screen.
//
// The users are Clerk test accounts (+clerk_test) in the development instance.
// clerk.signIn signs in with a one-time ticket made from CLERK_SECRET_KEY, so the
// test needs no passwords.

const GOLFER_A = "bucketlist-a+clerk_test@example.com";
const GOLFER_B = "bucketlist-b+clerk_test@example.com";

async function signInAs(page: Page, emailAddress: string) {
  await page.goto("/");
  await clerk.signIn({ page, emailAddress });
}

// Adds a custom course and waits until Supabase has stored it.
async function addCourse(page: Page, name: string) {
  await page.goto("/play/new");
  await page.getByLabel("Course name").fill(name);
  await page.getByText("9 holes").click();
  const saved = page.waitForResponse((r) => r.url().includes("/rest/v1/custom_courses") && r.request().method() === "POST");
  await page.getByRole("button", { name: "Save course" }).click();
  expect((await saved).ok()).toBe(true);
}

test("two golfers can't see each other's saved courses", async ({ browser }) => {
  const stamp = Date.now();
  const courseA = `Golfer A's course ${stamp}`;
  const courseB = `Golfer B's course ${stamp}`;

  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();

  await signInAs(a, GOLFER_A);
  await addCourse(a, courseA);

  await signInAs(b, GOLFER_B);
  await addCourse(b, courseB);

  // Fresh page loads, so what's on screen comes from the database, not memory.
  await a.goto("/play");
  await expect(a.getByText(courseA)).toBeVisible();
  await expect(a.getByText(courseB)).toHaveCount(0);

  await b.goto("/play");
  await expect(b.getByText(courseB)).toBeVisible();
  await expect(b.getByText(courseA)).toHaveCount(0);
});

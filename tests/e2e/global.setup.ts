import { clerkSetup } from "@clerk/testing/playwright";

// Gets a Clerk testing token (from CLERK_SECRET_KEY), so test browsers can sign in
// without tripping bot protection.
export default async function globalSetup() {
  await clerkSetup();
}

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: two-users.spec.ts >> two golfers can't see each other's saved courses
- Location: tests\e2e\two-users.spec.ts:30:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('Golfer B\'s course 1793086090878')
Expected: 0
Received: 1
Timeout:  15000ms

Call log:
  - Expect "toHaveCount" getByText('Golfer B\'s course 1793086090878') with timeout 15000ms
  - waiting for getByText('Golfer B\'s course 1793086090878')
    33 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - link "Skip to content" [ref=f2e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f2e3]:
    - generic [ref=f2e4]:
      - link "Bucket List" [ref=f2e5] [cursor=pointer]:
        - /url: /
      - generic [ref=f2e12]:
        - navigation "Main" [ref=f2e13]:
          - list [ref=f2e14]:
            - listitem [ref=f2e15]:
              - link "Home" [ref=f2e16] [cursor=pointer]:
                - /url: /
            - listitem [ref=f2e17]:
              - link "Play" [ref=f2e18] [cursor=pointer]:
                - /url: /play
            - listitem [ref=f2e19]:
              - link "Practice" [ref=f2e20] [cursor=pointer]:
                - /url: /practice
            - listitem [ref=f2e21]:
              - link "History" [ref=f2e22] [cursor=pointer]:
                - /url: /history
        - button "Open user menu" [ref=f2e24] [cursor=pointer]:
          - img "Tester A's logo" [ref=f2e27]
  - main [ref=f2e29]:
    - status
    - status [ref=f2e30]:
      - region "Celebration" [ref=f2e31]:
        - generic [ref=f2e49]:
          - paragraph [ref=f2e50]: Badge earned · crossed off your bucket list
          - paragraph [ref=f2e51]: Off the map
          - paragraph [ref=f2e52]: Add your own course.
          - generic [ref=f2e53]:
            - button "Nice!" [ref=f2e54]
            - link "See your bucket list" [ref=f2e55] [cursor=pointer]:
              - /url: /bucket-list
    - generic [ref=f2e57]:
      - generic [ref=f2e58]:
        - generic [ref=f2e59]:
          - heading "Where are you playing?" [level=1] [ref=f2e62]
          - generic [ref=f2e63]: Five Chicago public courses are built in, with par, yards and handicap for every hole. Playing somewhere else? Search for it and add it.
        - generic [ref=f2e64]:
          - generic [ref=f2e65]: Find a course
          - searchbox "Find a course" [ref=f2e66]
        - status [ref=f2e67]
      - generic [ref=f2e68]:
        - region [ref=f2e69]:
          - heading "Your courses" [level=2] [ref=f2e70]
          - list [ref=f2e71]:
            - listitem [ref=f2e72]:
              - link "Golfer B's course 1793086090878 Your course · 9 holes · Par 36" [ref=f2e73] [cursor=pointer]:
                - /url: /play/course/custom-322e1c95-d5cc-4397-9ebf-f08d7c33e04b
                - generic [ref=f2e74]:
                  - generic [ref=f2e75]: Golfer B's course 1793086090878
                  - generic [ref=f2e76]: Your course · 9 holes · Par 36
            - listitem [ref=f2e79]:
              - link "Golfer A's course 1793086090878 Your course · 9 holes · Par 36" [ref=f2e80] [cursor=pointer]:
                - /url: /play/course/custom-fe3cbd57-2b95-488d-ad37-7bce7e7d31ae
                - generic [ref=f2e81]:
                  - generic [ref=f2e82]: Golfer A's course 1793086090878
                  - generic [ref=f2e83]: Your course · 9 holes · Par 36
            - listitem [ref=f2e86]:
              - link "Golfer B's course 1793084147380 Your course · 9 holes · Par 36" [ref=f2e87] [cursor=pointer]:
                - /url: /play/course/custom-f0e2f2f2-299b-4395-817b-b821aa4bec1b
                - generic [ref=f2e88]:
                  - generic [ref=f2e89]: Golfer B's course 1793084147380
                  - generic [ref=f2e90]: Your course · 9 holes · Par 36
            - listitem [ref=f2e93]:
              - link "Guest trial course 1793084147469 Your course · 9 holes · Par 36" [ref=f2e94] [cursor=pointer]:
                - /url: /play/course/custom-0338f460-c890-4f34-aa04-edd01c04ea55
                - generic [ref=f2e95]:
                  - generic [ref=f2e96]: Guest trial course 1793084147469
                  - generic [ref=f2e97]: Your course · 9 holes · Par 36
            - listitem [ref=f2e100]:
              - link "Golfer A's course 1793084147380 Your course · 9 holes · Par 36" [ref=f2e101] [cursor=pointer]:
                - /url: /play/course/custom-5ddb5dc2-4b6e-47f6-8e19-6c9d86784ff2
                - generic [ref=f2e102]:
                  - generic [ref=f2e103]: Golfer A's course 1793084147380
                  - generic [ref=f2e104]: Your course · 9 holes · Par 36
            - listitem [ref=f2e107]:
              - link "Golfer B's course 1793083410477 Your course · 9 holes · Par 36" [ref=f2e108] [cursor=pointer]:
                - /url: /play/course/custom-25898c0f-28e1-4d80-8bc3-69af081dcad7
                - generic [ref=f2e109]:
                  - generic [ref=f2e110]: Golfer B's course 1793083410477
                  - generic [ref=f2e111]: Your course · 9 holes · Par 36
            - listitem [ref=f2e114]:
              - link "Guest trial course 1793083411087 Your course · 9 holes · Par 36" [ref=f2e115] [cursor=pointer]:
                - /url: /play/course/custom-b8a67070-f06b-4608-817a-3095dd87cae8
                - generic [ref=f2e116]:
                  - generic [ref=f2e117]: Guest trial course 1793083411087
                  - generic [ref=f2e118]: Your course · 9 holes · Par 36
            - listitem [ref=f2e121]:
              - link "Golfer A's course 1793083410477 Your course · 9 holes · Par 36" [ref=f2e122] [cursor=pointer]:
                - /url: /play/course/custom-98430f85-e6b0-4b60-8235-fd3f9a90b964
                - generic [ref=f2e123]:
                  - generic [ref=f2e124]: Golfer A's course 1793083410477
                  - generic [ref=f2e125]: Your course · 9 holes · Par 36
            - listitem [ref=f2e128]:
              - link "Guest trial course 1793082267947 Your course · 9 holes · Par 36" [ref=f2e129] [cursor=pointer]:
                - /url: /play/course/custom-092db73e-fbcc-4f17-9bf4-aa8255b295f5
                - generic [ref=f2e130]:
                  - generic [ref=f2e131]: Guest trial course 1793082267947
                  - generic [ref=f2e132]: Your course · 9 holes · Par 36
            - listitem [ref=f2e135]:
              - link "Guest trial course 1793081669014 Your course · 9 holes · Par 36" [ref=f2e136] [cursor=pointer]:
                - /url: /play/course/custom-a88001dd-02eb-447f-af52-9601308d9b99
                - generic [ref=f2e137]:
                  - generic [ref=f2e138]: Guest trial course 1793081669014
                  - generic [ref=f2e139]: Your course · 9 holes · Par 36
            - listitem [ref=f2e142]:
              - link "Golfer B's course 1793081518768 Your course · 9 holes · Par 36" [ref=f2e143] [cursor=pointer]:
                - /url: /play/course/custom-a48d3616-a756-4802-bfa3-62e9e5cc1135
                - generic [ref=f2e144]:
                  - generic [ref=f2e145]: Golfer B's course 1793081518768
                  - generic [ref=f2e146]: Your course · 9 holes · Par 36
            - listitem [ref=f2e149]:
              - link "Golfer A's course 1793081518768 Your course · 9 holes · Par 36" [ref=f2e150] [cursor=pointer]:
                - /url: /play/course/custom-00472b5a-08f3-4ee6-8b6f-1cd139da7077
                - generic [ref=f2e151]:
                  - generic [ref=f2e152]: Golfer A's course 1793081518768
                  - generic [ref=f2e153]: Your course · 9 holes · Par 36
            - listitem [ref=f2e156]:
              - link "Guest trial course 1793081518883 Your course · 9 holes · Par 36" [ref=f2e157] [cursor=pointer]:
                - /url: /play/course/custom-29f9fe14-8533-4987-9d43-2a95cfd73a19
                - generic [ref=f2e158]:
                  - generic [ref=f2e159]: Guest trial course 1793081518883
                  - generic [ref=f2e160]: Your course · 9 holes · Par 36
            - listitem [ref=f2e163]:
              - link "Golfer B's course 1793081454840 Your course · 9 holes · Par 36" [ref=f2e164] [cursor=pointer]:
                - /url: /play/course/custom-386de33f-95b5-4a59-841e-f5f7943c6fe5
                - generic [ref=f2e165]:
                  - generic [ref=f2e166]: Golfer B's course 1793081454840
                  - generic [ref=f2e167]: Your course · 9 holes · Par 36
            - listitem [ref=f2e170]:
              - link "Golfer A's course 1793081454840 Your course · 9 holes · Par 36" [ref=f2e171] [cursor=pointer]:
                - /url: /play/course/custom-0b8ed8ec-5cf2-4fd9-9d3e-dabe33ce1d70
                - generic [ref=f2e172]:
                  - generic [ref=f2e173]: Golfer A's course 1793081454840
                  - generic [ref=f2e174]: Your course · 9 holes · Par 36
        - region [ref=f2e177]:
          - heading "Chicago courses" [level=2] [ref=f2e178]
          - list [ref=f2e179]:
            - listitem [ref=f2e180]:
              - link "Jackson Park South Side · 18 holes · Par 70" [ref=f2e181] [cursor=pointer]:
                - /url: /play/course/jackson-park
                - generic [ref=f2e182]:
                  - generic [ref=f2e183]: Jackson Park
                  - generic [ref=f2e184]: South Side · 18 holes · Par 70
            - listitem [ref=f2e187]:
              - link "Harborside · Port Course Far South Side · 18 holes · Par 72" [ref=f2e188] [cursor=pointer]:
                - /url: /play/course/harborside-port
                - generic [ref=f2e189]:
                  - generic [ref=f2e190]: Harborside · Port Course
                  - generic [ref=f2e191]: Far South Side · 18 holes · Par 72
            - listitem [ref=f2e194]:
              - link "Harborside · Starboard Course Far South Side · 18 holes · Par 72" [ref=f2e195] [cursor=pointer]:
                - /url: /play/course/harborside-starboard
                - generic [ref=f2e196]:
                  - generic [ref=f2e197]: Harborside · Starboard Course
                  - generic [ref=f2e198]: Far South Side · 18 holes · Par 72
            - listitem [ref=f2e201]:
              - link "Sydney R. Marovitz North Side lakefront · 9 holes · Par 36" [ref=f2e202] [cursor=pointer]:
                - /url: /play/course/sydney-marovitz
                - generic [ref=f2e203]:
                  - generic [ref=f2e204]: Sydney R. Marovitz
                  - generic [ref=f2e205]: North Side lakefront · 9 holes · Par 36
            - listitem [ref=f2e208]:
              - link "Columbus Park West Side · 9 holes · Par 35" [ref=f2e209] [cursor=pointer]:
                - /url: /play/course/columbus-park
                - generic [ref=f2e210]:
                  - generic [ref=f2e211]: Columbus Park
                  - generic [ref=f2e212]: West Side · 9 holes · Par 35
            - listitem [ref=f2e215]:
              - link "Robert A. Black Far North Side · 9 holes · Par 33" [ref=f2e216] [cursor=pointer]:
                - /url: /play/course/robert-a-black
                - generic [ref=f2e217]:
                  - generic [ref=f2e218]: Robert A. Black
                  - generic [ref=f2e219]: Far North Side · 9 holes · Par 33
      - paragraph [ref=f2e223]:
        - text: Course not listed?
        - link "Add your own" [ref=f2e224] [cursor=pointer]:
          - /url: /play/new
        - text: and set the pars as you play.
  - button "Reset or load sample data" [ref=f2e226]:
    - generic [aria-hidden] [ref=f2e230]: Reset
  - generic [ref=f2e235] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=f2e236]
    - generic [ref=f2e240]:
      - button "Open Next.js Dev Tools" [ref=f2e241]: Cache disabled
      - button "Collapse Cache disabled badge" [ref=f2e242]
  - alert [ref=f2e245]
```

# Test source

```ts
  1  | import { clerk } from "@clerk/testing/playwright";
  2  | import { expect, type Page, test } from "@playwright/test";
  3  | 
  4  | // Two golfers sign in, each saves a course of their own, and neither can see the
  5  | // other's. This is the row-level security promise, checked end to end: browser →
  6  | // Clerk token → Supabase → RLS → back to the screen.
  7  | //
  8  | // The users are Clerk test accounts (+clerk_test) in the development instance.
  9  | // clerk.signIn signs in with a one-time ticket made from CLERK_SECRET_KEY, so the
  10 | // test needs no passwords.
  11 | 
  12 | const GOLFER_A = "bucketlist-a+clerk_test@example.com";
  13 | const GOLFER_B = "bucketlist-b+clerk_test@example.com";
  14 | 
  15 | async function signInAs(page: Page, emailAddress: string) {
  16 |   await page.goto("/");
  17 |   await clerk.signIn({ page, emailAddress });
  18 | }
  19 | 
  20 | // Adds a custom course and waits until Supabase has stored it.
  21 | async function addCourse(page: Page, name: string) {
  22 |   await page.goto("/play/new");
  23 |   await page.getByLabel("Course name").fill(name);
  24 |   await page.getByText("9 holes").click();
  25 |   const saved = page.waitForResponse((r) => r.url().includes("/rest/v1/custom_courses") && r.request().method() === "POST");
  26 |   await page.getByRole("button", { name: "Save course" }).click();
  27 |   expect((await saved).ok()).toBe(true);
  28 | }
  29 | 
  30 | test("two golfers can't see each other's saved courses", async ({ browser }) => {
  31 |   const stamp = Date.now();
  32 |   const courseA = `Golfer A's course ${stamp}`;
  33 |   const courseB = `Golfer B's course ${stamp}`;
  34 | 
  35 |   const a = await (await browser.newContext()).newPage();
  36 |   const b = await (await browser.newContext()).newPage();
  37 | 
  38 |   await signInAs(a, GOLFER_A);
  39 |   await addCourse(a, courseA);
  40 | 
  41 |   await signInAs(b, GOLFER_B);
  42 |   await addCourse(b, courseB);
  43 | 
  44 |   // Fresh page loads, so what's on screen comes from the database, not memory.
  45 |   await a.goto("/play");
  46 |   await expect(a.getByText(courseA)).toBeVisible();
> 47 |   await expect(a.getByText(courseB)).toHaveCount(0);
     |                                      ^ Error: expect(locator).toHaveCount(expected) failed
  48 | 
  49 |   await b.goto("/play");
  50 |   await expect(b.getByText(courseB)).toBeVisible();
  51 |   await expect(b.getByText(courseA)).toHaveCount(0);
  52 | });
  53 | 
```
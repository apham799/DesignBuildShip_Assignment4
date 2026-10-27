import { Badge, ButtonLink, Card, Column, Columns, Page, TextLink } from "@/components/ui";

// What a signed-out visitor sees: what the tool does, and a way in. No one's data.
export function Landing() {
  return (
    <Page>
      <Columns>
        <Column span={8}>
          <div className="flex flex-col gap-3">
            <p className="text-label text-muted">Golf notes that remember for you</p>
            <h1 className="text-display">Track a round. Get a practice plan.</h1>
            <p className="max-w-2xl text-body text-muted">
              Tap in each hole as you play a real Chicago course. Bucket List finds what cost you the most strokes, checks the weather, and tells you whether
              your next session belongs on the range or in a simulator.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/play" size="lg">
              Try a round, no account needed
            </ButtonLink>
            <ButtonLink href="/practice" size="lg" variant="secondary">
              Get a practice plan
            </ButtonLink>
          </div>
          <p className="text-body">
            Ready to keep your rounds?{" "}
            <TextLink href="/sign-up">Create a free account</TextLink> or <TextLink href="/sign-in">sign in</TextLink>.
          </p>
          <ul className="flex flex-col gap-2 text-body">
            {[
              "Try it first: play a round or plan a session without an account.",
              "Create a free account to keep them, on any device. Only you can see them.",
              "Official scorecards for Chicago public courses are built in. Anywhere else, add your own.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-green" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </Column>

        <Column span={4} sticky>
          <Card tone="cream" as="section" labelledBy="example" className="flex flex-col gap-3">
            <Badge tone="brass">Example · after a round</Badge>
            <h2 id="example" className="text-heading">
              Where to focus: Putting
            </h2>
            <p className="text-body">36 putts over 18 holes, with 4 three-putts. A bogey golfer takes about 34, so that cost you roughly 2 strokes.</p>
            <p className="text-body text-muted">One thing to work on, with the reason, after every round.</p>
          </Card>
        </Column>
      </Columns>
    </Page>
  );
}

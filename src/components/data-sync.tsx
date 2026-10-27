"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabase, loadAccount } from "@/lib/db";
import { clearGuest, connect, connectGuest, hasData, importGuest, readGuest, retrySaving, startLoading, useMode, useSaveState, useStore } from "@/lib/storage";
import { Alert, Button, ButtonLink, Toast } from "@/components/ui";

const NUDGE_KEY = "bucket-list:v1:signup-nudge";

// Signed out: runs the guest trial (this tab only). Signed in: loads the account
// from Supabase, adds any guest trial to it, and clears the account away again on
// sign-out. Also tells the golfer when loading or saving fails.
export function DataSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [imported, setImported] = useState<string | null>(null);
  // Closing the sign-up nudge hides it for the rest of this tab.
  const [nudgeClosed, setNudgeClosed] = useState(() => {
    try {
      return sessionStorage.getItem(NUDGE_KEY) === "closed";
    } catch {
      return false;
    }
  });
  const closeNudge = useCallback(() => {
    setNudgeClosed(true);
    try {
      sessionStorage.setItem(NUDGE_KEY, "closed");
    } catch {}
  }, []);
  const saveState = useSaveState();
  const mode = useMode();
  const store = useStore();
  // getToken changes identity between renders; keep the latest one for the client.
  const tokenRef = useRef(getToken);
  useEffect(() => {
    tokenRef.current = getToken;
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      connectGuest();
      return;
    }
    let cancelled = false;
    startLoading();
    const db = createSupabase(() => tokenRef.current());
    loadAccount(db)
      .then((account) => {
        if (cancelled) return;
        connect(userId, db, account);
        // Read the trial only once the account is in, so a cancelled load can't lose it.
        const guest = readGuest();
        if (guest && hasData(guest)) {
          importGuest(guest);
          setImported(guest.rounds.length ? "Your trial round is saved to your account" : "Your trial is saved to your account");
        }
        clearGuest();
      })
      .catch((error) => {
        console.error("Couldn't load from Supabase", error);
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, attempt]);

  const retryLoad = useCallback(() => {
    setLoadError(false);
    setAttempt((n) => n + 1);
  }, []);
  const clearImported = useCallback(() => setImported(null), []);

  let banner = null;
  if (loadError) {
    banner = (
      <Alert
        tone="error"
        title="Couldn't load your rounds and practice"
        action={
          <Button size="sm" variant="secondary" onClick={retryLoad}>
            Try again
          </Button>
        }
      >
        Check your connection, then try again. Nothing you saved is lost.
      </Alert>
    );
  } else if (saveState === "error") {
    banner = (
      <Alert
        tone="warning"
        title="Your last change hasn't saved yet"
        action={
          <Button size="sm" variant="secondary" onClick={retrySaving}>
            Try now
          </Button>
        }
      >
        It&apos;s kept on this screen and we&apos;ll keep retrying. Don&apos;t close the tab until this goes away.
      </Alert>
    );
  } else if (mode === "guest" && store && hasData(store) && !nudgeClosed) {
    banner = (
      <Alert
        tone="warning"
        title="Trying it out: nothing is saved yet"
        onDismiss={closeNudge}
        action={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/sign-up" size="sm">
              Create a free account to keep it
            </ButtonLink>
            <ButtonLink href="/sign-in" size="sm" variant="secondary">
              Sign in
            </ButtonLink>
          </div>
        }
      >
        What you log here disappears when you close this tab. With an account it&apos;s kept, on any device, and only you can see it.
      </Alert>
    );
  }

  return (
    <>
      {banner && <div className="mx-auto mb-6 max-w-2xl">{banner}</div>}
      <Toast message={imported} onDone={clearImported} duration={4000} />
    </>
  );
}

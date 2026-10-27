"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabase, loadAccount } from "@/lib/db";
import { connect, disconnect, retrySaving, useSaveState } from "@/lib/storage";
import { Alert, Button } from "@/components/ui";

// Loads the signed-in user's data from Supabase and hands it to the store, and
// clears it on sign-out. Also tells the golfer when loading or saving fails.
export function DataSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const saveState = useSaveState();
  // getToken changes identity between renders; keep the latest one for the client.
  const tokenRef = useRef(getToken);
  useEffect(() => {
    tokenRef.current = getToken;
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      disconnect();
      return;
    }
    let cancelled = false;
    const db = createSupabase(() => tokenRef.current());
    loadAccount(db)
      .then((account) => {
        if (!cancelled) connect(userId, db, account);
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

  if (loadError) {
    return (
      <div className="mx-auto mb-6 max-w-2xl">
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
      </div>
    );
  }

  if (saveState === "error") {
    return (
      <div className="mx-auto mb-6 max-w-2xl">
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
      </div>
    );
  }

  return null;
}

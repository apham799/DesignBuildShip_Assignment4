"use client";

import { useEffect, useRef } from "react";

// When one control replaces another (Delete → "Delete? Delete / Keep", Change focus →
// the picker), keyboard and screen-reader focus would fall back to the page. This moves
// it to `whenOpen` after opening and back to `whenClosed` after closing.
//
// It only acts when `open` actually changes, compared with the last value it saw, so
// pages never steal focus on load. (A "skip the first render" flag isn't enough: React
// runs effects twice in development, and cached pages can mount again.)
export function useFocusSwap(open: boolean) {
  const whenOpen = useRef<HTMLButtonElement | null>(null);
  const whenClosed = useRef<HTMLButtonElement | null>(null);
  const last = useRef(open);
  useEffect(() => {
    if (last.current === open) return;
    last.current = open;
    (open ? whenOpen : whenClosed).current?.focus();
  }, [open]);
  return { whenOpen, whenClosed };
}

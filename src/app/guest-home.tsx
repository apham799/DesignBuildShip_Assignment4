"use client";

import { LoadingCard } from "@/components/ui";
import { hasData, useStore } from "@/lib/storage";
import { HomeScreen } from "./home-screen";
import { Landing } from "./landing";

// Signed out: the landing page, until the guest has tried something in this tab.
export function GuestHome() {
  const store = useStore();
  if (!store) return <LoadingCard />;
  return hasData(store) ? <HomeScreen /> : <Landing />;
}

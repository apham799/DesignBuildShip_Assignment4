import { Show } from "@clerk/nextjs";
import { Suspense } from "react";
import { LoadingCard } from "@/components/ui";
import { HomeScreen } from "./home-screen";
import { GuestHome } from "./guest-home";

// Signed out: the landing page (or the guest's trial). Signed in: your home screen.
export default function Home() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Show when="signed-out">
        <GuestHome />
      </Show>
      <Show when="signed-in">
        <HomeScreen />
      </Show>
    </Suspense>
  );
}

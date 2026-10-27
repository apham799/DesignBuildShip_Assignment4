import { Show } from "@clerk/nextjs";
import { Suspense } from "react";
import { LoadingCard } from "@/components/ui";
import { HomeScreen } from "./home-screen";
import { Landing } from "./landing";

// Signed out: the landing page. Signed in: your home screen.
export default function Home() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Show when="signed-out">
        <Landing />
      </Show>
      <Show when="signed-in">
        <HomeScreen />
      </Show>
    </Suspense>
  );
}

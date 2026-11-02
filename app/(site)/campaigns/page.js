import { Suspense } from "react";
import { ExploreView } from "@/components/campaigns/ExploreView";

export const metadata = {
  title: "Explore Campaigns",
  description: "Browse live campaigns in technology, art, community, health, education and the environment.",
};

export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Explore campaigns</h1>
        <p className="max-w-2xl text-foreground/70">
          Find a project you believe in. Search by keyword, narrow by category or goal, and back it with
          credits.
        </p>
      </header>
      <Suspense>
        <ExploreView detailsBase="/campaigns" />
      </Suspense>
    </div>
  );
}

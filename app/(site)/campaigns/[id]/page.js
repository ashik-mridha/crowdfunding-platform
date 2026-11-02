import { Suspense } from "react";
import { CampaignDetailView, DetailSkeleton } from "@/components/campaigns/CampaignDetailView";

export const metadata = { title: "Campaign details" };

export default function CampaignDetailsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Suspense fallback={<DetailSkeleton />}>
        <CampaignDetailView backHref="/campaigns" backLabel="All campaigns" />
      </Suspense>
    </div>
  );
}

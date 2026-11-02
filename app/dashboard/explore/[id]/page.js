import { Suspense } from "react";
import { CampaignDetailView, DetailSkeleton } from "@/components/campaigns/CampaignDetailView";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Campaign details" };

export default function DashboardCampaignPage() {
  return (
    <RolePage roles={["supporter"]}>
      <Suspense fallback={<DetailSkeleton />}>
        <CampaignDetailView backHref="/dashboard/explore" backLabel="Back to explore" />
      </Suspense>
    </RolePage>
  );
}

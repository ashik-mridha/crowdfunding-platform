import { Suspense } from "react";
import { ExploreView } from "@/components/campaigns/ExploreView";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Explore Campaigns" };

export default function DashboardExplorePage() {
  return (
    <RolePage roles={["supporter"]}>
      <PageHeader title="Explore campaigns" description="Discover projects to back with your credits." />
      <Suspense>
        <ExploreView detailsBase="/dashboard/explore" />
      </Suspense>
    </RolePage>
  );
}

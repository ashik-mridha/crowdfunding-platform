import { ManageCampaigns } from "@/components/admin/ManageCampaigns";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Manage Campaigns" };

export default function ManageCampaignsPage() {
  return (
    <RolePage roles={["admin"]}>
      <PageHeader
        title="Manage campaigns"
        description="Every campaign on the platform, whatever its status."
      />
      <ManageCampaigns />
    </RolePage>
  );
}

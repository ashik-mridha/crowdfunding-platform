import { AddCampaignForm } from "@/components/creator/AddCampaignForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Add New Campaign" };

export default function AddCampaignPage() {
  return (
    <RolePage roles={["creator"]}>
      <PageHeader
        title="Add new campaign"
        description="Tell supporters what you are building and why it matters."
      />
      <AddCampaignForm />
    </RolePage>
  );
}

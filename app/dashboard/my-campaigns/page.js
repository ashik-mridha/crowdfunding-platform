import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { MyCampaigns } from "@/components/creator/MyCampaigns";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "My Campaigns" };

export default function MyCampaignsPage() {
  return (
    <RolePage roles={["creator"]}>
      <PageHeader
        title="My campaigns"
        description="Sorted by deadline, latest first."
        actions={
          <Link
            href="/dashboard/add-campaign"
            className={`${buttonVariants({ variant: "primary" })} min-h-11`}
          >
            <Plus className="size-4" aria-hidden="true" />
            New campaign
          </Link>
        }
      />
      <MyCampaigns />
    </RolePage>
  );
}

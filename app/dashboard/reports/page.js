import { ReportsTable } from "@/components/admin/ReportsTable";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <RolePage roles={["admin"]}>
      <PageHeader
        title="Reports"
        description="Campaigns flagged by supporters. Suspend to hide, or delete with refunds."
      />
      <ReportsTable />
    </RolePage>
  );
}

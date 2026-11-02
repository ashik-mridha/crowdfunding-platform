import { WithdrawalRequests } from "@/components/admin/WithdrawalRequests";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Withdrawal Requests" };

export default function WithdrawalRequestsPage() {
  return (
    <RolePage roles={["admin"]}>
      <PageHeader
        title="Withdrawal requests"
        description="Pay creators, then mark each request as successful."
      />
      <WithdrawalRequests />
    </RolePage>
  );
}

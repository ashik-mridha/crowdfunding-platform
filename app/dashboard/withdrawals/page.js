import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";
import { CreatorWithdrawals } from "@/components/withdrawals/CreatorWithdrawals";

export const metadata = { title: "Withdrawals" };

export default function WithdrawalsPage() {
  return (
    <RolePage roles={["creator"]}>
      <PageHeader
        title="Withdrawals"
        description="Turn the credits your campaigns raised into money. 20 credits = $1."
      />
      <CreatorWithdrawals />
    </RolePage>
  );
}

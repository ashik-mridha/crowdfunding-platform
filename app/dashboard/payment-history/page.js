import { RolePage } from "@/components/dashboard/RolePage";
import { PaymentHistoryPage } from "@/components/payments/PaymentHistoryPage";

export const metadata = { title: "Payment History" };

export default function Page() {
  return (
    <RolePage roles={["supporter", "creator"]}>
      <PaymentHistoryPage />
    </RolePage>
  );
}

import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";
import { PurchaseCredits } from "@/components/payments/PurchaseCredits";

export const metadata = { title: "Purchase Credit" };

export default function PurchaseCreditPage() {
  return (
    <RolePage roles={["supporter"]}>
      <PageHeader
        title="Purchase credit"
        description="Choose a package and back the campaigns you care about."
      />
      <Suspense>
        <PurchaseCredits />
      </Suspense>
    </RolePage>
  );
}

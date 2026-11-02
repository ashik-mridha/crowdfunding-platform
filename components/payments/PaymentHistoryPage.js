"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { PayoutHistory, PurchaseHistory } from "@/components/payments/PaymentHistory";
import { useAuth } from "@/hooks/useAuth";

// One route, two meanings: supporters see credit purchases, creators see paid-out withdrawals.
export function PaymentHistoryPage() {
  const { user } = useAuth();
  return user.role === "creator" ? (
    <>
      <PageHeader title="Payment history" description="Withdrawals that have been paid out to you." />
      <PayoutHistory />
    </>
  ) : (
    <>
      <PageHeader title="Payment history" description="Every credit purchase you have made." />
      <PurchaseHistory />
    </>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Modal, Skeleton, toast, useOverlayState } from "@heroui/react";
import { Coins, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { CheckoutDialog } from "@/components/payments/CheckoutDialog";
import { ErrorState } from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatUsd } from "@/lib/format";

function PackageCard({ pkg }) {
  const state = useOverlayState();
  return (
    <Card className={pkg.best_value ? "border-2 border-accent shadow-lg" : ""}>
      <Card.Content className="flex h-full flex-col gap-4 p-6">
        <div className="flex h-7 items-center justify-between">
          <Coins className="size-6 text-accent-ink" aria-hidden="true" />
          {pkg.best_value && (
            <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
              <Sparkles className="mr-1 size-3" aria-hidden="true" />
              Best value
            </span>
          )}
        </div>
        <div>
          <p className="font-heading text-4xl font-extrabold">{formatCredits(pkg.credits)}</p>
          <p className="text-sm text-foreground/70">credits</p>
        </div>
        <div>
          <p className="font-heading text-2xl font-bold text-accent-ink">{formatUsd(pkg.price_usd)}</p>
          <p className="text-xs text-foreground/70">{pkg.credits_per_usd} credits per $1</p>
        </div>
        <Modal state={state}>
          <Button
            fullWidth
            variant={pkg.best_value ? "primary" : "outline"}
            className="mt-auto min-h-11"
            aria-label={`Buy ${pkg.credits} credits for ${formatUsd(pkg.price_usd)}`}
          >
            Buy now
          </Button>
          <CheckoutDialog pkg={pkg} state={state} />
        </Modal>
      </Card.Content>
    </Card>
  );
}

// Stripe may redirect back with ?payment_intent=... after 3D Secure; finish the purchase here.
function useRedirectReturn() {
  const params = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const intentId = params.get("payment_intent");
  const status = params.get("redirect_status");

  useEffect(() => {
    if (!intentId) return;
    let cancelled = false;
    async function finish() {
      try {
        if (status === "succeeded") {
          const { data } = await api.post("/payments/confirm", { paymentIntentId: intentId });
          await refreshUser();
          if (!cancelled) {
            toast.success(data.data.already_processed ? "Payment already applied" : "Credits added", {
              description: `Your balance is ${formatCredits(data.data.credits)} credits.`,
            });
          }
        } else if (!cancelled) {
          toast.danger("Payment was not completed");
        }
      } catch (err) {
        if (!cancelled) toast.danger(err.response?.data?.error?.message || "Could not confirm the payment");
      } finally {
        if (!cancelled) router.replace("/dashboard/purchase-credit");
      }
    }
    finish();
    return () => {
      cancelled = true;
    };
  }, [intentId, status, refreshUser, router]);
}

export function PurchaseCredits() {
  useRedirectReturn();
  const { data, loading, error, refetch } = useFetch("/payments/packages");

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading packages">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-64 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.mode === "dummy" && (
        <p role="note" className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <strong>Test payment mode:</strong> purchases on this server do not charge a card.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.packages.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>
      <p className="text-sm text-foreground/70">
        Credits never expire. Prices are set by Fundora and checked again on the server for every purchase.
      </p>
    </div>
  );
}

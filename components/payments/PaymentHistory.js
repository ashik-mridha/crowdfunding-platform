"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip, Skeleton, Table, buttonVariants } from "@heroui/react";
import { Receipt } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatDate, formatUsd } from "@/lib/format";

function Loading() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading payment history">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// Supporter: every completed credit purchase.
export function PurchaseHistory() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch("/payments/mine", { page, limit: 8 });

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) return <Loading />;
  if (!data?.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No purchases yet"
        description="When you buy credits, each payment will be listed here."
      >
        <Link
          href="/dashboard/purchase-credit"
          className={`${buttonVariants({ variant: "primary" })} min-h-11`}
        >
          Purchase credits
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Credit purchases" className="min-w-[560px]">
            <Table.Header>
              <Table.Column isRowHeader>Package</Table.Column>
              <Table.Column>Credits</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((p) => (
                <Table.Row key={p._id} id={p._id}>
                  <Table.Cell>
                    <span className="font-semibold">{formatCredits(p.credits)} credits pack</span>
                    {p.mode === "dummy" && (
                      <span className="block text-xs text-foreground/70">Test payment</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>+{formatCredits(p.credits)}</Table.Cell>
                  <Table.Cell>{formatUsd(p.amount_usd)}</Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap">{formatDate(p.paid_at || p.date)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" color="success" className="capitalize">
                      {p.status}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} />}
    </div>
  );
}

// Creator: withdrawals that an admin has paid out.
export function PayoutHistory() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch("/withdrawals/mine", {
    page,
    limit: 8,
    status: "approved",
  });

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) return <Loading />;
  if (!data?.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No payouts yet"
        description="Approved withdrawals will be listed here once an admin has sent the payment."
      >
        <Link href="/dashboard/withdrawals" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
          Request a withdrawal
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Approved withdrawals" className="min-w-[640px]">
            <Table.Header>
              <Table.Column isRowHeader>Date</Table.Column>
              <Table.Column>Credits</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Payment system</Table.Column>
              <Table.Column>Account</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((w) => (
                <Table.Row key={w._id} id={w._id}>
                  <Table.Cell>
                    <span className="whitespace-nowrap">{formatDate(w.withdraw_date)}</span>
                  </Table.Cell>
                  <Table.Cell>{formatCredits(w.withdrawal_credit)}</Table.Cell>
                  <Table.Cell>{formatUsd(w.withdrawal_amount)}</Table.Cell>
                  <Table.Cell>{w.payment_system}</Table.Cell>
                  <Table.Cell>{w.account_number}</Table.Cell>
                  <Table.Cell>
                    <Chip size="sm" color="success" className="capitalize">
                      {w.status}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {meta && <Pager page={meta.page} totalPages={meta.totalPages} onChange={setPage} />}
    </div>
  );
}

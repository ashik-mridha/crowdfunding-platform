"use client";

import { useState } from "react";
import { Skeleton, Table, toast } from "@heroui/react";
import { BadgeCheck, HandCoins } from "lucide-react";
import api from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatDate, formatUsd } from "@/lib/format";

export function WithdrawalRequests() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch(
    "/admin/withdrawals/pending",
    { page, limit: 8 },
    { liveRefresh: true }
  );

  async function approve(w) {
    try {
      await api.patch(`/admin/withdrawals/${w._id}/approve`);
      toast.success("Payment marked as successful", {
        description: `${w.creator_name} was notified about their ${formatUsd(w.withdrawal_amount)} payout.`,
      });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not approve the withdrawal");
      refetch();
      throw err;
    }
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading withdrawal requests">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState
        icon={HandCoins}
        title="No pending withdrawals"
        description="Creator payout requests will show up here when they are submitted."
      />
    );
  }

  return (
    <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Pending withdrawal requests" className="min-w-[860px]">
            <Table.Header>
              <Table.Column isRowHeader>Creator</Table.Column>
              <Table.Column>Credits</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Payment system</Table.Column>
              <Table.Column>Account number</Table.Column>
              <Table.Column>Requested</Table.Column>
              <Table.Column>Action</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((w) => (
                <Table.Row key={w._id} id={w._id}>
                  <Table.Cell>
                    <span className="block font-semibold">{w.creator_name}</span>
                    <span className="text-xs text-foreground/70">{w.creator_email}</span>
                  </Table.Cell>
                  <Table.Cell>{formatCredits(w.withdrawal_credit)}</Table.Cell>
                  <Table.Cell>
                    <span className="font-semibold">{formatUsd(w.withdrawal_amount)}</span>
                  </Table.Cell>
                  <Table.Cell>{w.payment_system}</Table.Cell>
                  <Table.Cell>
                    <span className="break-all">{w.account_number}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap">{formatDate(w.withdraw_date)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <ConfirmDialog
                      triggerLabel={
                        <>
                          <BadgeCheck className="size-4" aria-hidden="true" />
                          Payment Success
                        </>
                      }
                      triggerVariant="primary"
                      title="Confirm the payment was sent?"
                      description={`Mark ${formatUsd(w.withdrawal_amount)} to ${w.creator_name} via ${w.payment_system} (${w.account_number}) as paid. Only do this after the money has been sent. ${w.creator_name} will be notified.`}
                      confirmLabel="Payment Success"
                      onConfirm={() => approve(w)}
                    />
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

"use client";

import { useState } from "react";
import { Button, Skeleton, Table, toast } from "@heroui/react";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import api from "@/lib/api";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatDate } from "@/lib/format";

export function PendingCampaigns({ onChanged }) {
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const { data, meta, loading, error, refetch } = useFetch(
    "/admin/campaigns/pending",
    { page, limit: 8 },
    { liveRefresh: true }
  );

  async function decide(campaign, status) {
    setBusyId(campaign._id);
    try {
      await api.patch(`/admin/campaigns/${campaign._id}/status`, { status });
      toast.success(status === "approved" ? "Campaign approved" : "Campaign rejected", {
        description: campaign.title,
      });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
      onChanged?.();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not update the campaign");
      throw err;
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading pending campaigns">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="All caught up"
        description="There are no campaigns waiting for approval right now."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Campaigns awaiting approval" className="min-w-[720px]">
            <Table.Header>
              <Table.Column isRowHeader>Campaign</Table.Column>
              <Table.Column>Creator</Table.Column>
              <Table.Column>Goal</Table.Column>
              <Table.Column>Deadline</Table.Column>
              <Table.Column>Decision</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((c) => (
                <Table.Row key={c._id} id={c._id}>
                  <Table.Cell>
                    <div className="max-w-xs">
                      <span className="line-clamp-2 font-semibold">{c.title}</span>
                      <span className="text-xs text-foreground/70">{c.category}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="block">{c.creator_name}</span>
                    <span className="text-xs text-foreground/70">{c.creator_email}</span>
                  </Table.Cell>
                  <Table.Cell>{formatCredits(c.funding_goal)}</Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap">{formatDate(c.deadline)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="min-h-11"
                        isPending={busyId === c._id}
                        aria-label={`Approve ${c.title}`}
                        onPress={() => decide(c, "approved").catch(() => {})}
                      >
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Approve
                      </Button>
                      <ConfirmDialog
                        triggerLabel="Reject"
                        triggerVariant="danger-soft"
                        title="Reject this campaign?"
                        description={`"${c.title}" will be rejected and will not appear on Explore.`}
                        confirmLabel="Reject campaign"
                        confirmVariant="danger"
                        onConfirm={() => decide(c, "rejected")}
                      />
                    </div>
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

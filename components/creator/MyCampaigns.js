"use client";

import { useState } from "react";
import Link from "next/link";
import { Skeleton, Table, buttonVariants, toast } from "@heroui/react";
import { Megaphone, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { StatusChip } from "@/components/ui/StatusChip";
import { UpdateCampaignModal } from "@/components/creator/UpdateCampaignModal";
import { useFetch } from "@/hooks/useFetch";
import { daysLeftLabel, formatCredits, formatDate } from "@/lib/format";

const PAGE_SIZE = 10;

export function MyCampaigns() {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch("/campaigns/mine", { page, limit: PAGE_SIZE });

  async function remove(campaign) {
    try {
      await api.delete(`/campaigns/${campaign._id}`);
      toast.success("Campaign deleted", { description: "Any contributions will be refunded to supporters." });
      // Step back a page if that was the last row on this one.
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not delete the campaign");
      throw err;
    }
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading your campaigns">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={Megaphone}
        title="You have not created a campaign yet"
        description="Share your idea with the community. New campaigns are reviewed by an admin before going live."
      >
        <Link href="/dashboard/add-campaign" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
          Add your first campaign
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="My campaigns" className="min-w-[760px]">
            <Table.Header>
              <Table.Column isRowHeader>Campaign</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Deadline</Table.Column>
              <Table.Column>Raised</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((c) => (
                <Table.Row key={c._id} id={c._id}>
                  <Table.Cell>
                    <div className="max-w-xs">
                      {c.status === "approved" ? (
                        <Link
                          href={`/campaigns/${c._id}`}
                          className="line-clamp-2 font-semibold hover:text-accent-ink"
                        >
                          {c.title}
                        </Link>
                      ) : (
                        <span className="line-clamp-2 font-semibold">{c.title}</span>
                      )}
                      <span className="text-xs text-foreground/70">{c.category}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusChip status={c.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <span className="block whitespace-nowrap">{formatDate(c.deadline)}</span>
                    <span className="text-xs text-foreground/70">{daysLeftLabel(c.deadline)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap">
                      {formatCredits(c.amount_raised)} / {formatCredits(c.funding_goal)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <UpdateCampaignModal campaign={c} onSaved={refetch} />
                      <ConfirmDialog
                        triggerLabel={
                          <>
                            <Trash2 className="size-4" aria-hidden="true" />
                            Delete
                          </>
                        }
                        triggerVariant="danger-soft"
                        title="Delete this campaign?"
                        description={`"${c.title}" will be removed permanently and any contributions will be refunded to supporters.`}
                        confirmLabel="Delete campaign"
                        confirmVariant="danger"
                        onConfirm={() => remove(c)}
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

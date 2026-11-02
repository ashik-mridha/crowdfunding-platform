"use client";

import { useState } from "react";
import Link from "next/link";
import { Skeleton, Table, buttonVariants } from "@heroui/react";
import { HeartHandshake } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { StatusChip } from "@/components/ui/StatusChip";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatDate } from "@/lib/format";

// Supporter-facing table used by Home (approved only) and My Contributions (all, paginated).
export function ContributionsTable({
  url,
  limit = 10,
  showDate = false,
  label,
  emptyTitle,
  emptyDescription,
}) {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch(url, { page, limit }, { liveRefresh: true });

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading contributions">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState icon={HeartHandshake} title={emptyTitle} description={emptyDescription}>
        <Link href="/dashboard/explore" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
          Explore campaigns
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={label} className="min-w-[620px]">
            <Table.Header>
              <Table.Column isRowHeader>Campaign</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Creator</Table.Column>
              {showDate && <Table.Column>Date</Table.Column>}
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((c) => (
                <Table.Row key={c._id} id={c._id}>
                  <Table.Cell>
                    <span className="line-clamp-2 max-w-xs font-semibold">{c.campaign_title}</span>
                    {c.refund_reason === "campaign_deleted" && (
                      <span className="block text-xs text-foreground/70">
                        Campaign deleted, credits refunded
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap">{formatCredits(c.contribution_amount)} credits</span>
                  </Table.Cell>
                  <Table.Cell>{c.creator_name}</Table.Cell>
                  {showDate && (
                    <Table.Cell>
                      <span className="whitespace-nowrap">{formatDate(c.current_date)}</span>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    <StatusChip status={c.status} />
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

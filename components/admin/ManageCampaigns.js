"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Skeleton, Table, toast } from "@heroui/react";
import { Megaphone, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFetch } from "@/hooks/useFetch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { SearchField } from "@/components/ui/SearchField";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatCredits, formatDate } from "@/lib/format";

const STATUSES = ["", "approved", "pending", "suspended", "rejected"];

export function ManageCampaigns() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebouncedValue(search.trim(), 300);
  const { data, meta, loading, error, refetch } = useFetch("/admin/campaigns", {
    q: q || undefined,
    status: status || undefined,
    page,
    limit: 8,
  });

  async function remove(c) {
    try {
      const { data: res } = await api.delete(`/campaigns/${c._id}`);
      toast.success("Campaign deleted", {
        description: res.data.refunded
          ? `${res.data.refunded} contribution(s) were refunded to supporters.`
          : "No contributions needed a refund.",
      });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not delete the campaign");
      throw err;
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <SearchField
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          label="Search campaigns"
          placeholder="Search by title or creator"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {STATUSES.map((s) => (
            <Button
              key={s || "all"}
              size="sm"
              variant={status === s ? "primary" : "outline"}
              aria-pressed={status === s}
              className="min-h-11 capitalize"
              onPress={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s || "All"}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : loading && !data ? (
        <div className="space-y-3" role="status" aria-label="Loading campaigns">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns found"
          description="Try another search or status filter."
        />
      ) : (
        <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="All campaigns" className="min-w-[860px]">
                <Table.Header>
                  <Table.Column isRowHeader>Campaign</Table.Column>
                  <Table.Column>Creator</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Raised / goal</Table.Column>
                  <Table.Column>Deadline</Table.Column>
                  <Table.Column>Action</Table.Column>
                </Table.Header>
                <Table.Body>
                  {data.map((c) => (
                    <Table.Row key={c._id} id={c._id}>
                      <Table.Cell>
                        <div className="max-w-xs">
                          <Link
                            href={`/campaigns/${c._id}`}
                            className="line-clamp-2 font-semibold hover:text-accent-ink"
                          >
                            {c.title}
                          </Link>
                          <span className="text-xs text-foreground/70">{c.category}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="block">{c.creator_name}</span>
                        <span className="text-xs text-foreground/70">{c.creator_email}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <StatusChip status={c.status} />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="whitespace-nowrap">
                          {formatCredits(c.amount_raised)} / {formatCredits(c.funding_goal)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="whitespace-nowrap">{formatDate(c.deadline)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <ConfirmDialog
                          triggerLabel={
                            <>
                              <Trash2 className="size-4" aria-hidden="true" />
                              Delete Campaign
                            </>
                          }
                          triggerVariant="danger-soft"
                          title="Delete this campaign?"
                          description={`"${c.title}" will be removed permanently. Every pending and approved contribution will be refunded to its supporter, and ${c.creator_name} will be notified.`}
                          confirmLabel="Delete and refund"
                          confirmVariant="danger"
                          onConfirm={() => remove(c)}
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
      )}
    </div>
  );
}

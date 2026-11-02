"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Skeleton, Table, toast } from "@heroui/react";
import { EyeOff, Flag, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatDate } from "@/lib/format";

const FILTERS = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "", label: "All" },
];

export function ReportsTable() {
  const [filter, setFilter] = useState("open");
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch(
    "/admin/reports",
    { status: filter || undefined, page, limit: 8 },
    { liveRefresh: true }
  );

  async function act(r, action) {
    try {
      if (action === "suspend") {
        await api.patch(`/admin/reports/${r._id}/suspend`);
        toast.success("Campaign suspended", {
          description: `${r.campaign_title} is hidden from supporters.`,
        });
      } else {
        const { data: res } = await api.delete(`/admin/reports/${r._id}/campaign`);
        toast.success("Campaign deleted", {
          description: `${res.data.refunded} contribution(s) were refunded to supporters.`,
        });
      }
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not complete the action");
      refetch();
      throw err;
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reports">
        {FILTERS.map((f) => (
          <Button
            key={f.id || "all"}
            size="sm"
            variant={filter === f.id ? "primary" : "outline"}
            aria-pressed={filter === f.id}
            className="min-h-11"
            onPress={() => {
              setFilter(f.id);
              setPage(1);
            }}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : loading && !data ? (
        <div className="space-y-3" role="status" aria-label="Loading reports">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Flag}
          title={filter === "open" ? "No open reports" : "No reports here"}
          description="When supporters flag a campaign, it will show up here for review."
        />
      ) : (
        <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Campaign reports" className="min-w-[980px]">
                <Table.Header>
                  <Table.Column isRowHeader>Reporter</Table.Column>
                  <Table.Column>Campaign</Table.Column>
                  <Table.Column>Reason</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Status</Table.Column>
                  <Table.Column>Actions</Table.Column>
                </Table.Header>
                <Table.Body>
                  {data.map((r) => {
                    const gone = r.campaign_status === "deleted";
                    return (
                      <Table.Row key={r._id} id={r._id}>
                        <Table.Cell>
                          <span className="font-semibold">{r.reporter_name}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="max-w-[14rem]">
                            {gone ? (
                              <span className="line-clamp-2 font-medium">{r.campaign_title}</span>
                            ) : (
                              <Link
                                href={`/campaigns/${r.campaign_id}`}
                                className="line-clamp-2 font-medium hover:text-accent-ink"
                              >
                                {r.campaign_title}
                              </Link>
                            )}
                            <StatusChip status={r.campaign_status} />
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="max-w-xs whitespace-pre-line break-words text-sm">{r.reason}</p>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="whitespace-nowrap">{formatDate(r.date)}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <StatusChip status={r.status} />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            {r.status === "open" && !gone && (
                              <ConfirmDialog
                                triggerLabel={
                                  <>
                                    <EyeOff className="size-4" aria-hidden="true" />
                                    Suspend
                                  </>
                                }
                                triggerVariant="secondary"
                                title="Suspend this campaign?"
                                description={`"${r.campaign_title}" will disappear from Explore and supporters will not be able to contribute. Its creator will be notified and all open reports for it will be resolved. You can still delete it later.`}
                                confirmLabel="Suspend campaign"
                                onConfirm={() => act(r, "suspend")}
                              />
                            )}
                            {!gone && (
                              <ConfirmDialog
                                triggerLabel={
                                  <>
                                    <Trash2 className="size-4" aria-hidden="true" />
                                    Delete
                                  </>
                                }
                                triggerVariant="danger-soft"
                                title="Delete the reported campaign?"
                                description={`"${r.campaign_title}" will be removed permanently and every pending and approved contribution will be refunded. Its creator will be notified.`}
                                confirmLabel="Delete and refund"
                                confirmVariant="danger"
                                onConfirm={() => act(r, "delete")}
                              />
                            )}
                            {gone && <span className="text-sm text-foreground/70">Campaign removed</span>}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
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

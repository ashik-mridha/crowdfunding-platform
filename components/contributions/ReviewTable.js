"use client";

import { useState } from "react";
import { Button, Modal, Skeleton, Table, toast, useOverlayState } from "@heroui/react";
import { Eye, Inbox } from "lucide-react";
import api from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Pager } from "@/components/ui/Pager";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatDate } from "@/lib/format";

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-foreground/70">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

function ViewModal({ c }) {
  const state = useOverlayState();
  return (
    <Modal state={state}>
      <Button
        size="sm"
        variant="secondary"
        className="min-h-11"
        aria-label={`View contribution from ${c.supporter_name}`}
      >
        <Eye className="size-4" aria-hidden="true" />
        View
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Contribution details</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <dl className="space-y-4">
                <Detail label="Supporter">{c.supporter_name}</Detail>
                <Detail label="Campaign">{c.campaign_title}</Detail>
                <Detail label="Amount">{formatCredits(c.contribution_amount)} credits</Detail>
                <Detail label="Submitted">{formatDate(c.current_date)}</Detail>
                <Detail label="Message">
                  {c.message ? (
                    <span className="whitespace-pre-line break-words">{c.message}</span>
                  ) : (
                    <span className="text-foreground/70">No message left</span>
                  )}
                </Detail>
              </dl>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" className="min-h-11" onPress={state.close}>
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

// Creator-facing queue of pending contributions with approve / reject confirmations.
export function ReviewTable({ onChanged }) {
  const [page, setPage] = useState(1);
  const { data, meta, loading, error, refetch } = useFetch(
    "/contributions/review",
    { page, limit: 8 },
    { liveRefresh: true }
  );

  async function decide(c, action) {
    try {
      await api.patch(`/contributions/${c._id}/${action}`);
      toast.success(action === "approve" ? "Contribution approved" : "Contribution rejected", {
        description:
          action === "approve"
            ? `${formatCredits(c.contribution_amount)} credits were added to ${c.campaign_title}.`
            : `${formatCredits(c.contribution_amount)} credits were refunded to ${c.supporter_name}.`,
      });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else refetch();
      onChanged?.();
    } catch (err) {
      toast.danger(err.response?.data?.error?.message || "Could not update the contribution");
      refetch();
      throw err;
    }
  }

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (loading && !data) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading contributions to review">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }
  if (!data?.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nothing to review"
        description="When supporters contribute to your campaigns, their pending contributions will appear here."
      />
    );
  }

  return (
    <div className={`space-y-4 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Contributions to review" className="min-w-[720px]">
            <Table.Header>
              <Table.Column isRowHeader>Supporter</Table.Column>
              <Table.Column>Campaign</Table.Column>
              <Table.Column>Amount</Table.Column>
              <Table.Column>Review</Table.Column>
            </Table.Header>
            <Table.Body>
              {data.map((c) => (
                <Table.Row key={c._id} id={c._id}>
                  <Table.Cell>
                    <span className="font-semibold">{c.supporter_name}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="line-clamp-2 max-w-xs">{c.campaign_title}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="whitespace-nowrap font-semibold">
                      {formatCredits(c.contribution_amount)} credits
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <ViewModal c={c} />
                      <ConfirmDialog
                        triggerLabel="Approve"
                        triggerVariant="primary"
                        title="Approve this contribution?"
                        description={`${formatCredits(c.contribution_amount)} credits from ${c.supporter_name} will be added to "${c.campaign_title}".`}
                        confirmLabel="Approve"
                        onConfirm={() => decide(c, "approve")}
                      />
                      <ConfirmDialog
                        triggerLabel="Reject"
                        triggerVariant="danger-soft"
                        title="Reject this contribution?"
                        description={`${c.supporter_name} will get their ${formatCredits(c.contribution_amount)} credits back.`}
                        confirmLabel="Reject and refund"
                        confirmVariant="danger"
                        onConfirm={() => decide(c, "reject")}
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

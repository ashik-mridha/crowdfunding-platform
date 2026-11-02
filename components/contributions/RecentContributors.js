"use client";

import { Avatar, Skeleton } from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, timeAgo } from "@/lib/format";

export function RecentContributors({ campaignId, refreshKey }) {
  const { data, loading } = useFetch(`/contributions/campaign/${campaignId}/recent`, {
    limit: 8,
    k: refreshKey,
  });

  return (
    <section aria-labelledby="recent-heading" className="space-y-3">
      <h2 id="recent-heading" className="text-xl font-bold">
        Recent supporters
      </h2>
      {loading && !data ? (
        <div className="space-y-2" role="status" aria-label="Loading supporters">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : !data?.length ? (
        <p className="rounded-2xl border border-dashed border-divider p-5 text-sm text-foreground/70">
          No approved contributions yet. Be the first to back this campaign.
        </p>
      ) : (
        <ul className="space-y-2">
          {data.map((c) => (
            <li key={c._id} className="flex items-start gap-3 rounded-2xl border border-divider p-3">
              <Avatar size="sm">
                <Avatar.Fallback>{c.supporter_name?.[0]?.toUpperCase()}</Avatar.Fallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <strong>{c.supporter_name}</strong> contributed{" "}
                  <strong className="text-accent-ink">{formatCredits(c.contribution_amount)} credits</strong>
                </p>
                {c.message && (
                  <p className="mt-0.5 break-words text-sm text-foreground/70">&ldquo;{c.message}&rdquo;</p>
                )}
                <p className="mt-0.5 text-xs text-foreground/70">{timeAgo(c.current_date)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

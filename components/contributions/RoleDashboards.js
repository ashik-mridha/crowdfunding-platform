"use client";

import { CircleDollarSign, Clock, HeartHandshake, Hourglass, Megaphone, Rocket } from "lucide-react";
import { ContributionsTable } from "@/components/contributions/ContributionsTable";
import { ReviewTable } from "@/components/contributions/ReviewTable";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { ErrorState } from "@/components/ui/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits } from "@/lib/format";

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CreatorDashboard() {
  const { data, loading, error, refetch } = useFetch("/stats/me", undefined, { liveRefresh: true });
  return (
    <>
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <StatGrid>
          <StatCard
            icon={Megaphone}
            label="Total campaigns"
            value={data?.totalCampaigns}
            loading={!data && loading}
          />
          <StatCard
            icon={Rocket}
            label="Active campaigns"
            value={data?.activeCampaigns}
            loading={!data && loading}
            hint="Deadline not passed"
          />
          <StatCard
            icon={CircleDollarSign}
            label="Total amount raised"
            value={data && `${formatCredits(data.totalRaised)} credits`}
            loading={!data && loading}
          />
        </StatGrid>
      )}
      <Section id="review-heading" title="Contributions to review">
        <ReviewTable onChanged={refetch} />
      </Section>
    </>
  );
}

export function SupporterDashboard() {
  const { data, loading, error, refetch } = useFetch("/stats/me", undefined, { liveRefresh: true });
  return (
    <>
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <StatGrid>
          <StatCard
            icon={HeartHandshake}
            label="Contributions made"
            value={data?.totalContributions}
            loading={!data && loading}
          />
          <StatCard icon={Clock} label="Pending" value={data?.totalPending} loading={!data && loading} />
          <StatCard
            icon={Hourglass}
            label="Total contributed"
            value={data && `${formatCredits(data.totalContributed)} credits`}
            loading={!data && loading}
            hint="Approved contributions"
          />
        </StatGrid>
      )}
      <Section id="approved-heading" title="Approved contributions">
        <ContributionsTable
          url="/contributions/approved-mine"
          limit={5}
          label="Approved contributions"
          emptyTitle="No approved contributions yet"
          emptyDescription="Once a creator approves your contribution it will be listed here."
        />
      </Section>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Input, Label, ProgressBar, Skeleton, TextField, buttonVariants } from "@heroui/react";
import { ArrowLeft, CalendarClock, Gift, SearchX, Target, UserRound } from "lucide-react";
import { CampaignImage } from "@/components/campaigns/CampaignImage";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { ContributionForm } from "@/components/contributions/ContributionForm";
import { RecentContributors } from "@/components/contributions/RecentContributors";
import { ReportModal } from "@/components/contributions/ReportModal";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import { daysLeft, daysLeftLabel, formatCredits, formatDate, progressPercent } from "@/lib/format";

export function DetailSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading campaign">
      <Skeleton className="aspect-[21/9] w-full rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          <Skeleton className="h-9 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-ink">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-foreground/70">{label}</p>
        <p className="font-semibold">{children}</p>
      </div>
    </div>
  );
}

export function CampaignDetailView({ backHref, backLabel }) {
  const { id } = useParams();
  const { data: c, loading, error, refetch } = useFetch(`/campaigns/${id}`);
  const [refreshKey, setRefreshKey] = useState(0);
  const onContributed = () => {
    refetch();
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/70 hover:text-accent-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      {loading ? (
        <DetailSkeleton />
      ) : error?.status === 404 ? (
        <EmptyState
          icon={SearchX}
          title="Campaign not found"
          description="It may have been removed, or it is still waiting for approval."
        >
          <Link href={backHref} className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
            {backLabel}
          </Link>
        </EmptyState>
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : c ? (
        <CampaignDetail c={c} refreshKey={refreshKey} onContributed={onContributed} />
      ) : null}
    </div>
  );
}

function CampaignDetail({ c, refreshKey, onContributed }) {
  const pct = progressPercent(c.amount_raised, c.funding_goal);
  const remaining = daysLeft(c.deadline);
  const ended = remaining < 0;

  return (
    <article className="space-y-6">
      <div className="aspect-[21/9] max-h-[420px] w-full overflow-hidden rounded-3xl">
        <CampaignImage src={c.image_url} alt={`Cover for ${c.title}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-ink">
                {c.category}
              </span>
              {c.status !== "approved" && <StatusChip status={c.status} />}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{c.title}</h1>
            <p className="flex items-center gap-2 text-foreground/70">
              <UserRound className="size-4" aria-hidden="true" />
              Created by <strong>{c.creator_name}</strong>
            </p>
          </header>

          <section aria-labelledby="story-heading" className="space-y-2">
            <h2 id="story-heading" className="text-xl font-bold">
              The story
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-foreground/80">{c.story}</p>
          </section>

          <section aria-labelledby="reward-heading" className="space-y-2 rounded-2xl bg-accent/5 p-5">
            <h2 id="reward-heading" className="flex items-center gap-2 text-xl font-bold">
              <Gift className="size-5 text-accent-ink" aria-hidden="true" />
              What supporters receive
            </h2>
            <p className="text-foreground/80">{c.reward_info}</p>
          </section>

          <RecentContributors campaignId={c._id} refreshKey={refreshKey} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <Card.Content className="space-y-5 p-5">
              <div>
                <p className="font-heading text-3xl font-extrabold">
                  {formatCredits(c.amount_raised)}
                  <span className="ml-2 text-base font-medium text-foreground/70">
                    of {formatCredits(c.funding_goal)} credits
                  </span>
                </p>
                <ProgressBar aria-label={`${pct}% funded`} value={pct} className="mt-3">
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
                <p className="mt-1 text-sm font-semibold text-accent-ink">{pct}% funded</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Stat icon={CalendarClock} label="Time left">
                  {daysLeftLabel(c.deadline)}
                  <span className="block text-sm font-normal text-foreground/70">
                    Ends {formatDate(c.deadline)}
                  </span>
                </Stat>
                <Stat icon={Target} label="Minimum contribution">
                  {formatCredits(c.minimum_contribution)} credits
                </Stat>
              </div>
            </Card.Content>
          </Card>

          <ActionCard c={c} ended={ended} onContributed={onContributed} />
        </aside>
      </div>
    </article>
  );
}

// What the visitor can do depends on who they are and whether the campaign is open.
function ActionCard({ c, ended, onContributed }) {
  const { user, loading } = useAuth();
  const isOwner = user && user.email === c.creator_email;
  const open = c.status === "approved" && !ended;

  let body;
  if (loading) body = <Skeleton className="h-40 w-full rounded-xl" />;
  else if (!open) {
    body = (
      <p className="text-sm text-foreground/70">
        {c.status !== "approved"
          ? "This campaign is not open for contributions."
          : "This campaign has ended."}
      </p>
    );
  } else if (!user) {
    body = (
      <>
        <p className="text-sm text-foreground/70">
          Sign in as a supporter to back this campaign with credits.
        </p>
        <Link
          href="/login"
          className={`${buttonVariants({ variant: "primary" })} min-h-11 w-full justify-center`}
        >
          Log in to contribute
        </Link>
      </>
    );
  } else if (user.role === "supporter") {
    body = <ContributionForm campaign={c} onDone={onContributed} />;
  } else {
    body = (
      <p className="text-sm text-foreground/70">
        {isOwner
          ? "This is your campaign. Review contributions from your dashboard."
          : "Only supporter accounts can contribute to campaigns."}
      </p>
    );
  }

  return (
    <Card>
      <Card.Content className="space-y-3 p-5">
        <h2 className="text-lg font-bold">Back this campaign</h2>
        {body}
        {open && user?.role === "supporter" && !isOwner && c.status === "approved" && (
          <ReportModal campaign={c} />
        )}
        {!user && !loading && (
          <p className="text-xs text-foreground/70">
            Log in as a supporter to report a problem with this campaign.
          </p>
        )}
      </Card.Content>
    </Card>
  );
}

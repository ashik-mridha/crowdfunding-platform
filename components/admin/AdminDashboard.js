"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import {
  Activity,
  ArrowRight,
  CircleDollarSign,
  Coins,
  Flag,
  HandCoins,
  Megaphone,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { PendingCampaigns } from "@/components/admin/PendingCampaigns";
import { ErrorState } from "@/components/ui/EmptyState";
import { StatCard, StatGrid } from "@/components/ui/StatCard";
import { useFetch } from "@/hooks/useFetch";
import { formatCredits, formatUsd } from "@/lib/format";

function Attention({ href, icon: Icon, count, label, loading }) {
  const urgent = !loading && count > 0;
  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center gap-3 rounded-2xl border p-4 transition-colors hover:bg-default focus-visible:outline-2 focus-visible:outline-accent ${
        urgent ? "border-warning/50 bg-warning/5" : "border-divider"
      }`}
    >
      <Icon
        className={`size-5 shrink-0 ${urgent ? "text-warning" : "text-foreground/70"}`}
        aria-hidden="true"
      />
      <span className="flex-1">
        <span className="font-heading text-xl font-extrabold">{loading ? "-" : count}</span>{" "}
        <span className="text-sm text-foreground/70">{label}</span>
      </span>
      <ArrowRight className="size-4 text-foreground/70" aria-hidden="true" />
    </Link>
  );
}

export function AdminDashboard() {
  const { data, loading, error, refetch } = useFetch("/stats/admin", undefined, { liveRefresh: true });
  const first = !data && loading;

  return (
    <>
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : (
        <>
          <StatGrid four>
            <StatCard
              icon={UserRoundCheck}
              label="Total supporters"
              value={data?.totalSupporters}
              loading={first}
            />
            <StatCard icon={Users} label="Total creators" value={data?.totalCreators} loading={first} />
            <StatCard
              icon={Coins}
              label="Available credits"
              value={data && formatCredits(data.totalCredits)}
              loading={first}
              hint="Sum of all user balances"
            />
            <StatCard
              icon={CircleDollarSign}
              label="Payments processed"
              value={data && formatUsd(data.totalPayments.usd)}
              loading={first}
              hint={
                data &&
                `${data.totalPayments.count} successful payment${data.totalPayments.count === 1 ? "" : "s"}`
              }
            />
          </StatGrid>

          <section aria-labelledby="attention-heading" className="space-y-3">
            <h2 id="attention-heading" className="text-xl font-bold">
              Needs your attention
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Attention
                href="/dashboard/admin-home#approvals"
                icon={Megaphone}
                count={data?.attention.pendingCampaigns}
                label="campaigns awaiting approval"
                loading={first}
              />
              <Attention
                href="/dashboard/withdrawal-requests"
                icon={HandCoins}
                count={data?.attention.pendingWithdrawals}
                label="withdrawal requests"
                loading={first}
              />
              <Attention
                href="/dashboard/reports"
                icon={Flag}
                count={data?.attention.openReports}
                label="open reports"
                loading={first}
              />
            </div>
          </section>

          <section aria-labelledby="activity-heading" className="space-y-3">
            <h2 id="activity-heading" className="flex items-center gap-2 text-xl font-bold">
              <Activity className="size-5 text-accent-ink" aria-hidden="true" />
              Last 7 days
            </h2>
            <Card>
              <Card.Content className="p-0">
                <dl className="grid divide-y divide-divider sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    ["New users", data?.last7Days.newUsers],
                    ["New campaigns", data?.last7Days.newCampaigns],
                    ["Contributions made", data?.last7Days.contributions],
                  ].map(([label, value]) => (
                    <div key={label} className="p-5 text-left">
                      <dt className="text-sm text-foreground/70">{label}</dt>
                      <dd className="font-heading text-2xl font-extrabold">{first ? "-" : value}</dd>
                    </div>
                  ))}
                </dl>
              </Card.Content>
            </Card>
          </section>
        </>
      )}

      <section id="approvals" aria-labelledby="approvals-heading" className="scroll-mt-24 space-y-4">
        <h2 id="approvals-heading" className="text-xl font-bold">
          Campaign approvals
        </h2>
        <PendingCampaigns onChanged={refetch} />
      </section>
    </>
  );
}

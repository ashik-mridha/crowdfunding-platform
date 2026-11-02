import Link from "next/link";
import { Card, ProgressBar, Skeleton, buttonVariants } from "@heroui/react";
import { CalendarClock } from "lucide-react";
import { CampaignImage } from "@/components/campaigns/CampaignImage";
import { daysLeftLabel, formatCredits, progressPercent } from "@/lib/format";

export function CampaignCard({ campaign, detailsBase }) {
  const pct = progressPercent(campaign.amount_raised, campaign.funding_goal);
  return (
    <Card className="h-full overflow-hidden p-0">
      <div className="relative aspect-[16/10] w-full">
        <CampaignImage src={campaign.image_url} alt={`Cover for ${campaign.title}`} />
        <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-accent-ink shadow-sm">
          {campaign.category}
        </span>
      </div>
      <Card.Content className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 min-h-[3rem] font-heading text-lg font-bold leading-snug">
            {campaign.title}
          </h3>
          <p className="text-sm text-foreground/70">by {campaign.creator_name}</p>
        </div>
        <div>
          <ProgressBar aria-label={`${campaign.title} is ${pct}% funded`} value={pct} size="sm">
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
          <div className="mt-2 flex items-baseline justify-between text-sm">
            <span>
              <strong>{formatCredits(campaign.amount_raised)}</strong>{" "}
              <span className="text-foreground/70">of {formatCredits(campaign.funding_goal)} credits</span>
            </span>
            <span className="font-semibold text-accent-ink">{pct}%</span>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-foreground/70">
          <CalendarClock className="size-4" aria-hidden="true" />
          {daysLeftLabel(campaign.deadline)}
        </p>
        <Link
          href={`${detailsBase}/${campaign._id}`}
          className={`${buttonVariants({ variant: "primary" })} mt-auto min-h-11 w-full justify-center`}
        >
          View Details
        </Link>
      </Card.Content>
    </Card>
  );
}

export function CampaignCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0" aria-hidden="true">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <Card.Content className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </Card.Content>
    </Card>
  );
}

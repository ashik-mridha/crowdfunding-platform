"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@heroui/react";
import { Rocket } from "lucide-react";
import { CampaignCard, CampaignCardSkeleton } from "@/components/campaigns/CampaignCard";
import { SectionHeading } from "@/components/home/Reveal";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { useFetch } from "@/hooks/useFetch";

export function TopFunded() {
  const { data, loading, error, refetch } = useFetch("/campaigns/top");

  return (
    <section
      id="top-funded"
      aria-labelledby="top-heading"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <SectionHeading
        id="top-heading"
        eyebrow="Community favourites"
        title="Top funded campaigns"
        text="The projects supporters have backed the most. Every one was reviewed before going live."
      />
      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : loading && !data ? (
        <div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="status"
          aria-label="Loading top campaigns"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={Rocket}
          title="No campaigns are live yet"
          description="Be the first to start something worth funding."
        >
          <Link href="/register" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
            Start a campaign
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="h-full"
              >
                <CampaignCard campaign={c} detailsBase="/campaigns" />
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/campaigns"
              className={`${buttonVariants({ variant: "outline", size: "lg" })} min-h-12`}
            >
              View all campaigns
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

import { Skeleton } from "@heroui/react";

export function FullPageSkeleton() {
  return (
    <div className="min-h-screen" role="status" aria-label="Loading your account">
      <div className="flex h-16 items-center justify-between border-b border-divider px-4 sm:px-6">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

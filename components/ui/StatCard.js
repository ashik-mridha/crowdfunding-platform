import { Card, Skeleton } from "@heroui/react";

export function StatCard({ icon: Icon, label, value, loading, hint }) {
  return (
    <Card>
      <Card.Content className="p-5">
        <div className="flex w-full items-center gap-4 text-left">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent-ink">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-foreground/70">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-8 w-20 rounded-lg" />
            ) : (
              <p className="font-heading text-2xl font-extrabold sm:text-3xl">{value}</p>
            )}
            {hint && <p className="text-xs text-foreground/70">{hint}</p>}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export function StatGrid({ children, four = false }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${four ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
      {children}
    </div>
  );
}

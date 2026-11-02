"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Popover, Skeleton } from "@heroui/react";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/format";

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { items, unread, loading, error, markRead, markAllRead } = useNotifications();

  async function openItem(n) {
    setOpen(false);
    if (!n.read) await markRead(n._id).catch(() => {});
    router.push(n.actionRoute);
  }

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Button
        isIconOnly
        variant="ghost"
        className="relative size-11"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      >
        <Bell className="size-5" aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold leading-5 text-white"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
      <Popover.Content placement="bottom end" className="w-[min(24rem,calc(100vw-1.5rem))] p-0">
        <Popover.Dialog className="p-0">
          <div className="flex items-center justify-between border-b border-divider px-4 py-3">
            <Popover.Heading className="font-heading text-base font-bold">Notifications</Popover.Heading>
            {unread > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="min-h-11"
                onPress={() => markAllRead().catch(() => {})}
              >
                <CheckCheck className="size-4" aria-hidden="true" />
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!items && loading ? (
              <div className="space-y-3 p-4" role="status" aria-label="Loading notifications">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <p role="alert" className="p-6 text-center text-sm text-danger">
                {error.message}
              </p>
            ) : !items?.length ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-foreground/70">
                <BellOff className="size-7" aria-hidden="true" />
                You are all caught up. New activity will show up here.
              </div>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n._id} className="border-b border-divider last:border-0">
                    <button
                      type="button"
                      onClick={() => openItem(n)}
                      className={`flex min-h-11 w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                        n.read ? "" : "bg-accent/5"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-accent"}`}
                      />
                      <span className="min-w-0">
                        <span className={`block text-sm ${n.read ? "text-foreground/80" : "font-semibold"}`}>
                          {n.message}
                        </span>
                        <span className="mt-0.5 block text-xs text-foreground/70">
                          {timeAgo(n.time)}
                          {!n.read && <span className="sr-only"> (unread)</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

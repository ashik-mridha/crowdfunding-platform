"use client";

import { useRouter } from "next/navigation";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { Coins, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { formatCredits } from "@/lib/format";

export function TopBar({ menuTrigger }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-divider bg-background/90 px-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">{menuTrigger}</div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent/10 px-3 text-sm font-semibold text-accent-ink"
          aria-live="polite"
        >
          <Coins className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Available Credits:</span>
          {formatCredits(user.credits)}
        </span>
        <NotificationBell />
        <ThemeToggle />
        <Dropdown>
          <Button variant="ghost" aria-label="Account menu" className="min-h-11 gap-2 px-2">
            <Avatar size="sm">
              {user.photo_url && <Avatar.Image src={user.photo_url} alt="" />}
              <Avatar.Fallback>{user.name?.[0]?.toUpperCase()}</Avatar.Fallback>
            </Avatar>
            <span className="hidden text-left leading-tight md:block">
              <span className="block max-w-32 truncate text-sm font-semibold">{user.name}</span>
              <span className="block text-xs capitalize text-foreground/70">{user.role}</span>
            </span>
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu
              onAction={(key) => {
                if (key === "logout") {
                  logout();
                  router.push("/login");
                } else {
                  router.push("/");
                }
              }}
            >
              <Dropdown.Item id="site" textValue="Back to site">
                <Label>Back to site</Label>
              </Dropdown.Item>
              <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                <LogOut className="size-4" aria-hidden="true" />
                <Label>Logout</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}

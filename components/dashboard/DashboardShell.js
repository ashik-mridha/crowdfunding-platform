"use client";

import { Button, Drawer, buttonVariants, useOverlayState } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { TopBar } from "@/components/dashboard/TopBar";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { useAuth } from "@/hooks/useAuth";

export function DashboardShell({ children }) {
  const { user } = useAuth();
  const drawer = useOverlayState();

  const menuTrigger = (
    <Drawer state={drawer}>
      <Drawer.Trigger
        aria-label="Open navigation"
        className={`${buttonVariants({ variant: "ghost", isIconOnly: true })} size-11 lg:hidden`}
      >
        <Menu className="size-5" aria-hidden="true" />
      </Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog aria-label="Dashboard navigation" className="bg-navy text-navy-foreground">
            <Drawer.Header>
              <div className="flex items-center justify-between">
                <Logo light />
                <Button
                  isIconOnly
                  variant="ghost"
                  aria-label="Close navigation"
                  className="size-11 text-white"
                  onPress={drawer.close}
                >
                  <X className="size-5" aria-hidden="true" />
                </Button>
              </div>
            </Drawer.Header>
            <Drawer.Body>
              <SidebarNav role={user.role} onNavigate={drawer.close} />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col gap-6 bg-navy p-4 text-navy-foreground lg:flex">
        <div className="px-1 pt-1">
          <Logo light />
        </div>
        <SidebarNav role={user.role} />
      </aside>
      <div className="flex min-h-screen flex-col">
        <TopBar menuTrigger={menuTrigger} />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-divider px-4 py-4 text-center text-xs text-foreground/70">
          &copy; <CurrentYear /> Fundora. Ignite. Support. Grow.
        </footer>
      </div>
    </div>
  );
}

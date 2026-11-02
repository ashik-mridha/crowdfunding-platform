"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button, Drawer, Dropdown, Label, buttonVariants, useOverlayState } from "@heroui/react";
import { Coins, Code2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { CLIENT_REPO_URL, NAV_LINKS } from "@/lib/config";

const navLink =
  "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-accent";

function DeveloperLink({ className = "" }) {
  return (
    <a
      href={CLIENT_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonVariants({ variant: "primary", size: "md" })} min-h-11 ${className}`}
    >
      <Code2 className="size-4" aria-hidden="true" />
      Join as Developer
    </a>
  );
}

export function SiteNavbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const menu = useOverlayState();

  const onAccountAction = (key) => {
    if (key === "logout") {
      logout();
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-background/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <div className="flex items-center gap-6">
          <Logo />
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={navLink}>
                  {l.label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <Link href="/dashboard" className={navLink}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {!loading && !user && (
            <>
              <Link href="/login" className={navLink}>
                Login
              </Link>
              <Link href="/register" className={navLink}>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <span
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent/10 px-3 text-sm font-semibold text-accent-ink"
                aria-live="polite"
              >
                <Coins className="size-4" aria-hidden="true" />
                Available Credits: {user.credits}
              </span>
              <Dropdown>
                <Button isIconOnly variant="ghost" aria-label="Account menu" className="size-11 rounded-full">
                  <Avatar size="sm">
                    <Avatar.Image src={user.photo_url} alt="" />
                    <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
                  </Avatar>
                </Button>
                <Dropdown.Popover>
                  <Dropdown.Menu onAction={onAccountAction}>
                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                      <LayoutDashboard className="size-4" aria-hidden="true" />
                      <Label>Dashboard</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                      <LogOut className="size-4" aria-hidden="true" />
                      <Label>Logout</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </>
          )}
          <DeveloperLink />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Drawer state={menu}>
            <Drawer.Trigger
              aria-label="Open menu"
              className={`${buttonVariants({ variant: "ghost", isIconOnly: true })} size-11`}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Drawer.Trigger>
            <Drawer.Backdrop>
              <Drawer.Content placement="right">
                <Drawer.Dialog aria-label="Site menu">
                  <Drawer.Header>
                    <div className="flex items-center justify-between">
                      <Logo />
                      <Button
                        isIconOnly
                        variant="ghost"
                        aria-label="Close menu"
                        className="size-11"
                        onPress={menu.close}
                      >
                        <X className="size-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </Drawer.Header>
                  <Drawer.Body>
                    <ul className="flex flex-col gap-1" onClick={menu.close}>
                      {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className={`${navLink} w-full`}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                      {user ? (
                        <li>
                          <Link href="/dashboard" className={`${navLink} w-full`}>
                            Dashboard
                          </Link>
                        </li>
                      ) : (
                        <>
                          <li>
                            <Link href="/login" className={`${navLink} w-full`}>
                              Login
                            </Link>
                          </li>
                          <li>
                            <Link href="/register" className={`${navLink} w-full`}>
                              Register
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <DeveloperLink className="w-full justify-center" />
                  </Drawer.Footer>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        </div>
      </nav>
    </header>
  );
}

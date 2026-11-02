"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "@/lib/dashboardNav";

export function SidebarNav({ role, onNavigate }) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role] || [];

  return (
    <nav aria-label="Dashboard">
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href.endsWith("/explore") && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-navy-foreground/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

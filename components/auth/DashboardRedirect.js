"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { dashboardHome } from "@/lib/roles";
import { FullPageSkeleton } from "@/components/auth/FullPageSkeleton";

export function DashboardRedirect() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(dashboardHome(user.role));
  }, [user, router]);
  return <FullPageSkeleton />;
}

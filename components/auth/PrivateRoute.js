"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardHome } from "@/lib/roles";
import { FullPageSkeleton } from "@/components/auth/FullPageSkeleton";

// Shown when a stored token could not be checked (busy server, network problem). The user is NOT sent
// to /login: they are most likely still signed in, so we offer a retry.
function SessionProblem({ message, onRetry }) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
      role="alert"
    >
      <h1 className="text-2xl font-extrabold">We could not confirm your session</h1>
      <p className="max-w-md text-foreground/70">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button className="min-h-11" onPress={onRetry}>
          Try again
        </Button>
        <Link href="/login" className={`${buttonVariants({ variant: "secondary" })} min-h-11`}>
          Log in again
        </Link>
      </div>
    </main>
  );
}

// Waits for the session check before deciding anything, so a reload never bounces a logged-in user.
export function PrivateRoute({ roles, children }) {
  const { user, loading, sessionError, retrySession } = useAuth();
  const router = useRouter();
  const wrongRole = Boolean(user && roles && !roles.includes(user.role));

  useEffect(() => {
    if (loading || sessionError) return;
    if (!user) router.replace("/login");
    else if (wrongRole) router.replace(dashboardHome(user.role));
  }, [loading, user, sessionError, wrongRole, router]);

  if (sessionError && !user) return <SessionProblem message={sessionError.message} onRetry={retrySession} />;
  if (loading || !user || wrongRole) return <FullPageSkeleton />;
  return children;
}

// Keeps signed-in users away from /login and /register.
export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);
  return !loading && !user;
}

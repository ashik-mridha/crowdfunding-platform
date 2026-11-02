"use client";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";

const COPY = {
  supporter: "Track the campaigns you back and top up your credits.",
  creator: "Manage your campaigns and review incoming contributions.",
  admin: "Moderate campaigns, withdrawals, users and reports.",
};

// Temporary landing content; each role's real dashboard is built in later phases.
export function RoleHome({ role, children }) {
  return (
    <PrivateRoute roles={[role]}>
      <Inner role={role}>{children}</Inner>
    </PrivateRoute>
  );
}

function Inner({ role, children }) {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Welcome back, {user.name}!</h1>
        <p className="text-foreground/70">
          You are signed in as a <strong className="capitalize">{role}</strong> with{" "}
          <strong>{user.credits} credits</strong>. {COPY[role]}
        </p>
      </section>
      {children}
    </div>
  );
}

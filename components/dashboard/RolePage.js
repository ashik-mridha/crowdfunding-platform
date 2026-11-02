"use client";

import { PrivateRoute } from "@/components/auth/PrivateRoute";

// Client-side role gate for a dashboard page; the API enforces the same roles on every endpoint.
export function RolePage({ roles, children }) {
  return <PrivateRoute roles={roles}>{children}</PrivateRoute>;
}

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = { title: "Dashboard" };

export default function DashboardLayout({ children }) {
  return (
    <PrivateRoute>
      <DashboardShell>{children}</DashboardShell>
    </PrivateRoute>
  );
}

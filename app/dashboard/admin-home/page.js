import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { RoleHome } from "@/components/auth/RoleHome";

export default function Page() {
  return (
    <RoleHome role="admin">
      <AdminDashboard />
    </RoleHome>
  );
}

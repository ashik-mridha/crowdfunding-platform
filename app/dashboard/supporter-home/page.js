import { RoleHome } from "@/components/auth/RoleHome";
import { SupporterDashboard } from "@/components/contributions/RoleDashboards";

export default function Page() {
  return (
    <RoleHome role="supporter">
      <SupporterDashboard />
    </RoleHome>
  );
}

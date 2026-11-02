import { RoleHome } from "@/components/auth/RoleHome";
import { CreatorDashboard } from "@/components/contributions/RoleDashboards";

export default function Page() {
  return (
    <RoleHome role="creator">
      <CreatorDashboard />
    </RoleHome>
  );
}

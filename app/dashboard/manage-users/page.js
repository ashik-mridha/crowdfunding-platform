import { ManageUsers } from "@/components/admin/ManageUsers";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "Manage Users" };

export default function ManageUsersPage() {
  return (
    <RolePage roles={["admin"]}>
      <PageHeader
        title="Manage users"
        description="Review accounts, change roles and remove users who break the rules."
      />
      <ManageUsers />
    </RolePage>
  );
}

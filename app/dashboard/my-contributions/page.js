import { ContributionsTable } from "@/components/contributions/ContributionsTable";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RolePage } from "@/components/dashboard/RolePage";

export const metadata = { title: "My Contributions" };

export default function MyContributionsPage() {
  return (
    <RolePage roles={["supporter"]}>
      <PageHeader title="My contributions" description="Every contribution you have made, newest first." />
      <ContributionsTable
        url="/contributions/mine"
        limit={8}
        showDate
        label="My contributions"
        emptyTitle="You have not contributed yet"
        emptyDescription="Find a campaign you believe in and back it with your credits."
      />
    </RolePage>
  );
}

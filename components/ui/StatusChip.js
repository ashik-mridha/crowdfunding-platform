import { Chip } from "@heroui/react";

const COLORS = {
  approved: "success",
  resolved: "success",
  pending: "warning",
  open: "warning",
  rejected: "danger",
  suspended: "default",
  deleted: "default",
};

export function StatusChip({ status }) {
  return (
    <Chip size="sm" color={COLORS[status] || "default"} className="capitalize">
      {status}
    </Chip>
  );
}

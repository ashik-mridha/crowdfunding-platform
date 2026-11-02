export const ROLES = ["supporter", "creator", "admin"];

export const PUBLIC_ROLES = [
  {
    id: "supporter",
    label: "Supporter",
    description: "Back campaigns with credits. Starts with 50 credits.",
  },
  {
    id: "creator",
    label: "Creator",
    description: "Launch campaigns and withdraw funds. Starts with 20 credits.",
  },
];

export function dashboardHome(role) {
  return `/dashboard/${role}-home`;
}

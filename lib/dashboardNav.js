import {
  BadgeDollarSign,
  CirclePlus,
  Compass,
  Flag,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

export const DASHBOARD_NAV = {
  supporter: [
    { href: "/dashboard/supporter-home", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/explore", label: "Explore Campaigns", icon: Compass },
    { href: "/dashboard/my-contributions", label: "My Contributions", icon: HeartHandshake },
    { href: "/dashboard/purchase-credit", label: "Purchase Credit", icon: BadgeDollarSign },
    { href: "/dashboard/payment-history", label: "Payment History", icon: Receipt },
  ],
  creator: [
    { href: "/dashboard/creator-home", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/add-campaign", label: "Add New Campaign", icon: CirclePlus },
    { href: "/dashboard/my-campaigns", label: "My Campaigns", icon: Megaphone },
    { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Wallet },
    { href: "/dashboard/payment-history", label: "Payment History", icon: Receipt },
  ],
  admin: [
    { href: "/dashboard/admin-home", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
    { href: "/dashboard/manage-campaigns", label: "Manage Campaigns", icon: ShieldCheck },
    { href: "/dashboard/withdrawal-requests", label: "Withdrawal Requests", icon: HandCoins },
    { href: "/dashboard/reports", label: "Reports", icon: Flag },
  ],
};

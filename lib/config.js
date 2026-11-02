export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const CLIENT_REPO_URL = process.env.NEXT_PUBLIC_CLIENT_REPO_URL || "#";

export const SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://www.linkedin.com",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com",
  },
  {
    id: "github",
    label: "GitHub",
    href:
      process.env.NEXT_PUBLIC_SOCIAL_GITHUB ||
      process.env.NEXT_PUBLIC_CLIENT_REPO_URL ||
      "https://github.com",
  },
];

export const NAV_LINKS = [{ href: "/campaigns", label: "Explore Campaigns" }];

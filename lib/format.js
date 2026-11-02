const DAY = 24 * 60 * 60 * 1000;

export const formatCredits = (n) => `${Number(n || 0).toLocaleString("en-US")}`;

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Whole days remaining, rounded up so "ends today" still reads as 1 day left.
export function daysLeft(deadline) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / DAY);
}

export function daysLeftLabel(deadline) {
  const d = daysLeft(deadline);
  if (d < 0) return "Ended";
  if (d === 0) return "Ends today";
  return d === 1 ? "1 day left" : `${d} days left`;
}

export function progressPercent(raised, goal) {
  if (!goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

// yyyy-mm-dd from a date input -> ISO at the end of that local day.
export function endOfDayISO(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d, 23, 59, 59).toISOString();
}

export function tomorrowInputValue() {
  const t = new Date(Date.now() + DAY);
  const pad = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

export const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment", "Other"];

export function timeAgo(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export const formatUsd = (n) => `$${Number(n || 0).toFixed(2)}`;
export const CREDITS_PER_USD = 20;
export const MIN_WITHDRAWAL_CREDITS = 200;
export const PAYMENT_SYSTEMS = ["Stripe", "Bkash", "Rocket", "Nagad", "Bank"];

// Internal component review page: kept out of search results.
export const metadata = {
  title: "Design system",
  description: "Internal review page for Fundora UI components in light and dark themes.",
  robots: { index: false, follow: false },
};

export default function DesignLayout({ children }) {
  return children;
}

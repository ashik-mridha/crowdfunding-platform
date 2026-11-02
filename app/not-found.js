import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="font-heading text-7xl font-extrabold text-accent-ink">404</p>
        <h1 className="text-2xl font-bold">We could not find that page</h1>
        <p className="max-w-md text-foreground/70">
          The campaign or page you are looking for may have moved or no longer exists.
        </p>
        <Link href="/" className={`${buttonVariants({ variant: "primary" })} min-h-11`}>
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

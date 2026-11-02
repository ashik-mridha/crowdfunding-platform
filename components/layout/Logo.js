import Link from "next/link";
import { Heart } from "lucide-react";

export function Logo({ className = "", light = false }) {
  return (
    <Link
      href="/"
      aria-label="Fundora home"
      className={`inline-flex items-center gap-2 rounded-lg font-heading text-xl font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-white">
        <Heart className="size-5" fill="currentColor" aria-hidden="true" />
      </span>
      <span className={light ? "text-white" : "text-foreground"}>Fundora</span>
    </Link>
  );
}

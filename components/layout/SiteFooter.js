import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { Logo } from "@/components/layout/Logo";
import { SOCIAL_LINKS } from "@/lib/config";

const icons = { linkedin: FaLinkedinIn, facebook: FaFacebookF, github: FaGithub };

const quickLinks = [
  { href: "/campaigns", label: "Explore Campaigns" },
  { href: "/register", label: "Start a Campaign" },
  { href: "/login", label: "Login" },
];

const categories = ["Technology", "Art", "Community", "Health", "Education", "Environment"];
const footerLink = "inline-flex min-h-11 items-center text-sm text-navy-foreground/70 hover:text-accent";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-navy-foreground/70">
            Fundora connects creators with people who believe in them. Back a project with credits, follow its
            progress, and help ideas in technology, art, health and community work become real.
          </p>
          <ul className="flex gap-2" aria-label="Social media">
            {SOCIAL_LINKS.map((s) => {
              const Icon = icons[s.id];
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav aria-label="Quick links">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Quick links</h2>
          <ul className="space-y-1">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={footerLink}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Categories">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Categories</h2>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li key={c}>
                <Link href={`/campaigns?category=${c}`} className={footerLink}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-navy-foreground/60">
        &copy; <CurrentYear /> Fundora. Ignite. Support. Grow.
      </div>
    </footer>
  );
}

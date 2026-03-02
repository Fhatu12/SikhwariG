import Link from "next/link";
import { Container } from "@/components/layout/container";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-[var(--color-surface-muted)]/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-8">
        <Link href="/" className="flex items-center shrink-0 w-[140px] sm:w-[160px]">
          <img
            src="/brand/sg-parent.png"
            alt="Sikhwari Group"
            width={140}
            height={28}
            className="h-7 w-auto opacity-90 saturate-75 sm:h-8"
          />
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center">
          <ul className="flex flex-nowrap items-center gap-5 whitespace-nowrap text-sm font-medium text-slate-700">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-link text-link-subtle focus-ring text-sm font-medium"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

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
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-8">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-slate-900">
          Sikhwari Group
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-700">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="focus-ring transition-colors hover:text-[var(--color-brand-700)]"
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

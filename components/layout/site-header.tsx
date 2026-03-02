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
        <Link href="/" className="flex items-center shrink-0 w-[140px] sm:w-[160px]">
          <img
            src="/brand/sg-parent.png"
            alt="Sikhwari Group"
            width={140}
            height={28}
            className="h-6 w-auto sm:h-7"
          />
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center">
          <ul className="flex flex-nowrap items-center gap-5 whitespace-nowrap text-sm font-medium text-slate-700">
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

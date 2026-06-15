import Link from "next/link";
import { Container } from "@/components/layout/container";
import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[var(--color-surface-muted)] py-10">
      <Container>
        <div className="flex min-w-0 flex-col">
          <LegalIdentityBlock className="w-full" />
        </div>

        <div className="mt-8 w-full border-t border-slate-200 pt-8 md:mt-10 md:pt-10">
          <p className="font-serif text-lg font-semibold text-slate-900">
            SIKHWARI GROUP (Pty) Ltd
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Professional services across telecommunications, cybersecurity, and software
            development.
          </p>
          <ul className="mt-4 flex w-full flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
            {LEGAL_LINKS.map((item) => (
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
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Built by SG Digital | A division of Sikhwari Group (Pty) Ltd
        </p>
      </Container>
    </footer>
  );
}

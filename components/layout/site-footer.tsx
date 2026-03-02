import Link from "next/link";
import { Container } from "@/components/layout/container";
import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[var(--color-surface-muted)] py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-2">
            <p className="font-serif text-lg font-semibold text-slate-900">
              SIKHWARI GROUP (Pty) Ltd
            </p>
            <p className="max-w-xl text-sm text-slate-600">
              Professional consulting services across strategic advisory, cybersecurity delivery,
              and internal operations support.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
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
            <p className="mt-4 text-xs text-slate-500">
              Site built by{" "}
              <Link className="text-link focus-ring font-medium" href="/services">
                SG Digital
              </Link>
              , a division of SIKHWARI GROUP (Pty) Ltd.
            </p>
          </div>
          <LegalIdentityBlock className="max-w-md" />
        </div>
      </Container>
    </footer>
  );
}

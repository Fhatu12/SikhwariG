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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 md:items-start">
          <section
            className="w-full rounded-xl border border-slate-200 bg-[var(--color-surface-muted)] p-4 text-sm text-slate-800"
            aria-label="Contact and email"
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="font-medium text-slate-900">Fhatuwani Sikhwari</p>
                <p>
                  Contact:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="tel:+27829974112"
                  >
                    0829974112
                  </a>
                </p>
                <p>
                  E-mail:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="mailto:Fhatuwani.Sikhwari@sikhwarigroup.co.za"
                  >
                    Fhatuwani.Sikhwari@sikhwarigroup.co.za
                  </a>
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">Tendani Sikhwari</p>
                <p>
                  Contact:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="tel:+27829984112"
                  >
                    0829984112
                  </a>
                </p>
                <p>
                  E-mail:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="mailto:Tendani.Sikhwari@sikhwarigroup.co.za"
                  >
                    Tendani.Sikhwari@sikhwarigroup.co.za
                  </a>
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">Inquiries</p>
                <p>
                  Email:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="mailto:info@sikhwarigroup.co.za"
                  >
                    info@sikhwarigroup.co.za
                  </a>
                </p>
                <p>
                  website:{" "}
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href="https://sikhwarigroup.co.za"
                  >
                    sikhwarigroup.co.za
                  </a>
                </p>
              </div>
            </div>
          </section>
          <div className="flex min-w-0 flex-col">
            <LegalIdentityBlock className="w-full" />
          </div>
        </div>

        <div className="mt-8 w-full border-t border-slate-200 pt-8 md:mt-10 md:pt-10">
          <p className="font-serif text-lg font-semibold text-slate-900">
            SIKHWARI GROUP (Pty) Ltd
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Professional consulting services across strategic advisory, cybersecurity delivery, and
            internal operations support.
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

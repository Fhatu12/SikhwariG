import Link from "next/link";
import { Container } from "@/components/layout/container";
import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";
import { PORTFOLIOS, PUBLIC_EMAIL, PUBLIC_SERVICES } from "@/lib/public-content";

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
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-serif text-lg font-semibold text-slate-900">
                SIKHWARI GROUP (Pty) Ltd
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Telecommunications, cybersecurity, software, digital and hospitality services under
                one accountable South African company.
              </p>
              <p className="mt-3 text-sm text-slate-700">
                Email:{" "}
                <a className="text-link focus-ring font-medium" href={`mailto:${PUBLIC_EMAIL}`}>
                  {PUBLIC_EMAIL}
                </a>
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
            <nav aria-label="Footer services" className="grid gap-4 text-sm">
              {PORTFOLIOS.map((portfolio) => (
                <div key={portfolio.title}>
                  <h2 className="text-sm font-semibold text-slate-900">{portfolio.title}</h2>
                  <ul className="mt-2 space-y-1">
                    {PUBLIC_SERVICES.filter((service) => service.portfolio === portfolio.title).map(
                      (service) => (
                        <li key={service.key}>
                          <Link className="text-link focus-ring" href={service.href}>
                            {service.title}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Built by SG Digital | A division of Sikhwari Group (Pty) Ltd
        </p>
      </Container>
    </footer>
  );
}

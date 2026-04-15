import Link from "next/link";
import { Container } from "@/components/layout/container";
import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";
import { contactEmails, contactPhones, contactWebsite } from "@/lib/contact-details";

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
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Contact</p>
              <ul className="space-y-1">
                {contactPhones.map((phone) => (
                  <li key={phone.tel}>
                    {phone.label}:{" "}
                    <a className="text-link text-link-subtle focus-ring font-medium" href={`tel:${phone.tel}`}>
                      {phone.number}
                    </a>
                  </li>
                ))}
                {contactEmails.map((email) => (
                  <li key={email}>
                    <a
                      className="text-link text-link-subtle focus-ring font-medium"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    className="text-link text-link-subtle focus-ring font-medium"
                    href={`https://${contactWebsite}`}
                  >
                    {contactWebsite}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <LegalIdentityBlock className="max-w-md" />
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Built by SG Digital | A division of Sikhwari Group (Pty) Ltd
        </p>
      </Container>
    </footer>
  );
}

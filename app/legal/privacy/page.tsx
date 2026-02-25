import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy notice for Sikhwari Group (Pty) Ltd and its website contact process.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <Section title="Privacy Policy" description="Last updated: February 24, 2026">
      <div className="space-y-6">
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p>
            This website collects personal information submitted through contact forms, including
            name, email address, company details, and message content. We also process basic website
            log information such as IP address and request timestamp for operational and security
            purposes.
          </p>
          <p>
            We process this information to respond to enquiries, assess consultation fit, maintain
            communication records, and protect the website from abuse.
          </p>
          <p>
            Lead and enquiry records will be stored in a database managed through Prisma as part of
            the website application stack. Slice 1 includes policy wording only; database wiring
            will be implemented in Slice 2.
          </p>
          <p>
            Default retention period: 24 months from last meaningful contact, configurable as
            business and legal requirements evolve.
          </p>
          <p>
            In line with POPIA principles, data subjects may request access, correction, objection,
            restriction, or deletion where applicable. Rights requests can be submitted via the
            contact page and will be handled by the company representative.
          </p>
          <p>
            We apply high-level safeguards including controlled access, encrypted transport (HTTPS),
            and role-appropriate handling procedures. Specific technical controls are not disclosed
            publicly for security reasons.
          </p>
        </div>
        <LegalIdentityBlock />
      </div>
    </Section>
  );
}

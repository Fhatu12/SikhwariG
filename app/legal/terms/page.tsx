import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms governing use of the Sikhwari Group (Pty) Ltd website.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <Section title="Terms of Use" description="Last updated: February 24, 2026">
      <div className="space-y-6">
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p>
            This website is provided for general business information. Content may change without
            notice and does not constitute a contractual offer.
          </p>
          <p>
            Users agree not to misuse the site, attempt unauthorised access, or interfere with
            service availability.
          </p>
          <p>
            Any service engagement will be governed by separate written agreements that define
            scope, deliverables, fees, and liabilities.
          </p>
          <p>
            To the maximum extent permitted by applicable law, the company is not liable for
            indirect or consequential losses arising from reliance on website content.
          </p>
          <p>These terms are governed by the laws of the Republic of South Africa.</p>
        </div>
      </div>
    </Section>
  );
}

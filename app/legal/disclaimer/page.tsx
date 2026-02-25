import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";
import { TradingDisclaimerBlock } from "@/components/legal/trading-disclaimer-block";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: "General disclaimer and proprietary trading notice for Sikhwari Group (Pty) Ltd.",
  path: "/legal/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <Section title="Disclaimer" description="Last updated: February 24, 2026">
      <div className="space-y-6">
        <div className="space-y-3 text-sm leading-7 text-slate-700">
          <p>
            Information on this website is supplied for general business context and does not
            constitute legal, financial, tax, or investment advice.
          </p>
          <p>
            Users should obtain independent professional advice before acting on any information
            presented on this website.
          </p>
          <p>
            References to service lines do not create separate legal entities; all services are
            rendered by SIKHWARI GROUP (Pty) Ltd.
          </p>
        </div>
        <TradingDisclaimerBlock />
        <LegalIdentityBlock />
      </div>
    </Section>
  );
}

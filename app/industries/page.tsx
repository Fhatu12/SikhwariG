import { IndustriesSection } from "@/components/industries/industries-section";
import { Section } from "@/components/layout/section";
import { INDUSTRIES_SERVED } from "@/lib/industries-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Industries",
  description:
    "Overview of industries served by Sikhwari Group (Pty) Ltd across advisory, cybersecurity, and operational support.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <IndustriesSection
        title="Industries served"
        intro="We support organisations across multiple sectors with practical delivery, governance discipline, and accountable execution aligned to business priorities."
        items={INDUSTRIES_SERVED}
      />
      <Section title="Clients" description="How we handle client disclosure">
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          We disclose client names only with written permission. Case studies and references can be
          shared on request where confidentiality obligations allow.
        </p>
      </Section>
    </>
  );
}

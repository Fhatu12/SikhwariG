import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Overview of Sikhwari Group (Pty) Ltd, a single legal entity with focused service divisions and accountable delivery.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section
        title="About Sikhwari Group"
        description="SIKHWARI GROUP (Pty) Ltd is structured as one legal entity with distinct, coordinated service lines."
      >
        <div className="max-w-3xl space-y-4 text-slate-700">
          <p>
            We focus on disciplined delivery and clear governance. Our model is designed to keep
            engagements practical, transparent and results-focused.
          </p>
          <p>
            Phase 1 establishes the company-facing foundation. Sector and capability depth will be
            expanded as service collateral is finalised.
          </p>
        </div>
      </Section>
    </>
  );
}

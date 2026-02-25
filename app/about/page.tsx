import { ProofSection } from "@/components/proof/proof-section";
import { Section } from "@/components/layout/section";
import { getActiveProofItems } from "@/lib/proof-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Overview of Sikhwari Group (Pty) Ltd, a single legal entity with focused service divisions and accountable delivery.",
  path: "/about",
});

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const proofItems = await getActiveProofItems();

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
            Our company-facing foundation is established, with sector and capability depth presented
            in line with client requirements and documented scope.
          </p>
        </div>
      </Section>

      <ProofSection
        items={proofItems}
        title="Proof and governance"
        description="Current proof items reflecting recognised certifications, partner relationships, memberships, and awards."
      />
    </>
  );
}

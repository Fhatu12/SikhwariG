import { ProofSection } from "@/components/proof/proof-section";
import { Section } from "@/components/layout/section";
import { LeaderAvatar } from "@/components/team/leader-avatar";
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

      <Section
        title="Leadership"
        description="Leadership across strategy, delivery, risk, and technology services under one accountable legal entity."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <LeaderAvatar src="/team/fhatuwani.jpg" alt="Fhatuwani Sikhwari" initials="FS" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Fhatuwani Sikhwari</h3>
            <p className="text-sm text-slate-600">
              Director, Telecommunications, ICT and Network Services
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Leads delivery across telecommunications and digital services, with a focus on
              reliable execution, operational governance, and authorised security support. Brings
              deep experience in connectivity environments and practical service improvement.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Telecommunications delivery",
                "Service reliability",
                "Governance and change control",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {chip}
                </span>
              ))}
            </div>
            <a
              className="mt-4 inline-block text-link focus-ring font-medium"
              href="https://linkedin.com/in/fhatuwani-sikhwari-60013a1a"
            >
              LinkedIn profile
            </a>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <LeaderAvatar src="/team/tendani.jpg" alt="Tendani Sikhwari" initials="TS" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Tendani Sikhwari</h3>
            <p className="text-sm text-slate-600">Director, Culinary and Hospitality Services</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Leads catering and hospitality delivery with a focus on service standards, food safety
              discipline, and consistent event execution. Supports kitchen operations, stock
              handling, and team coordination for dependable service outcomes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Catering operations", "Food safety", "Service standards"].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {chip}
                </span>
              ))}
            </div>
          </article>
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

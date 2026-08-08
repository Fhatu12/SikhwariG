import { ProofSection } from "@/components/proof/proof-section";
import { Section } from "@/components/layout/section";
import { LeaderAvatar } from "@/components/team/leader-avatar";
import { SelectedWorkSection } from "@/components/work/selected-work-section";
import { getActiveProofItems } from "@/lib/proof-content";
import { PORTFOLIOS, PUBLIC_SERVICES } from "@/lib/public-content";
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
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              About Sikhwari Group
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              SIKHWARI GROUP (Pty) Ltd is one registered South African private company with
              specialist internal divisions across technology, telecommunications, cybersecurity,
              digital services and hospitality.
            </p>
          </div>
        </div>
      </section>

      <Section
        title="Company structure"
        description="The divisions are internal specialist divisions, not separate companies."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {PORTFOLIOS.map((portfolio) => (
            <article
              key={portfolio.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">{portfolio.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{portfolio.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {portfolio.divisions.map((division) => (
                  <li
                    key={division}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {division}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Public service divisions</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {PUBLIC_SERVICES.map((service) => (
              <li key={service.key} className="rounded-[var(--radius-sm)] bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-900">{service.division}:</span>{" "}
                {service.title}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        title="Delivery principles"
        description="The company model is designed for practical, accountable work under documented scope."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {[
            "One accountable legal entity",
            "Documented scope",
            "Disciplined execution",
            "Authorised work only",
          ].map((principle) => (
            <article key={principle} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">{principle}</h3>
            </article>
          ))}
        </div>
        <div className="mt-5 max-w-3xl space-y-4 text-slate-700">
          <p>
            Sikhwari Group is South Africa-based, 100% black owned and 50% black female owned, with
            a B-BBEE Level 1 Contributor status recorded as an approved public fact.
          </p>
          <p>
            The underlying B-BBEE and ownership certificate material is not displayed publicly in
            this implementation.
          </p>
        </div>
      </Section>

      <Section
        title="Leadership"
        description="Leadership across the approved public portfolios under one accountable legal entity."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <LeaderAvatar src="/team/fhatuwani.jpg" alt="Fhatuwani Sikhwari" initials="FS" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Fhatuwani Sikhwari</h3>
            <p className="text-sm font-medium text-slate-700">Group CEO / Managing Director</p>
            <p className="text-sm text-slate-600">
              Technology, Telecommunications and Cybersecurity Portfolio
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Fhatuwani Sikhwari brings experience across telecommunications, project delivery,
              digital services, and cybersecurity, with a focus on practical execution and
              accountable delivery.
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
            <p className="text-sm font-medium text-slate-700">
              Executive Director: Operations, Hospitality and Corporate Services
            </p>
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

      <Section
        title="Selected Work"
        description="Approved examples of practical delivery, shown without invented metrics, endorsements, confidential details, screenshots or unapproved public links."
      >
        <SelectedWorkSection />
      </Section>

      <ProofSection
        items={proofItems}
        title="Proof and governance"
        description="Current proof items reflecting recognised certifications, partner relationships, memberships, and awards."
      />
    </>
  );
}

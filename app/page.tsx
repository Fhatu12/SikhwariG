import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProofSection } from "@/components/proof/proof-section";
import { SelectedWorkSection } from "@/components/work/selected-work-section";
import { getActiveProofItems } from "@/lib/proof-content";
import { CREDIBILITY_FACTS, PORTFOLIOS, PUBLIC_SERVICES } from "@/lib/public-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description:
    "Sikhwari Group (Pty) Ltd delivers telecommunications, cybersecurity, software, digital and hospitality services under one accountable South African company.",
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function Home() {
  const proofItems = await getActiveProofItems();

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-[var(--color-surface-muted)] to-white py-12 sm:py-14">
        <Container className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-700)]">
              SIKHWARI GROUP (Pty) Ltd
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Technology, telecommunications, cybersecurity, digital and hospitality services under
              one accountable South African company.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Sikhwari Group (Pty) Ltd delivers practical services through specialist internal
              divisions covering telecommunications and ICT, cybersecurity, software and digital
              delivery, and culinary and hospitality operations. Every engagement is managed under
              one registered legal entity with clear accountability, documented scope and
              disciplined execution.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
                href="/contact?intent=quote"
              >
                Request a quote
              </Link>
              <Link
                className="rounded-[var(--radius-sm)] border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
                href="/services"
              >
                View our services
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-slate-900">Credibility facts</h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-1">
              {CREDIBILITY_FACTS.map((fact) => (
                <li key={fact} className="rounded-[var(--radius-sm)] bg-slate-50 px-3 py-2">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Section
        title="Two public portfolios"
        description="The divisions work under one company structure while giving clients a clear way to understand where each service fits."
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
      </Section>

      <Section
        title="Focused service areas"
        description="Four public service areas are delivered through specialist internal divisions under one accountable legal entity."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {PUBLIC_SERVICES.map((service) => (
            <article
              key={service.key}
              className="h-full rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                {service.division}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.summary}</p>
              <Link
                className="mt-4 inline-block text-link focus-ring text-sm font-medium"
                href={service.href}
              >
                View {service.division}
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link
            className="text-link text-link-subtle focus-ring text-sm font-medium"
            href="/services"
          >
            View all services
          </Link>
        </div>
      </Section>

      <Section
        title="Selected Work"
        description="Approved examples of practical digital, software and cybersecurity capability, shown without invented metrics, endorsements or confidential details."
      >
        <SelectedWorkSection compact />
      </Section>

      <Section
        title="Accountable delivery"
        description="Every enquiry is handled under Sikhwari Group (Pty) Ltd with clear scope, disciplined execution and the right internal division for the work."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-4 text-sm leading-6 text-slate-700 md:grid-cols-3">
            <p>One registered South African private company is accountable for engagements.</p>
            <p>Service areas are public-facing divisions, not separate legal entities.</p>
            <p>Cybersecurity work is performed only with authorisation and agreed scope.</p>
          </div>
          <div className="mt-5">
            <Link
              className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
              href="/contact?intent=quote"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </Section>

      <ProofSection items={proofItems} />
    </>
  );
}

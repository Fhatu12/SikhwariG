import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProofSection } from "@/components/proof/proof-section";
import { getActiveProofItems } from "@/lib/proof-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description:
    "Sikhwari Group (Pty) Ltd delivers practical support across telecommunications, cybersecurity, and software development services.",
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
              Telecommunications, cybersecurity, and software development services under one
              accountable legal entity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Sikhwari Group (Pty) Ltd supports organisations through three focused service areas:
              Telecommunications, ICT, and Network Services; Cybersecurity Services; and Software
              Development and Digital Services. We deliver practical, accountable support for
              connectivity, security, and digital execution.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-slate-900">Quick facts</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>South Africa-based delivery and support.</li>
              <li>Professional service lines under one accountable legal entity.</li>
              <li>Enquiries handled with appropriate safeguards and POPIA awareness.</li>
              <li>Cybersecurity work is provided on an authorised basis.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
                href="/contact?intent=quote"
              >
                Request a quote
              </Link>
              <Link
                className="rounded-[var(--radius-sm)] border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
                href="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Section
        title="Focused service areas"
        description="Our work is structured into clear service categories while remaining under a single legal company."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Telecommunications, ICT, and Network Services",
              body: "We support organisations with telecommunications, ICT, and network services that improve connectivity, reliability, and day-to-day operational continuity. Our focus is practical delivery for environments that depend on stable communications and well-managed infrastructure.",
            },
            {
              title: "Cybersecurity Services",
              body: "We help organisations strengthen their security posture through practical cybersecurity support, risk-aware guidance, and accountable execution. Our approach focuses on improving resilience, reducing exposure, and supporting safer business operations.",
            },
            {
              title: "Software Development and Digital Services",
              body: "We build and support digital solutions that help organisations improve workflows, strengthen service delivery, and move ideas into working systems. Our focus is practical software and digital delivery aligned to real business needs.",
            },
          ].map((item) => (
            <article key={item.title} className="h-full rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {item.body}
              </p>
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

      <ProofSection items={proofItems} />
    </>
  );
}

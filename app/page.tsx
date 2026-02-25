import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description:
    "Sikhwari Group (Pty) Ltd delivers practical support across advisory, cybersecurity, and business operations.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-[var(--color-brand-50)] to-white py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-700)]">
              SIKHWARI GROUP (Pty) Ltd
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Professional service lines under one accountable legal entity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              We partner with organisations that need practical delivery in strategy execution,
              cybersecurity and business operations support.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
              Current release scope
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This release provides the website foundation for company information, legal
              disclosures and contact enquiries.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Treasury and proprietary trading activities are internal and are not offered to the
              public.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
                href="/services"
              >
                Request a quote
              </Link>
              <Link
                className="rounded-[var(--radius-sm)] border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
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
          {["Advisory", "Cybersecurity", "Operations support"].map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">{item}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Initial content for Phase 1. Detailed service information will be added in later
                releases.
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}

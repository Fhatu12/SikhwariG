import Link from "next/link";
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
      <Section title="Client confidentiality">
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          We treat client information as confidential and only reference client names or work
          examples with permission. Additional details can be shared during a private discussion
          where appropriate.
        </p>
      </Section>
      <Section
        title="Discuss your requirements"
        description="Use our contact channel for business enquiries, consultations, and quote requests."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="rounded-[var(--radius-sm)] border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
            href="/contact?intent=quote"
          >
            Request a quote
          </Link>
        </div>
      </Section>
    </>
  );
}

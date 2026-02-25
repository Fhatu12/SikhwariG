import Link from "next/link";
import { IndustriesSection } from "@/components/industries/industries-section";
import { Section } from "@/components/layout/section";
import { TradingDisclaimerBlock } from "@/components/legal/trading-disclaimer-block";
import { INDUSTRIES_SERVED } from "@/lib/industries-content";
import { buildMetadata } from "@/lib/seo";
import { ensureServiceContent, splitBodyLines } from "@/lib/service-content";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Service overview for advisory, cybersecurity, and internal operations under Sikhwari Group (Pty) Ltd.",
  path: "/services",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await ensureServiceContent();
  const compactIndustries = INDUSTRIES_SERVED.slice(0, 6);

  return (
    <>
      <Section
        title="Services"
        description="Service lines are grouped under Sikhwari Group (Pty) Ltd using clear, accountable categories."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className={`rounded-xl border border-slate-200 bg-white p-5 ${service.isTradingInternal ? "md:col-span-2" : ""}`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              {service.intro ? (
                <p
                  className={`mt-2 text-sm ${service.isTradingInternal ? "font-medium text-slate-700" : "text-slate-600"}`}
                >
                  {service.intro}
                </p>
              ) : null}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {splitBodyLines(service.body).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {service.isTradingInternal ? <TradingDisclaimerBlock className="mt-4" /> : null}
            </article>
          ))}
        </div>
      </Section>

      <IndustriesSection
        title="Industries served"
        intro="Our teams support sector-specific delivery requirements while keeping governance and communication clear."
        items={compactIndustries}
      />

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
            href="/contact"
          >
            Request a quote
          </Link>
        </div>
      </Section>
    </>
  );
}

import { Section } from "@/components/layout/section";
import { TradingDisclaimerBlock } from "@/components/legal/trading-disclaimer-block";
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

  return (
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
  );
}

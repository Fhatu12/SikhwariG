import { Section } from "@/components/layout/section";
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
  const services = (await ensureServiceContent()).filter((service) => !service.isTradingInternal);

  return (
    <Section
      title="Services"
      description="Service lines are grouped under Sikhwari Group (Pty) Ltd using clear, accountable categories."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            className={`relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-5 ${service.isTradingInternal ? "md:col-span-2" : ""}`}
          >
            {service.watermarkSrc ? (
              <img
                src={service.watermarkSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full select-none object-contain opacity-[0.10] sm:block"
              />
            ) : null}
            <div className="relative z-10">
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
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

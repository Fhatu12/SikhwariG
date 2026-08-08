import { Section } from "@/components/layout/section";
import { PORTFOLIOS, getPublicServiceByKey } from "@/lib/public-content";
import { buildMetadata } from "@/lib/seo";
import { ensureServiceContent, splitBodyLines } from "@/lib/service-content";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Service overview for telecommunications, cybersecurity, software, digital and hospitality services under Sikhwari Group (Pty) Ltd.",
  path: "/services",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = (await ensureServiceContent()).filter((service) => !service.isTradingInternal);

  return (
    <>
      <section className="py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Services
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Sikhwari Group (Pty) Ltd delivers four public service areas through specialist
              internal divisions. Each service is managed under one registered legal entity with
              documented scope and accountable delivery.
            </p>
          </div>
        </div>
      </section>

      {PORTFOLIOS.map((portfolio) => {
        const portfolioServices = services.filter(
          (service) => getPublicServiceByKey(service.key)?.portfolio === portfolio.title
        );

        return (
          <Section
            key={portfolio.title}
            title={portfolio.title}
            description={portfolio.description}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {portfolioServices.map((service) => {
                const publicService = getPublicServiceByKey(service.key);

                return (
                  <article
                    key={service.id}
                    className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-5"
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
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                        {publicService?.division}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-slate-900">{service.title}</h2>
                      {service.intro ? (
                        <p className="mt-2 rounded-[var(--radius-sm)] bg-amber-50 px-3 py-2 text-sm text-amber-900">
                          {service.intro}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {publicService?.summary}
                        </p>
                      )}
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {splitBodyLines(service.body).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                      {publicService ? (
                        <a
                          className="mt-4 inline-block text-link focus-ring text-sm font-medium"
                          href={publicService.href}
                        >
                          View {publicService.division}
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </Section>
        );
      })}

      <Section
        title="Scope boundaries"
        description="Service wording is intentionally practical and evidence-supported."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
          <p>
            Telecommunications support does not present Sikhwari Group as holding regulated
            telecoms-provider status. Cybersecurity work is performed only with applicable
            authorisation and agreed scope. Hospitality work is confirmed against event requirements
            and does not imply unverified permits or premises approvals.
          </p>
        </div>
      </Section>
    </>
  );
}

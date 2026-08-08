import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { SelectedWorkSection } from "@/components/work/selected-work-section";
import {
  DIVISION_LEGAL_STATEMENT,
  ENGAGEMENT_PROCESS,
  PUBLIC_SERVICES,
  getSelectedWorkByKeys,
} from "@/lib/public-content";
import { buildMetadata } from "@/lib/seo";

type DivisionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getDivision(slug: string) {
  return PUBLIC_SERVICES.find((service) => service.href === `/divisions/${slug}`);
}

export async function generateMetadata({ params }: DivisionPageProps) {
  const { slug } = await params;
  const division = getDivision(slug);
  if (!division) {
    return buildMetadata({
      title: "Division",
      description: "Division page for Sikhwari Group (Pty) Ltd.",
      path: `/divisions/${slug}`,
    });
  }

  return buildMetadata({
    title: division.title,
    description: `${division.title} delivered by ${division.division}, ${DIVISION_LEGAL_STATEMENT}`,
    path: `/divisions/${slug}`,
  });
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
  const division = getDivision(slug);

  if (!division) {
    notFound();
  }

  const selectedWork = getSelectedWorkByKeys(division.selectedWorkKeys);
  const quoteHref = `/contact?intent=quote&service=${encodeURIComponent(division.title)}`;

  return (
    <>
      <section className="border-b border-slate-200 bg-[var(--color-surface-muted)] py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
              {division.division}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {division.title}
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-900">{DIVISION_LEGAL_STATEMENT}</p>
            <p className="mt-4 text-base leading-7 text-slate-600">{division.overview}</p>
            {division.scopeNote ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {division.scopeNote}
              </p>
            ) : null}
            <div className="mt-5">
              <Link
                className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)] focus-visible:ring-offset-2"
                href={quoteHref}
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Client problems addressed" description={division.clientProblem}>
        <div className="grid gap-4 md:grid-cols-3">
          {division.useCases.map((useCase) => (
            <article key={useCase} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">{useCase}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Support is scoped around the requirement, operating context and practical delivery
                path.
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Core capabilities" description={division.summary}>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Capabilities</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {division.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Typical deliverables</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {division.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section
        title="Engagement process"
        description="The same delivery discipline applies across the public service areas."
      >
        <ol className="grid gap-4 md:grid-cols-4">
          {ENGAGEMENT_PROCESS.map((step, index) => (
            <li key={step} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-700)]">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {selectedWork.length > 0 ? (
        <Section
          title="Relevant Selected Work"
          description="Approved examples connected to this service area, shown without confidential details, screenshots or unapproved links."
        >
          <SelectedWorkSection items={selectedWork} />
        </Section>
      ) : null}

      <Section
        title="Scope and legal boundaries"
        description="These boundaries keep the public service presentation accurate and evidence-supported."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {division.boundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
          <div className="mt-5">
            <Link className="text-link focus-ring text-sm font-medium" href={quoteHref}>
              Request a quote for {division.title}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

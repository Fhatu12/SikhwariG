import type { ProofItem } from "@prisma/client";
import { PROOF_KIND_LABELS } from "@/lib/proof-content";

type ProofSectionProps = {
  items: ProofItem[];
  title?: string;
  description?: string;
};

export function ProofSection({
  items,
  title = "Proof",
  description = "Selected certifications, partnerships, memberships, and recognised achievements.",
}: ProofSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const grouped = items.reduce<Record<string, ProofItem[]>>((acc, item) => {
    acc[item.kind] = acc[item.kind] || [];
    acc[item.kind].push(item);
    return acc;
  }, {});

  return (
    <section className="border-t border-slate-200 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-[var(--container-max-width)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {Object.entries(grouped).map(([kind, kindItems]) => (
            <article key={kind} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800">
                {PROOF_KIND_LABELS[kindItems[0].kind]}
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                {kindItems.map((item) => (
                  <li key={item.id}>
                    {item.url ? (
                      <a
                        className="font-medium text-[var(--color-brand-700)] hover:underline"
                        href={item.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <p className="font-medium text-slate-900">{item.title}</p>
                    )}
                    {item.subtitle ? <p className="mt-1 text-slate-600">{item.subtitle}</p> : null}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

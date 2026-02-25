import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureServiceContent, TRADING_COPY_GUARDRAIL } from "@/lib/service-content";

type ServicesPageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

export default async function AdminServicesPage({ searchParams }: ServicesPageProps) {
  await requireAdmin("/admin/services");

  const params = await searchParams;
  const services = await ensureServiceContent();

  return (
    <AdminShell title="Service content">
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Copy guardrail</h2>
        <p className="mt-2">
          Treasury / Internal proprietary trading text must stay internal-only. Do not add public
          trading calls to action, invitation language, or solicitation copy.
        </p>
      </section>

      {params.saved ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Service content saved.
        </p>
      ) : null}

      <div className="space-y-4">
        {services.map((service) => (
          <section
            key={service.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]"
          >
            <form action={`/api/admin/services/${service.id}`} method="post" className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
                <input
                  className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                  defaultValue={service.title}
                  maxLength={160}
                  name="title"
                  required
                  type="text"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Intro (optional)
                </span>
                <textarea
                  className="min-h-20 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                  defaultValue={
                    service.isTradingInternal ? TRADING_COPY_GUARDRAIL : (service.intro ?? "")
                  }
                  disabled={service.isTradingInternal}
                  maxLength={400}
                  name="intro"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Bullets (one item per line)
                </span>
                <textarea
                  className="min-h-32 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                  defaultValue={service.body}
                  maxLength={5000}
                  name="body"
                  required
                />
              </label>

              {service.isTradingInternal ? (
                <p className="rounded-[var(--radius-sm)] bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Treasury / Internal trading intro text is fixed for MOI compliance.
                </p>
              ) : null}

              <button
                className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
                type="submit"
              >
                Save section
              </button>
            </form>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}

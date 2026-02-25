import { ProofKind } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type ProofPageProps = {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
  }>;
};

const PROOF_KIND_OPTIONS: { value: ProofKind; label: string }[] = [
  { value: "CERTIFICATION", label: "Certification" },
  { value: "PARTNER", label: "Partner" },
  { value: "MEMBERSHIP", label: "Membership" },
  { value: "AWARD", label: "Award" },
];

export default async function AdminProofPage({ searchParams }: ProofPageProps) {
  await requireAdmin("/admin/proof");

  const params = await searchParams;
  const proofItems = await prisma.proofItem.findMany({
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <AdminShell title="Proof">
      {params.saved ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Proof item saved.
        </p>
      ) : null}
      {params.deleted ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Proof item removed.
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold text-slate-900">Create proof item</h2>
        <form action="/api/admin/proof" method="post" className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={140}
              name="title"
              required
              type="text"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Subtitle (optional)
            </span>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={180}
              name="subtitle"
              type="text"
            />
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Kind</span>
              <select
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm"
                defaultValue={ProofKind.CERTIFICATION}
                name="kind"
              >
                {PROOF_KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Sort order</span>
              <input
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                defaultValue={0}
                name="sortOrder"
                type="number"
              />
            </label>
            <label className="flex items-center gap-2 pt-7 text-sm text-slate-700">
              <input defaultChecked name="isActive" type="checkbox" />
              Active
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Reference URL (optional)
            </span>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={500}
              name="url"
              placeholder="https://..."
              type="url"
            />
          </label>
          <button
            className="w-fit rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
            type="submit"
          >
            Add proof item
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Existing proof items</h2>
        {proofItems.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No proof items yet.
          </p>
        ) : (
          proofItems.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <form action={`/api/admin/proof/${item.id}`} method="post" className="grid gap-3">
                <input name="intent" type="hidden" value="save" />
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
                  <input
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={item.title}
                    maxLength={140}
                    name="title"
                    required
                    type="text"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Subtitle (optional)
                  </span>
                  <input
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={item.subtitle ?? ""}
                    maxLength={180}
                    name="subtitle"
                    type="text"
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">Kind</span>
                    <select
                      className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm"
                      defaultValue={item.kind}
                      name="kind"
                    >
                      {PROOF_KIND_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                      Sort order
                    </span>
                    <input
                      className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                      defaultValue={item.sortOrder}
                      name="sortOrder"
                      type="number"
                    />
                  </label>
                  <label className="flex items-center gap-2 pt-7 text-sm text-slate-700">
                    <input defaultChecked={item.isActive} name="isActive" type="checkbox" />
                    Active
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Reference URL (optional)
                  </span>
                  <input
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={item.url ?? ""}
                    maxLength={500}
                    name="url"
                    placeholder="https://..."
                    type="url"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
                    type="submit"
                  >
                    Save changes
                  </button>
                </div>
              </form>

              <div className="mt-3 flex flex-wrap gap-2">
                <form action={`/api/admin/proof/${item.id}`} method="post">
                  <input name="intent" type="hidden" value="toggle" />
                  <input name="isActive" type="hidden" value={item.isActive ? "false" : "true"} />
                  <button
                    className="rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500"
                    type="submit"
                  >
                    {item.isActive ? "Set inactive" : "Set active"}
                  </button>
                </form>
                <form action={`/api/admin/proof/${item.id}`} method="post">
                  <input name="intent" type="hidden" value="reorder" />
                  <input name="direction" type="hidden" value="up" />
                  <button
                    className="rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500"
                    type="submit"
                  >
                    Move up
                  </button>
                </form>
                <form action={`/api/admin/proof/${item.id}`} method="post">
                  <input name="intent" type="hidden" value="reorder" />
                  <input name="direction" type="hidden" value="down" />
                  <button
                    className="rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500"
                    type="submit"
                  >
                    Move down
                  </button>
                </form>
                <form action={`/api/admin/proof/${item.id}`} method="post">
                  <input name="intent" type="hidden" value="delete" />
                  <button
                    className="rounded-[var(--radius-sm)] border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-500"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </section>
    </AdminShell>
  );
}

import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type LeadsPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  await requireAdmin("/admin/leads");

  const params = await searchParams;
  const selectedId = Number.parseInt(params.id ?? "", 10);

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const selectedLead =
    leads.find((lead) => lead.id === selectedId) ??
    (Number.isNaN(selectedId)
      ? null
      : await prisma.lead.findUnique({
          where: { id: selectedId },
        }));

  return (
    <AdminShell title="Lead inbox">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
          <header className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-slate-900">Recent leads</h2>
            <p className="text-sm text-slate-600">
              Showing the most recent 200 contact submissions.
            </p>
          </header>
          {leads.length === 0 ? (
            <p className="px-4 py-5 text-sm text-slate-600">No leads captured yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {leads.map((lead) => (
                <li key={lead.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-600">{lead.email}</p>
                      <p className="text-xs text-slate-500">{lead.intent}</p>
                      <p className="text-xs text-slate-500">{formatDate(lead.createdAt)}</p>
                    </div>
                    <Link
                      className="rounded-[var(--radius-sm)] border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:border-slate-500"
                      href={`/admin/leads?id=${lead.id}`}
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold text-slate-900">Lead details</h2>
          {!selectedLead ? (
            <p className="mt-3 text-sm text-slate-600">
              Select a lead to view the full submission.
            </p>
          ) : (
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-700">Name</dt>
                <dd className="text-slate-900">{selectedLead.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Email</dt>
                <dd className="text-slate-900">{selectedLead.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Phone</dt>
                <dd className="text-slate-900">{selectedLead.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Reason</dt>
                <dd className="text-slate-900">{selectedLead.intent}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Service area</dt>
                <dd className="text-slate-900">{selectedLead.serviceArea || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Submitted</dt>
                <dd className="text-slate-900">{formatDate(selectedLead.createdAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Source path</dt>
                <dd className="text-slate-900">{selectedLead.sourcePath || "Unknown"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">IP address</dt>
                <dd className="text-slate-900">{selectedLead.ipAddress || "Unknown"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">User agent</dt>
                <dd className="break-all text-slate-900">{selectedLead.userAgent || "Unknown"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Message</dt>
                <dd className="whitespace-pre-wrap text-slate-900">{selectedLead.message}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

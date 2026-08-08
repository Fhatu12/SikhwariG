import { SELECTED_WORK } from "@/lib/public-content";

type SelectedWorkItem = (typeof SELECTED_WORK)[number];

type SelectedWorkSectionProps = {
  items?: readonly SelectedWorkItem[];
  compact?: boolean;
};

function statusClassName(status: string) {
  if (status === "Live") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Internal Product") {
    return "border-teal-200 bg-[var(--color-brand-50)] text-[var(--color-brand-700)]";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
}

export function SelectedWorkSection({
  items = SELECTED_WORK,
  compact = false,
}: SelectedWorkSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.key} className="h-full rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap gap-2">
            {item.statuses.map((status) => (
              <span
                key={status}
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName(status)}`}
              >
                {status}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.name}</h3>
          <p className="mt-2 text-sm font-medium text-slate-700">{item.businessNeed}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {(compact ? item.scope.slice(0, 3) : item.scope).map((scopeItem) => (
              <li key={scopeItem}>{scopeItem}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
            Contribution: {item.contribution}
          </p>
          {item.classification ? (
            <p className="mt-2 text-xs text-slate-500">{item.classification}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

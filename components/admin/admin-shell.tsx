import Link from "next/link";
import { Container } from "@/components/layout/container";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/posts", label: "Posts" },
];

type AdminShellProps = {
  children: React.ReactNode;
  title: string;
};

export function AdminShell({ children, title }: AdminShellProps) {
  return (
    <section className="py-10">
      <Container className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            <form action="/api/admin/logout" method="post">
              <button
                className="rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500"
                type="submit"
              >
                Log out
              </button>
            </form>
          </div>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            {ADMIN_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-[var(--color-brand-700)]" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </Container>
    </section>
  );
}

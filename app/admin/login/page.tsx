import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getMessage(error?: string) {
  if (error === "missing-env") {
    return "Admin credentials are not configured in environment variables.";
  }
  if (error === "invalid") {
    return "Invalid username or password.";
  }
  return "";
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/leads");
  }

  const params = await searchParams;
  const nextPath =
    typeof params.next === "string" && params.next.startsWith("/admin")
      ? params.next
      : "/admin/leads";
  const errorMessage = getMessage(params.error);

  return (
    <section className="py-16">
      <Container className="max-w-lg">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-semibold text-slate-900">Admin login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your configured admin credentials to manage leads, services, and posts.
          </p>
          {errorMessage ? (
            <p className="mt-4 rounded-[var(--radius-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <form action="/api/admin/login" method="post" className="mt-5 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Username</span>
              <input
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                name="username"
                type="text"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <input
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                name="password"
                type="password"
                required
              />
            </label>
            <button
              className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
              type="submit"
            >
              Sign in
            </button>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            Return to the public site:{" "}
            <Link className="font-medium text-[var(--color-brand-700)] hover:underline" href="/">
              Home
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

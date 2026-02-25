import { PostStatus } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type PostsPageProps = {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
  }>;
};

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  await requireAdmin("/admin/posts");

  const params = await searchParams;
  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <AdminShell title="Posts">
      {params.saved ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Post saved.
        </p>
      ) : null}
      {params.deleted ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Post deleted.
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold text-slate-900">Create post</h2>
        <form action="/api/admin/posts" method="post" className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={180}
              name="title"
              required
              type="text"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Slug (optional)</span>
            <input
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={180}
              name="slug"
              type="text"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Excerpt (optional)
            </span>
            <textarea
              className="min-h-20 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={400}
              name="excerpt"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Content</span>
            <textarea
              className="min-h-36 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              maxLength={20000}
              name="content"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
            <select
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm"
              defaultValue={PostStatus.DRAFT}
              name="status"
            >
              <option value={PostStatus.DRAFT}>Draft</option>
              <option value={PostStatus.PUBLISHED}>Published</option>
            </select>
          </label>
          <button
            className="w-fit rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
            type="submit"
          >
            Save post
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Existing posts</h2>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No posts created yet.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <form
                action={`/api/admin/posts/${post.id}/update`}
                method="post"
                className="space-y-3"
              >
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
                  <input
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={post.title}
                    maxLength={180}
                    name="title"
                    required
                    type="text"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Slug</span>
                  <input
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={post.slug}
                    maxLength={180}
                    name="slug"
                    required
                    type="text"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Excerpt (optional)
                  </span>
                  <textarea
                    className="min-h-20 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={post.excerpt ?? ""}
                    maxLength={400}
                    name="excerpt"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Content</span>
                  <textarea
                    className="min-h-36 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                    defaultValue={post.content}
                    maxLength={20000}
                    name="content"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
                  <select
                    className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm"
                    defaultValue={post.status}
                    name="status"
                  >
                    <option value={PostStatus.DRAFT}>Draft</option>
                    <option value={PostStatus.PUBLISHED}>Published</option>
                  </select>
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
              <form action={`/api/admin/posts/${post.id}/delete`} method="post" className="mt-3">
                <button
                  className="rounded-[var(--radius-sm)] border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-500"
                  type="submit"
                >
                  Delete post
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </AdminShell>
  );
}

import { PostStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parsePostStatus, toSlug } from "@/lib/post-utils";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 180;
const MAX_SLUG_LENGTH = 180;
const MAX_EXCERPT_LENGTH = 400;
const MAX_CONTENT_LENGTH = 20000;

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/posts", request.url));
  }

  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
  }

  const formData = await request.formData();
  const title = text(formData.get("title"));
  const requestedSlug = text(formData.get("slug"));
  const excerpt = text(formData.get("excerpt"));
  const content = text(formData.get("content"));
  const status = parsePostStatus(formData.get("status"));

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json({ error: "Invalid title." }, { status: 400 });
  }

  if (!content || content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  if (excerpt.length > MAX_EXCERPT_LENGTH) {
    return NextResponse.json({ error: "Excerpt is too long." }, { status: 400 });
  }

  const slug = toSlug(requestedSlug || title);
  if (!slug || slug.length > MAX_SLUG_LENGTH) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { status: true, publishedAt: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const publishNow =
    existing.status !== PostStatus.PUBLISHED && status === PostStatus.PUBLISHED
      ? new Date()
      : existing.publishedAt;

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      status,
      publishedAt: status === PostStatus.PUBLISHED ? publishNow : null,
    },
  });

  return NextResponse.redirect(new URL("/admin/posts?saved=1", request.url));
}

import { PostStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { toSlug } from "@/lib/post-utils";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 180;
const MAX_SLUG_LENGTH = 180;
const MAX_EXCERPT_LENGTH = 400;
const MAX_CONTENT_LENGTH = 20000;

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/posts", request.url));
  }

  const formData = await request.formData();
  const title = text(formData.get("title"));
  const requestedSlug = text(formData.get("slug"));
  const excerpt = text(formData.get("excerpt"));
  const content = text(formData.get("content"));
  const status =
    formData.get("status") === PostStatus.PUBLISHED ? PostStatus.PUBLISHED : PostStatus.DRAFT;

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

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        status,
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create post. Confirm the slug is unique." },
      { status: 400 }
    );
  }

  return NextResponse.redirect(new URL("/admin/posts?saved=1", request.url));
}

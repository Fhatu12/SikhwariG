import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/posts", request.url));
  }

  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  if (Number.isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.redirect(new URL("/admin/posts?deleted=1", request.url));
}

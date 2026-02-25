import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { TRADING_COPY_GUARDRAIL } from "@/lib/service-content";

const MAX_TITLE_LENGTH = 160;
const MAX_INTRO_LENGTH = 400;
const MAX_BODY_LENGTH = 5000;

const BANNED_TRADING_CTA_PHRASES = [
  "request a quote",
  "book consultation",
  "talk to us",
  "contact us",
];

function sanitizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login?next=/admin/services", request.url));
  }

  const { id } = await params;
  const serviceId = Number.parseInt(id, 10);
  if (Number.isNaN(serviceId)) {
    return NextResponse.json({ error: "Invalid service ID." }, { status: 400 });
  }

  const existing = await prisma.serviceContent.findUnique({
    where: { id: serviceId },
    select: { id: true, isTradingInternal: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  if (existing.isTradingInternal) {
    return NextResponse.json(
      { error: "Trading service is internal and not editable from this endpoint." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const title = sanitizeString(formData.get("title"));
  const intro = sanitizeString(formData.get("intro"));
  const body = sanitizeString(formData.get("body"));

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json({ error: "Invalid title." }, { status: 400 });
  }

  if (intro.length > MAX_INTRO_LENGTH) {
    return NextResponse.json({ error: "Intro is too long." }, { status: 400 });
  }

  if (!body || body.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Invalid body content." }, { status: 400 });
  }

  if (existing.isTradingInternal) {
    const lowerCopy = `${title}\n${intro}\n${body}`.toLowerCase();
    if (BANNED_TRADING_CTA_PHRASES.some((phrase) => lowerCopy.includes(phrase))) {
      return NextResponse.json(
        {
          error: "Trading content must remain internal and cannot include public calls to action.",
        },
        { status: 400 }
      );
    }
  }

  await prisma.serviceContent.update({
    where: { id: serviceId },
    data: {
      title,
      intro: existing.isTradingInternal ? TRADING_COPY_GUARDRAIL : intro || null,
      body,
    },
  });

  return NextResponse.redirect(new URL("/admin/services?saved=1", request.url));
}

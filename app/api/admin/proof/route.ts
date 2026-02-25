import { ProofKind } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 140;
const MAX_SUBTITLE_LENGTH = 180;
const MAX_URL_LENGTH = 500;
const MAX_SORT_ORDER = 1000;
const NO_STORE = "no-store, no-cache, must-revalidate";

type ProofInput = {
  title: string;
  subtitle: string;
  kind: string;
  url: string;
  sortOrder: string;
  isActive: string;
};

function withNoStoreHeaders(initHeaders?: HeadersInit) {
  return {
    "Cache-Control": NO_STORE,
    ...(initHeaders || {}),
  };
}

function unauthorisedResponse() {
  return NextResponse.json(
    { error: "Unauthorised" },
    {
      status: 401,
      headers: withNoStoreHeaders(),
    }
  );
}

function getTrimmedValue(value: FormDataEntryValue | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function parseProofKind(value: string) {
  return (Object.values(ProofKind) as string[]).includes(value) ? (value as ProofKind) : null;
}

function parseSortOrder(value: string) {
  const parsed = Number.parseInt(value || "0", 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  if (parsed < -MAX_SORT_ORDER || parsed > MAX_SORT_ORDER) {
    return null;
  }
  return parsed;
}

function parseOptionalUrl(value: string) {
  if (!value) {
    return null;
  }
  if (value.length > MAX_URL_LENGTH) {
    return null;
  }
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function parseIsActive(value: string) {
  return value === "on" || value === "true" || value === "1";
}

async function readInput(request: Request): Promise<ProofInput> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      title: String(body.title ?? ""),
      subtitle: String(body.subtitle ?? ""),
      kind: String(body.kind ?? ""),
      url: String(body.url ?? ""),
      sortOrder: String(body.sortOrder ?? ""),
      isActive: String(body.isActive ?? ""),
    };
  }

  const formData = await request.formData();
  return {
    title: getTrimmedValue(formData.get("title") ?? undefined),
    subtitle: getTrimmedValue(formData.get("subtitle") ?? undefined),
    kind: getTrimmedValue(formData.get("kind") ?? undefined),
    url: getTrimmedValue(formData.get("url") ?? undefined),
    sortOrder: getTrimmedValue(formData.get("sortOrder") ?? undefined),
    isActive: getTrimmedValue(formData.get("isActive") ?? undefined),
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorisedResponse();
  }

  const items = await prisma.proofItem.findMany({
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(items, {
    headers: withNoStoreHeaders(),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorisedResponse();
  }

  const input = await readInput(request);
  const title = input.title.trim();
  const subtitle = input.subtitle.trim();
  const kind = parseProofKind(input.kind.trim());
  const sortOrder = parseSortOrder(input.sortOrder.trim());
  const url = parseOptionalUrl(input.url.trim());

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json(
      { error: "Title is required and must be 140 characters or fewer." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  if (subtitle.length > MAX_SUBTITLE_LENGTH) {
    return NextResponse.json(
      { error: "Subtitle must be 180 characters or fewer." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  if (!kind) {
    return NextResponse.json(
      { error: "Invalid proof kind." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  if (sortOrder === null) {
    return NextResponse.json(
      { error: "Sort order must be an integer between -1000 and 1000." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  if (input.url.trim() && !url) {
    return NextResponse.json(
      { error: "URL must be a valid http or https address." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  await prisma.proofItem.create({
    data: {
      title,
      subtitle: subtitle || null,
      kind,
      url,
      sortOrder,
      isActive: parseIsActive(input.isActive),
    },
  });

  const redirectUrl = new URL("/admin/proof?saved=1", request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.headers.set("Cache-Control", NO_STORE);
  return response;
}

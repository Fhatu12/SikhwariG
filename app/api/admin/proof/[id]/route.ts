import { ProofKind } from "@prisma/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 140;
const MAX_SUBTITLE_LENGTH = 180;
const MAX_URL_LENGTH = 500;
const MAX_SORT_ORDER = 1000;
const NO_STORE = "no-store, no-cache, must-revalidate";

type ProofPatchInput = {
  title?: string;
  subtitle?: string;
  kind?: string;
  url?: string;
  sortOrder?: string;
  isActive?: string;
  direction?: string;
  intent?: string;
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

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readInput(request: Request): Promise<ProofPatchInput> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as ProofPatchInput;
  }

  const formData = await request.formData();
  return {
    title: getTrimmedString(formData.get("title")),
    subtitle: getTrimmedString(formData.get("subtitle")),
    kind: getTrimmedString(formData.get("kind")),
    url: getTrimmedString(formData.get("url")),
    sortOrder: getTrimmedString(formData.get("sortOrder")),
    isActive: getTrimmedString(formData.get("isActive")),
    direction: getTrimmedString(formData.get("direction")),
    intent: getTrimmedString(formData.get("intent")),
  };
}

async function getCurrentItem(id: string) {
  return prisma.proofItem.findUnique({
    where: { id },
  });
}

async function handlePatchById(id: string, input: ProofPatchInput) {
  const current = await getCurrentItem(id);
  if (!current) {
    return NextResponse.json(
      { error: "Proof item not found." },
      { status: 404, headers: withNoStoreHeaders() }
    );
  }

  if (input.direction === "up" || input.direction === "down") {
    const updated = await prisma.proofItem.update({
      where: { id },
      data: {
        sortOrder: input.direction === "up" ? current.sortOrder - 1 : current.sortOrder + 1,
      },
    });

    return NextResponse.json(updated, { headers: withNoStoreHeaders() });
  }

  const title = input.title !== undefined ? getTrimmedString(input.title) : current.title;
  const subtitle =
    input.subtitle !== undefined ? getTrimmedString(input.subtitle) : current.subtitle || "";
  const kindInput = input.kind !== undefined ? getTrimmedString(input.kind) : current.kind;
  const urlInput = input.url !== undefined ? getTrimmedString(input.url) : current.url || "";
  const sortOrderInput =
    input.sortOrder !== undefined ? getTrimmedString(input.sortOrder) : String(current.sortOrder);
  const isActiveInput =
    input.isActive !== undefined ? getTrimmedString(input.isActive) : String(current.isActive);

  const kind = parseProofKind(kindInput);
  const sortOrder = parseSortOrder(sortOrderInput);
  const url = parseOptionalUrl(urlInput);

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

  if (urlInput && !url) {
    return NextResponse.json(
      { error: "URL must be a valid http or https address." },
      { status: 400, headers: withNoStoreHeaders() }
    );
  }

  const updated = await prisma.proofItem.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || null,
      kind,
      url,
      sortOrder,
      isActive: parseIsActive(isActiveInput),
    },
  });

  return NextResponse.json(updated, { headers: withNoStoreHeaders() });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return unauthorisedResponse();
  }

  const { id } = await params;
  const input = await readInput(request);
  return handlePatchById(id, input);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return unauthorisedResponse();
  }

  const { id } = await params;
  const current = await getCurrentItem(id);
  if (!current) {
    return NextResponse.json(
      { error: "Proof item not found." },
      { status: 404, headers: withNoStoreHeaders() }
    );
  }

  await prisma.proofItem.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true }, { headers: withNoStoreHeaders() });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return unauthorisedResponse();
  }

  const { id } = await params;
  const input = await readInput(request);

  if (input.intent === "delete") {
    await prisma.proofItem.delete({ where: { id } });
    const redirectDeleted = NextResponse.redirect(new URL("/admin/proof?deleted=1", request.url));
    redirectDeleted.headers.set("Cache-Control", NO_STORE);
    return redirectDeleted;
  }

  if (input.intent === "toggle") {
    await prisma.proofItem.update({
      where: { id },
      data: {
        isActive: parseIsActive(getTrimmedString(input.isActive)),
      },
    });
    const redirectToggled = NextResponse.redirect(new URL("/admin/proof?saved=1", request.url));
    redirectToggled.headers.set("Cache-Control", NO_STORE);
    return redirectToggled;
  }

  if (input.intent === "reorder") {
    const current = await getCurrentItem(id);
    if (!current) {
      return NextResponse.json(
        { error: "Proof item not found." },
        { status: 404, headers: withNoStoreHeaders() }
      );
    }
    const direction = getTrimmedString(input.direction);
    if (direction === "up" || direction === "down") {
      await prisma.proofItem.update({
        where: { id },
        data: {
          sortOrder: direction === "up" ? current.sortOrder - 1 : current.sortOrder + 1,
        },
      });
    }
    const redirectReordered = NextResponse.redirect(new URL("/admin/proof?saved=1", request.url));
    redirectReordered.headers.set("Cache-Control", NO_STORE);
    return redirectReordered;
  }

  const patchResponse = await handlePatchById(id, input);
  if (patchResponse.status >= 400) {
    return patchResponse;
  }

  const redirectUpdated = NextResponse.redirect(new URL("/admin/proof?saved=1", request.url));
  redirectUpdated.headers.set("Cache-Control", NO_STORE);
  return redirectUpdated;
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkLeadRateLimit } from "@/lib/rate-limit";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_SOURCE_PATH_LENGTH = 200;
const MAX_USER_AGENT_LENGTH = 512;
const MAX_IP_LENGTH = 64;

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
  sourcePath?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isLikelySpamMessage(message: string) {
  const urlMatches = message.match(/(?:https?:\/\/|www\.)/gi)?.length ?? 0;
  if (urlMatches > 2) {
    return true;
  }

  const lower = message.toLowerCase();
  const blockedPhrases = ["guaranteed profit", "forex signal", "buy now", "crypto giveaway"];
  return blockedPhrases.some((phrase) => lower.includes(phrase));
}

function getIpAddress(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "";
  return ip.slice(0, MAX_IP_LENGTH);
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const phone = asTrimmedString(payload.phone);
  const message = asTrimmedString(payload.message);
  const honeypot = asTrimmedString(payload.website);
  const sourcePath = asTrimmedString(payload.sourcePath);

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const requestHeaders = await headers();
  const ipAddress = getIpAddress(requestHeaders);
  const userAgent = (requestHeaders.get("user-agent") || "").slice(0, MAX_USER_AGENT_LENGTH);

  const rateKey = ipAddress || userAgent || "unknown";
  const rateResult = checkLeadRateLimit(rateKey);
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateResult.retryAfterSeconds),
        },
      }
    );
  }

  if (!name || name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail || email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (phone && (!/^[0-9+\-()\s]{7,30}$/.test(phone) || phone.length > MAX_PHONE_LENGTH)) {
    return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
  }

  if (!message || message.length < 10 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "Message must be between 10 and 1200 characters." },
      { status: 400 }
    );
  }

  if (sourcePath.length > MAX_SOURCE_PATH_LENGTH) {
    return NextResponse.json({ error: "Invalid source path." }, { status: 400 });
  }

  if (isLikelySpamMessage(message)) {
    return NextResponse.json({ error: "Message could not be accepted." }, { status: 400 });
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      sourcePath: sourcePath || null,
    },
  });

  return NextResponse.json({ ok: true });
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import {
  SERVICE_AREA_OPTIONS,
  isContactIntent,
  isHospitalityServiceArea,
  isHospitalityServiceType,
  isServiceAreaOption,
} from "@/lib/lead-options";
import { prisma } from "@/lib/prisma";
import { checkLeadSubmissionRateLimit } from "@/lib/rate-limit";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_COMPANY_LENGTH = 120;
const MAX_SERVICE_AREA_LENGTH = 80;
const MAX_EVENT_LOCATION_LENGTH = 160;
const MAX_SOURCE_PATH_LENGTH = 200;
const MAX_USER_AGENT_LENGTH = 512;
const MAX_IP_LENGTH = 64;
const MIN_FORM_SUBMIT_TIME_MS = 3000;
const ALLOWED_SERVICE_AREAS = new Set<string>(SERVICE_AREA_OPTIONS);

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  intent?: unknown;
  serviceArea?: unknown;
  hospitalityServiceType?: unknown;
  eventDate?: unknown;
  eventLocation?: unknown;
  estimatedGuestCount?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
  website?: unknown;
  formStartedAt?: unknown;
  sourcePath?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseEventDate(value: string) {
  if (!value) {
    return { date: null, valid: true };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { date: null, valid: false };
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { date: null, valid: false };
  }

  return { date, valid: true };
}

function parseGuestCount(value: string) {
  if (!value) {
    return { guestCount: null, valid: true };
  }

  const guestCount = Number(value);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100000) {
    return { guestCount: null, valid: false };
  }

  return { guestCount, valid: true };
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

function isLeadStorageConfigured() {
  return Boolean(process.env.PRISMA_POSTGRES_DATABASE_URL?.trim());
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
  const company = asTrimmedString(payload.company);
  const intent = asTrimmedString(payload.intent);
  const serviceArea = asTrimmedString(payload.serviceArea);
  const hospitalityServiceType = asTrimmedString(payload.hospitalityServiceType);
  const eventDateInput = asTrimmedString(payload.eventDate);
  const eventLocation = asTrimmedString(payload.eventLocation);
  const estimatedGuestCountInput = asTrimmedString(payload.estimatedGuestCount);
  const message = asTrimmedString(payload.message);
  const honeypot = asTrimmedString(payload.companyWebsite ?? payload.website);
  const formStartedAtRaw = Number(payload.formStartedAt);
  const sourcePath = asTrimmedString(payload.sourcePath);

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!Number.isFinite(formStartedAtRaw)) {
    return NextResponse.json({ ok: true });
  }

  if (Date.now() - formStartedAtRaw < MIN_FORM_SUBMIT_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  const requestHeaders = await headers();
  const ipAddress = getIpAddress(requestHeaders);
  const userAgent = (requestHeaders.get("user-agent") || "").slice(0, MAX_USER_AGENT_LENGTH);

  const rateResult = checkLeadSubmissionRateLimit(ipAddress || "unknown");
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

  if (company.length > MAX_COMPANY_LENGTH) {
    return NextResponse.json(
      { error: "Company must be 120 characters or fewer." },
      { status: 400 }
    );
  }

  if (!isContactIntent(intent)) {
    return NextResponse.json({ error: "Please select a valid reason." }, { status: 400 });
  }

  if (serviceArea.length > MAX_SERVICE_AREA_LENGTH) {
    return NextResponse.json(
      { error: "Service area must be 80 characters or fewer." },
      { status: 400 }
    );
  }

  if (
    !serviceArea ||
    !isServiceAreaOption(serviceArea) ||
    !ALLOWED_SERVICE_AREAS.has(serviceArea)
  ) {
    return NextResponse.json({ error: "Please select a valid service area." }, { status: 400 });
  }

  const isHospitality = isHospitalityServiceArea(serviceArea);
  let eventDate: Date | null = null;
  let estimatedGuestCount: number | null = null;
  let normalizedHospitalityServiceType: string | null = null;
  let normalizedEventLocation: string | null = null;

  if (isHospitality) {
    if (!hospitalityServiceType || !isHospitalityServiceType(hospitalityServiceType)) {
      return NextResponse.json(
        { error: "Please select a valid hospitality service type." },
        { status: 400 }
      );
    }

    const parsedEventDate = parseEventDate(eventDateInput);
    if (!parsedEventDate.valid) {
      return NextResponse.json({ error: "Please provide a valid event date." }, { status: 400 });
    }

    if (eventLocation.length > MAX_EVENT_LOCATION_LENGTH) {
      return NextResponse.json(
        { error: "Event location must be 160 characters or fewer." },
        { status: 400 }
      );
    }

    const parsedGuestCount = parseGuestCount(estimatedGuestCountInput);
    if (!parsedGuestCount.valid) {
      return NextResponse.json(
        { error: "Estimated guest count must be a positive number." },
        { status: 400 }
      );
    }

    normalizedHospitalityServiceType = hospitalityServiceType;
    eventDate = parsedEventDate.date;
    normalizedEventLocation = eventLocation || null;
    estimatedGuestCount = parsedGuestCount.guestCount;
  }

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: "Message must be 2000 characters or fewer." },
      { status: 400 }
    );
  }

  if (sourcePath.length > MAX_SOURCE_PATH_LENGTH) {
    return NextResponse.json({ error: "Invalid source path." }, { status: 400 });
  }

  if (isLikelySpamMessage(message)) {
    return NextResponse.json({ error: "Message could not be accepted." }, { status: 400 });
  }

  if (!isLeadStorageConfigured()) {
    return NextResponse.json(
      { error: "Enquiry submission is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    const savedLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        intent,
        serviceArea,
        hospitalityServiceType: normalizedHospitalityServiceType,
        eventDate,
        eventLocation: normalizedEventLocation,
        estimatedGuestCount,
        message,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        sourcePath: sourcePath || null,
      },
    });

    await sendLeadNotification({
      leadId: savedLead.id,
      submittedAt: savedLead.createdAt,
      name,
      email,
      phone: phone || null,
      company: company || null,
      intent,
      serviceArea: serviceArea || null,
      hospitalityServiceType: normalizedHospitalityServiceType,
      eventDate,
      eventLocation: normalizedEventLocation,
      estimatedGuestCount,
      message,
    });
  } catch (error) {
    console.error("Lead submission failed", error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Enquiry submission is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    throw error;
  }

  return NextResponse.json({ ok: true });
}

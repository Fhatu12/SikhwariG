import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "sg_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

type AdminSessionPayload = {
  username: string;
  expiresAt: number;
};

function getEnvOrEmpty(name: string) {
  return (process.env[name] ?? "").trim();
}

function getAdminSecret() {
  return getEnvOrEmpty("ADMIN_SESSION_SECRET");
}

function constantTimeEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(encodedPayload: string): AdminSessionPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.username !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function buildToken(username: string, secret: string) {
  const payload: AdminSessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const encodedPayload = encodePayload(payload);
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

function readToken(token: string, secret: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  if (!constantTimeEquals(signature, expectedSignature)) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!payload || payload.expiresAt <= Date.now()) {
    return null;
  }

  return payload;
}

function sanitizeAdminPath(path: string) {
  if (!path.startsWith("/admin")) {
    return "/admin/leads";
  }
  return path;
}

export async function isAdminAuthenticated() {
  const secret = getAdminSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  return Boolean(readToken(token, secret));
}

export async function requireAdmin(nextPath = "/admin/leads") {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect(`/admin/login?next=${encodeURIComponent(sanitizeAdminPath(nextPath))}`);
  }
}

export function validateAdminCredentials(username: string, password: string) {
  const configuredUsername = getEnvOrEmpty("ADMIN_USERNAME");
  const configuredPassword = getEnvOrEmpty("ADMIN_PASSWORD");

  if (!configuredUsername || !configuredPassword) {
    return false;
  }

  return (
    constantTimeEquals(username.trim(), configuredUsername) &&
    constantTimeEquals(password, configuredPassword)
  );
}

export async function setAdminSession(username: string) {
  const secret = getAdminSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: buildToken(username, secret),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSafeAdminNextPath(input: FormDataEntryValue | null) {
  if (typeof input !== "string" || !input.trim()) {
    return "/admin/leads";
  }
  return sanitizeAdminPath(input);
}

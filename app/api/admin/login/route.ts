import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getSafeAdminNextPath,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { checkAdminLoginRateLimit } from "@/lib/rate-limit";

const MAX_IP_LENGTH = 64;

function getIpAddress(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "";
  return ip.slice(0, MAX_IP_LENGTH);
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const ipAddress = getIpAddress(requestHeaders);

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeAdminNextPath(formData.get("next"));

  const rateResult = checkAdminLoginRateLimit({ ipAddress, username });
  if (!rateResult.allowed) {
    console.warn(
      `[admin-login] blocked ip=${ipAddress || "unknown"} username=${username || "unknown"} reason=${rateResult.reason}`
    );
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateResult.retryAfterSeconds),
        },
      }
    );
  }

  if (!validateAdminCredentials(username, password)) {
    console.warn(
      `[admin-login] invalid credentials ip=${ipAddress || "unknown"} username=${username || "unknown"}`
    );
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("error", "invalid");
    redirectUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirectUrl);
  }

  const sessionToken = createAdminSessionToken(username);
  if (!sessionToken) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("error", "missing-env");
    redirectUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

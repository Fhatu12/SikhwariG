import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getSafeAdminNextPath,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeAdminNextPath(formData.get("next"));

  if (!validateAdminCredentials(username, password)) {
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

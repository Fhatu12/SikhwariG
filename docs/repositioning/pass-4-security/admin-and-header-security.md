# Pass 4B Admin and Header Security

Date: 2026-08-08

Reviewed files: `lib/admin-auth.ts`, `app/admin/(protected)/layout.tsx`, `app/admin/(protected)/leads/page.tsx`, `app/api/admin/login/route.ts`, `app/api/admin/logout/route.ts`, `app/sitemap.ts`, `next.config.ts`.

## Verdict

PASS WITH NOTES.

Admin lead data remains server-protected, absent from sitemap and covered by no-store/private headers. Browser security headers are present in local production-mode checks.

## Admin/Auth Findings

- Protected admin layout calls `requireAdmin()` server-side.
- Admin leads page calls `requireAdmin("/admin/leads")` before querying lead records.
- Unauthenticated local request to `/admin/leads` returned a redirect to `/admin/login?next=%2Fadmin%2Fleads`.
- Admin session cookie is HttpOnly, SameSite=Lax, production-secure and HMAC-signed.
- Admin credentials and session secret are environment-backed.
- Admin login has IP/username rate limiting and a hard IP lockout.
- No public route or new hospitality API exposes stored leads.
- No direct object route was added for public lead access.
- `app/sitemap.ts` includes public/legal routes only; admin routes are not indexed through sitemap.

## Header Findings

Local production-mode responses included:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

Admin responses also included:

- `Cache-Control: no-store, no-cache, must-revalidate`

## Notes

- CSP includes `'unsafe-inline'` for scripts/styles. This matches the current Next/Tailwind application constraints and no new third-party runtime scripts were added, but stricter CSP nonce/hash hardening can be considered later.
- Admin state-changing POST routes rely on SameSite=Lax cookies and same-origin form/API use rather than explicit CSRF tokens. This is not a blocker for the current stage, but should be reviewed before expanding admin workflows or users.

# Pass 4B Threat Boundary Review

Date: 2026-08-08

Starting HEAD: `bc580a1`

Scope: security/compliance evidence review for the repositioned public site and hospitality enquiry data flow. No Production data, secrets, deployment, public offensive testing or environment values were accessed.

## Verdict

PASS WITH NOTES.

No material security/privacy blocker was found for moving to DevOps-owned Preview/Staging validation. Remaining risks are release-readiness and hardening notes, not blockers for the next environment.

## Boundaries

| Boundary                              | Input                                                 | Protected data                                                | Trust assumption                                                                              | Abuse case                                                                       | Existing control                                                                                                                   | Remaining risk                                                                                                   |
| ------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Browser -> public enquiry form        | Public form fields and conditional hospitality fields | User-entered personal/business data before submission         | Browser is untrusted; client validation is convenience only                                   | Tampered options, stale hidden hospitality values, script-like text              | Client length limits, allow-list options, hidden honeypot, conditional omission of hospitality values for non-hospitality payloads | Client controls can be bypassed, so server validation remains the source of truth                                |
| Browser -> `/api/leads`               | JSON body, headers, source path                       | Lead payload, IP address, user agent                          | Requests are untrusted and public                                                             | Spam, malformed JSON, invalid service labels, oversized fields, rapid submission | JSON parse handling, honeypot/timing controls, rate limit, server allow-lists, length caps, generic validation errors              | In-memory rate limit is per runtime instance; no explicit route body-size config beyond platform/default parsing |
| API -> validation                     | Normalized strings/numbers/dates                      | Data integrity before persistence/email                       | Validation must reject or normalize unsafe values                                             | Unsafe guest count/date/type, stale hospitality data on other services           | Server validators in `app/api/leads/route.ts` and shared allow-lists in `lib/lead-options.ts`                                      | Future fields must be added to server validation before persistence                                              |
| API -> Prisma/PostgreSQL              | Validated lead data                                   | Lead records, IP/user-agent metadata                          | Prisma client parameterizes writes; DB URL comes from env                                     | SQL injection or destructive schema change                                       | Prisma `lead.create`, no raw SQL in API, additive nullable migration                                                               | Real Preview/Staging migration and DB-backed E2E remain DevOps-owned                                             |
| API -> SMTP/Zoho                      | Saved lead notification                               | SMTP credentials, enquiry content in internal email           | SMTP config is environment-controlled; customer only controls reply-to after email validation | Header injection, arbitrary recipients, unsafe HTML                              | Controlled from/to/subject, validated reply-to, CRLF checks on config fields, HTML escaping, safe SMTP diagnostics                 | Notification content necessarily contains submitted lead details for internal handling                           |
| Browser -> protected admin routes     | Admin cookie and route requests                       | Lead database records and proof/service/post admin data       | Admin routes must be server-gated                                                             | Direct URL access, indexed admin pages                                           | `requireAdmin`, HttpOnly signed cookie, no-store admin headers, admin absent from sitemap                                          | Admin state-changing routes rely on SameSite=Lax cookies rather than explicit CSRF tokens                        |
| Admin -> stored lead data             | Authenticated admin views and selected lead ID        | Lead PII, message, IP address, user agent, hospitality fields | Authenticated admin is authorized to view lead inbox                                          | ID probing after auth, accidental public exposure                                | Server-side `requireAdmin`, Prisma queries only in protected route, React escaping                                                 | Admin operational controls and account governance remain outside repo review                                     |
| Vercel runtime -> environment secrets | Runtime env variable reads                            | DB URL, admin password/session secret, SMTP credentials       | Values are managed outside source control                                                     | Secret leakage in source, docs or logs                                           | Env names only in code/docs, placeholder `.env.example`, SMTP logs omit secrets                                                    | Do not print env values during Preview/Staging validation                                                        |

## Security-Sensitive Files Reviewed

- `components/forms/contact-form.tsx`
- `app/api/leads/route.ts`
- `lib/lead-options.ts`
- `lib/rate-limit.ts`
- `lib/email/lead-notification.ts`
- `prisma/schema.prisma`
- `prisma/migrations/20260808120000_add_hospitality_lead_fields/migration.sql`
- `app/admin/(protected)/layout.tsx`
- `app/admin/(protected)/leads/page.tsx`
- `app/api/admin/login/route.ts`
- `lib/admin-auth.ts`
- `next.config.ts`
- `app/sitemap.ts`
- `app/layout.tsx`
- `components/layout/site-footer.tsx`
- `app/legal/privacy/page.tsx`
- `lib/public-content.ts`
- `lib/service-content.ts`

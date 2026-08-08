# Pass 4B Lead API Security Review

Date: 2026-08-08

Reviewed files: `app/api/leads/route.ts`, `components/forms/contact-form.tsx`, `lib/lead-options.ts`, `app/api/leads/route.test.ts`.

## Verdict

PASS WITH NOTES.

The lead API validates the public payload server-side, persists only normalized fields, uses Prisma client writes and returns generic errors. No material injection or data-boundary blocker was found.

## Accepted Fields

| Field                        | Control                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `name`                       | Required; trimmed; max 80                                                          |
| `email`                      | Required; regex checked; max 120                                                   |
| `phone`                      | Optional; phone-character pattern; max 30                                          |
| `company`                    | Optional; max 120                                                                  |
| `intent`                     | Required allow-list                                                                |
| `serviceArea`                | Required allow-list; max 80                                                        |
| `hospitalityServiceType`     | Required only for hospitality; allow-list only                                     |
| `eventDate`                  | Optional; `YYYY-MM-DD`; parsed as UTC date                                         |
| `eventLocation`              | Optional; max 160                                                                  |
| `estimatedGuestCount`        | Optional; integer 1 through 100000                                                 |
| `message`                    | Required; max 2000; simple spam screening                                          |
| `sourcePath`                 | Optional; max 200                                                                  |
| `companyWebsite` / `website` | Honeypot; returns success without persistence when filled                          |
| `formStartedAt`              | Timing control; invalid or too-fast submissions return success without persistence |

## Findings

- Server-side validation exists for all common and hospitality additions.
- Service area and hospitality service type are allow-listed in shared code.
- Stale hospitality values do not affect non-hospitality leads. The client omits them, and the API normalizes hospitality fields to `null` unless the service area is `Culinary and Hospitality Services`.
- Unexpected extra fields are ignored because persistence uses an explicit Prisma `data` object.
- Prisma `lead.create` is used; no raw dynamic SQL exists in the lead route.
- Validation errors are generic and do not echo submitted names, messages, phone numbers or event locations.
- A local API check returned `400` for a benign invalid email payload with a safe error string.
- A local valid non-hospitality payload containing stale hospitality fields returned the expected local `503` because no database env was configured; it did not attempt Production DB access.

## XSS / HTML Injection

- Public form errors and success text are fixed strings or server generic errors rendered through React escaping.
- Admin lead display renders stored values as React text nodes; no `dangerouslySetInnerHTML` was found.
- Notification HTML escapes every label and user value through `escapeHtml`.
- Tests include a benign script-like message check and confirm the notification HTML does not contain raw script markup.
- Selected Work and public content are static content arrays rendered through React components.
- Query/service preselection is normalized through allow-list helpers before use.

## Abuse Controls

- Lead submissions are rate-limited by IP to 5 per hour in `lib/rate-limit.ts`.
- Honeypot and minimum form-fill timing checks remain in front of validation/persistence.
- Message spam heuristics reject high URL density and blocked phrases.
- Request field lengths bound stored content after JSON parsing.

Remaining note: the rate limiter is in-memory and therefore best-effort per runtime instance. The route also relies on framework/platform request body parsing limits rather than declaring an explicit API body-size limit. These are proportionate for the current public-site stage, but should be revisited before higher-risk or high-volume operation.

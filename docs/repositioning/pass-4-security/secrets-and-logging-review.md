# Pass 4B Secrets and Logging Review

Date: 2026-08-08

Reviewed files: `.env.example`, `app/api/leads/route.ts`, `app/api/admin/login/route.ts`, `lib/admin-auth.ts`, `lib/email/lead-notification.ts`, relevant tests and tracked docs.

## Verdict

PASS WITH NOTES.

No committed secret values were found in tracked source/docs during the scoped scan. Env variable names and placeholders appear where operationally useful. Runtime logging is mostly safe and structured, with one hardening note for unexpected lead persistence errors.

## Scoped Secret Scan

Tracked-source scan patterns covered private keys, common cloud/API tokens, SMTP password assignments, database URL assignments and admin session secret assignments.

Matches were limited to:

- `.env.example` placeholders
- test-only placeholder values for SMTP/database configuration
- documentation examples that redact values with ellipses/placeholders

The untracked `npm-audit.json` and `npm-audit.after.json` files were not modified.

## Environment Handling

- `PRISMA_POSTGRES_DATABASE_URL` is read from environment and is not hard-coded.
- SMTP credentials are read from environment and are not printed by SMTP diagnostics.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are read from environment.
- `.env.example` uses placeholder values only.
- Pass 4B commands did not print local environment variable values.

## Logging Review

| Area                        | Finding                                                         |
| --------------------------- | --------------------------------------------------------------- |
| SMTP disabled               | Logs event name and missing env variable names only             |
| SMTP send success           | Logs counts, response code and message-id presence only         |
| SMTP send failure           | Logs code, command, response code and error name only           |
| Lead validation             | Returns generic messages without submitted values               |
| Lead storage unavailable    | Returns generic `503` without DB internals                      |
| Admin login invalid/blocked | Logs IP and submitted username for audit/rate-limit diagnostics |

## Hardening Notes

- `app/api/leads/route.ts` logs the raw unexpected `error` object with `console.error("Lead submission failed", error)` before rethrowing non-initialization failures. This does not expose details publicly, and ordinary validation paths do not log submitted enquiry content, but a later hardening slice should consider structured safe logging for unexpected persistence failures.
- Admin login warnings include the submitted username. This is useful for account security diagnostics, but operations should treat runtime logs as sensitive.

No secret values or customer records are included in this evidence.

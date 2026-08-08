# Pass 4B SMTP and Database Security

Date: 2026-08-08

Reviewed files: `lib/email/lead-notification.ts`, `app/api/leads/route.ts`, `prisma/schema.prisma`, `prisma/migrations/20260808120000_add_hospitality_lead_fields/migration.sql`.

## Verdict

PASS WITH NOTES.

SMTP and database flows preserve controlled trust boundaries. No Production SMTP or database connection was used in this pass.

## SMTP Notification Findings

- From address is controlled by `LEAD_NOTIFICATION_FROM`.
- To address is controlled by `LEAD_NOTIFICATION_TO`.
- Customer input cannot add recipients.
- Subject is fixed: `New Sikhwari Group website enquiry`.
- Reply-To uses the customer email only after API email validation.
- SMTP config values used in headers are rejected if they contain CRLF characters.
- From/to values must match the internal email validation helper.
- HTML notification content escapes labels and all user-supplied values.
- Plain text notification contains submitted lead details by design for internal handling.
- SMTP send failure is non-fatal after database persistence.
- SMTP diagnostics avoid credentials and customer content.

## Database Findings

- The app uses PostgreSQL through Prisma with `PRISMA_POSTGRES_DATABASE_URL`.
- No SQLite datasource regression was found.
- Lead persistence uses Prisma client `lead.create`.
- The lead route does not build raw SQL strings.
- Hospitality fields are explicitly mapped after validation/normalization.
- No Production migration or live database command was run.

## Migration Review

Migration: `prisma/migrations/20260808120000_add_hospitality_lead_fields/migration.sql`

Findings:

- additive only
- nullable fields only
- no destructive operations
- no privilege changes
- no raw dynamic SQL
- no sensitive defaults
- existing `Lead` rows remain valid

## Local Validation

- `PRISMA_POSTGRES_DATABASE_URL=... npx prisma validate` passed with a placeholder local URL.
- `PRISMA_POSTGRES_DATABASE_URL=... npx prisma generate` passed with a placeholder local URL.
- Local built app returned expected `503` for a synthetically valid lead submission because no real database env was configured.

Preview/Staging DB migration and a real DB-backed lead test remain DevOps-owned release gates.

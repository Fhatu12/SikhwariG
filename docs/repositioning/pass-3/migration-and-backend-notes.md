# Migration and Backend Notes

## Migration

Migration file:

`prisma/migrations/20260808120000_add_hospitality_lead_fields/migration.sql`

The migration is additive and nullable:

- adds `hospitalityServiceType`
- adds `eventDate`
- adds `eventLocation`
- adds `estimatedGuestCount`

No existing migration was edited.

## Local Validation

`npx prisma generate` succeeded.

`npx prisma validate` requires `PRISMA_POSTGRES_DATABASE_URL`. The first run failed because the variable is not available in the shell. Validation should be run with a safe local/dummy value or in an environment where the variable is configured. No production database command was run.

## Backend Contract

The API keeps existing anti-spam, timing, rate-limit, validation and database-unavailable behaviour.

SMTP notification failure remains non-fatal after successful database insert. Notification diagnostic logs continue to avoid customer content and secret values.

## Admin

The protected lead detail view displays hospitality fields for authorised admin users only. Public pages do not expose lead data.

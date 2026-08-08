# API and Data Validation

## Automated Tests

`npm test` passed:

- 3 test files
- 20 tests

Coverage includes:

- valid lead behaviour
- invalid lead behaviour
- hospitality field persistence mapping
- stale hospitality field normalisation for non-hospitality submissions
- invalid hospitality validation
- notification content mapping
- SMTP failure remaining non-fatal after database persistence
- no customer data in diagnostic logs

## Direct Local API Checks

The local built app was tested without a database connection:

| Scenario                         | Result                                                       |
| -------------------------------- | ------------------------------------------------------------ |
| Invalid email payload            | `400` with safe validation error                             |
| Invalid hospitality service type | `400` with safe validation error                             |
| Valid hospitality payload        | `503` because no non-production DB connection was configured |

The `503` for a valid payload is expected in this local shell because `PRISMA_POSTGRES_DATABASE_URL` was not configured. No production or external database was used.

## Prisma and Migration

Migration reviewed:

`prisma/migrations/20260808120000_add_hospitality_lead_fields/migration.sql`

Findings:

- additive migration
- no destructive column or data changes
- all added fields nullable
- existing `Lead` records remain valid
- no already-applied migration was edited
- Prisma schema matches migration intent

Safe validation:

- `PRISMA_POSTGRES_DATABASE_URL=... npx prisma validate` passed with a one-command dummy local URL.
- `npx prisma generate` passed.

## Notification Mapping

Tests confirm:

- Hospitality email content includes service type, event date, event location and estimated guest count when present.
- Non-Hospitality notification content omits stale hospitality-only values.
- Reply-To behaviour remains customer email only.
- SMTP failure does not convert a successfully persisted lead into API failure.
- Credential values and customer message data are not logged by notification diagnostics.

No live SMTP mail was sent.

# Pass 5A Preview Database Isolation

Date: 2026-08-08

## Verdict

BLOCKED_PREVIEW_DB_ISOLATION.

Safe comparison of Preview and Production database identities concluded:

```text
PREVIEW_DB_PRESENT=true
PRODUCTION_DB_PRESENT=true
PREVIEW_DB_ISOLATED=false
```

## Method

- Vercel environment-variable names and targets were inspected without recording values.
- Because metadata showed the Prisma database URL variable targeted to both Preview and Production, metadata alone was insufficient to prove isolation.
- Temporary permission-restricted local env pulls were used only to compare database identity.
- Connection strings were not printed, stored in tracked files, included in documentation or included in summary output.
- Temporary files containing pulled env values were deleted immediately after comparison.

## Finding

Preview and Production resolved to the same database identity for `PRISMA_POSTGRES_DATABASE_URL`.

This violates the Pass 5A hard gate requiring an isolated non-production database before migration or synthetic DB-backed enquiry validation.

## Stop Condition Applied

Because `PREVIEW_DB_ISOLATED=false`:

- no Preview migration was run
- no Preview deployment was created
- no route smoke tests were run against a new Preview deployment
- no synthetic enquiry was submitted
- no database rows were inspected or written
- no new external database was created automatically
- Production remained untouched

## Required Decision

Product Owner / DevOps must provision or designate a genuinely isolated Preview/Staging PostgreSQL database and configure Preview to use it before Pass 5A can continue.

The new database must not be shared with Production and must be validated again before any migration or E2E lead test.

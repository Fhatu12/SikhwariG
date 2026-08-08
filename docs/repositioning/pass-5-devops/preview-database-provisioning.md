# Preview Database Provisioning

Date: 2026-08-08

## Verdict

PASS WITH NOTES.

A separate Vercel Prisma Postgres resource was provisioned for Preview on the Free plan and connected to the `sikhwarig` project for Preview only.

## Cost Gate

`FREE_RESOURCE_AVAILABLE`

Evidence:

- Vercel CLI showed Prisma Postgres billing plan `free` as available.
- New resource was created with `--plan free`.
- No paid plan, billing change or owner/MFA approval prompt was accepted.

## Resource

- Resource name: `SikhwariG-Preview`
- Product: Prisma Postgres
- Plan: Free
- Region: `iad1`
- Status: Available
- Connected project: `sikhwarig`
- Environment target: Preview

No Production data was copied into Preview.

## Targeting Changes

Preview:

- New Preview Prisma Postgres integration created generic Preview DB variables.
- Preview-only app alias `PRISMA_POSTGRES_DATABASE_URL` was added/overwritten from the new Preview database variable without printing its value.

Production:

- Production aliases and deployment remained healthy.
- Production app alias `PRISMA_POSTGRES_DATABASE_URL` was restored/confirmed for Production-only future builds from the existing Production DB variable without printing its value.
- Production SMTP configuration was not changed.

## Notes

The older Production Prisma resource still appears as connected to the project in provider metadata, while current Vercel environment targeting now separates the app-specific Preview and Production database variables. The old resource was not disconnected globally because the available CLI disconnect command is project-scoped, not environment-scoped, and could affect Production.

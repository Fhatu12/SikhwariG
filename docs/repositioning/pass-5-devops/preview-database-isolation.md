# Pass 5A Preview Database Isolation

Date: 2026-08-08

## Verdict

PASS WITH NOTES.

The original Preview/Production shared database issue was corrected by provisioning a new Preview Prisma Postgres resource and retargeting Preview database environment variables.

## Safe Isolation Evidence

Safe metadata and local comparisons showed:

- Existing Production Prisma resource remains the Production database resource.
- New Preview resource `SikhwariG-Preview` is separate from the existing Production resource.
- Preview generic database URL and Production generic database URL compare as distinct.
- Preview schema started empty, with all four migrations pending before Preview migration deployment.
- Preview-only synthetic lead was found exactly once in the Preview database after E2E.

Safe result:

```text
PREVIEW_DB_ISOLATED=true
```

## Method

- Vercel integration resources and environment-variable targets were inspected without recording values.
- Temporary permission-restricted env pulls were used for equality checks and migration/E2E verification.
- Connection strings were not printed, committed or documented.
- Temporary files containing pulled env values were deleted immediately after use.

## Limitations

Vercel `env pull` returns the app-specific sensitive `PRISMA_POSTGRES_DATABASE_URL` as opaque secret material, so direct value comparison for that sensitive alias was not usable. Isolation was proven through separate resource identity, distinct generic database values, empty Preview migration baseline and Preview-only persistence verification.

Direct Production row lookup for the Preview synthetic email was not available locally because Production pulled database values are opaque for local Prisma usage. Production contamination is therefore assessed from separate resource targeting plus Preview-only persistence, not from a direct Production row query.

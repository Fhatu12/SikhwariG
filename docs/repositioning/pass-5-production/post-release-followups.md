# Post-Release Follow-Ups

Date: 2026-08-08

These items are not silent release scope expansions. They remain post-release follow-ups unless new evidence makes one material.

## Priority

1. Confirm mailbox receipt for the synthetic Production release enquiry.
2. Decide whether Preview SMTP should remain disabled or receive non-Production-safe test credentials later.
3. Perform a direct Production one-record non-contamination check through an approved admin/DB access path if stricter evidence is required.

## Existing Follow-Ups

- Preview SMTP posture
- privacy/legal wording
- legal page H1 structure
- repo-wide formatting cleanup
- image optimisation warnings
- shared/distributed rate limiting
- request body-size hardening
- admin CSRF hardening
- CSP inline allowance review
- raw unexpected lead-error logging hardening
- dependency/dev-tooling cleanup

## Reusable Knowledge

- Vercel build cache can preserve stale generated Prisma client output. Production build wrapper now explicitly runs Prisma client generation before Next build.
- The hospitality migration is additive and nullable, so application rollback should leave added columns in place.
- Preview database isolation was closed in the post-release DevOps infrastructure pass by provisioning and validating `SikhwariG-Preview`.

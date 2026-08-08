# Post-Release Follow-Ups

Date: 2026-08-08

These items are not silent release scope expansions. They remain post-release follow-ups unless new evidence makes one material.

## Priority

1. Provision an isolated Preview/Staging database and re-run Preview validation.
2. Decide Preview SMTP posture.
3. Confirm mailbox receipt for the synthetic Production release enquiry.
4. Perform a direct one-record persistence check through an approved admin/DB access path if stricter evidence is required.

## Existing Follow-Ups

- isolated Preview database
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
- Preview database isolation is still open and must not be treated as resolved by this Production release.

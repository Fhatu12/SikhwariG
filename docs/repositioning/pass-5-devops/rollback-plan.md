# Pass 5A Rollback Plan

Date: 2026-08-08

## Verdict

ROLLBACK PLAN READY IN PRINCIPLE; RELEASE BLOCKED.

The application/database change is rollback-friendly because the migration is additive and nullable, but Production release cannot proceed until Preview isolation is corrected and validated.

## Migration Compatibility

Old Production application code plus new nullable hospitality columns is backward compatible:

- old code does not need to read the new columns
- old code can continue creating existing lead records
- nullable columns do not require values for existing or future old-code inserts
- leaving unused additive columns is safer during emergency rollback than destructive rollback

## Database Rollback Implications

Do not automatically write or run a destructive down migration.

If an application rollback is required after Production migration:

- roll back/redeploy the previous known-good application deployment
- leave additive nullable columns in place
- investigate separately before any database intervention

Database intervention is required only if:

- an unexpected destructive migration was applied
- schema drift blocks the previous known-good app
- data corruption or access-control issue is confirmed
- legal/compliance owner requires specific data handling action

## Rollback Scenarios

| Scenario                           | Response                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| Deployment/build failure           | Do not promote; keep previous Production deployment serving                              |
| Post-release functional regression | Roll back/redeploy previous known-good Production deployment                             |
| SMTP issue                         | Keep DB persistence as primary; disable/fix SMTP config if needed without deleting leads |
| Lead API issue                     | Roll back app deployment; preserve additive columns; verify lead capture health          |

## Mechanism

Use Vercel rollback/redeployment to restore the previous known-good Production deployment. Do not promote Preview or modify Production aliases during Pass 5A.

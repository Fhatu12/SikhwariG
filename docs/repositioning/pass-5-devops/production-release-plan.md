# Pass 5A Production Release Plan

Date: 2026-08-08

## Production Status

Production release remains NOT APPROVED.

Pass 5A is blocked before Preview/Staging validation, so no Production deployment sequence may be executed yet.

## Build Wrapper Assessment

`vercel.json` uses:

```json
{ "buildCommand": "npm run vercel-build" }
```

`npm run vercel-build` runs `scripts/devops/vercel-build.mjs`.

The wrapper behavior remains:

- detect `VERCEL_ENV`
- require `PRISMA_POSTGRES_DATABASE_URL` for Production
- run `npx prisma migrate deploy` only when `VERCEL_ENV=production`
- run `npm run build` after migration handling
- skip Prisma migrations for non-Production Vercel environments

## Intended Future Production Sequence

Only after Product Owner approval and successful isolated Preview validation:

1. Deploy the approved commit to Production.
2. Observe the additive migration during Production build.
3. Complete the Next.js build.
4. Allow Vercel to switch traffic only after successful deployment readiness.
5. Run bounded post-deploy smoke tests.

## Expected Failure Behavior

- If Production migration fails during build, the new deployment should not become the successful Production release.
- Existing Production deployment should remain available for rollback/redeployment.
- If the app build fails, the deployment should not become READY.
- If post-release smoke checks fail, use the rollback plan without attempting destructive database rollback for the additive nullable columns.

## Current Blocker

The current Preview database is not isolated from Production. Production release planning cannot advance to approval until Preview/Staging validation is repeated against an isolated database.

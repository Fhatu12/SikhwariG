# Production Release Baseline

Date: 2026-08-08

## Approval

Production release was explicitly approved for the Sikhwari Group corporate website repositioning.

Known accepted residual risk: Pass 5A could not validate against Preview because Preview and Production resolve to the same Prisma database identity. This remains an open post-release infrastructure follow-up and is not marked resolved.

## Starting State

- Branch: `master`
- Starting HEAD: `a8e3093`
- Expected state: `master...origin/master [ahead 7]`
- Actual baseline matched expected state.
- Expected untracked files only: `npm-audit.json`, `npm-audit.after.json`

## Final Local Gates Before Push

| Gate                  | Result                                 |
| --------------------- | -------------------------------------- |
| `npm test`            | Passed: 3 files, 20 tests              |
| `npm run typecheck`   | Passed                                 |
| `npm run lint`        | Passed with two known `<img>` warnings |
| `npm run build`       | Passed                                 |
| `npx prisma generate` | Passed with placeholder local DB URL   |
| `npx prisma validate` | Passed with placeholder local DB URL   |
| `git diff --check`    | Passed                                 |

## Readiness Checks

- Vercel project confirmed: `fhatu12s-projects/sikhwarig`.
- Production environment exists.
- Required Production variable names exist for Prisma/PostgreSQL and SMTP notification.
- Values were not recorded.
- Production build wrapper still runs `prisma migrate deploy` only when `VERCEL_ENV=production`.
- Migration reviewed: `20260808120000_add_hospitality_lead_fields`.
- Migration is additive and nullable for Lead hospitality columns only.

## Rollback Baseline

Previous known-good Production deployment:

- Deployment ID: `dpl_An65q5Nx39Zu8FadgPJ5hK3Sn4GU`
- Deployment URL: `https://sikhwarig-252r9hifn-fhatu12s-projects.vercel.app`
- State: READY
- Aliases before release included `https://www.sikhwarigroup.co.za` and `https://sikhwarig.vercel.app`.

Database rollback strategy: do not remove additive nullable columns during application rollback. Old application code remains compatible with the additional nullable columns.

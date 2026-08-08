# Pass 5A Environment Readiness

Date: 2026-08-08

Starting HEAD: `cbc74db`

Branch: `master`

Project inspected: `fhatu12s-projects/sikhwarig`

## Verdict

BLOCKED.

Local gates passed and Vercel project linkage was confirmed, but Preview database isolation failed. No migration, Preview deployment, smoke test or synthetic lead submission was performed.

## Local Baseline

- Branch: `master`
- Starting HEAD: `cbc74db`
- Starting origin relationship: `master...origin/master [ahead 6]`
- Untracked files at baseline: `npm-audit.json`, `npm-audit.after.json`
- Application source changes during this pass: none

## Local Gates

| Gate                                                   | Result                                  |
| ------------------------------------------------------ | --------------------------------------- |
| `npm test`                                             | Passed: 3 files, 20 tests               |
| `npm run typecheck`                                    | Passed                                  |
| `npm run lint`                                         | Passed with 2 existing `<img>` warnings |
| `npm run build`                                        | Passed                                  |
| `PRISMA_POSTGRES_DATABASE_URL=... npx prisma validate` | Passed with placeholder local URL       |
| `PRISMA_POSTGRES_DATABASE_URL=... npx prisma generate` | Passed with placeholder local URL       |
| `git diff --check`                                     | Passed                                  |

## Vercel Linkage

- Existing linked Vercel project confirmed through local linkage metadata.
- Project name confirmed through Vercel CLI: `sikhwarig`.
- Team/account scope confirmed: `fhatu12s-projects`.
- Production environment exists.
- Preview environment exists.
- Production aliases were not modified.
- Master was not pushed.
- Production was not deployed.

## Environment Variable Name Readiness

Values were not recorded.

| Variable name                  | Preview     | Production | Sensitive where discoverable |
| ------------------------------ | ----------- | ---------- | ---------------------------- |
| `PRISMA_POSTGRES_DATABASE_URL` | Present     | Present    | Yes                          |
| `SMTP_HOST`                    | Not present | Present    | No                           |
| `SMTP_PORT`                    | Not present | Present    | No                           |
| `SMTP_SECURE`                  | Not present | Present    | No                           |
| `SMTP_USER`                    | Not present | Present    | No                           |
| `SMTP_PASSWORD`                | Not present | Present    | Yes                          |
| `LEAD_NOTIFICATION_FROM`       | Not present | Present    | No                           |
| `LEAD_NOTIFICATION_TO`         | Not present | Present    | No                           |

## Readiness Result

- Production env presence for the required DB/SMTP names is confirmed.
- Preview DB env presence is confirmed.
- Preview SMTP is not configured.
- Preview DB isolation failed, so environment readiness is blocked before migration or E2E validation.

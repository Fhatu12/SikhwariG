# npm audit dependency-risk report (2026-05-27)

Repo: `SikhwariG` (`sikhwarig-app@0.1.0`)

This is a read-only investigation pass (no upgrades applied).

## Evidence captured

- `npm audit` output recorded in terminal history.
- `npm audit --json > npm-audit.json` (artifact kept for follow-up work).

## Summary totals (from `npm-audit.json`)

- Total: **14** ( **10 high**, **4 moderate**, **0 critical/low** )
- Dependency graph size: 52 prod / 548 dev / 640 total (npm metadata)

## Vulnerability inventory (all 14)

Legend:
- Direct? = direct dependency of this repo (`package.json`)
- Runtime? = reachable from `npm ls --omit=dev` (i.e., in the production dependency tree)

### High (10)

1) `next` (direct, runtime)
- Severity: high (multiple advisories)
- Affected range: `9.3.4-canary.0 - 16.3.0-canary.5` (repo currently `16.1.6`)
- Fix available: **yes** (npm suggests `next@16.2.6`, non-major)
- Runtime chain:
  - `next@16.1.6` (direct dependency)

2) `prisma` (direct, runtime)
- Severity: high
- Affected range: `6.13.0-dev.1 - 6.19.2 || 6.20.0-dev.1 - 7.6.0-integration-feat-prisma-bootstrap.13` (repo currently `6.16.0`)
- Fix available: **yes**
- Runtime chain:
  - `prisma@6.16.0` (direct dependency)

3) `@prisma/config` (transitive, runtime)
- Severity: high
- Affected range: same family range as `prisma` (currently `@prisma/config@6.16.0`)
- Fix available: **yes**
- Runtime chain:
  - `prisma@6.16.0 -> @prisma/config@6.16.0`

4) `effect` (transitive, runtime)
- Severity: high
- Affected range: `<3.20.0` (currently `3.16.12`)
- Fix available: **yes**
- Runtime chain:
  - `prisma@6.16.0 -> @prisma/config@6.16.0 -> effect@3.16.12`

5) `defu` (transitive, runtime)
- Severity: high
- Affected range: `<=6.1.4` (currently `6.1.4`)
- Fix available: **yes**
- Runtime chain:
  - `prisma@6.16.0 -> @prisma/config@6.16.0 -> c12@3.1.0 -> defu@6.1.4`

6) `basic-ftp` (transitive, dev-only)
- Severity: high
- Affected range: `<=5.3.0` (currently `5.2.0`)
- Fix available: **yes**
- Dev chain:
  - `md-to-pdf@5.2.5 -> puppeteer -> @puppeteer/browsers -> proxy-agent -> pac-proxy-agent -> get-uri -> basic-ftp@5.2.0`

7) `minimatch` (transitive, dev-only)
- Severity: high
- Affected range: `<=3.1.3 || 10.0.0 - 10.2.2` (currently `3.1.2`, `3.1.3`, `10.2.2`)
- Fix available: **yes**
- Dev chains (examples):
  - `eslint@9.39.3 -> minimatch@3.1.3`
  - `eslint-config-next -> typescript-eslint -> @typescript-eslint/typescript-estree -> minimatch@10.2.2`
  - `md-to-pdf -> serve-handler@6.1.6 -> minimatch@3.1.2`

8) `picomatch` (transitive, dev-only)
- Severity: high
- Affected range: `<=2.3.1 || 4.0.0 - 4.0.3` (currently `2.3.1`, `4.0.3`)
- Fix available: **yes**
- Dev chains (examples):
  - `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> picomatch@2.3.1`
  - `eslint-config-next -> eslint-import-resolver-typescript -> tinyglobby -> picomatch@4.0.3`
  - `md-to-pdf -> chokidar -> anymatch -> picomatch@2.3.1`

9) `flatted` (transitive, dev-only)
- Severity: high
- Affected range: `<=3.4.1` (currently `3.3.3`)
- Fix available: **yes**
- Dev chain:
  - `eslint@9.39.3 -> file-entry-cache -> flat-cache -> flatted@3.3.3`

10) `serve-handler` (transitive, dev-only)
- Severity: high
- Affected range: `1.1.0 - 6.1.6` (currently `6.1.6`)
- Fix available: **yes**
- Dev chain:
  - `md-to-pdf@5.2.5 -> serve-handler@6.1.6`

### Moderate (4)

11) `postcss` (transitive, runtime)
- Severity: moderate
- Affected range: `<8.5.10` (currently `8.4.31`)
- Fix available: **yes** (npm suggests upgrading `next` to `16.2.6`, non-major)
- Runtime chain:
  - `next@16.1.6 -> postcss@8.4.31`

12) `brace-expansion` (transitive, dev-only)
- Severity: moderate
- Affected range: `<=1.1.12 || 4.0.0 - 5.0.5` (currently `1.1.12`, `5.0.3`)
- Fix available: **yes**
- Dev chains (examples):
  - `eslint@9.39.3 -> minimatch@3.1.3 -> brace-expansion@1.1.12`
  - `eslint-config-next -> ... -> minimatch@10.2.2 -> brace-expansion@5.0.3`

13) `ip-address` (transitive, dev-only)
- Severity: moderate
- Affected range: `<=10.1.0` (currently `10.1.0`)
- Fix available: **yes**
- Dev chain:
  - `md-to-pdf -> puppeteer -> ... -> socks -> ip-address@10.1.0`

14) `ws` (transitive, dev-only)
- Severity: moderate
- Affected range: `8.0.0 - 8.20.0` (currently `8.19.0`)
- Fix available: **yes**
- Dev chain:
  - `md-to-pdf -> puppeteer-core -> ws@8.19.0`

## Runtime risk assessment

### Highest practical risk (runtime / production tree)

- `next` (high): web framework runtime surface; multiple security advisories; **should be upgraded first**.
- `postcss` (moderate, but runtime): used by Next’s build pipeline; commonly runs in CI/build, but still in the production dependency tree due to Next’s dependency graph; addressed by upgrading Next.
- `prisma` + `@prisma/config` + `effect` + `defu` (high, runtime): present because `prisma` is in `dependencies`.
  - Project code uses `@prisma/client` at runtime (e.g. `lib/prisma.ts` and `lib/*` imports), but **`prisma` (CLI) is typically build/migration-time tooling**.
  - If `prisma` can be moved from `dependencies` to `devDependencies` in a later pass, this would reduce runtime exposure and keep the runtime DB client (`@prisma/client`) intact.

### Lower practical risk (dev/test tooling only)

The remaining vulnerabilities are only reachable via dev tooling (`eslint*`, `md-to-pdf`/`puppeteer`, etc.). They still matter (supply-chain + developer machine exposure), but they are generally acceptable to schedule into a bounded hardening slice instead of hot-fixing production.

## Fix risk classification (no changes applied)

### Likely safe with non-breaking upgrades

- `next`: npm indicates `next@16.2.6` (minor upgrade within 16.x) to clear Next + PostCSS findings.
- `postcss`: resolved via the Next upgrade suggested by npm.
- Dev-only chain upgrades: likely resolved by upgrading `md-to-pdf` and/or its transitive deps (puppeteer ecosystem), plus routine upgrades of `eslint`/`eslint-config-next`/`typescript-eslint`.

### Potentially risky / needs care

- `prisma` / `@prisma/client` upgrades: usually safe within 6.x, but should be done together and validated (migrations, generated client, runtime DB queries).
- Moving `prisma` from runtime deps to dev-only: can be safe but depends on deployment/CI workflow (e.g., if production images run `prisma` commands at startup).

### Likely false-positive / low practical risk

- `ip-address` (XSS) is only present in the `md-to-pdf -> puppeteer` toolchain; unless tooling renders untrusted user-controlled strings into those HTML-emitting methods during runs, practical exploitability is limited. Still worth upgrading for hygiene.

## Recommended remediation order

1) Fix now (runtime surface)
- Upgrade `next` within 16.x (npm suggested `16.2.6`) and re-run `npm audit` to confirm `next` + `postcss` are cleared.
- Upgrade `prisma` + `@prisma/client` together within the current major line, then verify app runtime + migrations.

2) Fix in a bounded hardening slice (dev toolchain)
- Upgrade `md-to-pdf` (and/or replace it if unmaintained) to clear `basic-ftp`, `serve-handler`, `ws`, `ip-address` and related transitive findings.
- Upgrade `eslint`, `eslint-config-next`, `typescript-eslint` to clear `minimatch`, `picomatch`, `flatted`, `brace-expansion` (and re-run lint/typecheck).

3) Defer temporarily (with rationale)
- If dev-tooling upgrades can’t be scheduled immediately, defer the dev-only findings short-term with the explicit constraint that they are **not** in the production dependency tree today (`npm ls --omit=dev` showed `(empty)` for those packages).

## Remediation result (runtime pass applied on 2026-05-27)

Changes applied (runtime-scope only):
- `next`: `16.1.6` -> `16.2.6`
- `prisma`: `6.16.0` -> `6.19.3`
- `@prisma/client`: `6.16.0` -> `6.19.3`
- Added `package.json` override: `postcss` -> `^8.5.10` (to clear the PostCSS advisory without forcing an unrelated Next downgrade)

Audit delta:
- Before: **14** (10 high, 4 moderate)
- After: **8** (5 high, 3 moderate)
- Remaining issues are the previously-identified dev/tooling-only set (`md-to-pdf`/`puppeteer` chain and `eslint*` chain).

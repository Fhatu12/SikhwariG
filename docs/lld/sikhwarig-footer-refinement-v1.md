# SikhwariG Footer Refinement LLD v1

## 1. Title
Footer Refinement and Legal Identity Alignment

## 2. Document Control
- Document ID: `LLD-SG-FOOTER-REFINEMENT-V1`
- Version: `1.0`
- Status: `Approved / Implemented`
- Date: `2026-04-16`
- Owner: `Site/Product Owner`
- Contributors / Reviewers: `Engineering`, `Design/UX`, `Legal/Compliance Reviewer`

## 3. Scope Snapshot
This living LLD records the currently approved footer refinement slice for the Sikhwari Group site. The site remains a single Group site representing one legal entity, while existing `/divisions/*` pages continue to operate as approved division landing pages.

## 4. Current Pass Objective
Capture the approved footer structure, legal identity content, and validation expectations in one lightweight technical reference so implementation and future maintenance stay aligned.

## 5. Footer Refinement Scope
### Approved structure
- Combine contact and email content into one footer block with three grouped entries:
  - `Fhatuwani Sikhwari`
  - `Contact: 0829974112`
  - `E-mail: Fhatuwani.Sikhwari@sikhwarigroup.co.za`
  - `Tendani Sikhwari`
  - `Contact: 0829984112`
  - `E-mail: Tendani.Sikhwari@sikhwarigroup.co.za`
  - `Inquiries`
  - `Email: info@sikhwarigroup.co.za`
  - `website: sikhwarigroup.co.za`
- Preserve the legal identity block for the single legal entity.
- Render a bottom footer strip spanning left to right with:
  - `SIKHWARI GROUP (Pty) Ltd`
  - `Professional consulting services across strategic advisory, cybersecurity delivery, and internal operations support.`
  - `Privacy`
  - `Terms`
  - `Disclaimer`

### Legal identity values
- Registration number: `2026 / 166219 / 07`
- Registered address:
  - `UNIT 93 AMBER HILL`
  - `26 LEMONWOOD ST`
  - `CENTURION`
  - `GAUTENG`
  - `0144`

### Mandatory preserved baseline
- Exact branding string remains: `Built by SG Digital | A division of Sikhwari Group (Pty) Ltd`
- Exact division compliance wording remains unchanged where already approved: `A division of Sikhwari Group (Pty) Ltd.`
- Legal destinations remain unchanged:
  - `/legal/privacy`
  - `/legal/terms`
  - `/legal/disclaimer`
- No route renaming.
- No broad redesign outside this approved footer structure.

## 6. Acceptance Intent
- Footer reads cleanly on desktop and mobile.
- Contact information is grouped in one block and matches approved copy exactly.
- Legal identity displays the approved registration number and registered address exactly.
- Bottom strip presents the approved company statement and legal links without changing destinations.
- Branding and one-entity legal posture remain intact.

## 7. Affected Routes / Components / Files
### Runtime surface
- `/`
- `/contact`
- Shared footer rendered via app layout

### Key implementation files
- `components/layout/site-footer.tsx`
- `components/legal/legal-identity-block.tsx`
- `lib/legal-identity.ts`
- `lib/contact-details.ts`

### Documentation file
- `docs/lld/sikhwarig-footer-refinement-v1.md`

## 8. Validation Expectations
- Run `npm run build`
- Verify rendered footer on:
  - `/`
  - `/contact`
- Confirm:
  - combined contact block content matches approved structure
  - registration number renders exactly `2026 / 166219 / 07`
  - registered address renders exactly as the approved five-line block
  - bottom footer strip contains approved company statement and legal links
  - branding string still renders exactly
  - legal link destinations remain unchanged

## 9. Open Issues / Follow-ups
- Optional future pass: add automated footer content assertions in UI regression coverage if the project adopts broader visual or end-to-end test coverage.
- Optional future pass: capture refreshed approved screenshots for footer-specific documentation if release evidence is required.
- Vercel preview can serve public routes, but durable form/admin data operations still require a hosted writable database instead of the current local SQLite deployment pattern.
- Git integration is not connected for `fhatu12s-projects/sikhwarig` (CLI connect attempt failed), so branch-driven previews and branch-scoped Preview environment variables are not yet reproducible.
- Preview environment variables are not configured, so Preview is currently operating in a tolerated, non-parity posture where `/services` and proof content may fall back when the primary Prisma-backed source is unavailable.

## 10. Decision Log
- `2026-04-16` - Approved footer refinement implemented as a minimal structure update: combined contact block, preserved legal identity block, and full-width bottom strip with unchanged legal routes and branding.
- `2026-04-16` - Vercel deployment-readiness foundation established with project linkage, preview deployment proof, explicit secrets-upload hardening via `.vercelignore`, and documentation of required environment variables and recovery steps. No `vercel.json` was added because Next.js auto-detection is sufficient for the current app.
- `2026-04-16` - MVP parity policy defined: Preview should have its own required env contract and Git-driven reproducibility; until Git/env parity is in place, Preview may operate with accepted fail-soft fallbacks for `/services` and proof content without changing public copy.

## 11. Change Summary / Traceability
- Footer runtime behavior is documented against the approved content slice.
- Legal identity values are traceable to the shared legal identity source used by the footer and contact page.
- This document should be updated if footer structure, legal identity wording, ownership, or validation expectations change in a later approved slice.

## 12. Environment
- Runtime/framework: `Next.js 16` App Router on Node.js with React `19`.
- Package manager / lockfile: `npm` with `package-lock.json`.
- Local scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
- Vercel configuration:
  - `vercel.json` is not required for the current baseline.
  - Vercel successfully auto-detects the project as Next.js.
- Required environment variables for Vercel:
  - `DATABASE_URL`
    - Purpose: Prisma datasource connection string for lead capture and admin-managed content/proof data.
    - Target environments: `preview`, `production`, and `development` if using Vercel local env sync.
  - `ADMIN_USERNAME`
    - Purpose: admin login username.
    - Target environments: `preview`, `production`, `development`.
  - `ADMIN_PASSWORD`
    - Purpose: admin login password.
    - Target environments: `preview`, `production`, `development`.
  - `ADMIN_SESSION_SECRET`
    - Purpose: HMAC signing secret for admin session cookies.
    - Target environments: `preview`, `production`, `development`.
  - `NEXT_PUBLIC_SITE_URL`
    - Purpose: canonical/public site base URL used by SEO metadata.
    - Target environments:
      - `preview`: preview deployment URL or approved preview host
      - `production`: live canonical site URL
      - local `.env.example`: `http://localhost:3000`
  - `COMPANY_REGISTRATION_NUMBER`
    - Purpose: optional override for shared legal identity copy.
    - Target environments: optional in `preview` and `production`.
  - `COMPANY_REGISTERED_ADDRESS`
    - Purpose: optional override for shared legal identity copy.
    - Target environments: optional in `preview` and `production`.
- Current Vercel env posture for `fhatu12s-projects/sikhwarig`:
  - `production`: required variables are configured.
  - `preview`: no variables are configured.
  - `development`: no variables are configured.
  - Git integration: project is not connected to the GitHub repository, which blocks reliable branch-based Preview env configuration.

## 13. Rollout
- MVP rollout path:
  1. Keep validation on generated Vercel preview URLs.
  2. Add required Vercel env vars without exposing values in code or docs.
  3. Replace the local SQLite deployment pattern with a hosted writable database before relying on form/admin writes in Vercel environments.
  4. Validate public routes and selected admin/data paths.
  5. Only then connect the live domain.
- Domain connection path for `sikhwarigroup.co.za`:
  - Preferred MVP: keep previews on generated `vercel.app` URLs.
  - Production apex: connect `sikhwarigroup.co.za` only after preview/env/database readiness is complete.
  - `www`: either redirect `www.sikhwarigroup.co.za` to the apex or use `www` as primary and redirect apex, but keep one canonical host in `NEXT_PUBLIC_SITE_URL`.
  - If nameserver migration is considered later, review all existing DNS records first and preserve non-web records before any cutover.
- This pass did not perform custom-domain cutover or DNS changes.

## 14. Observability
- Immediate platform checks:
  - Vercel deployment status / inspector page
  - Vercel function logs for runtime route failures
  - build logs for missing environment variables or Prisma initialization errors
- Minimum smoke targets after each preview/prod deployment:
  - `/`
  - `/contact`
  - one accepted division route
  - one legal route

## 15. Validation
- Local validation performed:
  - `npm run build`
- Vercel validation performed:
  - project linked to `fhatu12s-projects/sikhwarig`
  - generated preview deployment completed successfully
  - refreshed preview deployment completed after `.vercelignore` was added, and build logs no longer reported local `.env` ingestion
- Minimum route checks for this slice:
  - `/`
  - `/contact`
  - `/divisions/cybersecurity-services`
  - `/legal/privacy`
- Current preview access note:
  - preview deployments are publicly reachable for route validation; parity focus is now on Git integration and Preview env completeness rather than deployment protection
- Public footer/legal baseline must remain unchanged during platform work:
  - `Built by SG Digital | A division of Sikhwari Group (Pty) Ltd`
  - `A division of Sikhwari Group (Pty) Ltd.`
  - `/legal/privacy`
  - `/legal/terms`
  - `/legal/disclaimer`

## 16. Deployment / Recovery Notes
- Last known good deployment can be identified from the Vercel project deployment list or inspector URLs.
- Rollback on Vercel restores an older deployment/build/config state for that project.
- Prefer rollback when:
  - the latest deployment breaks public availability
  - the issue is deployment/config related and a known good deployment exists
- Prefer fix-forward when:
  - the issue is isolated, understood, and can be corrected quickly without restoring stale content/config
- Minimum smoke checks after rollback:
  - `/`
  - `/contact`
  - one division route
  - one legal route
  - footer branding/legal links

## 17. Secrets Hygiene
- `.env*` remains gitignored, with `.env.example` as the only tracked template.
- `.vercelignore` was added so local Vercel CLI deployments do not upload `.env` files by accident.
- Secret values must be managed in Vercel environment variables, not committed files or docs.
- No secret values should be copied into the LLD, README, screenshots, or commit messages.

## 18. Content-source policy: `/services` (MVP)
### Primary source
- **Primary source** for `/services` is the Prisma-backed `ServiceContent` table when the environment has a working `DATABASE_URL` and is DB-ready.

### Preview policy
- Preview should prefer the **primary source** when Preview env parity is configured (Preview has its required env contract and a preview-safe DB target).
- Preview may use **fail-soft fallback** content only when the environment is intentionally non-DB-ready or the primary source is temporarily unavailable.
- If Preview is serving fallback because required Preview env vars are missing, treat this as **tolerated temporary operation**, not target-state parity.

### Production policy
- Production should use the **primary source**.
- Production fallback is **emergency continuity behavior only**.
- If Production serves fallback because the primary source is missing, unreachable, or unconfigured, treat this as **misconfiguration** requiring remediation.

### Misconfiguration is defined as
- Required env vars missing for the target environment.
- Preview relying on production-only env setup.
- Git integration absent when reproducible branch-preview behavior is expected.
- `NEXT_PUBLIC_SITE_URL` not matching target environment intent.
- `/services` serving fallback in production due to missing primary configuration.
- Preview/prod pointing at an unsafe or unintended data source.

### Validation expectation
- `/services` must render successfully on Preview after redeploy.
- Whether it is using primary source or fallback must be known and documented.
- Fallback in Preview is acceptable only when explicitly explained by the environment posture above.

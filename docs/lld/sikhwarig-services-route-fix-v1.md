# SikhwariG `/services` Route Fix LLD v1

## 1. Title
Restore public `/services` route on Vercel preview

## 2. Document Control
- Document ID: `LLD-SG-SERVICES-ROUTE-FIX-V1`
- Version: `1.0`
- Status: `Implemented`
- Date: `2026-04-16`
- Owner: `DevOps / Platform Engineer`
- Contributors / Reviewers: `Engineering`, `QA / Test Engineer`, `Product Owner`

## 3. Scope Snapshot
This slice restores the public `/services` route in Vercel preview without altering accepted public copy, route structure, or legal/branding posture. The site remains one Group site representing a single legal entity and existing `/divisions/*` pages remain accepted.

## 4. Current Pass Objective
Make `/services` return `200` on the public Vercel preview URL so QA and the Product Owner can review the accepted baseline.

## 5. Exact `/services` blocker summary
- Symptom: public preview `/services` returned `500`.
- Impact: blocked public preview review despite other routes being accessible.

## 6. Root Cause
`/services` calls `ensureServiceContent()` which performs Prisma operations (`upsert`, `updateMany`, `findMany`) against `ServiceContent`. In preview, no working database configuration is available, so the Prisma calls throw and the page fails with `500`.

## 7. Fix Scope
Minimal fail-soft behavior: if Prisma operations in `ensureServiceContent()` throw (e.g., missing/invalid `DATABASE_URL` in preview), return the existing seeded service content from `DEFAULT_SERVICE_CONTENT` so `/services` can render the accepted content.

This does **not** change accepted copy, routes, branding/compliance strings, or legal destinations.

## 8. Affected Routes / Components / Files
- Routes:
  - `/services` (restored)
- Files:
  - `app/services/page.tsx` (consumer; unchanged)
  - `lib/service-content.ts` (fix applied)

## 9. Validation Expectations
- Run `npm run build`
- Verify public preview returns `200` on:
  - `/`
  - `/services`
  - `/contact`
  - `/divisions/software-development-and-digital-services`
  - `/legal/privacy`
- Confirm baseline preserved on checked pages:
  - branding string: `Built by SG Digital | A division of Sikhwari Group (Pty) Ltd`
  - division compliance text: `A division of Sikhwari Group (Pty) Ltd.`
  - legal destinations: `/legal/privacy`, `/legal/terms`, `/legal/disclaimer`

## 10. Open Issues / Follow-ups
- Establish a hosted writable database for preview/production and configure `DATABASE_URL` properly so admin/content editing and lead capture can operate on Vercel without fail-soft fallbacks.
- Connect the Vercel project to the Git provider if branch-scoped preview env vars are required.

## 11. Decision Log
- `2026-04-16` - Implemented a minimal fail-soft fallback in `ensureServiceContent()` to preserve public route availability when Prisma is unavailable in preview, enabling QA/PO review without altering accepted content or routes.


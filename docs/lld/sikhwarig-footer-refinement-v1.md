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

## 10. Decision Log
- `2026-04-16` - Approved footer refinement implemented as a minimal structure update: combined contact block, preserved legal identity block, and full-width bottom strip with unchanged legal routes and branding.

## 11. Change Summary / Traceability
- Footer runtime behavior is documented against the approved content slice.
- Legal identity values are traceable to the shared legal identity source used by the footer and contact page.
- This document should be updated if footer structure, legal identity wording, ownership, or validation expectations change in a later approved slice.

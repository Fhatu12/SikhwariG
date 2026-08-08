# Claim-Support Matrix

Do not treat an individual certification as company accreditation. Active proof items can support only the exact proof they evidence.

| Claim area | Current public claim state | Repo evidence | Support status | Publication guidance |
| --- | --- | --- | --- | --- |
| Company registration and legal identity | Legal name, registration number and registered address are displayed | `lib/legal-identity.ts`, `components/legal/legal-identity-block.tsx` | Requires source document/legal review | Confirm company registration record and approved address visibility |
| B-BBEE Level 1 | Not found publicly | No certificate in repo | Requires source document | Do not publish until certificate is available, current and approved |
| 100% black ownership | Not found publicly | No ownership source in repo | Requires source document | Do not publish without source record and approval |
| 50% black female ownership | Not found publicly | No ownership source in repo | Requires source document | Do not publish without source record and approval |
| South African ownership and operation | South Africa-based delivery/support is claimed | Registered address and South African legal context | Provisionally supported | Company approval required for exact ownership/operation wording |
| Leadership experience | Leadership experience and operational claims appear on About | Profile copy only | Requires approval | Source CV/certificates or approve director risk acceptance |
| Qualifications and certifications | Proof component can show certifications | Database-driven proof items, no seed evidence | Requires source document | Each item needs source document; avoid company accreditation language |
| Telecommunications capabilities | Public service bullets and division page | `lib/service-content.ts`, `app/divisions/[slug]/page.tsx` | Provisionally supported | Keep practical support wording; avoid licensed operator or ISP claims |
| Cybersecurity capabilities | Authorised advisory/assessment/support wording | `lib/service-content.ts`, `app/page.tsx` | Supported with caveats | Preserve authorisation and advisory/support framing |
| Software and digital capabilities | Public service bullets and Mzansi Select copy | `lib/service-content.ts`, `app/about/page.tsx` | Provisionally supported | Source project evidence before stronger portfolio claims |
| Hospitality capabilities | Service page and division page include hospitality | `lib/service-content.ts`, division route | Provisionally supported | Add to homepage/footer only after approved Pass 2 content |
| Selected Work claims | Mzansi Select only appears publicly | `app/about/page.tsx`; deferred candidates doc | Requires source document | Do not invent metrics, endorsements or client outcomes |
| CSD wording | Not found publicly | Search found only package-lock incidental text and docs notes | Requires source document | Avoid `fully CSD compliant` or verified-supplier claims without evidence and legal review |
| Tax and procurement wording | Not found publicly | No tax/procurement source in repo | Requires source document/legal review | Avoid broad tax-compliance or tender-readiness claims |
| Partnerships, memberships and accreditations | Proof section labels exist | Admin-managed `ProofItem` model | Requires source document | Partner/membership/accreditation claims need exact source and expiry/status |
| Geographic delivery claims | South Africa-based support on homepage | Website legal identity and copy | Provisionally supported | Avoid guaranteed national coverage without approval |
| Proprietary-trading wording | Legal disclaimer only | `components/legal/trading-disclaimer-block.tsx` | Supported | Preserve as internal-only restriction; do not convert into service copy |

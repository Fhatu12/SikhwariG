# Component Reuse Matrix

| Component/file | Current role | Classification | Pass 2 direction |
| --- | --- | --- | --- |
| `app/layout.tsx` | Global shell and metadata | Reuse with content only | Update metadata later; keep structure |
| `components/layout/site-header.tsx` | Public navigation | Small visual/content adjustment | Keep compact nav; add skip link nearby if implemented |
| `components/layout/site-footer.tsx` | Legal identity and footer links | Extend | Add service groups, email and hospitality positioning |
| `components/layout/container.tsx` | Width constraint | Reuse unchanged | Preserve max width and padding |
| `components/layout/section.tsx` | Standard section wrapper | Extend only if needed | Could support `as="section"`/heading level later, but avoid churn |
| `components/proof/proof-section.tsx` | Public proof display | Reuse with content only | Use cautious headings and redacted-proof policy |
| `components/forms/contact-form.tsx` | Contact form | Extend | Add new options and hospitality conditional fields in implementation slice |
| `components/team/leader-avatar.tsx` | Leadership image/fallback | Reuse unchanged | Keep modest avatar size |
| `components/legal/legal-identity-block.tsx` | Legal identity | Reuse with content only | Registered address remains public |
| `components/legal/trading-disclaimer-block.tsx` | Trading disclaimer | Reuse unchanged | Preserve existing proprietary-trading disclaimer |
| `lib/service-content.ts` | Service seed/database content | Extend | Add portfolio/division metadata if useful |
| `lib/proof-content.ts` | Proof retrieval/labels | Reuse unchanged | Do not conflate certifications with accreditation |
| `lib/seo.ts` | Metadata helper | Reuse unchanged | Update descriptions through existing helper |
| `app/page.tsx` | Homepage | Extend | Add approved repositioning sections |
| `app/about/page.tsx` | Company, leadership, work | Extend | Update structure/titles and selected work |
| `app/services/page.tsx` | Service overview | Extend | Add portfolio grouping and links |
| `app/divisions/[slug]/page.tsx` | Division pages | Extend | Replace placeholders with reusable division layout |
| `app/contact/page.tsx` | Contact page shell | Small content adjustment | Keep workflow, update guidance text |
| Legal pages | Privacy/terms/disclaimer | Content only after legal review | Preserve routes and trading disclaimer |

Objective: minimal implementation diff, maximum reuse of existing design language.

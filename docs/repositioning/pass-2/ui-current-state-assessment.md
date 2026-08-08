# UI Current-State Assessment

## Repository-First Discovery

| Area | Current evidence | Reuse position |
| --- | --- | --- |
| App layout | `app/layout.tsx` wraps `SiteHeader`, `main` and `SiteFooter`; Manrope body and Lora headings | Reuse unchanged, update metadata content later |
| Navigation | `components/layout/site-header.tsx`; Home, Services, About, Contact; mobile quote link | Reuse structure; add no desktop clutter |
| Footer | `components/layout/site-footer.tsx`; legal identity block, legal links, SG Digital credit | Extend content; preserve legal identity and exact build credit |
| Homepage | `app/page.tsx`; hero, quick facts, three service cards, proof | Reuse section rhythm; update content and add hospitality/portfolio/Selected Work sections |
| About | `app/about/page.tsx`; company intro, leadership cards, Mzansi Select, proof | Reuse card pattern; update structure and titles |
| Services | `app/services/page.tsx`; dynamic service cards from `ensureServiceContent` | Reuse grid/card system; add clearer hierarchy in later implementation |
| Contact form | `components/forms/contact-form.tsx`; controlled client form with validation, honeypot and status messages | Extend; preserve workflow and backend behaviour until engineering slice |
| Division pages | `app/divisions/[slug]/page.tsx`; brief dynamic slug content | Replace placeholder body with reusable layout, retaining routes |
| Proof | `components/proof/proof-section.tsx`; grouped database-driven proof items | Reuse with redacted-proof rule and cautious headings |
| Legal links | Privacy, Terms, Disclaimer in footer and sitemap | Preserve routes |
| Tokens | `styles/tokens.css`; teal brand, accent, slate text, 8-16px radii, soft shadow | Preserve; avoid broad palette redesign |
| Accessibility | Focus helpers, semantic sections, labels, aria status patterns | Preserve and improve with skip link, conditional announcements and error summary |

## Current UX Assessment

| UX area | Finding | Classification |
| --- | --- | --- |
| First-screen company understanding | Hero explains technology services under one legal entity, but not diversified hospitality | Must change |
| Service hierarchy | Four services exist on Services page, but homepage shows three and lacks portfolio grouping | Must change |
| Portfolio clarity | SG Telecoms/SG Digital/SG Cyber/SG Hospitality model is not public-facing yet | Must change |
| Hospitality discoverability | Present in Services/contact/division route, absent from homepage/footer positioning | Must change |
| Credibility/trust | Quick facts are useful but miss approved credibility facts | Must change |
| Selected Work discoverability | Embedded low on About only; not surfaced on homepage | Should improve |
| Leadership clarity | Titles are narrower than approved and portfolio ownership is unclear | Must change |
| Division navigation | Division routes exist but are not discoverable from primary nav or service cards | Should improve |
| Enquiry routing | Four services present; future General business enquiry/Not sure and hospitality fields absent | Must change |
| Mobile flow | Simple stacked layouts are sound | Preserve |
| Keyboard accessibility | Existing controls and links are keyboard reachable | Preserve and improve |
| Heading hierarchy | Public pages often use `Section` with `h2`; homepage has one `h1` | Preserve with care |
| CTA consistency | Request a quote and Contact exist; secondary CTA should become View our services | Must change |
| Content density | Current pages are concise, sometimes too thin on divisions | Should improve |
| Visual balance | Quiet corporate layout fits the site | Preserve |

## What Should Not Be Redesigned

- Do not rebuild the site or introduce a new visual language.
- Do not replace the current stack, layout shell, legal routes, enquiry submission flow or admin protections.
- Do not introduce decorative hero illustrations, large marketing effects or unrelated animation.
- Do not expose Proprietary Trading and Treasury outside the existing legal disclaimer context.
- Do not publish personal contact details or raw certificate material.

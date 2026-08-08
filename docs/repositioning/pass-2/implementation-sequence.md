# Implementation Sequence

## A. Shared Content/Data Structures

Add shared constants for portfolios, divisions, services, selected work and approved credibility facts. Dependencies: approved wording and proof policy. Risk: duplicated labels causing form/API mismatch.

## B. Homepage Repositioning

Update hero, credibility facts, portfolio overview, four service cards, Selected Work preview and CTA. Dependencies: shared content constants. Risk: hospitality still omitted from metadata/footer if not sequenced.

## C. Services and Division Pages

Update `/services` grouping and build one reusable division layout for four routes. Dependencies: service content model. Risk: overclaiming telecoms/cybersecurity capabilities.

## D. About and Leadership

Update company model, approved leadership titles, qualifications and delivery principles. Dependencies: approved qualification text. Risk: publishing private or unsupported credential metadata.

## E. Selected Work

Implement reusable cards for Mzansi Select, V-Property and SG Digital Trust Check. Dependencies: approved links/screenshots. Risk: implying external client relationships or outcomes.

## F. Hospitality Enquiry Fields

Extend form UX and backend contract deliberately. Dependencies: privacy wording, Prisma/storage decision, admin display, notification format and tests. Risk: hidden data loss, API validation failures, incomplete privacy disclosure.

## G. Footer, Navigation and Metadata

Add footer service grouping, public email, hospitality positioning and updated metadata. Dependencies: IA and shared content. Risk: navigation clutter.

## H. Legal/Privacy Presentation Updates

After legal review, update privacy responsible party, contact, data categories, SMTP/database/operator handling and complaints route. Dependencies: legal approval. Risk: unreviewed legal wording.

## I. Accessibility and Responsive Refinement

Add skip link, form error summary, conditional announcements and responsive polish. Dependencies: all UI changes. Risk: regressions in mobile menu, focus order and form labels.

## Recommended Test/Validation Coverage

- Unit tests for lead API if labels or payloads change.
- E2E contact form coverage including hospitality reveal and normal service submission.
- Screenshot review for homepage, services, about, contact and legal pages on desktop/mobile.
- Manual keyboard pass for navigation, mobile menu and form.
- Sensitive-content scan before commit.

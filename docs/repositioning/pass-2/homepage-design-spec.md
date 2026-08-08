# Homepage Design Spec

## Section Order

| Section | Purpose | Component pattern | Desktop | Tablet | Mobile | Interaction and accessibility | Content guidance | Reuse |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Navigation | Orient users and keep quote path available | Existing sticky header | Logo left, links right | Same until mobile breakpoint | Menu button with links and quote CTA | Preserve button labels and focus ring | Keep top-level nav short | `SiteHeader` |
| Hero | State diversified company position | Existing bordered hero band with text plus fact panel | Two-column text/facts | Two-column or stacked if cramped | Text first, facts below | One `h1`; primary and secondary CTA as links/buttons | Use approved headline and supporting copy | Homepage hero structure |
| Credibility strip | Make trust facts scannable | Compact facts row or grid | 4-7 small facts in two rows if needed | 2-3 columns | Single/two columns | Facts are text, not image-only badges | Approved facts only; do not show certificate image | Existing quick facts pattern |
| Two-portfolio overview | Explain group model | Two understated cards | Two columns | Two columns or stacked | Stacked | Card headings link or point to Services anchors | One short paragraph per portfolio | Existing card pattern |
| Four service cards | Present public offerings | Card grid with optional division label | Four cards, two-by-two | Two columns | One column | Whole-card link optional; visible CTA text | 70-110 words each; no regulated claims | Services cards |
| Selected Work preview | Show practical delivery | Three reusable project cards | Three columns or responsive grid | Two/one columns | One column | Status badges include text labels | Mzansi Select, V-Property, SG Digital Trust Check only | About selected work card pattern |
| Leadership/company trust | Show accountable ownership | Two compact leadership cards or text band | Two cards | Two cards/stacked | Stacked | Images have alt text; no overlarge portraits | Approved titles and restrained credentials | `LeaderAvatar`, card pattern |
| Enquiry CTA | Convert to contact | Full-width section with short copy | Text left, CTA right | Stack if needed | Stack | Primary Request a quote; secondary Contact if used | Avoid sales hype | `Section`, link buttons |
| Footer | Legal and secondary navigation | Existing footer | Legal identity plus grouped links | Same | Stacked | Legal links clear; address stays public | Include hospitality and exact SG Digital credit | `SiteFooter` |

## Approved Hero Content

Headline:

`Technology, telecommunications, cybersecurity, digital and hospitality services under one accountable South African company.`

Supporting copy:

`Sikhwari Group (Pty) Ltd delivers practical services through specialist internal divisions covering telecommunications and ICT, cybersecurity, software and digital delivery, and culinary and hospitality operations. Every engagement is managed under one registered legal entity with clear accountability, documented scope and disciplined execution.`

Primary CTA: `Request a quote`

Secondary CTA: `View our services`

## Approved Credibility Facts

- South African private company
- Registration number: `2026/166219/07`
- B-BBEE Level 1 Contributor
- 100% black ownership
- 50% black female ownership
- South Africa-based delivery
- Four external service divisions
- One accountable legal entity

Do not display the underlying B-BBEE or ownership certificate publicly.

## Visual Direction

Preserve the current quiet corporate language: slate text, teal primary actions, white cards, soft borders and `max-w-6xl` content width. Do not introduce a hero image, decorative background or new brand palette for this repositioning slice.
